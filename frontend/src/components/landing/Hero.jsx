"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Gauge, Megaphone, Play, ShieldCheck, Sparkles, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { GsapMotion } from "@/components/shared/GsapMotion";
import { getSession } from "@/lib/local-history";
const targetChannels = ["Facebook", "Instagram", "Reddit", "Food", "Travel", "Tech", "SEO", "Business"];
const protectedLinks = [
    { href: "/results", label: "Results" },
    { href: "/optimization", label: "Optimization" },
    { href: "/promotor-guide", label: "Promoter Guide" },
    { href: "/ad-creation", label: "Ad Creation" },
    { href: "/admin", label: "Admin", adminOnly: true }
];
export function Hero() {
    const [session, setSessionState] = useState(null);
    useEffect(() => {
        setSessionState(getSession());
    }, []);
    const visibleLinks = session ? protectedLinks.filter((link) => !link.adminOnly || session.role === "admin") : [];
    const protectedHref = (path) => session ? path : `/login?next=${encodeURIComponent(path)}`;
    return (<section className="relative overflow-hidden pb-20 pt-8 lg:pb-24">
      <GsapMotion />
      <nav className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/growkaro-logo.svg" alt="GrowKaro" width={208} height={56} priority className="h-12 max-w-[178px] object-contain sm:h-14 sm:max-w-none"/>
        </Link>
        {visibleLinks.length > 0 && (<div className="hidden items-center gap-7 text-sm font-semibold text-white/65 md:flex">
            {visibleLinks.map((link) => (<Link key={link.href} href={link.href}>{link.label}</Link>))}
          </div>)}
        {session ? (<Link href="/results" className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white shadow-glow backdrop-blur transition hover:border-cyanEdge/60">
            Workspace
          </Link>) : (<div className="flex items-center gap-2">
            <Link href="/login" className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white shadow-glow backdrop-blur transition hover:border-cyanEdge/60">
              Login
            </Link>
            <Link href="/signup" className="rounded-full bg-limeSignal px-4 py-2 text-sm font-black text-midnight transition hover:bg-white">
              Sign up
            </Link>
          </div>)}
      </nav>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 px-5 pt-12 lg:grid-cols-[1fr_0.95fr]">
        <motion.div data-gsap="fade-up" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm font-bold text-cyan-100">
            <ShieldCheck className="h-4 w-4 text-limeSignal"/>
            Motto: Quality product, smarter reach
          </div>
          <h1 className="max-w-4xl text-balance text-5xl font-black leading-[0.94] tracking-tight text-white md:text-7xl">
            Growkaro helps local businesses choose better ads.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/66">
            Upload ad results, let the UCB engine learn which message performs best, and get plain-language suggestions that owners, teams, and non-technical users can understand.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={protectedHref("/results")} className="inline-flex items-center justify-center gap-2 rounded-full bg-cyanEdge px-6 py-3 font-black text-midnight shadow-glow transition hover:bg-white">
              Start growth check
              <ArrowRight className="h-5 w-5"/>
            </Link>
            <Link href={protectedHref("/optimization")} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-6 py-3 font-black text-white backdrop-blur transition hover:border-violetEdge/60">
              <Play className="h-5 w-5"/>
              Watch ad learning
            </Link>
          </div>
          <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
            {[
            ["Local-ready", "Built for nearby customers"],
            ["Owner-friendly", "Results in simple words"],
            ["Quality-first", "Promote the strongest offer"]
        ].map(([title, body]) => (<div key={title} className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                <p className="text-sm font-black text-white">{title}</p>
                <p className="mt-1 text-xs leading-5 text-white/50">{body}</p>
              </div>))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15, duration: 0.7 }} data-gsap="scale-in" className="glass-panel relative overflow-hidden rounded-[2rem] p-5">
          <div className="neon-line absolute inset-x-0 top-0 h-1"/>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold uppercase text-white/40">Growth command view</p>
                <p className="text-2xl font-black">Target ads and performance</p>
              </div>
              <div className="rounded-full bg-limeSignal/12 px-3 py-1 text-sm font-black text-limeSignal">ready</div>
            </div>
            <div className="grid gap-3 sm:grid-cols-[180px_1fr]">
              <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5">
                <div className="grid aspect-square place-items-center rounded-full p-3" style={{ background: "conic-gradient(#74f7b6 0deg 292deg, rgba(255,255,255,.12) 292deg 360deg)" }}>
                  <div className="grid h-full w-full place-items-center rounded-full bg-midnight/95 text-center">
                    <div>
                      <Gauge className="mx-auto h-7 w-7 text-limeSignal"/>
                      <p className="mt-2 text-4xl font-black">812</p>
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-center text-xs font-black uppercase text-limeSignal">GrowScore</p>
              </div>
              <div className="grid content-start gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-center gap-2 text-sm font-black text-cyanEdge">
                  <Megaphone className="h-4 w-4"/>
                  Target ad channels
                </div>
                <div className="flex flex-wrap gap-2">
                  {targetChannels.map((channel) => (<span key={channel} className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-bold text-white/70">
                      {channel}
                    </span>))}
                </div>
                <div className="mt-2 rounded-2xl border border-limeSignal/25 bg-limeSignal/10 p-3">
                  <div className="flex items-center gap-2 text-sm font-black text-limeSignal">
                    <Sparkles className="h-4 w-4"/>
                    Suggestion
                  </div>
                  <p className="mt-1 text-sm leading-6 text-white/68">Push more budget to the best ad and test one local-language variant next.</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
            ["CTR", "19.2%"],
            ["Best ad", "Ad 5"],
            ["Local fit", "High"]
        ].map(([label, value]) => (<div key={label} className="rounded-2xl border border-white/10 bg-white/8 p-4">
                  <p className="text-xs font-bold uppercase text-white/45">{label}</p>
                  <p className="mt-2 text-2xl font-black">{value}</p>
                </div>))}
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-amberSignal/25 bg-amberSignal/10 p-4">
              <Store className="h-5 w-5 shrink-0 text-amberSignal"/>
              <p className="text-sm leading-6 text-white/68">Result written for owners: this ad is getting more quality clicks, so Growkaro recommends scaling it carefully.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>);
}
