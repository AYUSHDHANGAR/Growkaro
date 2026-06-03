import type { PlatformBenchmark } from "@/types";

export const platformBenchmarks: PlatformBenchmark[] = [
  {
    channel: "Google Search",
    useCase: "High-intent search",
    benchmarkCtr: 6.66,
    cpcLabel: "$5.26 avg CPC",
    costLevel: "High",
    effectiveness: "High intent",
    bestFor: "Loan, finance, repair, local service, and urgent buyer searches.",
    source: "WordStream 2025 Google Ads benchmarks",
    sourceUrl: "https://www.wordstream.com/blog/2025-google-ads-benchmarks"
  },
  {
    channel: "Facebook Traffic",
    useCase: "Low-cost reach and retargeting",
    benchmarkCtr: 1.71,
    cpcLabel: "$0.70 avg CPC",
    costLevel: "Low",
    effectiveness: "Traffic",
    bestFor: "Local offers, food, retail, events, and broad audience discovery.",
    source: "WordStream 2025 Facebook Ads benchmarks",
    sourceUrl: "https://www.wordstream.com/blog/facebook-ads-benchmarks-2025"
  },
  {
    channel: "Facebook Leads",
    useCase: "Lead forms",
    benchmarkCtr: 1.71,
    cpcLabel: "$27.66 avg CPL",
    costLevel: "Medium",
    effectiveness: "Leads",
    bestFor: "Loan enquiry, real estate, education, health, and service bookings.",
    source: "WordStream 2025 Facebook Ads benchmarks",
    sourceUrl: "https://www.wordstream.com/blog/facebook-ads-benchmarks-2025"
  },
  {
    channel: "Instagram",
    useCase: "Visual products",
    benchmarkCtr: 1.4,
    cpcLabel: "$1.43 avg CPC",
    costLevel: "Medium",
    effectiveness: "Awareness",
    bestFor: "Fashion, food, beauty, creator-led promotions, and short video.",
    source: "Sender 2025-2026 CPC statistics",
    sourceUrl: "https://www.sender.net/marketing-glossary/cost-per-click-cpc/statistics/"
  },
  {
    channel: "Google Display",
    useCase: "Browser and banner ads",
    benchmarkCtr: 0.27,
    cpcLabel: "$0.63 avg CPC",
    costLevel: "Low",
    effectiveness: "Awareness",
    bestFor: "Retargeting site visitors and keeping a local brand visible cheaply.",
    source: "Sender CPC statistics and Search Engine Land display CTR benchmark",
    sourceUrl: "https://searchengineland.com/tools/benchmark-tools/display-ads-ctr-benchmarks"
  },
  {
    channel: "Food blogs and native",
    useCase: "Contextual content ads",
    benchmarkCtr: 0.35,
    cpcLabel: "$5-$12 CPM native range",
    costLevel: "Medium",
    effectiveness: "Awareness",
    bestFor: "Restaurants, recipes, cloud kitchens, packaged foods, and review-led offers.",
    source: "OwlClaw display advertising benchmark summary",
    sourceUrl: "https://owlclaw.com/benchmarks/display-ads-benchmarks/"
  },
  {
    channel: "TikTok",
    useCase: "Cheap creative testing",
    benchmarkCtr: 1.0,
    cpcLabel: "$0.02-$1.00 CPC range",
    costLevel: "Low",
    effectiveness: "Awareness",
    bestFor: "Youth audiences, impulse products, creator videos, and fast hook testing.",
    source: "Sender 2025-2026 CPC statistics",
    sourceUrl: "https://www.sender.net/marketing-glossary/cost-per-click-cpc/statistics/"
  },
  {
    channel: "LinkedIn",
    useCase: "B2B targeting",
    benchmarkCtr: 0.65,
    cpcLabel: "$5.58+ CPC",
    costLevel: "High",
    effectiveness: "Leads",
    bestFor: "B2B software, professional services, hiring, and decision-maker campaigns.",
    source: "Sender 2025-2026 CPC statistics",
    sourceUrl: "https://www.sender.net/marketing-glossary/cost-per-click-cpc/statistics/"
  }
];

export const bestValueChannels = platformBenchmarks
  .map((platform) => ({
    ...platform,
    valueScore:
      platform.costLevel === "Low"
        ? platform.benchmarkCtr * 3
        : platform.costLevel === "Medium"
          ? platform.benchmarkCtr * 1.7
          : platform.benchmarkCtr
  }))
  .sort((first, second) => second.valueScore - first.valueScore);

export const promoterGuides = [
  {
    title: "Loan and finance",
    channels: "Google Search + Facebook Leads",
    guidance: "Use search for high-intent keywords and Meta lead forms for lower-cost enquiry capture. Keep compliance copy plain and avoid unrealistic claims."
  },
  {
    title: "Facebook and Instagram",
    channels: "Facebook Traffic + Instagram Reels",
    guidance: "Run the same offer with two hooks, then move budget to the creative with lower CPC and stable CTR after the first test window."
  },
  {
    title: "Browser and display ads",
    channels: "Google Display + retargeting",
    guidance: "Use browser ads mainly for retargeting. Cold display traffic is cheap but usually low CTR, so judge it by assisted conversions too."
  },
  {
    title: "Food blog and recipe pages",
    channels: "Native placements + local influencer posts",
    guidance: "Show the dish, price, delivery radius, and review proof. Contextual pages work better when the ad matches the article topic."
  },
  {
    title: "Wiki-style guides",
    channels: "SEO pages + sponsored explainers",
    guidance: "Wikipedia does not sell normal display ads. Build helpful guide pages or sponsor editorial-style content where ads are accepted."
  }
];
