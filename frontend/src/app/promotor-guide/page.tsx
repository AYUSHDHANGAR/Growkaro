import { ArrowUpRight, BadgeDollarSign, BookOpenCheck, Megaphone, Target } from "lucide-react";

import { AppShell } from "@/components/shared/AppShell";
import { platformBenchmarks, promoterGuides } from "@/lib/ad-platforms";

export default function PromotorGuidePage() {
  return (
    <AppShell
      eyebrow="Helping new promoters"
      title="Target marketing guide"
      description="Choose where to promote based on objective, CTR benchmark, cost signal, and the type of customer you need."
    >
      <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 pb-16">
        <div className="grid gap-4 lg:grid-cols-5">
          {promoterGuides.map((guide) => (
            <article key={guide.title} className="glass-panel rounded-lg p-5">
              <BookOpenCheck className="h-6 w-6 text-limeSignal" />
              <h2 className="mt-4 text-lg font-black">{guide.title}</h2>
              <p className="mt-2 text-sm font-bold text-cyanEdge">{guide.channels}</p>
              <p className="mt-3 text-sm leading-6 text-white/60">{guide.guidance}</p>
            </article>
          ))}
        </div>

        <section className="glass-panel rounded-lg p-5">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-black uppercase text-amberSignal">CTR and cost comparison</p>
              <h2 className="mt-2 text-3xl font-black">Best cheap and effective promotion sites</h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-white/56">
              Benchmarks are planning references. Run a small test, then let GrowKaro compare the real CTR from your own ads.
            </p>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[900px] border-separate border-spacing-y-2 text-left text-sm">
              <thead className="text-xs uppercase text-white/40">
                <tr>
                  <th className="px-3 py-2">Promotion site</th>
                  <th className="px-3 py-2">Use case</th>
                  <th className="px-3 py-2">CTR benchmark</th>
                  <th className="px-3 py-2">Cost signal</th>
                  <th className="px-3 py-2">Best fit</th>
                  <th className="px-3 py-2">Source</th>
                </tr>
              </thead>
              <tbody>
                {platformBenchmarks.map((platform) => (
                  <tr key={platform.channel} className="bg-white/[0.04]">
                    <td className="rounded-l-lg px-3 py-3">
                      <div className="flex items-center gap-2 font-black">
                        <Megaphone className="h-4 w-4 text-cyanEdge" />
                        {platform.channel}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-white/62">{platform.useCase}</td>
                    <td className="px-3 py-3 font-black text-limeSignal">{platform.benchmarkCtr.toFixed(2)}%</td>
                    <td className="px-3 py-3">
                      <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.05] px-2 py-1">
                        <BadgeDollarSign className="h-4 w-4 text-amberSignal" />
                        {platform.cpcLabel}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-white/62">{platform.bestFor}</td>
                    <td className="rounded-r-lg px-3 py-3">
                      <a href={platform.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-bold text-cyanEdge">
                        {platform.source}
                        <ArrowUpRight className="h-3 w-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {[
            ["Cheap first test", "Start with Facebook Traffic, TikTok, or Google Display retargeting when budget is tight."],
            ["Best intent", "Use Google Search for loan, service, repair, and urgent demand because users are already searching."],
            ["Best learning", "Use the same offer across two channels, then compare CTR, CPC, and saved GrowScore history."]
          ].map(([title, body]) => (
            <article key={title} className="glass-panel rounded-lg p-5">
              <Target className="h-6 w-6 text-roseEdge" />
              <h2 className="mt-4 text-xl font-black">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-white/60">{body}</p>
            </article>
          ))}
        </section>
      </section>
    </AppShell>
  );
}
