import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { FeatureShowcase } from "@/components/landing/FeatureShowcase";
import { GrowthGuide } from "@/components/landing/GrowthGuide";
import { Hero } from "@/components/landing/Hero";
import { ServiceOperations } from "@/components/landing/ServiceOperations";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-midnight">
      <div className="noise" />
      <div className="fixed inset-0 -z-10 bg-grid bg-[length:70px_70px] opacity-[0.08]" />
      <Hero />
      <ServiceOperations />
      <FeatureShowcase />
      <GrowthGuide />
      <DashboardShell />
      <footer className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-4 px-5 py-10 text-sm text-white/45 md:flex-row">
        <p>Growkaro - quality product growth through smarter target ads.</p>
        <p>UCB reinforcement learning, FastAPI backend, Next.js frontend.</p>
      </footer>
    </main>
  );
}
