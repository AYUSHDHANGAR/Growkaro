import numpy as np

from app.ml_models.base_model import BanditModel


class EpsilonGreedyModel(BanditModel):
    algorithm_name = "epsilon_greedy"

    def __init__(self, epsilon: float = 0.1, random_state: int | None = 42) -> None:
        super().__init__(random_state=random_state)
        self.epsilon = epsilon

    def select_ad(self, round_index: int, selections: np.ndarray, rewards_by_ad: np.ndarray) -> int:
        unselected = np.where(selections == 0)[0]
        if len(unselected) > 0:
            return int(unselected[0])

        if self.random.random() < self.epsilon:
            return int(self.random.integers(0, len(selections)))

        averages = rewards_by_ad / np.maximum(selections, 1)
        return int(np.argmax(averages))
