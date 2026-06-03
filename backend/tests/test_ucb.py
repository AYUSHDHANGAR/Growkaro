import pandas as pd

from app.ml_models.comparison import compare_algorithms
from app.ml_models.ucb import UCBModel


def test_ucb_learns_best_ad() -> None:
    data = pd.DataFrame(
        {
            "Ad 1": [1 if index % 5 == 0 else 0 for index in range(300)],
            "Ad 2": [1 for _ in range(300)],
            "Ad 3": [1 if index % 10 == 0 else 0 for index in range(300)],
        }
    )
    result = UCBModel().fit(data)

    assert result.algorithm == "ucb"
    assert result.total_reward >= 250
    assert result.best_ad == "Ad 2"
    assert sum(result.selections) == len(data)


def test_model_comparison_returns_required_algorithms() -> None:
    data = pd.DataFrame({"Ad 1": [0, 1, 0, 1], "Ad 2": [1, 1, 1, 0]})
    result = compare_algorithms(data)

    assert {"ucb", "thompson_sampling", "epsilon_greedy", "random_baseline"} == set(result)
