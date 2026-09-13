"use client";
import { useEffect, useMemo, useState } from "react";
import { Award, Pause, Play, RotateCcw, Zap } from "lucide-react";
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const numberFormatter = new Intl.NumberFormat("en-US");

export function Simulator() {
    const [running, setRunning] = useState(true);
    const [speed, setSpeed] = useState(3);
    const [round, setRound] = useState(120);

    useEffect(() => {
        if (!running)
            return;
        const timer = window.setInterval(() => {
            setRound((value) => Math.min(2400, value + speed * 20));
        }, 500);
        return () => window.clearInterval(timer);
    }, [running, speed]);

    const series = useMemo(() => Array.from({ length: 16 }).map((_, index) => {
        const currentRound = Math.max(20, Math.round((round / 16) * (index + 1)));
        return {
            round: currentRound,
            thompson: Math.min(0.262, 0.09 + Math.log(currentRound) / 40),
            ucb: Math.min(0.218, 0.08 + Math.log(currentRound) / 52),
            epsilon: Math.min(0.204, 0.075 + Math.log(currentRound) / 58),
            traditionalAB: 0.125 + Math.sin(index) * 0.005
        };
    }), [round]);

    const thompsonCtr = Math.min(26.2, 9.0 + (Math.log(round) / 40) * 100);
    const ucbCtr = Math.min(21.8, 8.0 + (Math.log(round) / 52) * 100);
    const abCtr = 12.5;

    return (
        <section id="simulator" className="glass-panel rounded-3xl p-6">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-limeSignal/30 bg-limeSignal/10 px-3 py-0.5 text-xs font-black uppercase text-limeSignal">
                        <Zap className="h-3.5 w-3.5" />
                        Multi-Algorithm Live Learning Run
                    </div>
                    <h3 className="mt-2 text-2xl font-black text-white">
                        Real-Time RL Convergence vs Traditional A/B Testing
                    </h3>
                    <p className="text-xs text-white/50">
                        Watch how Bayesian Thompson Sampling and UCB discover the winner ad and accelerate CTR while Traditional A/B stays flat.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <button 
                        type="button" 
                        onClick={() => setRunning((value) => !value)} 
                        className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-2 font-black text-white hover:bg-white/15 transition"
                    >
                        {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        {running ? "Pause" : "Start"}
                    </button>
                    <button 
                        type="button" 
                        onClick={() => setRound(120)} 
                        className="rounded-2xl border border-white/15 bg-white/10 p-2 text-white hover:bg-white/15 transition" 
                        aria-label="Reset simulator"
                    >
                        <RotateCcw className="h-5 w-5" />
                    </button>
                    <label className="flex items-center gap-3 text-sm font-bold text-white/58">
                        Speed
                        <input 
                            type="range" 
                            min="1" 
                            max="8" 
                            value={speed} 
                            onChange={(event) => setSpeed(Number(event.target.value))} 
                            className="accent-cyanEdge" 
                        />
                    </label>
                </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
                <div className="h-80 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={series}>
                            <XAxis dataKey="round" stroke="rgba(255,255,255,.45)" tickLine={false} axisLine={false} unit=" r" />
                            <YAxis 
                                stroke="rgba(255,255,255,.45)" 
                                tickLine={false} 
                                axisLine={false} 
                                tickFormatter={(val) => `${(val * 100).toFixed(0)}%`} 
                            />
                            <Tooltip 
                                formatter={(value, name) => [`${(Number(value) * 100).toFixed(1)}% CTR`, name]}
                                contentStyle={{ background: "#0b1020", border: "1px solid rgba(255,255,255,.14)", borderRadius: 16 }} 
                            />
                            <Legend />
                            <Line type="monotone" dataKey="thompson" name="Thompson Sampling" stroke="#10b981" strokeWidth={3} dot={false} />
                            <Line type="monotone" dataKey="ucb" name="UCB1" stroke="#25d6ff" strokeWidth={2.5} dot={false} />
                            <Line type="monotone" dataKey="epsilon" name="ε-Greedy" stroke="#a78bfa" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="traditionalAB" name="Traditional A/B" stroke="#f43f5e" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="grid gap-3">
                    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                        <p className="text-xs font-black uppercase text-white/45">Simulated Impression Round</p>
                        <p className="mt-1 text-3xl font-black text-white">{numberFormatter.format(round)}</p>
                        <p className="mt-1 text-xs text-white/50">Tracking real-time bandit updates</p>
                    </div>

                    <div className="rounded-3xl border border-limeSignal/30 bg-limeSignal/[0.06] p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-black uppercase text-limeSignal">Thompson CTR</span>
                            <Award className="h-4 w-4 text-limeSignal" />
                        </div>
                        <p className="mt-1 text-2xl font-black text-limeSignal">{thompsonCtr.toFixed(1)}%</p>
                        <p className="text-xs text-limeSignal/70">+{(thompsonCtr - abCtr).toFixed(1)}% lift over A/B</p>
                    </div>

                    <div className="rounded-3xl border border-cyanEdge/30 bg-cyanEdge/[0.06] p-4">
                        <span className="text-xs font-black uppercase text-cyanEdge">UCB1 CTR</span>
                        <p className="mt-1 text-2xl font-black text-cyanEdge">{ucbCtr.toFixed(1)}%</p>
                        <p className="text-xs text-cyanEdge/70">+{(ucbCtr - abCtr).toFixed(1)}% lift over A/B</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
