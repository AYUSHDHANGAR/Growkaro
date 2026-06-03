"use client";

import { motion } from "framer-motion";
import { BarChart3, FileCheck2, Gauge, Handshake, Lightbulb, Megaphone, Store, UsersRound } from "lucide-react";

const features = [
  {
    icon: Megaphone,
    title: "Target ads planner",
    body: "Plan ads for social media, food, travel, tech, SEO, business, information channels, and guide-led campaigns."
  },
  {
    icon: Lightbulb,
    title: "Guide and suggestions",
    body: "Every result includes the next action in simple language, so owners know what to improve without reading ML terms."
  },
  {
    icon: UsersRound,
    title: "Non-technical results",
    body: "CTR, reward, confidence, and regret are translated into clear business meaning for teams and stakeholders."
  },
  {
    icon: Gauge,
    title: "Performance meter",
    body: "A GrowScore-style meter summarizes ad health, like a simple quality score for campaign readiness."
  },
  {
    icon: Store,
    title: "Local business fit",
    body: "The interface is tuned for local people and growing businesses that need practical decisions, not dashboards full of jargon."
  },
  {
    icon: FileCheck2,
    title: "Quality product base",
    body: "CSV/XLSX validation, UCB optimization, model comparison, analytics, simulator, backend APIs, and deployment structure stay intact."
  },
  {
    icon: BarChart3,
    title: "Professional depth",
    body: "Analysts can still inspect CTR, reward, regret, stability, selection frequency, and model comparison when needed."
  },
  {
    icon: Handshake,
    title: "Stakeholder friendly",
    body: "Summaries are written for business owners, marketing teams, and decision makers in the same workspace."
  }
];

export function FeatureShowcase() {
  return (
    <section id="target-ads" className="mx-auto w-full max-w-7xl px-5 py-16">
      <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-black uppercase text-cyanEdge">Quality product modules</p>
          <h2 className="mt-3 max-w-3xl text-4xl font-black tracking-tight md:text-5xl">Built for target ads, guidance, and clear decisions.</h2>
        </div>
        <p className="max-w-xl text-base leading-7 text-white/58">
          Growkaro keeps the reinforcement-learning engine, but presents the result like a practical growth assistant for real businesses.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {features.map((feature, index) => (
          <motion.article
            key={feature.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: index * 0.05 }}
            className="glass-panel rounded-3xl p-6"
          >
            <div className="mb-6 grid h-12 w-12 place-items-center rounded-2xl border border-cyanEdge/25 bg-cyanEdge/10 text-cyanEdge">
              <feature.icon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-black">{feature.title}</h3>
            <p className="mt-3 text-sm leading-6 text-white/58">{feature.body}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
