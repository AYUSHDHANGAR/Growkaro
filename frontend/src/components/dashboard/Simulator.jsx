"use client";
import { useEffect, useMemo, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
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
            ucb: Math.min(0.24, 0.08 + Math.log(currentRound) / 50),
            random: 0.1 + Math.sin(index) * 0.008
        };
    }), [round]);
    const confidence = Math.min(96, 34 + round / 32);
    return (<section id="simulator" className="glass-panel rounded-3xl p-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase text-limeSignal">Live simulator</p>
          <h3 className="mt-2 text-2xl font-black">Testing new ads while scaling the winner</h3>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => setRunning((value) => !value)} className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-2 font-black text-white">
            {running ? <Pause className="h-4 w-4"/> : <Play className="h-4 w-4"/>}
            {running ? "Pause" : "Start"}
          </button>
          <button type="button" onClick={() => setRound(120)} className="rounded-2xl border border-white/15 bg-white/10 p-2 text-white" aria-label="Reset simulator">
            <RotateCcw className="h-5 w-5"/>
          </button>
          <label className="flex items-center gap-3 text-sm font-bold text-white/58">
            Speed
            <input type="range" min="1" max="8" value={speed} onChange={(event) => setSpeed(Number(event.target.value))} className="accent-cyanEdge"/>
          </label>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="h-72 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series}>
              <XAxis dataKey="round" stroke="rgba(255,255,255,.45)" tickLine={false} axisLine={false}/>
              <YAxis stroke="rgba(255,255,255,.45)" tickLine={false} axisLine={false}/>
              <Tooltip contentStyle={{ background: "#0b1020", border: "1px solid rgba(255,255,255,.14)", borderRadius: 16 }}/>
              <Line type="monotone" dataKey="ucb" stroke="#25d6ff" strokeWidth={3} dot={false}/>
              <Line type="monotone" dataKey="random" stroke="#ff4ecd" strokeWidth={2} dot={false}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="grid gap-3">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm font-black uppercase text-white/45">Current round</p>
            <p className="mt-2 text-4xl font-black">{numberFormatter.format(round)}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm font-black uppercase text-white/45">UCB confidence</p>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-cyanEdge to-limeSignal" style={{ width: `${confidence}%` }}/>
            </div>
            <p className="mt-3 text-2xl font-black">{confidence.toFixed(0)}%</p>
          </div>
        </div>
      </div>
    </section>);
}
