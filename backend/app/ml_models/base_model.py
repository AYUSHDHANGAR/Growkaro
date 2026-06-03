from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any

import numpy as np
import pandas as pd


@dataclass
class BanditResult:
    algorithm: str
    ad_labels: list[str]
    selections: list[int]
    rewards_by_ad: list[float]
    selected_ads: list[int]
    cumulative_rewards: list[dict[str, float]]
    rolling_ctr: list[dict[str, float]]
    confidence_intervals: list[dict[str, float]]
    total_reward: float
    ctr: float
    regret: float
    best_ad: str
    exploration_ratio: float
    exploitation_ratio: float
    convergence_round: int | None

    def to_dict(self) -> dict[str, Any]:
        return {
            "algorithm": self.algorithm,
            "ad_labels": self.ad_labels,
            "selections": self.selections,
            "rewards_by_ad": self.rewards_by_ad,
            "selected_ads": self.selected_ads,
            "cumulative_rewards": self.cumulative_rewards,
            "rolling_ctr": self.rolling_ctr,
            "confidence_intervals": self.confidence_intervals,
            "total_reward": self.total_reward,
            "ctr": self.ctr,
            "regret": self.regret,
            "best_ad": self.best_ad,
            "exploration_ratio": self.exploration_ratio,
            "exploitation_ratio": self.exploitation_ratio,
            "convergence_round": self.convergence_round,
        }


class BanditModel(ABC):
    algorithm_name = "base"

    def __init__(self, random_state: int | None = 42) -> None:
        self.random = np.random.default_rng(random_state)

    def fit(self, data: pd.DataFrame | np.ndarray) -> BanditResult:
        frame = self._to_frame(data)
        values = frame.to_numpy(dtype=float)
        self._validate_binary(values)

        selections = np.zeros(values.shape[1], dtype=int)
        rewards_by_ad = np.zeros(values.shape[1], dtype=float)
        selected_ads: list[int] = []
        cumulative_rewards: list[dict[str, float]] = []
        rolling_ctr: list[dict[str, float]] = []
        total_reward = 0.0
        checkpoint = max(1, values.shape[0] // 100)

        for round_index, row in enumerate(values):
            ad_index = self.select_ad(round_index, selections, rewards_by_ad)
            reward = float(row[ad_index])
            selections[ad_index] += 1
            rewards_by_ad[ad_index] += reward
            selected_ads.append(int(ad_index))
            total_reward += reward

            if round_index == 0 or (round_index + 1) % checkpoint == 0 or round_index == values.shape[0] - 1:
                round_number = round_index + 1
                cumulative_rewards.append({"round": round_number, "reward": total_reward})
                rolling_ctr.append({"round": round_number, "ctr": total_reward / round_number})

        return self._build_result(frame, selections, rewards_by_ad, selected_ads, cumulative_rewards, rolling_ctr, total_reward)

    @abstractmethod
    def select_ad(self, round_index: int, selections: np.ndarray, rewards_by_ad: np.ndarray) -> int:
        raise NotImplementedError

    def _build_result(
        self,
        frame: pd.DataFrame,
        selections: np.ndarray,
        rewards_by_ad: np.ndarray,
        selected_ads: list[int],
        cumulative_rewards: list[dict[str, float]],
        rolling_ctr: list[dict[str, float]],
        total_reward: float,
    ) -> BanditResult:
        ad_labels = [str(column) for column in frame.columns]
        best_index = int(np.argmax(selections))
        rates = frame.mean(axis=0).to_numpy(dtype=float)
        best_possible_rate = float(np.max(rates))
        regret = max(0.0, best_possible_rate * len(frame) - total_reward)
        exploration_count = sum(1 for ad in selected_ads if ad != best_index)
        convergence_round = self._detect_convergence(selected_ads, best_index)

        return BanditResult(
            algorithm=self.algorithm_name,
            ad_labels=ad_labels,
            selections=selections.astype(int).tolist(),
            rewards_by_ad=rewards_by_ad.astype(float).tolist(),
            selected_ads=selected_ads,
            cumulative_rewards=cumulative_rewards,
            rolling_ctr=rolling_ctr,
            confidence_intervals=self._confidence_intervals(ad_labels, selections, rewards_by_ad, len(frame)),
            total_reward=float(total_reward),
            ctr=float(total_reward / max(len(frame), 1)),
            regret=float(regret),
            best_ad=ad_labels[best_index],
            exploration_ratio=float(exploration_count / max(len(selected_ads), 1)),
            exploitation_ratio=float(1 - exploration_count / max(len(selected_ads), 1)),
            convergence_round=convergence_round,
        )

    def _confidence_intervals(
        self,
        labels: list[str],
        selections: np.ndarray,
        rewards_by_ad: np.ndarray,
        total_rounds: int,
    ) -> list[dict[str, float]]:
        intervals: list[dict[str, float]] = []
        for index, label in enumerate(labels):
            if selections[index] == 0:
                average = 0.0
                delta = 0.0
            else:
                average = float(rewards_by_ad[index] / selections[index])
                delta = float(np.sqrt((3 / 2) * np.log(total_rounds + 1) / selections[index]))
            intervals.append(
                {
                    "ad": label,
                    "average_reward": average,
                    "lower": max(0.0, average - delta),
                    "upper": min(1.0, average + delta),
                    "raw_upper_bound": average + delta,
                }
            )
        return intervals

    def _detect_convergence(self, selected_ads: list[int], best_index: int) -> int | None:
        window = min(250, max(20, len(selected_ads) // 20))
        if len(selected_ads) < window:
            return None
        for index in range(window, len(selected_ads) + 1):
            window_ads = selected_ads[index - window : index]
            best_share = window_ads.count(best_index) / window
            if best_share >= 0.8:
                return index
        return None

    def _to_frame(self, data: pd.DataFrame | np.ndarray) -> pd.DataFrame:
        if isinstance(data, pd.DataFrame):
            return data.copy()
        return pd.DataFrame(data, columns=[f"Ad {index + 1}" for index in range(data.shape[1])])

    def _validate_binary(self, values: np.ndarray) -> None:
        if values.ndim != 2 or values.shape[0] == 0 or values.shape[1] == 0:
            raise ValueError("Dataset must contain at least one row and one ad column.")
        valid = np.isin(values, [0, 1])
        if not bool(valid.all()):
            raise ValueError("Dataset must contain only binary values: 0 for no click, 1 for click.")
