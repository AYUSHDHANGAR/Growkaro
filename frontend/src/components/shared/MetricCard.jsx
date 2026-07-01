import clsx from "clsx";
const toneClasses = {
    cyan: "from-cyanEdge/25 to-cyanEdge/5 text-cyanEdge",
    violet: "from-violetEdge/25 to-violetEdge/5 text-violetEdge",
    lime: "from-limeSignal/25 to-limeSignal/5 text-limeSignal",
    rose: "from-roseEdge/25 to-roseEdge/5 text-roseEdge"
};
export function MetricCard({ label, value, helper, icon: Icon, tone = "cyan" }) {
    return (<article className="glass-panel rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-white/55">{label}</p>
          <strong className="mt-3 block text-3xl font-black tracking-tight text-white">{value}</strong>
        </div>
        <div className={clsx("rounded-2xl bg-gradient-to-br p-3", toneClasses[tone])}>
          <Icon className="h-5 w-5"/>
        </div>
      </div>
      <p className="mt-5 text-sm leading-6 text-white/56">{helper}</p>
    </article>);
}
