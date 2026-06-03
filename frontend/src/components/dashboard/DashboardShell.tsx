"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Gauge, LockKeyhole, MousePointerClick, Radio, Sigma, Trophy, UploadCloud, UserPlus } from "lucide-react";

import { buildAnalysisRecord, buildNextActions, getGrowScore, getTopResultAds } from "@/lib/analysis";
import { getSession, saveAnalysis } from "@/lib/local-history";
import type { UploadStats } from "@/types";
import { AnalyticsCharts } from "./AnalyticsCharts";
import { DatasetUpload } from "./DatasetUpload";
import { PerformanceMeter } from "./PerformanceMeter";
import { MetricCard } from "../shared/MetricCard";

const numberFormatter = new Intl.NumberFormat("en-US");

const toneClass = {
  cyan: "border-cyanEdge/40 bg-cyanEdge/10 text-cyan-100",
  violet: "border-violetEdge/40 bg-violetEdge/10 text-violet-100",
  lime: "border-limeSignal/40 bg-limeSignal/10 text-lime-100",
  rose: "border-roseEdge/40 bg-roseEdge/10 text-rose-100"
};

export function DashboardShell() {
  const [stats, setStats] = useState<UploadStats | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const growScore = stats ? getGrowScore(stats) : null;

  useEffect(() => {
    setIsAuthenticated(Boolean(getSession()));
  }, []);

  function handleStats(nextStats: UploadStats) {
    const session = getSession();
    if (!session) return;
    setStats(nextStats);
    saveAnalysis(buildAnalysisRecord(nextStats, session, "upload"));
  }

  if (!isAuthenticated) {
    return (
      <section id="dashboard" className="mx-auto w-full max-w-7xl px-5 py-16">
        <div data-gsap="fade-up" className="glass-panel rounded-lg p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-center">
            <div>
              <div className="grid h-12 w-12 place-items-center rounded-lg border border-limeSignal/30 bg-limeSignal/10 text-limeSignal">
                <LockKeyhole className="h-6 w-6" />
              </div>
              <p className="mt-5 text-sm font-black uppercase text-cyanEdge">Protected analytics</p>
              <h2 className="mt-3 max-w-3xl text-4xl font-black tracking-tight md:text-5xl">Login before viewing results.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/60">
                GrowKaro keeps every client analysis separate. Sign up or login first, then upload datasets, see CTR charts, save history, and export PDF reports.
              </p>
            </div>
            <div className="grid gap-3">
              <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-lg bg-limeSignal px-5 py-3 font-black text-midnight">
                <UserPlus className="h-4 w-4" />
                Create account
              </Link>
              <Link href="/login" className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.06] px-5 py-3 font-black text-white">
                <LockKeyhole className="h-4 w-4" />
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="dashboard" className="mx-auto w-full max-w-7xl px-5 py-16">
      <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-black uppercase text-cyanEdge">Analytics workspace</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">Upload, score, guide, and optimize.</h2>
        </div>
        {stats ? (
          <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white/68">
            Active dataset: <span className="text-white">{stats.filename}</span>
          </div>
        ) : (
          <div className="rounded-full border border-amberSignal/25 bg-amberSignal/10 px-4 py-2 text-sm font-bold text-amberSignal">No dataset selected</div>
        )}
      </div>

      <DatasetUpload onStats={handleStats} />

      {!stats ? (
        <div className="mt-5 rounded-lg border border-dashed border-white/15 bg-white/[0.03] p-8 text-center">
          <UploadCloud className="mx-auto h-9 w-9 text-cyanEdge" />
          <h3 className="mt-4 text-2xl font-black">Upload a real dataset to unlock analytics.</h3>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-white/56">
            No dataset is loaded. Charts, GrowScore, ranking, and guidance will appear only after a user uploads their own ad result file.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <MetricCard label="Total impressions" value={numberFormatter.format(stats.rows * stats.columns)} helper={`${stats.columns} ads detected automatically`} icon={Radio} tone="cyan" />
            <MetricCard label="Quality clicks" value={numberFormatter.format(stats.totalClicks)} helper="People who responded positively to the ads" icon={MousePointerClick} tone="violet" />
            <MetricCard label="CTR" value={`${stats.overallCtr.toFixed(2)}%`} helper="How often viewers clicked after seeing an ad" icon={Sigma} tone="lime" />
            <MetricCard label="Ranked ads" value={`${getTopResultAds(stats).length}/${stats.columns}`} helper="All ads ranked by CTR" icon={Trophy} tone="rose" />
            <MetricCard label="GrowScore" value={String(growScore)} helper="Client-ready campaign health score" icon={Gauge} tone="cyan" />
          </div>

          <div className="mt-5">
            <PerformanceMeter stats={stats} />
          </div>

          <div className="mt-5">
            <AnalyticsCharts stats={stats} />
          </div>

          <aside className="glass-panel mt-5 rounded-3xl p-6">
            <p className="text-sm font-black uppercase text-cyanEdge">Guide engine</p>
            <h3 className="mt-2 text-2xl font-black">Simple next actions</h3>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {buildNextActions(stats, growScore ?? 300).map((action, index) => (
                <article key={action} className={`rounded-2xl border p-4 ${toneClass[index === 0 ? "cyan" : index === 1 ? "lime" : "violet"]}`}>
                  <p className="font-black">Step {index + 1}</p>
                  <p className="mt-2 text-sm leading-6 text-white/64">{action}</p>
                </article>
              ))}
            </div>
          </aside>
        </>
      )}
    </section>
  );
}
