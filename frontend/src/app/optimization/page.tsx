import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { AppShell } from "@/components/shared/AppShell";
import { AnalysisHistoryPanel } from "@/components/shared/AnalysisHistoryPanel";
import { bestValueChannels } from "@/lib/ad-platforms";

export default function OptimizationPage() {
  return (
    <AppShell
      eyebrow="Optimization workspace"
      title="Ad optimization with saved history"
      description="Upload ad performance, review UCB recommendations, compare channels, and keep every analysis saved for the current user."
    >
      <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 pb-4 xl:grid-cols-[1fr_360px]">
        <div className="glass-panel rounded-lg p-5">
          <p className="text-sm font-black uppercase text-amberSignal">Best value channels</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {bestValueChannels.slice(0, 4).map((channel) => (
              <article key={channel.channel} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <p className="text-lg font-black">{channel.channel}</p>
                <p className="mt-2 text-sm text-white/56">{channel.useCase}</p>
                <div className="mt-4 flex items-center justify-between gap-2 text-sm">
                  <span className="font-black text-limeSignal">{channel.benchmarkCtr.toFixed(2)}% CTR</span>
                  <span className="text-white/58">{channel.cpcLabel}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
        <AnalysisHistoryPanel scope="user" limit={4} />
      </section>
      <DashboardShell />
    </AppShell>
  );
}
