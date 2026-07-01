export function getGrowScore(stats) {
    return Math.min(900, Math.max(300, Math.round(650 + stats.overallCtr * 8.5)));
}
export function getQualityLabel(score) {
    if (score >= 820)
        return "Excellent";
    if (score >= 740)
        return "Strong";
    if (score >= 660)
        return "Promising";
    if (score >= 580)
        return "Needs tuning";
    return "Needs work";
}
export function buildRecommendation(stats, growScore) {
    const resultAds = getTopResultAds(stats);
    const adNames = resultAds.map((ad) => ad.ad).join(", ");
    if (growScore >= 820) {
        return `All ${resultAds.length} ads are ranked for controlled scaling: ${adNames}. Increase budget gradually by rank and keep improving lower-ranked ads.`;
    }
    if (growScore >= 700) {
        return `Review all ${resultAds.length} ranked ads: ${adNames}. Put more budget on higher-ranked ads and improve offer proof for lower-ranked ads.`;
    }
    return `All ${resultAds.length} ads are ranked here: ${adNames}. The campaign needs better targeting and clearer copy before extra budget goes to lower-ranked ads.`;
}
export function buildNextActions(stats, growScore) {
    const resultAds = getTopResultAds(stats);
    const adNames = resultAds.map((ad) => ad.ad).join(", ");
    const actions = [
        `Rank all ${resultAds.length} ads and put the biggest budget on the highest CTR ads: ${adNames}.`,
        "Create one new variant with a clearer hook, stronger proof, and a direct call to action.",
        "Separate warm audiences from cold audiences so the result is not mixed."
    ];
    if (stats.overallCtr < 2) {
        actions.unshift("CTR is low for most paid social campaigns. Improve the opening line, image, and audience match first.");
    }
    if (growScore >= 800) {
        actions.push("Prepare a retargeting ad for people who clicked but did not convert.");
    }
    return actions;
}
export function getAdDetails(stats) {
    if (stats.adDetails?.length)
        return stats.adDetails;
    const impressions = Math.max(stats.rows, 1);
    return [
        {
            ad: stats.bestAd,
            impressions,
            clicks: stats.totalClicks,
            ctr: stats.overallCtr
        }
    ];
}
export function getRankedAds(stats) {
    return getAdDetails(stats)
        .slice()
        .sort((first, second) => second.ctr - first.ctr || second.clicks - first.clicks)
        .map((ad, index) => ({ ...ad, rank: index + 1 }));
}
export function getTopResultAds(stats) {
    return getRankedAds(stats);
}
export function getBudgetAllocation(stats, totalBudget) {
    const topAds = getTopResultAds(stats);
    const safeBudget = Math.max(0, totalBudget);
    const rawWeights = topAds.map((ad, index) => {
        const rankBoost = topAds.length - index;
        return Math.max(ad.ctr, 0.01) * rankBoost;
    });
    const totalWeight = rawWeights.reduce((sum, weight) => sum + weight, 0) || topAds.length;
    let allocated = 0;
    return topAds.map((ad, index) => {
        const amount = index === topAds.length - 1
            ? Math.max(0, safeBudget - allocated)
            : Math.round((safeBudget * rawWeights[index]) / totalWeight);
        allocated += amount;
        return {
            ...ad,
            budget: amount,
            share: safeBudget > 0 ? (amount / safeBudget) * 100 : 0
        };
    });
}
export function getAdDecision(ad, rank, averageCtr) {
    if (rank === 0) {
        return {
            label: "Spend first",
            tone: "lime",
            meaning: "This ad is getting the best response. Give it the largest share before lower-ranked ads.",
            nextStep: "Increase budget slowly and watch if CTR stays stable."
        };
    }
    if (ad.ctr >= averageCtr * 0.9) {
        return {
            label: "Keep testing",
            tone: "cyan",
            meaning: "This ad is close to the campaign average. It may work with a better audience or creative.",
            nextStep: "Change one thing: image, opening line, or audience."
        };
    }
    if (ad.ctr >= averageCtr * 0.5) {
        return {
            label: "Improve first",
            tone: "amber",
            meaning: "People are clicking, but not enough to deserve more budget yet.",
            nextStep: "Rewrite the offer and test again with a small budget."
        };
    }
    return {
        label: "Pause for now",
        tone: "rose",
        meaning: "This ad is not pulling enough clicks compared with the others.",
        nextStep: "Do not scale it. Make a new version before spending again."
    };
}
export function buildAnalysisRecord(stats, session, source = "upload") {
    const growScore = getGrowScore(stats);
    return {
        id: crypto.randomUUID(),
        ownerEmail: session?.email ?? "guest@growkaro.local",
        ownerName: session?.name ?? "Guest user",
        createdAt: new Date().toISOString(),
        source,
        stats,
        growScore,
        qualityLabel: getQualityLabel(growScore),
        recommendation: buildRecommendation(stats, growScore),
        nextActions: buildNextActions(stats, growScore)
    };
}
export function buildStatsFromManualRows(rows, filename = "manual-ad-performance") {
    const cleanedRows = rows
        .map((row) => ({
        ...row,
        impressions: Math.max(0, Math.round(row.impressions)),
        clicks: Math.max(0, Math.min(Math.round(row.clicks), Math.round(row.impressions)))
    }))
        .filter((row) => row.ad.trim() && row.impressions > 0);
    if (!cleanedRows.length) {
        throw new Error("Add at least one ad with impressions and clicks.");
    }
    const totalImpressions = cleanedRows.reduce((sum, row) => sum + row.impressions, 0);
    const totalClicks = cleanedRows.reduce((sum, row) => sum + row.clicks, 0);
    const adDetails = cleanedRows.map((row) => ({
        ...row,
        ctr: (row.clicks / Math.max(row.impressions, 1)) * 100
    }));
    const bestAd = adDetails.reduce((best, row) => (row.ctr > best.ctr ? row : best), adDetails[0]).ad;
    return {
        filename,
        rows: Math.round(totalImpressions / Math.max(adDetails.length, 1)),
        columns: adDetails.length,
        totalClicks,
        overallCtr: (totalClicks / Math.max(totalImpressions, 1)) * 100,
        bestAd,
        adDetails
    };
}
export function formatPercent(value) {
    return `${value.toFixed(value >= 10 ? 1 : 2)}%`;
}
