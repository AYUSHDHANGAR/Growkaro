export type ChartPoint = {
  round: number;
  reward?: number;
  ctr?: number;
  regret?: number;
};

export type ComparisonMetric = {
  algorithm: string;
  ctr: number;
  reward: number;
  regret: number;
  stability: number;
};

export type UploadStats = {
  filename: string;
  rows: number;
  columns: number;
  totalClicks: number;
  overallCtr: number;
  bestAd: string;
  adDetails?: AdPerformance[];
};

export type Insight = {
  title: string;
  body: string;
  tone: "cyan" | "violet" | "lime" | "rose";
};

export type AdPerformance = {
  ad: string;
  impressions: number;
  clicks: number;
  ctr: number;
};

export type UserSession = {
  email: string;
  name: string;
  role: "admin" | "user" | "analyst";
  accessToken?: string;
  refreshToken?: string;
  createdAt: string;
};

export type SavedUser = {
  email: string;
  name: string;
  role: UserSession["role"];
  password?: string;
  createdAt: string;
};

export type AnalysisRecord = {
  id: string;
  ownerEmail: string;
  ownerName: string;
  createdAt: string;
  source: "upload" | "manual";
  stats: UploadStats;
  growScore: number;
  qualityLabel: string;
  recommendation: string;
  nextActions: string[];
};

export type PlatformBenchmark = {
  channel: string;
  useCase: string;
  benchmarkCtr: number;
  cpcLabel: string;
  costLevel: "Low" | "Medium" | "High";
  effectiveness: "Awareness" | "Traffic" | "Leads" | "High intent";
  bestFor: string;
  source: string;
  sourceUrl: string;
};
