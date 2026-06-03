import numpy as np

from app.ml_models.base_model import BanditModel


class RandomBaselineModel(BanditModel):
    algorithm_name = "random_baseline"

    def select_ad(self, round_index: int, selections: np.ndarray, rewards_by_ad: np.ndarray) -> int:
        return int(self.random.integers(0, len(selections)))
