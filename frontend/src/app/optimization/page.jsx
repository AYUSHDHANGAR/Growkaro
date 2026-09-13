import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { MultiModelComparison } from "@/components/dashboard/MultiModelComparison";
import { AppShell } from "@/components/shared/AppShell";
import { AnalysisHistoryPanel } from "@/components/shared/AnalysisHistoryPanel";
import { AuthGate } from "@/components/shared/AuthGate";
import { bestValueChannels } from "@/lib/ad-platforms";

export default function OptimizationPage() {
    return (
        <AppShell 
            eyebrow="Reinforcement Learning Suite" 
            title="Multi-Model Ad Optimization & RL Benchmark" 
            description="Empirical comparison of Thompson Sampling, UCB1, Epsilon-Greedy, and Softmax algorithms against Traditional static A/B testing."
        >
            <AuthGate 
                title="Login required for optimization" 
                description="Sign in before uploading ad data, viewing channel guidance, or opening saved optimization history."
            >
                {/* Multi-Model RL vs Traditional A/B Test Benchmark */}
                <section className="mx-auto w-full max-w-7xl px-5 pb-8">
                    <MultiModelComparison />
                </section>

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
            </AuthGate>
        </AppShell>
    );
}
