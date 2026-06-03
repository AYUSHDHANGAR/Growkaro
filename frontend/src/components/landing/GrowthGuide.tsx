"use client";

import { motion } from "framer-motion";
import { BadgeCheck, BookOpenCheck, MapPin, Megaphone, Sparkles, Store, Target } from "lucide-react";

const targetGroups = [
  {
    icon: Megaphone,
    title: "Social media ads",
    detail: "Facebook, Instagram, Reddit, and short-form campaign channels."
  },
  {
    icon: Store,
    title: "Business categories",
    detail: "Food, travel, tour, tech, SEO services, and local business offers."
  },
  {
    icon: BookOpenCheck,
    title: "Information channels",
    detail: "Helpful guides, product explainers, and trust-building education."
  },
  {
    icon: MapPin,
    title: "Local people reach",
    detail: "Campaign language and messaging tuned for nearby customers."
  }
];

const recommendations = [
  "Show the quality proof first: product benefit, customer trust, or result.",
  "Use the highest-score ad for the main budget and keep one fresh variant in testing.",
  "Write the result in owner language: what is working, why it matters, and what to do next.",
  "Keep the professional metrics available for analysts: CTR, reward, regret, and confidence."
];

export function GrowthGuide() {
  return (
    <section id="guide" className="mx-auto w-full max-w-7xl px-5 py-16">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <p className="text-sm font-black uppercase text-amberSignal">Guide and suggestions</p>
          <h2 className="mt-3 max-w-3xl text-4xl font-black tracking-tight md:text-5xl">One workspace for owners and professionals.</h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-white/58">
            Growkaro turns optimization output into a business-ready recommendation, then keeps the deeper numbers ready for the people who want to inspect the model.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {targetGroups.map((group, index) => (
            <motion.article
              key={group.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.06 }}
              className="glass-panel rounded-3xl p-6"
            >
              <div className="mb-5 grid h-11 w-11 place-items-center rounded-2xl border border-limeSignal/25 bg-limeSignal/10 text-limeSignal">
                <group.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-black">{group.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/58">{group.detail}</p>
            </motion.article>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="glass-panel rounded-3xl p-6">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl border border-cyanEdge/25 bg-cyanEdge/10 text-cyanEdge">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-black uppercase text-cyanEdge">Target ad mix</p>
              <h3 className="text-2xl font-black">From product quality to the right audience</h3>
            </div>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-4">
            {["Quality proof", "Local reach", "Best ad", "Next test"].map((step, index) => (
              <div key={step} className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                <p className="text-xs font-black uppercase text-white/38">Step {index + 1}</p>
                <p className="mt-2 font-black">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="glass-panel rounded-3xl p-6">
          <div className="flex items-center gap-2 text-sm font-black uppercase text-limeSignal">
            <Sparkles className="h-4 w-4" />
            Smart suggestions
          </div>
          <div className="mt-5 grid gap-3">
            {recommendations.map((item) => (
              <div key={item} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-white/64">
                <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-limeSignal" />
                <p>{item}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
