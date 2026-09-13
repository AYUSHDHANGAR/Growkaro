"use client";
import { useState } from "react";
import { 
    Bar, 
    BarChart, 
    CartesianGrid, 
    Legend, 
    Line, 
    LineChart, 
    ResponsiveContainer, 
    Tooltip, 
    XAxis, 
    YAxis 
} from "recharts";
import { 
    Award, 
    BookOpen, 
    CheckCircle2, 
    ChevronDown, 
    ChevronUp, 
    Flame, 
    HelpCircle, 
    LineChart as ChartIcon, 
    ShieldAlert, 
    Sparkles, 
    TrendingUp, 
    Zap 
} from "lucide-react";
import { benchmarkModelsData, benchmarkProgressionData } from "@/lib/bandit-algorithms";

const numberFormatter = new Intl.NumberFormat("en-US");

export function MultiModelComparison() {
    const [chartMode, setChartMode] = useState("ctr"); // "ctr" | "regret"
    const [showVivaNotes, setShowVivaNotes] = useState(false);
    const [selectedModel, setSelectedModel] = useState(benchmarkModelsData[0]);

    const barChartData = benchmarkModelsData.map((m) => ({
        algorithm: m.shortType,
        fullName: m.name,
        ctr: Number(m.ctr.toFixed(2)),
        reward: m.totalReward,
        regret: m.regret,
        fill: m.color
    }));

    return (
        <section id="rl-comparison" className="glass-panel rounded-3xl p-6 shadow-glow border border-white/10">
            {/* Header */}
            <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-limeSignal/30 bg-limeSignal/10 px-3.5 py-1 text-xs font-black uppercase text-limeSignal">
                        <Sparkles className="h-3.5 w-3.5" />
                        Reinforcement Learning Multi-Model Suite
                    </div>
                    <h2 className="mt-2.5 text-2xl font-black text-white sm:text-3xl">
                        RL Algorithms vs Traditional A/B Testing
                    </h2>
                    <p className="mt-1 max-w-3xl text-sm leading-6 text-white/60">
                        Comparing <strong className="text-white">Thompson Sampling, UCB1, ε-Greedy, and Softmax</strong> against 
                        traditional static A/B testing on 10,000 real impression records.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setShowVivaNotes((prev) => !prev)}
                        className="inline-flex items-center gap-2 rounded-xl border border-cyanEdge/30 bg-cyanEdge/10 px-3.5 py-2 text-xs font-bold text-cyanEdge transition hover:bg-cyanEdge/20"
                    >
                        <BookOpen className="h-4 w-4" />
                        {showVivaNotes ? "Hide Viva/Theory Notes" : "Show College Viva Notes"}
                        {showVivaNotes ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </button>
                </div>
            </div>

            {/* Viva & Theoretical Proof Box (Collapsible) */}
            {showVivaNotes && (
                <div className="mb-6 rounded-2xl border border-cyanEdge/25 bg-midnight/90 p-5 backdrop-blur-md">
                    <div className="flex items-center gap-2.5 text-cyanEdge">
                        <HelpCircle className="h-5 w-5" />
                        <h4 className="text-base font-black">College Viva & Evaluation Guide: Multi-Armed Bandit (MAB)</h4>
                    </div>
                    <div className="mt-4 grid gap-4 md:grid-cols-3 text-xs leading-5 text-white/75">
                        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3.5">
                            <p className="font-black text-limeSignal">1. Exploration vs Exploitation Dilemma</p>
                            <p className="mt-1">
                                Traditional A/B testing wastes 50%-90% impressions uniformly exploring dead ads. RL algorithms dynamically allocate traffic to winning ads as evidence accumulates.
                            </p>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3.5">
                            <p className="font-black text-cyanEdge">2. Logarithmic Regret (Lai & Robbins)</p>
                            <p className="mt-1">
                                Proven theoretical lower bound: RL cumulative regret is bounded by <span className="font-mono text-cyan-200">O(ln T)</span>, whereas static A/B testing suffers linear regret <span className="font-mono text-rose-300">O(T)</span>.
                            </p>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3.5">
                            <p className="font-black text-amberSignal">3. Why Thompson Sampling Often Wins</p>
                            <p className="mt-1">
                                By sampling posterior Beta distributions <span className="font-mono text-amber-200">Beta(α, β)</span>, Thompson Sampling handles variance smoothly without hard confidence bounds.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Top Highlight Cards */}
            <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-limeSignal/30 bg-limeSignal/[0.08] p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-limeSignal">Top RL Performer</span>
                        <Award className="h-5 w-5 text-limeSignal" />
                    </div>
                    <p className="mt-2 text-2xl font-black text-white">Thompson Sampling</p>
                    <p className="mt-1 text-sm font-bold text-limeSignal">26.17% CTR (+109% lift)</p>
                    <p className="mt-2 text-xs text-white/50">Lowest regret (only 78 missed clicks)</p>
                </div>

                <div className="rounded-2xl border border-cyanEdge/30 bg-cyanEdge/[0.08] p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-cyanEdge">Core Deterministic RL</span>
                        <Zap className="h-5 w-5 text-cyanEdge" />
                    </div>
                    <p className="mt-2 text-2xl font-black text-white">UCB1 Algorithm</p>
                    <p className="mt-1 text-sm font-bold text-cyanEdge">21.78% CTR (+74% lift)</p>
                    <p className="mt-2 text-xs text-white/50">Locks winner Ad 5 with high certainty</p>
                </div>

                <div className="rounded-2xl border border-violetEdge/30 bg-violetEdge/[0.08] p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-violetEdge">Classic RL Baseline</span>
                        <Flame className="h-5 w-5 text-violetEdge" />
                    </div>
                    <p className="mt-2 text-2xl font-black text-white">ε-Greedy & Softmax</p>
                    <p className="mt-1 text-sm font-bold text-violetEdge">20.37% & 16.66% CTR</p>
                    <p className="mt-2 text-xs text-white/50">Both beat traditional testing easily</p>
                </div>

                <div className="rounded-2xl border border-rose-500/30 bg-rose-500/[0.08] p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-rose-400">Traditional Method</span>
                        <ShieldAlert className="h-5 w-5 text-rose-400" />
                    </div>
                    <p className="mt-2 text-2xl font-black text-white">Static A/B Testing</p>
                    <p className="mt-1 text-sm font-bold text-rose-400">12.51% CTR (Baseline)</p>
                    <p className="mt-2 text-xs text-white/50">Lost 1,444 potential customer clicks</p>
                </div>
            </div>

            {/* Interactive Charts Section */}
            <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                        <h3 className="text-lg font-black text-white">
                            {chartMode === "ctr" ? "Click-Through Rate (CTR %) by Model" : "Cumulative Regret Progression (Loss over Rounds)"}
                        </h3>
                        <p className="text-xs text-white/50">
                            {chartMode === "ctr" 
                                ? "Higher is better. Notice all 4 Reinforcement Learning methods far outperform Traditional A/B." 
                                : "Lower is better. Reinforcement Learning flattens regret; Traditional A/B testing continues wasting money linearly."}
                        </p>
                    </div>

                    {/* Chart Mode Toggle */}
                    <div className="flex rounded-xl border border-white/15 bg-white/5 p-1">
                        <button
                            type="button"
                            onClick={() => setChartMode("ctr")}
                            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                                chartMode === "ctr" ? "bg-cyanEdge text-midnight shadow" : "text-white/60 hover:text-white"
                            }`}
                        >
                            CTR Comparison
                        </button>
                        <button
                            type="button"
                            onClick={() => setChartMode("regret")}
                            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                                chartMode === "regret" ? "bg-limeSignal text-midnight shadow" : "text-white/60 hover:text-white"
                            }`}
                        >
                            Regret Progression
                        </button>
                    </div>
                </div>

                <div className="h-72 w-full">
                    {chartMode === "ctr" ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                                <XAxis dataKey="fullName" stroke="rgba(255,255,255,0.5)" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                                <YAxis unit="%" stroke="rgba(255,255,255,0.5)" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                                <Tooltip
                                    formatter={(value, name) => [`${value}% CTR`, "Performance"]}
                                    contentStyle={{ background: "#0b1020", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12 }}
                                />
                                <Bar dataKey="ctr" radius={[8, 8, 0, 0]} fill="#25d6ff" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={benchmarkProgressionData} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
                                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                                <XAxis dataKey="round" stroke="rgba(255,255,255,0.5)" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} unit=" rnd" />
                                <YAxis stroke="rgba(255,255,255,0.5)" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                                <Tooltip
                                    contentStyle={{ background: "#0b1020", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12 }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="RegretThompson" name="Thompson Sampling (Regret)" stroke="#10b981" strokeWidth={2.5} dot={false} />
                                <Line type="monotone" dataKey="RegretUCB" name="UCB1 (Regret)" stroke="#25d6ff" strokeWidth={2.5} dot={false} />
                                <Line type="monotone" dataKey="RegretAB" name="Traditional A/B (Linear Regret)" stroke="#f43f5e" strokeWidth={2.5} strokeDasharray="4 4" dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Comprehensive Table */}
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]">
                <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/[0.04] text-xs font-black uppercase tracking-wider text-white/50">
                            <th className="px-4 py-3.5">Algorithm</th>
                            <th className="px-4 py-3.5">Category</th>
                            <th className="px-4 py-3.5">CTR</th>
                            <th className="px-4 py-3.5">Total Clicks</th>
                            <th className="px-4 py-3.5">Cumulative Regret</th>
                            <th className="px-4 py-3.5">Best Ad Pick</th>
                            <th className="px-4 py-3.5">Lift vs A/B Test</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {benchmarkModelsData.map((model) => (
                            <tr 
                                key={model.id}
                                onClick={() => setSelectedModel(model)}
                                className={`cursor-pointer transition hover:bg-white/[0.06] ${
                                    selectedModel.id === model.id ? "bg-white/[0.08]" : ""
                                }`}
                            >
                                <td className="px-4 py-3.5 font-black text-white">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: model.color }} />
                                        <span>{model.name}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3.5 text-xs text-white/60">
                                    <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5">
                                        {model.shortType}
                                    </span>
                                </td>
                                <td className="px-4 py-3.5 font-mono font-black" style={{ color: model.color }}>
                                    {model.ctr.toFixed(2)}%
                                </td>
                                <td className="px-4 py-3.5 font-mono text-white/90">
                                    {numberFormatter.format(model.totalReward)}
                                </td>
                                <td className="px-4 py-3.5 font-mono text-rose-300">
                                    {numberFormatter.format(model.regret)}
                                </td>
                                <td className="px-4 py-3.5 font-bold text-cyan-200">
                                    {model.bestAd}
                                </td>
                                <td className="px-4 py-3.5 text-xs font-bold text-limeSignal">
                                    {model.vsAbLift}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Selected Model Explanation Drawer */}
            <div className="mt-4 rounded-2xl border border-white/10 bg-midnight/60 p-4">
                <div className="flex items-center gap-2 text-sm font-black text-white">
                    <TrendingUp className="h-4 w-4 text-limeSignal" />
                    <span>How {selectedModel.name} works:</span>
                </div>
                <p className="mt-1.5 text-xs leading-5 text-white/70">
                    {selectedModel.intuition}
                </p>
                <div className="mt-2 font-mono text-xs text-cyanEdge/90">
                    Formula: <span className="rounded bg-black/40 px-2 py-0.5">{selectedModel.formula}</span>
                </div>
            </div>
        </section>
    );
}
