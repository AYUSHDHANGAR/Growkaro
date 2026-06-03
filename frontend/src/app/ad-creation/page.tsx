"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Copy, ImagePlus, MessageSquareText, MousePointerClick, Sparkles } from "lucide-react";

import { AppShell } from "@/components/shared/AppShell";

const industries = ["Loan and finance", "Food business", "Local service", "Fashion and beauty", "Education", "Travel"];
const channels = ["Facebook", "Instagram", "Google Search", "Google Display", "Food blog/native", "TikTok"];
const objectives = ["Leads", "Sales", "Traffic", "Awareness"];

const channelAdvice: Record<string, string> = {
  Facebook: "Use a direct offer, social proof, and one form field fewer than you think you need.",
  Instagram: "Lead with the image or reel hook. The first three seconds should show the product or result.",
  "Google Search": "Match the keyword in the headline and send users to the most relevant landing page.",
  "Google Display": "Keep copy short, use strong contrast, and retarget people who already visited the site.",
  "Food blog/native": "Make the ad feel like a helpful recommendation with dish, price, and locality visible.",
  TikTok: "Use a creator-style opening, fast proof, and a call to action that feels native to short video."
};

export default function AdCreationPage() {
  const [industry, setIndustry] = useState(industries[0]);
  const [channel, setChannel] = useState(channels[0]);
  const [objective, setObjective] = useState(objectives[0]);

  const plan = useMemo(() => {
    const cleanIndustry = industry.toLowerCase();
    const outcome = objective === "Leads" ? "get enquiries" : objective === "Sales" ? "increase purchases" : objective === "Traffic" ? "bring more visitors" : "build recall";
    const headline = `${industry}: ${objective} campaign for ${channel}`;
    const primaryText =
      cleanIndustry.includes("loan")
        ? "Get a clear loan option with fast support and transparent next steps."
        : cleanIndustry.includes("food")
          ? "Fresh, trusted, and ready near you. See today's offer before it closes."
          : `Choose a trusted ${industry.toLowerCase()} offer built to ${outcome}.`;
    return {
      headline,
      primaryText,
      cta: objective === "Leads" ? "Get enquiry" : objective === "Sales" ? "Shop now" : objective === "Traffic" ? "Visit page" : "Learn more",
      visual: cleanIndustry.includes("food") ? "Use a real dish photo, price, location, and delivery radius." : "Use a clean product or service image with one visible proof point.",
      test: `Create two ${channel} variants: one emotional hook and one proof-led hook. Keep the same audience for a fair CTR comparison.`
    };
  }, [channel, industry, objective]);

  function copyPlan() {
    void navigator.clipboard.writeText(`${plan.headline}\n${plan.primaryText}\nCTA: ${plan.cta}\n${plan.visual}\n${plan.test}`);
  }

  return (
    <AppShell
      eyebrow="Creation and guidance"
      title="Ad creation guide"
      description="Pick a business category, promotion channel, and objective to generate a clean starting ad plan."
    >
      <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 pb-16 lg:grid-cols-[380px_1fr]">
        <aside className="glass-panel rounded-lg p-5">
          <p className="text-sm font-black uppercase text-cyanEdge">Options</p>
          <div className="mt-5 grid gap-4">
            <label className="grid gap-2 text-sm font-bold text-white/70">
              Business type
              <select value={industry} onChange={(event) => setIndustry(event.target.value)} className="rounded-lg border border-white/10 bg-midnight px-3 py-3 text-white outline-none">
                {industries.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-bold text-white/70">
              Promotion channel
              <select value={channel} onChange={(event) => setChannel(event.target.value)} className="rounded-lg border border-white/10 bg-midnight px-3 py-3 text-white outline-none">
                {channels.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-bold text-white/70">
              Campaign objective
              <select value={objective} onChange={(event) => setObjective(event.target.value)} className="rounded-lg border border-white/10 bg-midnight px-3 py-3 text-white outline-none">
                {objectives.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>
        </aside>

        <div className="grid gap-5">
          <section className="glass-panel rounded-lg p-5">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div>
                <p className="text-sm font-black uppercase text-limeSignal">Generated ad plan</p>
                <h2 className="mt-2 text-3xl font-black">{plan.headline}</h2>
              </div>
              <button type="button" onClick={copyPlan} className="inline-flex items-center gap-2 rounded-lg bg-limeSignal px-4 py-3 font-black text-midnight">
                <Copy className="h-4 w-4" />
                Copy
              </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <article className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <MessageSquareText className="h-5 w-5 text-cyanEdge" />
                <p className="mt-3 text-sm font-black uppercase text-white/42">Primary text</p>
                <p className="mt-2 text-lg font-black">{plan.primaryText}</p>
              </article>
              <article className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <MousePointerClick className="h-5 w-5 text-limeSignal" />
                <p className="mt-3 text-sm font-black uppercase text-white/42">CTA</p>
                <p className="mt-2 text-lg font-black">{plan.cta}</p>
              </article>
              <article className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <ImagePlus className="h-5 w-5 text-amberSignal" />
                <p className="mt-3 text-sm font-black uppercase text-white/42">Creative guide</p>
                <p className="mt-2 text-sm leading-6 text-white/62">{plan.visual}</p>
              </article>
              <article className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <Sparkles className="h-5 w-5 text-roseEdge" />
                <p className="mt-3 text-sm font-black uppercase text-white/42">A/B test</p>
                <p className="mt-2 text-sm leading-6 text-white/62">{plan.test}</p>
              </article>
            </div>
          </section>

          <section className="glass-panel rounded-lg p-5">
            <p className="text-sm font-black uppercase text-amberSignal">Channel guidance</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {Object.entries(channelAdvice).map(([name, advice]) => (
                <div key={name} className="flex gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-limeSignal" />
                  <div>
                    <p className="font-black">{name}</p>
                    <p className="mt-1 text-sm leading-6 text-white/60">{advice}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </AppShell>
  );
}
