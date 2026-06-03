"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { BarChart3, FileText, LayoutDashboard, LogIn, LogOut, Megaphone, Shield, Wand2 } from "lucide-react";

import { clearSession, getSession } from "@/lib/local-history";
import type { UserSession } from "@/types";
import { GsapMotion } from "./GsapMotion";

const navigation = [
  { href: "/results", label: "Results", icon: FileText },
  { href: "/optimization", label: "Optimization", icon: BarChart3 },
  { href: "/promotor-guide", label: "Promoter Guide", icon: Megaphone },
  { href: "/ad-creation", label: "Ad Creation", icon: Wand2 },
  { href: "/admin", label: "Admin", icon: Shield }
] as const;

type AppShellProps = {
  children: ReactNode;
  eyebrow?: string;
  title?: string;
  description?: string;
};

export function AppShell({ children, eyebrow, title, description }: AppShellProps) {
  const [session, setSessionState] = useState<UserSession | null>(null);

  useEffect(() => {
    setSessionState(getSession());
  }, []);

  function handleLogout() {
    clearSession();
    setSessionState(null);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-midnight">
      <GsapMotion />
      <div className="noise" />
      <div className="fixed inset-0 -z-10 bg-grid bg-[length:70px_70px] opacity-[0.06]" />
      <header className="sticky top-0 z-40 border-b border-white/10 bg-midnight/86 backdrop-blur-xl">
        <nav className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/growkaro-logo.svg" alt="GrowKaro" width={208} height={56} priority className="h-12 max-w-[178px] object-contain sm:h-14 sm:max-w-none" />
            </Link>
            <Link
              href="/optimization"
              className="grid h-10 w-10 place-items-center rounded-lg border border-cyanEdge/30 bg-cyanEdge/10 text-cyanEdge lg:hidden"
              aria-label="Open optimization"
            >
              <LayoutDashboard className="h-5 w-5" />
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-bold text-white/70 transition hover:border-limeSignal/50 hover:bg-limeSignal/10 hover:text-white"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
            {session ? (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-lg border border-roseEdge/30 bg-roseEdge/10 px-3 py-2 text-sm font-bold text-rose-100"
              >
                <LogOut className="h-4 w-4" />
                {session.role === "admin" ? "Admin" : session.name}
              </button>
            ) : (
              <Link href="/login" className="inline-flex items-center gap-2 rounded-lg bg-limeSignal px-3 py-2 text-sm font-black text-midnight">
                <LogIn className="h-4 w-4" />
                Login
              </Link>
            )}
          </div>
        </nav>
      </header>

      {(title || description || eyebrow) && (
        <section data-gsap="fade-up" className="mx-auto w-full max-w-7xl px-5 pb-6 pt-10">
          {eyebrow && <p className="text-sm font-black uppercase text-cyanEdge">{eyebrow}</p>}
          {title && <h1 className="mt-3 max-w-4xl text-4xl font-black tracking-tight text-white md:text-6xl">{title}</h1>}
          {description && <p className="mt-4 max-w-3xl text-base leading-7 text-white/62">{description}</p>}
        </section>
      )}

      {children}
    </main>
  );
}
