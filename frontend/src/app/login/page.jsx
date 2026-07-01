"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, LockKeyhole, Mail, ShieldCheck, UserPlus } from "lucide-react";
import { AppShell } from "@/components/shared/AppShell";
import { loginUser } from "@/lib/api";
import { loginLocalUser, saveLocalUser, setSession } from "@/lib/local-history";
export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    function getSafeRedirect(session) {
        const requestedPath = typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("next");
        if (requestedPath?.startsWith("/") && !requestedPath.startsWith("//") && !requestedPath.startsWith("/login")) {
            return requestedPath;
        }
        return session.role === "admin" ? "/admin" : "/results";
    }
    async function handleSubmit(event) {
        event.preventDefault();
        setIsLoading(true);
        setMessage("Checking account...");
        const normalizedEmail = email.trim().toLowerCase();
        const localSession = await loginLocalUser(normalizedEmail, password);
        if (localSession) {
            setSession(localSession);
            router.push(getSafeRedirect(localSession));
            return;
        }
        const apiSession = await loginUser({ email: normalizedEmail, password });
        if (apiSession) {
            await saveLocalUser({
                email: apiSession.email,
                name: apiSession.name,
                role: apiSession.role,
                password: apiSession.role === "admin" ? undefined : password,
                createdAt: apiSession.createdAt
            });
            setSession(apiSession);
            router.push(getSafeRedirect(apiSession));
            return;
        }
        setMessage("We could not verify this account. Please check your email and password.");
        setIsLoading(false);
    }
    return (<AppShell eyebrow="Secure access" title="Login to GrowKaro" description="Use your registered account to open private campaign tools, saved histories, and reports.">
      <section className="mx-auto grid w-full max-w-5xl gap-5 px-5 pb-16 lg:grid-cols-[1fr_0.85fr]">
        <form onSubmit={handleSubmit} className="glass-panel rounded-lg p-6 shadow-glow">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black uppercase text-cyanEdge">Protected sign in</p>
              <h2 className="mt-1 text-2xl font-black">Access your workspace</h2>
            </div>
            <LockKeyhole className="h-7 w-7 text-limeSignal"/>
          </div>
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm font-bold text-white/70">
              Email
              <span className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-3">
                <Mail className="h-4 w-4 text-cyanEdge"/>
                <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required placeholder="you@example.com" className="w-full bg-transparent text-white outline-none placeholder:text-white/28"/>
              </span>
            </label>
            <label className="grid gap-2 text-sm font-bold text-white/70">
              Password
              <span className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-3">
                <LockKeyhole className="h-4 w-4 text-limeSignal"/>
                <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required placeholder="Enter password" className="w-full bg-transparent text-white outline-none placeholder:text-white/28"/>
              </span>
            </label>
            <button type="submit" className="rounded-lg bg-limeSignal px-5 py-3 font-black text-midnight transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Login securely"}
            </button>
            {message && <p className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/64" aria-live="polite">{message}</p>}
            <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-lg border border-cyanEdge/25 bg-cyanEdge/10 px-4 py-3 text-sm font-black text-cyanEdge">
              <UserPlus className="h-4 w-4"/>
              Create user account
            </Link>
          </div>
        </form>

        <aside className="glass-panel rounded-lg p-6">
          <div className="flex items-center gap-3 text-limeSignal">
            <ShieldCheck className="h-6 w-6"/>
            <p className="text-sm font-black uppercase">Responsible access</p>
          </div>
          <h2 className="mt-3 text-2xl font-black">Only signed-in users can use GrowKaro tools.</h2>
          <p className="mt-3 text-sm leading-6 text-white/60">Admin credentials are never displayed on this screen. Use the account details configured in the backend or create a regular user account.</p>
          <div className="mt-5 grid gap-3 text-sm leading-6 text-white/62">
            {["Private analysis history per user.", "Admin area is role-gated.", "No shared passwords are exposed in the UI."].map((item) => (<p key={item} className="flex gap-2">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-limeSignal"/>
                <span>{item}</span>
              </p>))}
          </div>
        </aside>
      </section>
    </AppShell>);
}
