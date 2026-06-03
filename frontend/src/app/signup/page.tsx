"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, Mail, UserRound } from "lucide-react";

import { AppShell } from "@/components/shared/AppShell";
import { signupUser } from "@/lib/api";
import { saveLocalUser, setSession } from "@/lib/local-history";
import type { UserSession } from "@/types";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("Creating account...");

    const apiSession = await signupUser({ name, email, password });
    const session: UserSession =
      apiSession ??
      ({
        email: email.toLowerCase(),
        name,
        role: "user",
        createdAt: new Date().toISOString()
      } satisfies UserSession);

    saveLocalUser({ email: session.email, name, role: session.role, password, createdAt: new Date().toISOString() });
    setSession(session);
    router.push("/results");
  }

  return (
    <AppShell eyebrow="New client" title="Create a GrowKaro account" description="Save each user's ad result separately, then return later to compare history and export reports.">
      <section className="mx-auto w-full max-w-3xl px-5 pb-16">
        <form onSubmit={handleSubmit} className="glass-panel rounded-lg p-6">
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm font-bold text-white/70">
              Name
              <span className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-3">
                <UserRound className="h-4 w-4 text-cyanEdge" />
                <input value={name} onChange={(event) => setName(event.target.value)} required minLength={2} className="w-full bg-transparent text-white outline-none" />
              </span>
            </label>
            <label className="grid gap-2 text-sm font-bold text-white/70">
              Email
              <span className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-3">
                <Mail className="h-4 w-4 text-limeSignal" />
                <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required className="w-full bg-transparent text-white outline-none" />
              </span>
            </label>
            <label className="grid gap-2 text-sm font-bold text-white/70">
              Password
              <span className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-3">
                <LockKeyhole className="h-4 w-4 text-amberSignal" />
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                  minLength={8}
                  required
                  className="w-full bg-transparent text-white outline-none"
                />
              </span>
            </label>
            <button type="submit" disabled={isLoading} className="rounded-lg bg-cyanEdge px-5 py-3 font-black text-midnight">
              {isLoading ? "Saving..." : "Create account"}
            </button>
            {message && <p className="text-sm text-white/56">{message}</p>}
          </div>
        </form>
      </section>
    </AppShell>
  );
}
