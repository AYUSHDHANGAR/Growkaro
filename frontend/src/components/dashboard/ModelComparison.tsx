"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { comparisonMetrics } from "@/lib/demo-data";

const numberFormatter = new Intl.NumberFormat("en-US");

export function ModelComparison() {
  return (
    <section id="models" className="glass-panel rounded-3xl p-6">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-black uppercase text-cyanEdge">Professional model view</p>
          <h3 className="mt-2 text-2xl font-black">UCB vs other learning methods</h3>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs font-bold text-white/55 sm:grid-cols-4">
          <span>CTR</span>
          <span>Convergence</span>
          <span>Regret</span>
          <span>Stability</span>
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonMetrics}>
              <CartesianGrid stroke="rgba(255,255,255,.09)" vertical={false} />
              <XAxis dataKey="algorithm" stroke="rgba(255,255,255,.45)" tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,.45)" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "#0b1020", border: "1px solid rgba(255,255,255,.14)", borderRadius: 16 }} />
              <Bar dataKey="ctr" fill="#25d6ff" radius={[10, 10, 0, 0]} />
              <Bar dataKey="stability" fill="#74f7b6" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid gap-3">
          {comparisonMetrics.map((model) => (
            <div key={model.algorithm} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-center justify-between">
                <p className="font-black">{model.algorithm}</p>
                <p className="text-sm font-black text-cyanEdge">{model.ctr.toFixed(1)}% CTR</p>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-cyanEdge to-limeSignal" style={{ width: `${model.stability}%` }} />
              </div>
              <p className="mt-2 text-xs text-white/45">Reward {numberFormatter.format(model.reward)} - missed-click cost {model.regret}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
