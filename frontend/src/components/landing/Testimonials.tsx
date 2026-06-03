const testimonials = [
  {
    quote: "Growkaro made the ad result easy enough for our store team to understand in one meeting.",
    name: "Maya Chen",
    role: "Local retail owner"
  },
  {
    quote: "The score meter helped us explain campaign quality before showing the detailed charts.",
    name: "Arjun Mehta",
    role: "Performance marketing lead"
  },
  {
    quote: "We finally had one view for non-technical owners and professional analysts.",
    name: "Elena Rossi",
    role: "Agency analytics manager"
  }
];

export function Testimonials() {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-16">
      <div className="grid gap-4 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <article key={testimonial.name} className="glass-panel rounded-3xl p-6">
            <p className="text-lg leading-8 text-white/78">&ldquo;{testimonial.quote}&rdquo;</p>
            <div className="mt-6">
              <p className="font-black">{testimonial.name}</p>
              <p className="text-sm text-white/46">{testimonial.role}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
