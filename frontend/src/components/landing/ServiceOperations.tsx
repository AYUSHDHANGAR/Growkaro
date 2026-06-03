import { ClipboardCheck, FileText, History, ShieldCheck, UsersRound, WalletCards } from "lucide-react";

const modules = [
  {
    icon: UsersRound,
    title: "Client accounts",
    body: "Every promoter or client has a separate login, saved history, and private result workspace."
  },
  {
    icon: FileText,
    title: "PDF reporting",
    body: "Export a clean result report with GrowScore, CTR, best ad, and next actions for client delivery."
  },
  {
    icon: History,
    title: "History tracking",
    body: "Review previous analyses across user and admin panels before recommending the next spend change."
  },
  {
    icon: WalletCards,
    title: "Budget guidance",
    body: "Compare cheap and effective ad channels before moving money into a bigger promotion plan."
  },
  {
    icon: ClipboardCheck,
    title: "Creation workflow",
    body: "Turn a business type and campaign objective into an ad brief, CTA, creative guide, and A/B test."
  },
  {
    icon: ShieldCheck,
    title: "Admin control",
    body: "Admin can review users, export analysis history, and manage saved client records from one panel."
  }
];

export function ServiceOperations() {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-16">
      <div data-gsap="fade-up" className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-black uppercase text-limeSignal">Service-ready platform</p>
          <h2 className="mt-3 max-w-3xl text-4xl font-black tracking-tight md:text-5xl">Built for real client delivery.</h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-white/58">
          GrowKaro now covers account access, private results, ad guidance, channel planning, admin review, and report export.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => (
          <article data-gsap="scale-in" key={module.title} className="glass-panel rounded-lg p-5">
            <div className="grid h-11 w-11 place-items-center rounded-lg border border-limeSignal/25 bg-limeSignal/10 text-limeSignal">
              <module.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-xl font-black">{module.title}</h3>
            <p className="mt-3 text-sm leading-6 text-white/58">{module.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
