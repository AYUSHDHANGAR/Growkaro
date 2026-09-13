"use client";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { benchmarkModelsData } from "@/lib/bandit-algorithms";

const numberFormatter = new Intl.NumberFormat("en-US");

export function ModelComparison() {
    const chartData = benchmarkModelsData.map((m) => ({
        algorithm: m.shortType,
        fullName: m.name,
        ctr: Number(m.ctr.toFixed(1)),
        stability: m.stability,
        reward: m.totalReward,
        regret: m.regret,
        vsAbLift: m.vsAbLift,
        color: m.color
    }));

    return (
        <section id="models" className="glass-panel rounded-3xl p-6">
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                    <p className="text-sm font-black uppercase text-cyanEdge">Academic & Experimental Benchmark</p>
                    <h3 className="mt-2 text-2xl font-black text-white">
                        Multi-Armed Bandit Models vs Traditional A/B
                    </h3>
                    <p className="text-xs text-white/50">
                        Tested on 10,000 real impression records from dataset.csv.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold text-white/55 sm:grid-cols-4">
                    <span className="text-cyanEdge font-black">CTR (%)</span>
                    <span className="text-limeSignal font-black">Stability</span>
                    <span className="text-white/80">Clicks Gained</span>
                    <span className="text-rose-400">Regret Loss</span>
                </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid stroke="rgba(255,255,255,.09)" vertical={false} />
                            <XAxis dataKey="algorithm" stroke="rgba(255,255,255,.45)" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                            <YAxis stroke="rgba(255,255,255,.45)" tickLine={false} axisLine={false} unit="%" tick={{ fontSize: 11 }} />
                            <Tooltip 
                                formatter={(val, name) => [name === "ctr" ? `${val}% CTR` : `${val}% Stability`, name === "ctr" ? "CTR" : "Stability"]}
                                contentStyle={{ background: "#0b1020", border: "1px solid rgba(255,255,255,.14)", borderRadius: 16 }} 
                            />
                            <Bar dataKey="ctr" fill="#25d6ff" radius={[10, 10, 0, 0]} name="ctr" />
                            <Bar dataKey="stability" fill="#74f7b6" radius={[10, 10, 0, 0]} name="stability" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="grid gap-3">
                    {benchmarkModelsData.map((model) => (
                        <div key={model.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: model.color }} />
                                    <p className="font-black text-sm text-white">{model.name}</p>
                                </div>
                                <p className="text-sm font-black" style={{ color: model.color }}>{model.ctr.toFixed(1)}% CTR</p>
                            </div>
                            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                                <div 
                                    className="h-full rounded-full" 
                                    style={{ 
                                        width: `${model.stability}%`,
                                        background: `linear-gradient(to right, ${model.color}, #74f7b6)`
                                    }} 
                                />
                            </div>
                            <div className="mt-2 flex items-center justify-between text-xs">
                                <span className="text-white/50">{numberFormatter.format(model.totalReward)} clicks</span>
                                <span className="font-bold text-limeSignal">{model.vsAbLift}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
