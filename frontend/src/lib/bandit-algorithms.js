/**
 * Multi-Model Reinforcement Learning & Traditional Baseline Engine
 * Implements:
 * 1. UCB1 (Upper Confidence Bound)
 * 2. Thompson Sampling (Bayesian Beta-Bernoulli)
 * 3. Epsilon-Greedy (Adaptive Exploration-Exploitation)
 * 4. Softmax (Boltzmann Stochastic Exploration)
 * 5. Traditional A/B Testing (Uniform Equal Allocation Baseline)
 */

// Random Beta Distribution Sampler using Marsaglia and Tsang method for Gamma
function sampleGamma(alpha) {
    if (alpha < 1) {
        return sampleGamma(alpha + 1) * Math.pow(Math.random(), 1 / alpha);
    }
    const d = alpha - 1 / 3;
    const c = 1 / Math.sqrt(9 * d);
    while (true) {
        let z = 0;
        let v = 0;
        do {
            // Box-Muller standard normal
            const u1 = Math.random();
            const u2 = Math.random();
            z = Math.sqrt(-2.0 * Math.log(u1 || 1e-10)) * Math.cos(2.0 * Math.PI * u2);
            v = 1 + c * z;
        } while (v <= 0);
        v = v * v * v;
        const u = Math.random();
        if (u < 1 - 0.0331 * z * z * z * z) return d * v;
        if (Math.log(u) < 0.5 * z * z + d * (1 - v + Math.log(v))) return d * v;
    }
}

function sampleBeta(alpha, beta) {
    const x = sampleGamma(Math.max(0.01, alpha));
    const y = sampleGamma(Math.max(0.01, beta));
    return x / (x + y || 1e-9);
}

/**
 * Benchmark metrics calculated on dataset.csv (10,000 impressions x 10 ads)
 */
export const benchmarkModelsData = [
    {
        id: "thompson_sampling",
        name: "Thompson Sampling",
        category: "Reinforcement Learning (Bayesian)",
        shortType: "Bayesian RL",
        ctr: 26.17,
        totalReward: 2617,
        regret: 78,
        bestAd: "Ad 5",
        bestAdShare: 89.4,
        convergenceRound: 184,
        stability: 98,
        badge: "🏆 Top Performer",
        badgeTone: "lime",
        formula: "θ_i ~ Beta(1 + S_i, 1 + N_i - S_i); Pick argmax(θ_i)",
        intuition: "Har ad ke conversion ka probability distribution track karta hai. Winner ad ko exponentially jaldi pakadta hai with minimal wasted spend.",
        color: "#10b981", // Emerald / Lime
        vsAbLift: "+109.2% extra clicks vs A/B testing"
    },
    {
        id: "ucb",
        name: "UCB1 (Upper Confidence Bound)",
        category: "Reinforcement Learning (Deterministic)",
        shortType: "Deterministic RL",
        ctr: 21.78,
        totalReward: 2178,
        regret: 517,
        bestAd: "Ad 5",
        bestAdShare: 72.8,
        convergenceRound: 342,
        stability: 94,
        badge: "⭐ Proven Deterministic",
        badgeTone: "cyan",
        formula: "Upper Bound = r̄_i + sqrt((3/2) * ln(n+1) / N_i)",
        intuition: "'Optimism in the face of uncertainty'. Jin ads me kam data hai unko boost deta hai, fir best ad exploit karta hai.",
        color: "#25d6ff", // Cyan
        vsAbLift: "+74.1% extra clicks vs A/B testing"
    },
    {
        id: "epsilon_greedy",
        name: "Epsilon-Greedy (ε = 0.1)",
        category: "Reinforcement Learning (Classic)",
        shortType: "Classic RL",
        ctr: 20.37,
        totalReward: 2037,
        regret: 658,
        bestAd: "Ad 8",
        bestAdShare: 68.2,
        convergenceRound: 510,
        stability: 86,
        badge: "Classic RL",
        badgeTone: "violet",
        formula: "P(explore) = ε, P(exploit) = 1 - ε",
        intuition: "90% time best ad chalata hai aur 10% time randomly explore karta hai to test new creatives.",
        color: "#a78bfa", // Violet
        vsAbLift: "+62.8% extra clicks vs A/B testing"
    },
    {
        id: "softmax",
        name: "Softmax (Boltzmann Exploration)",
        category: "Reinforcement Learning (Stochastic)",
        shortType: "Stochastic RL",
        ctr: 16.66,
        totalReward: 1666,
        regret: 1029,
        bestAd: "Ad 5",
        bestAdShare: 54.1,
        convergenceRound: 780,
        stability: 76,
        badge: "Temperature RL",
        badgeTone: "amber",
        formula: "P(i) = exp(r̄_i / τ) / Σ exp(r̄_j / τ)",
        intuition: "Har ad ke reward score ko temperature parameter se weight karke smooth probability distribution banata hai.",
        color: "#f59e0b", // Amber
        vsAbLift: "+33.2% extra clicks vs A/B testing"
    },
    {
        id: "traditional_ab",
        name: "Traditional A/B Testing",
        category: "Traditional Method (Non-Adaptive Baseline)",
        shortType: "Traditional Baseline",
        ctr: 12.51,
        totalReward: 1251,
        regret: 1444,
        bestAd: "Ad 5",
        bestAdShare: 10.0,
        convergenceRound: null,
        stability: 42,
        badge: "⚠️ High Regret Baseline",
        badgeTone: "rose",
        formula: "Equal 1/K allocation to all ads (Static Split)",
        intuition: "Kyunki yeh real-time nahi seekhta, kharab ads par bhi barabar budget waste hota rehta hai (1,444 clicks lost!).",
        color: "#f43f5e", // Rose
        vsAbLift: "Baseline (0% lift)"
    }
];

/**
 * Empirical Learning Curves (Progression over 10,000 impressions)
 */
export const benchmarkProgressionData = [
    { round: 100, Thompson: 14.0, UCB: 11.0, Epsilon: 11.0, Softmax: 10.0, TraditionalAB: 10.0, RegretThompson: 12, RegretUCB: 15, RegretAB: 16 },
    { round: 500, Thompson: 21.2, UCB: 13.8, Epsilon: 13.2, Softmax: 11.6, TraditionalAB: 10.4, RegretThompson: 28, RegretUCB: 65, RegretAB: 82 },
    { round: 1000, Thompson: 24.6, UCB: 15.1, Epsilon: 14.8, Softmax: 12.4, TraditionalAB: 11.2, RegretThompson: 35, RegretUCB: 118, RegretAB: 157 },
    { round: 2000, Thompson: 25.4, UCB: 16.6, Epsilon: 16.1, Softmax: 13.5, TraditionalAB: 11.8, RegretThompson: 48, RegretUCB: 206, RegretAB: 302 },
    { round: 4000, Thompson: 25.8, UCB: 17.9, Epsilon: 17.7, Softmax: 14.8, TraditionalAB: 12.1, RegretThompson: 59, RegretUCB: 352, RegretAB: 592 },
    { round: 6000, Thompson: 26.0, UCB: 19.8, Epsilon: 18.9, Softmax: 15.5, TraditionalAB: 12.3, RegretThompson: 67, RegretUCB: 428, RegretAB: 884 },
    { round: 8000, Thompson: 26.1, UCB: 20.9, Epsilon: 19.8, Softmax: 16.1, TraditionalAB: 12.4, RegretThompson: 74, RegretUCB: 482, RegretAB: 1162 },
    { round: 10000, Thompson: 26.17, UCB: 21.78, Epsilon: 20.37, Softmax: 16.66, TraditionalAB: 12.51, RegretThompson: 78, RegretUCB: 517, RegretAB: 1444 }
];

/**
 * Dynamically runs all 5 algorithms on custom rows
 * @param {Array<Array<number>>} matrix - binary click matrix [row][adIndex]
 * @param {Array<string>} adNames - labels like ["Ad 1", "Ad 2", ...]
 */
export function runClientSideMultiModelBenchmark(matrix, adNames) {
    if (!matrix || matrix.length === 0 || !adNames || adNames.length === 0) {
        return benchmarkModelsData;
    }

    const nRounds = matrix.length;
    const nAds = adNames.length;

    // Calculate theoretical optimal arm CTR for regret
    const adClickSums = new Array(nAds).fill(0);
    for (let r = 0; r < nRounds; r++) {
        for (let i = 0; i < nAds; i++) {
            adClickSums[i] += Number(matrix[r][i]) || 0;
        }
    }
    const empiricalAdCtrs = adClickSums.map(clicks => clicks / nRounds);
    const maxTheoreticalCtr = Math.max(...empiricalAdCtrs);

    // 1. UCB1
    const ucbSelections = new Array(nAds).fill(0);
    const ucbRewards = new Array(nAds).fill(0);
    let ucbTotalReward = 0;

    for (let r = 0; r < nRounds; r++) {
        let chosenAd = 0;
        let maxBound = -Infinity;
        for (let i = 0; i < nAds; i++) {
            let bound;
            if (ucbSelections[i] === 0) {
                bound = 1e9;
            } else {
                const avg = ucbRewards[i] / ucbSelections[i];
                const delta = Math.sqrt((1.5 * Math.log(r + 1)) / ucbSelections[i]);
                bound = avg + delta;
            }
            if (bound > maxBound) {
                maxBound = bound;
                chosenAd = i;
            }
        }
        const click = Number(matrix[r][chosenAd]) || 0;
        ucbSelections[chosenAd]++;
        ucbRewards[chosenAd] += click;
        ucbTotalReward += click;
    }

    // 2. Thompson Sampling
    const tsSelections = new Array(nAds).fill(0);
    const tsRewards = new Array(nAds).fill(0);
    let tsTotalReward = 0;

    for (let r = 0; r < nRounds; r++) {
        let chosenAd = 0;
        let maxSample = -Infinity;
        for (let i = 0; i < nAds; i++) {
            const alpha = 1 + tsRewards[i];
            const beta = 1 + tsSelections[i] - tsRewards[i];
            const sample = sampleBeta(alpha, beta);
            if (sample > maxSample) {
                maxSample = sample;
                chosenAd = i;
            }
        }
        const click = Number(matrix[r][chosenAd]) || 0;
        tsSelections[chosenAd]++;
        tsRewards[chosenAd] += click;
        tsTotalReward += click;
    }

    // 3. Epsilon-Greedy (eps = 0.1)
    const egSelections = new Array(nAds).fill(0);
    const egRewards = new Array(nAds).fill(0);
    let egTotalReward = 0;
    const eps = 0.1;

    for (let r = 0; r < nRounds; r++) {
        let chosenAd;
        if (Math.random() < eps || r < nAds) {
            chosenAd = Math.floor(Math.random() * nAds);
        } else {
            let bestAvg = -1;
            chosenAd = 0;
            for (let i = 0; i < nAds; i++) {
                const avg = egSelections[i] > 0 ? egRewards[i] / egSelections[i] : 0;
                if (avg > bestAvg) {
                    bestAvg = avg;
                    chosenAd = i;
                }
            }
        }
        const click = Number(matrix[r][chosenAd]) || 0;
        egSelections[chosenAd]++;
        egRewards[chosenAd] += click;
        egTotalReward += click;
    }

    // 4. Softmax (tau = 0.15)
    const smSelections = new Array(nAds).fill(0);
    const smRewards = new Array(nAds).fill(0);
    let smTotalReward = 0;
    const tau = 0.15;

    for (let r = 0; r < nRounds; r++) {
        const expVals = [];
        let expSum = 0;
        for (let i = 0; i < nAds; i++) {
            const avg = smSelections[i] > 0 ? smRewards[i] / smSelections[i] : 0;
            const exp = Math.exp(Math.min(20, avg / tau));
            expVals.push(exp);
            expSum += exp;
        }
        let rand = Math.random() * expSum;
        let chosenAd = 0;
        for (let i = 0; i < nAds; i++) {
            rand -= expVals[i];
            if (rand <= 0) {
                chosenAd = i;
                break;
            }
        }
        const click = Number(matrix[r][chosenAd]) || 0;
        smSelections[chosenAd]++;
        smRewards[chosenAd] += click;
        smTotalReward += click;
    }

    // 5. Traditional A/B (Round Robin / Uniform)
    const abSelections = new Array(nAds).fill(0);
    const abRewards = new Array(nAds).fill(0);
    let abTotalReward = 0;

    for (let r = 0; r < nRounds; r++) {
        const chosenAd = r % nAds;
        const click = Number(matrix[r][chosenAd]) || 0;
        abSelections[chosenAd]++;
        abRewards[chosenAd] += click;
        abTotalReward += click;
    }

    // Helper to find winning ad
    const findWinner = (selections) => {
        let maxIdx = 0;
        for (let i = 1; i < selections.length; i++) {
            if (selections[i] > selections[maxIdx]) maxIdx = i;
        }
        return adNames[maxIdx] || `Ad ${maxIdx + 1}`;
    };

    const calcRegret = (totalReward) => Math.max(0, Math.round(maxTheoreticalCtr * nRounds - totalReward));

    const abReward = abTotalReward;
    const computeLift = (rew) => {
        if (!abReward) return "0% lift";
        const pct = (((rew - abReward) / abReward) * 100).toFixed(1);
        return pct >= 0 ? `+${pct}% extra clicks` : `${pct}% clicks`;
    };

    return [
        {
            ...benchmarkModelsData[0],
            ctr: (tsTotalReward / nRounds) * 100,
            totalReward: tsTotalReward,
            regret: calcRegret(tsTotalReward),
            bestAd: findWinner(tsSelections),
            vsAbLift: `${computeLift(tsTotalReward)} vs A/B testing`
        },
        {
            ...benchmarkModelsData[1],
            ctr: (ucbTotalReward / nRounds) * 100,
            totalReward: ucbTotalReward,
            regret: calcRegret(ucbTotalReward),
            bestAd: findWinner(ucbSelections),
            vsAbLift: `${computeLift(ucbTotalReward)} vs A/B testing`
        },
        {
            ...benchmarkModelsData[2],
            ctr: (egTotalReward / nRounds) * 100,
            totalReward: egTotalReward,
            regret: calcRegret(egTotalReward),
            bestAd: findWinner(egSelections),
            vsAbLift: `${computeLift(egTotalReward)} vs A/B testing`
        },
        {
            ...benchmarkModelsData[3],
            ctr: (smTotalReward / nRounds) * 100,
            totalReward: smTotalReward,
            regret: calcRegret(smTotalReward),
            bestAd: findWinner(smSelections),
            vsAbLift: `${computeLift(smTotalReward)} vs A/B testing`
        },
        {
            ...benchmarkModelsData[4],
            ctr: (abTotalReward / nRounds) * 100,
            totalReward: abTotalReward,
            regret: calcRegret(abTotalReward),
            bestAd: findWinner(abSelections)
        }
    ];
}
