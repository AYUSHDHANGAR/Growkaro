from typing import Any

import pandas as pd

from app.ml_models.base_model import BanditModel
from app.ml_models.epsilon_greedy import EpsilonGreedyModel
from app.ml_models.random_baseline import RandomBaselineModel
from app.ml_models.softmax import SoftmaxBanditModel
from app.ml_models.thompson_sampling import ThompsonSamplingModel
from app.ml_models.ucb import UCBModel


def get_model(algorithm: str, parameters: dict[str, Any] | None = None) -> BanditModel:
    parameters = parameters or {}
    normalized = algorithm.lower().replace("-", "_")
    if normalized == "ucb":
        return UCBModel(random_state=parameters.get("random_state", 42))
    if normalized == "thompson_sampling":
        return ThompsonSamplingModel(random_state=parameters.get("random_state", 42))
    if normalized == "epsilon_greedy":
        return EpsilonGreedyModel(epsilon=parameters.get("epsilon", 0.1), random_state=parameters.get("random_state", 42))
    if normalized == "softmax":
        return SoftmaxBanditModel(
            temperature=parameters.get("temperature", 0.15),
            random_state=parameters.get("random_state", 42),
        )
    if normalized == "random_baseline":
        return RandomBaselineModel(random_state=parameters.get("random_state", 42))
    raise ValueError(f"Unsupported algorithm: {algorithm}")


def compare_algorithms(data: pd.DataFrame, algorithms: list[str] | None = None) -> dict[str, dict]:
    algorithms = algorithms or ["ucb", "thompson_sampling", "epsilon_greedy", "random_baseline"]
    return {algorithm: get_model(algorithm).fit(data).to_dict() for algorithm in algorithms}
