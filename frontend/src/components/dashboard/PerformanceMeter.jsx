import { BadgeCheck, Gauge, Lightbulb, TrendingUp } from "lucide-react";
import { getGrowScore } from "@/lib/analysis";
const scoreBands = [
    { label: "Needs work", range: "300-579" },
    { label: "Fair", range: "580-699" },
    { label: "Good", range: "700-799" },
    { label: "Excellent", range: "800-900" }
];
export function PerformanceMeter({ stats }) {
    const score = getGrowScore(stats);
    const scorePercent = ((score - 300) / 600) * 100;
    const scoreDegrees = (scorePercent / 100) * 360;
    const qualityLabel = score >= 800 ? "Excellent" : score >= 700 ? "Good" : score >= 580 ? "Fair" : "Needs work";
    const meters = [
        { label: "Quality click signal", value: Math.min(96, Math.round(stats.overallCtr * 4.8)), tone: "bg-limeSignal" },
        { label: "Learning confidence", value: 88, tone: "bg-cyanEdge" },
        { label: "Local audience fit", value: 82, tone: "bg-amberSignal" },
        { label: "Scale readiness", value: 79, tone: "bg-roseEdge" }
    ];
    return (<section id="performance-score" className="glass-panel rounded-3xl p-6">
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-black uppercase text-limeSignal">Performance meter</p>
          <h3 className="mt-2 text-2xl font-black">GrowScore for quick business understanding</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/56">
            A simple score-style view that turns ad performance into owner-friendly status while keeping the model metrics below.
          </p>
        </div>
        <div className="rounded-full border border-limeSignal/25 bg-limeSignal/10 px-4 py-2 text-sm font-black text-limeSignal">
          {qualityLabel} campaign health
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[280px_1fr_320px]">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <div className="mx-auto grid aspect-square max-w-[220px] place-items-center rounded-full p-4" style={{ background: `conic-gradient(#74f7b6 0deg ${scoreDegrees}deg, rgba(255,255,255,.1) ${scoreDegrees}deg 360deg)` }}>
            <div className="grid h-full w-full place-items-center rounded-full bg-midnight text-center">
              <div>
                <Gauge className="mx-auto h-8 w-8 text-limeSignal"/>
                <p className="mt-2 text-5xl font-black">{score}</p>
                <p className="text-xs font-black uppercase text-white/42">out of 900</p>
              </div>
            </div>
          </div>
          <p className="mt-4 text-center text-sm font-black uppercase tracking-normal text-limeSignal">GrowScore</p>
          <div className="mt-5 grid grid-cols-2 gap-2">
            {scoreBands.map((band) => (<div key={band.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                <p className="text-xs font-black text-white/70">{band.label}</p>
                <p className="mt-1 text-xs text-white/40">{band.range}</p>
              </div>))}
          </div>
        </div>

        <div className="grid gap-3">
          {meters.map((meter) => (<div key={meter.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-center justify-between gap-3 text-sm">
                <p className="font-black text-white/78">{meter.label}</p>
                <p className="font-black text-white">{meter.value}%</p>
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
                <div className={`h-full rounded-full ${meter.tone}`} style={{ width: `${meter.value}%` }}/>
              </div>
            </div>))}
        </div>

        <aside className="rounded-3xl border border-amberSignal/25 bg-amberSignal/10 p-5">
          <div className="flex items-center gap-2 text-sm font-black uppercase text-amberSignal">
            <Lightbulb className="h-4 w-4"/>
            Plain result
          </div>
          <p className="mt-4 text-lg font-black text-white">Your strongest ad is {stats.bestAd}.</p>
          <p className="mt-3 text-sm leading-6 text-white/66">
            Growkaro would show this ad to more people, keep watching quality clicks, and test one new creative for the same audience.
          </p>
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-limeSignal/25 bg-limeSignal/10 p-4">
            <BadgeCheck className="h-5 w-5 shrink-0 text-limeSignal"/>
            <p className="text-sm leading-6 text-white/66">Good for non-professional users: the next action is clear before the technical charts.</p>
          </div>
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-cyanEdge/25 bg-cyanEdge/10 p-4">
            <TrendingUp className="h-5 w-5 shrink-0 text-cyanEdge"/>
            <p className="text-sm leading-6 text-white/66">Professional users can still review CTR, reward, regret, stability, and confidence.</p>
          </div>
        </aside>
      </div>
    </section>);
}
