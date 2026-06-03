"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";

import { AppShell } from "@/components/shared/AppShell";
import { loginUser } from "@/lib/api";
import { loginLocalUser, setSession } from "@/lib/local-history";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@growkaro.com");
  const [password, setPassword] = useState("Growkaro@123");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("Checking access...");

    const apiSession = await loginUser({ email, password });
    if (apiSession) {
      setSession(apiSession);
      router.push(apiSession.role === "admin" ? "/admin" : "/results");
      return;
    }

    const localSession = loginLocalUser(email, password);
    if (localSession) {
      router.push(localSession.role === "admin" ? "/admin" : "/results");
      return;
    }

    setMessage("Login failed. Check email and password.");
    setIsLoading(false);
  }

  return (
    <AppShell eyebrow="Secure access" title="Login to GrowKaro" description="Open your saved ad analyses, export reports, and manage client results from one account.">
      <section className="mx-auto grid w-full max-w-5xl gap-5 px-5 pb-16 lg:grid-cols-[1fr_0.85fr]">
        <form onSubmit={handleSubmit} className="glass-panel rounded-lg p-6">
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm font-bold text-white/70">
              Email
              <span className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-3">
                <Mail className="h-4 w-4 text-cyanEdge" />
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  required
                  className="w-full bg-transparent text-white outline-none"
                />
              </span>
            </label>
            <label className="grid gap-2 text-sm font-bold text-white/70">
              Password
              <span className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-3">
                <LockKeyhole className="h-4 w-4 text-limeSignal" />
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                  required
                  className="w-full bg-transparent text-white outline-none"
                />
              </span>
            </label>
            <button type="submit" className="rounded-lg bg-limeSignal px-5 py-3 font-black text-midnight" disabled={isLoading}>
              {isLoading ? "Opening..." : "Login"}
            </button>
            {message && <p className="text-sm text-white/56">{message}</p>}
          </div>
        </form>

        <aside className="glass-panel rounded-lg p-6">
          <div className="flex items-center gap-3 text-limeSignal">
            <ShieldCheck className="h-6 w-6" />
            <p className="text-sm font-black uppercase">Admin access</p>
          </div>
          <h2 className="mt-3 text-2xl font-black">Full app control is available here.</h2>
          <div className="mt-5 grid gap-3 rounded-lg border border-limeSignal/25 bg-limeSignal/10 p-4 text-sm leading-6 text-white/68">
            <p>
              Admin email: <b className="text-white">admin@growkaro.com</b>
            </p>
            <p>
              Admin password: <b className="text-white">Growkaro@123</b>
            </p>
          </div>
          <p className="mt-5 text-sm leading-6 text-white/58">New client users can create their own account and their results will stay in a separate history bucket.</p>
          <Link href="/signup" className="mt-5 inline-flex rounded-lg border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-black text-white">
            Create user account
          </Link>
        </aside>
      </section>
    </AppShell>
  );
}
