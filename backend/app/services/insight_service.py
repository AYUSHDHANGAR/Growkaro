def generate_insights(result: dict) -> list[str]:
    labels = result["ad_labels"]
    selections = result["selections"]
    rewards = result["rewards_by_ad"]
    best_index = labels.index(result["best_ad"])
    rates = [reward / max(selection, 1) for reward, selection in zip(rewards, selections, strict=True)]
    sorted_rates = sorted(rates, reverse=True)
    lift = 0.0
    if len(sorted_rates) > 1 and sorted_rates[1] > 0:
        lift = (sorted_rates[0] - sorted_rates[1]) / sorted_rates[1] * 100

    insights = [
        f"{result['best_ad']} is the strongest learned ad with {selections[best_index]:,} selections.",
        f"The model achieved {result['ctr'] * 100:.2f}% CTR and {result['total_reward']:,.0f} total reward.",
        f"Exploration represented {result['exploration_ratio'] * 100:.1f}% of decisions while exploitation reached {result['exploitation_ratio'] * 100:.1f}%.",
    ]

    if lift > 0:
        insights.append(f"{result['best_ad']} is outperforming the next learned ad by {lift:.1f}% reward rate.")
    if result.get("convergence_round"):
        insights.append(f"Model confidence stabilized around round {result['convergence_round']:,}.")
    if result["regret"] <= max(result["total_reward"] * 0.03, 1):
        insights.append("Regret is low, indicating the policy is close to the best fixed ad strategy.")

    return insights
