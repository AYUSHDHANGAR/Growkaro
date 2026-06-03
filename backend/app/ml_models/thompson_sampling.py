import numpy as np

from app.ml_models.base_model import BanditModel


class ThompsonSamplingModel(BanditModel):
    algorithm_name = "thompson_sampling"

    def select_ad(self, round_index: int, selections: np.ndarray, rewards_by_ad: np.ndarray) -> int:
        successes = rewards_by_ad + 1
        failures = selections - rewards_by_ad + 1
        samples = self.random.beta(successes, failures)
        return int(np.argmax(samples))
