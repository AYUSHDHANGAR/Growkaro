import { Check } from "lucide-react";

const tiers = [
  {
    name: "Local",
    price: "$49",
    body: "For a local owner checking which ad deserves more budget.",
    features: ["5 datasets", "GrowScore meter", "Simple suggestions", "CSV exports"]
  },
  {
    name: "Growth",
    price: "$249",
    body: "For teams running continuous target-ad planning.",
    features: ["Unlimited experiments", "Target ad planner", "Model comparison", "PDF reports"],
    featured: true
  },
  {
    name: "Professional",
    price: "Custom",
    body: "For agencies and advanced marketing operations.",
    features: ["SSO and RBAC", "Private deployment", "Audit logs", "Custom models"]
  }
];

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto w-full max-w-7xl px-5 py-16">
      <div className="mb-10 text-center">
        <p className="text-sm font-black uppercase text-limeSignal">Plans</p>
        <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">Start local, grow professionally.</h2>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {tiers.map((tier) => (
          <article
            key={tier.name}
            className={`glass-panel rounded-3xl p-7 ${tier.featured ? "border-cyanEdge/55 shadow-glow" : ""}`}
          >
            <p className="text-lg font-black">{tier.name}</p>
            <p className="mt-4 text-4xl font-black">{tier.price}</p>
            <p className="mt-3 min-h-12 text-sm leading-6 text-white/58">{tier.body}</p>
            <div className="my-6 h-px bg-white/10" />
            <div className="grid gap-3">
              {tier.features.map((feature) => (
                <div key={feature} className="flex items-center gap-3 text-sm font-semibold text-white/72">
                  <Check className="h-4 w-4 text-limeSignal" />
                  {feature}
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
