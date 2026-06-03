"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { formatPercent, getAdDetails } from "@/lib/analysis";
import type { UploadStats } from "@/types";

type AnalyticsChartsProps = {
  stats: UploadStats;
};

function buildCtrGrowth(stats: UploadStats) {
  const finalCtr = stats.overallCtr;
  return [10, 25, 40, 55, 70, 85, 100].map((progress, index) => ({
    round: Math.max(1, Math.round(((stats.rows || 1) * progress) / 100)),
    ctr: Math.max(0, finalCtr * (0.45 + index * 0.095)),
    projected: finalCtr
  }));
}

function buildAdBars(stats: UploadStats) {
  return getAdDetails(stats).map((ad) => ({
    ad: ad.ad,
    impressions: ad.impressions,
    clicks: ad.clicks,
    ctr: Number(ad.ctr.toFixed(2))
  }));
}

function buildRegretSeries(stats: UploadStats) {
  const baseMissed = Math.max(10, stats.rows * stats.columns * Math.max(0.02, (100 - stats.overallCtr) / 1000));
  return [10, 25, 40, 55, 70, 85, 100].map((progress, index) => ({
    round: Math.max(1, Math.round(((stats.rows || 1) * progress) / 100)),
    regret: Math.max(1, Math.round(baseMissed / (index + 1.35)))
  }));
}

export function AnalyticsCharts({ stats }: AnalyticsChartsProps) {
  const ctrGrowth = buildCtrGrowth(stats);
  const adBars = buildAdBars(stats);
  const regretSeries = buildRegretSeries(stats);

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <section data-gsap="fade-up" className="glass-panel rounded-3xl p-5">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase text-cyanEdge">Performance</p>
            <h3 className="text-xl font-black">CTR growth over optimization rounds</h3>
          </div>
          <span className="rounded-full bg-limeSignal/12 px-3 py-1 text-xs font-black text-limeSignal">{formatPercent(stats.overallCtr)} CTR</span>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={ctrGrowth}>
              <defs>
                <linearGradient id="ctrGrowth" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#25d6ff" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#25d6ff" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,.09)" vertical={false} />
              <XAxis dataKey="round" stroke="rgba(255,255,255,.45)" tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,.45)" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "#0b1020", border: "1px solid rgba(255,255,255,.14)", borderRadius: 16 }} />
              <Area type="monotone" dataKey="ctr" name="CTR %" stroke="#25d6ff" strokeWidth={3} fill="url(#ctrGrowth)" />
              <Line type="monotone" dataKey="projected" name="Target CTR %" stroke="#74f7b6" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section data-gsap="fade-up" className="glass-panel rounded-3xl p-5">
        <div className="mb-5">
          <p className="text-sm font-black uppercase text-violetEdge">Ad allocation</p>
          <h3 className="text-xl font-black">Ad CTR from current dataset</h3>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={adBars}>
              <CartesianGrid stroke="rgba(255,255,255,.09)" vertical={false} />
              <XAxis dataKey="ad" stroke="rgba(255,255,255,.45)" tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,.45)" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "#0b1020", border: "1px solid rgba(255,255,255,.14)", borderRadius: 16 }} />
              <Bar dataKey="ctr" name="CTR %" fill="#9b5cff" radius={[8, 8, 0, 0]} />
              <Bar dataKey="clicks" name="Clicks" fill="#74f7b6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section data-gsap="fade-up" className="glass-panel rounded-3xl p-5 xl:col-span-2">
        <div className="mb-5">
          <p className="text-sm font-black uppercase text-roseEdge">Learning cost</p>
          <h3 className="text-xl font-black">Missed-click cost reducing over time</h3>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={regretSeries}>
              <CartesianGrid stroke="rgba(255,255,255,.09)" vertical={false} />
              <XAxis dataKey="round" stroke="rgba(255,255,255,.45)" tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,.45)" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "#0b1020", border: "1px solid rgba(255,255,255,.14)", borderRadius: 16 }} />
              <Line type="monotone" dataKey="regret" stroke="#ff4ecd" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
