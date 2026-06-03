import math

import numpy as np

from app.ml_models.base_model import BanditModel


class UCBModel(BanditModel):
    algorithm_name = "ucb"

    def select_ad(self, round_index: int, selections: np.ndarray, rewards_by_ad: np.ndarray) -> int:
        unselected = np.where(selections == 0)[0]
        if len(unselected) > 0:
            return int(unselected[0])

        upper_bounds = []
        for ad_index in range(len(selections)):
            average_reward = rewards_by_ad[ad_index] / selections[ad_index]
            delta_i = math.sqrt((3 / 2) * math.log(round_index + 1) / selections[ad_index])
            upper_bounds.append(average_reward + delta_i)
        return int(np.argmax(upper_bounds))
