"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3, Download, Gauge, IndianRupee, MousePointerClick, Radio, Sigma, Sparkles, Trophy } from "lucide-react";
import { formatPercent, getAdDecision, getBudgetAllocation, getRankedAds, getTopResultAds } from "@/lib/analysis";
const numberFormatter = new Intl.NumberFormat("en-US");
const currencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
});
export function ResultSummary({ record, onExportPdf }) {
    const [totalBudget, setTotalBudget] = useState(10000);
    const rankedAds = useMemo(() => getRankedAds(record.stats), [record.stats]);
    const topAds = useMemo(() => getTopResultAds(record.stats), [record.stats]);
    const budgetPlan = useMemo(() => getBudgetAllocation(record.stats, totalBudget), [record.stats, totalBudget]);
    const totalImpressions = record.stats.adDetails?.reduce((sum, ad) => sum + ad.impressions, 0) ?? record.stats.rows * record.stats.columns;
    const averageCtr = record.stats.overallCtr;
    const decisionTone = {
        lime: "border-limeSignal/30 bg-limeSignal/10 text-limeSignal",
        cyan: "border-cyanEdge/30 bg-cyanEdge/10 text-cyanEdge",
        amber: "border-amberSignal/30 bg-amberSignal/10 text-amberSignal",
        rose: "border-roseEdge/30 bg-roseEdge/10 text-roseEdge"
    };
    const cards = [
        { label: "Impressions", value: numberFormatter.format(totalImpressions), icon: Radio, tone: "text-cyanEdge" },
        { label: "Quality clicks", value: numberFormatter.format(record.stats.totalClicks), icon: MousePointerClick, tone: "text-violetEdge" },
        { label: "CTR", value: formatPercent(record.stats.overallCtr), icon: Sigma, tone: "text-limeSignal" },
        { label: "Ads ranked", value: `${rankedAds.length}`, icon: Trophy, tone: "text-amberSignal" },
        { label: "GrowScore", value: String(record.growScore), icon: Gauge, tone: "text-roseEdge" }
    ];
    return (<section className="grid gap-5">
      <div className="glass-panel rounded-lg p-5">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div>
            <p className="text-sm font-black uppercase text-limeSignal">Detailed result</p>
            <h2 className="mt-2 text-3xl font-black">{record.qualityLabel} ad performance</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/62">{record.recommendation}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link href="/optimization" className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyanEdge px-4 py-3 font-black text-midnight">
              <BarChart3 className="h-4 w-4"/>
              Full analysis
              <ArrowRight className="h-4 w-4"/>
            </Link>
            {onExportPdf && (<button type="button" onClick={() => onExportPdf(totalBudget)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-limeSignal px-4 py-3 font-black text-midnight">
                <Download className="h-4 w-4"/>
                Export PDF
              </button>)}
          </div>
        </div>

        {topAds.length > 0 && (<div className="mt-5 rounded-lg border border-limeSignal/25 bg-limeSignal/10 p-5">
            <p className="text-sm font-black uppercase text-limeSignal">Plain answer</p>
            <h3 className="mt-2 text-2xl font-black text-white">All {rankedAds.length} ads are ranked below.</h3>
            <p className="mt-2 text-sm leading-6 text-white/68">
              GrowKaro shows every ad from best to weakest. Higher-ranked ads get more budget, and lower-ranked ads should be improved before heavy spending.
            </p>
          </div>)}

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {cards.map((card) => (<article key={card.label} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <card.icon className={`h-5 w-5 ${card.tone}`}/>
              <p className="mt-3 text-xs font-black uppercase text-white/42">{card.label}</p>
              <p className="mt-1 break-words text-2xl font-black">{card.value}</p>
            </article>))}
        </div>
      </div>

      <section className="glass-panel rounded-lg p-5">
        <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-black uppercase text-cyanEdge">All ranked ads</p>
            <h3 className="mt-2 text-2xl font-black">Every ad result in rank order</h3>
          </div>
          <p className="max-w-xl text-sm leading-6 text-white/56">
            CTR means how many people clicked after seeing the ad. Higher CTR gets a better rank and a larger budget share.
          </p>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {topAds.map((ad, index) => {
            const decision = getAdDecision(ad, index, averageCtr);
            return (<article key={ad.ad} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase text-white/42">Rank {index + 1}</p>
                    <h4 className="mt-1 text-xl font-black">{ad.ad}</h4>
                  </div>
                  <span className={`rounded-lg border px-3 py-1 text-xs font-black ${decisionTone[decision.tone]}`}>{decision.label}</span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                  <div className="rounded-lg bg-white/[0.05] p-3">
                    <p className="text-xs font-black uppercase text-white/38">CTR</p>
                    <p className="mt-1 font-black text-limeSignal">{formatPercent(ad.ctr)}</p>
                  </div>
                  <div className="rounded-lg bg-white/[0.05] p-3">
                    <p className="text-xs font-black uppercase text-white/38">Clicks</p>
                    <p className="mt-1 font-black">{numberFormatter.format(ad.clicks)}</p>
                  </div>
                  <div className="rounded-lg bg-white/[0.05] p-3">
                    <p className="text-xs font-black uppercase text-white/38">Views</p>
                    <p className="mt-1 font-black">{numberFormatter.format(ad.impressions)}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-white/64">{decision.meaning}</p>
                <p className="mt-3 rounded-lg border border-white/10 bg-midnight/50 p-3 text-sm font-bold leading-6 text-white/72">{decision.nextStep}</p>
              </article>);
        })}
        </div>
      </section>

      <section className="glass-panel rounded-lg p-5">
        <div className="grid gap-5 lg:grid-cols-[320px_1fr] lg:items-start">
          <div>
            <div className="flex items-center gap-2 text-sm font-black uppercase text-limeSignal">
              <IndianRupee className="h-4 w-4"/>
              Budget allocation
            </div>
            <h3 className="mt-2 text-2xl font-black">Enter total budget</h3>
            <p className="mt-2 text-sm leading-6 text-white/58">
              GrowKaro splits the money across all ranked ads. Higher rank and higher CTR receive more budget.
            </p>
            <label className="mt-4 grid gap-2 text-sm font-bold text-white/70">
              Total promotion budget
              <input type="number" min={0} value={totalBudget} onChange={(event) => setTotalBudget(Number(event.target.value))} className="rounded-lg border border-white/10 bg-midnight/70 px-3 py-3 text-white outline-none"/>
            </label>
          </div>
          <div className="grid gap-3">
            {budgetPlan.map((ad, index) => (<article key={ad.ad} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-xs font-black uppercase text-white/42">Rank {ad.rank}</p>
                    <h4 className="text-xl font-black">{ad.ad}</h4>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-2xl font-black text-limeSignal">{currencyFormatter.format(ad.budget)}</p>
                    <p className="text-xs font-bold text-white/45">{formatPercent(ad.share)} of budget</p>
                  </div>
                </div>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-limeSignal" style={{ width: `${Math.min(100, ad.share)}%` }}/>
                </div>
                <p className="mt-3 text-sm leading-6 text-white/60">
                  {index === 0 ? "Highest priority. Give this ad the biggest test budget." : "Good supporting ad. Keep budget smaller than higher-ranked ads."}
                </p>
              </article>))}
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <section className="glass-panel rounded-lg p-5">
          <p className="text-sm font-black uppercase text-cyanEdge">Ranked result table</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[620px] border-separate border-spacing-y-2 text-left text-sm">
              <thead className="text-xs uppercase text-white/40">
                <tr>
                  <th className="px-3 py-2">Rank</th>
                  <th className="px-3 py-2">Ad</th>
                  <th className="px-3 py-2">Impressions</th>
                  <th className="px-3 py-2">Clicks</th>
                  <th className="px-3 py-2">CTR</th>
                  <th className="px-3 py-2">Decision</th>
                  <th className="px-3 py-2">Simple meaning</th>
                </tr>
              </thead>
              <tbody>
                {topAds.map((ad, index) => {
            const decision = getAdDecision(ad, index, averageCtr);
            return (<tr key={ad.ad} className="bg-white/[0.04]">
                      <td className="rounded-l-lg px-3 py-3 font-black text-limeSignal">#{ad.rank}</td>
                      <td className="px-3 py-3 font-black">{ad.ad}</td>
                      <td className="px-3 py-3">{numberFormatter.format(ad.impressions)}</td>
                      <td className="px-3 py-3">{numberFormatter.format(ad.clicks)}</td>
                      <td className="px-3 py-3 font-black text-limeSignal">{formatPercent(ad.ctr)}</td>
                      <td className="px-3 py-3 font-black text-white">{decision.label}</td>
                      <td className="rounded-r-lg px-3 py-3 text-white/62">{decision.meaning}</td>
                    </tr>);
        })}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="glass-panel rounded-lg p-5">
          <div className="flex items-center gap-2 text-sm font-black uppercase text-amberSignal">
            <Sparkles className="h-4 w-4"/>
            Next actions
          </div>
          <div className="mt-4 grid gap-3">
            {record.nextActions.map((action) => (<p key={action} className="rounded-lg border border-white/10 bg-white/[0.04] p-3 text-sm leading-6 text-white/64">
                {action}
              </p>))}
          </div>
        </aside>
      </div>
    </section>);
}
