import numpy as np

from app.ml_models.base_model import BanditModel


class SoftmaxBanditModel(BanditModel):
    algorithm_name = "softmax"

    def __init__(self, temperature: float = 0.15, random_state: int | None = 42) -> None:
        super().__init__(random_state=random_state)
        self.temperature = max(temperature, 0.01)

    def select_ad(self, round_index: int, selections: np.ndarray, rewards_by_ad: np.ndarray) -> int:
        unselected = np.where(selections == 0)[0]
        if len(unselected) > 0:
            return int(unselected[0])

        averages = rewards_by_ad / np.maximum(selections, 1)
        scaled = np.exp((averages - np.max(averages)) / self.temperature)
        probabilities = scaled / np.sum(scaled)
        return int(self.random.choice(len(selections), p=probabilities))
