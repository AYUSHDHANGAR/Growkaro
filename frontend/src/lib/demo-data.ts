import type { ChartPoint, ComparisonMetric, Insight } from "@/types";

export const cumulativeReward: ChartPoint[] = [
  { round: 100, reward: 11, ctr: 0.11 },
  { round: 500, reward: 69, ctr: 0.138 },
  { round: 1000, reward: 151, ctr: 0.151 },
  { round: 2000, reward: 332, ctr: 0.166 },
  { round: 4000, reward: 716, ctr: 0.179 },
  { round: 6000, reward: 1116, ctr: 0.186 },
  { round: 8000, reward: 1514, ctr: 0.189 },
  { round: 10000, reward: 1916, ctr: 0.192 }
];

export const selectionFrequency = [
  { ad: "Ad 1", selections: 512, reward: 54, upper: 0.18 },
  { ad: "Ad 2", selections: 348, reward: 31, upper: 0.15 },
  { ad: "Ad 3", selections: 760, reward: 86, upper: 0.19 },
  { ad: "Ad 4", selections: 441, reward: 39, upper: 0.16 },
  { ad: "Ad 5", selections: 6598, reward: 1488, upper: 0.24 },
  { ad: "Ad 6", selections: 382, reward: 28, upper: 0.14 },
  { ad: "Ad 7", selections: 821, reward: 105, upper: 0.2 },
  { ad: "Ad 8", selections: 414, reward: 41, upper: 0.17 },
  { ad: "Ad 9", selections: 499, reward: 51, upper: 0.18 },
  { ad: "Ad 10", selections: 225, reward: 19, upper: 0.13 }
];

export const comparisonMetrics: ComparisonMetric[] = [
  { algorithm: "UCB", ctr: 19.2, reward: 1916, regret: 71, stability: 94 },
  { algorithm: "Thompson", ctr: 18.8, reward: 1880, regret: 107, stability: 91 },
  { algorithm: "Epsilon", ctr: 16.9, reward: 1692, regret: 295, stability: 78 },
  { algorithm: "Random", ctr: 10.1, reward: 1012, regret: 975, stability: 42 }
];

export const regretSeries: ChartPoint[] = [
  { round: 100, regret: 22 },
  { round: 500, regret: 48 },
  { round: 1000, regret: 68 },
  { round: 2000, regret: 83 },
  { round: 4000, regret: 89 },
  { round: 6000, regret: 84 },
  { round: 8000, regret: 77 },
  { round: 10000, regret: 71 }
];

export const insights: Insight[] = [
  {
    title: "Promote Ad 5 first",
    body: "This ad is getting the strongest quality response. Put the main budget here before scaling lower-ranked ads.",
    tone: "cyan"
  },
  {
    title: "Keep one test running",
    body: "The system has enough confidence to choose a winner, but it should still test one fresh creative for learning.",
    tone: "violet"
  },
  {
    title: "Result is easy to explain",
    body: "For owners: more people click this ad. For analysts: regret is flattening and stability is improving.",
    tone: "lime"
  }
];
