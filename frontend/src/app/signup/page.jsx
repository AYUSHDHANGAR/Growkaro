"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, LockKeyhole, Mail, ShieldCheck, UserPlus, UserRound } from "lucide-react";
import { AppShell } from "@/components/shared/AppShell";
import { signupUser } from "@/lib/api";
import { getUsers, loginLocalUser, saveLocalUser, setSession } from "@/lib/local-history";
export default function SignupPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    function getSafeRedirect(session) {
        const requestedPath = typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("next");
        if (requestedPath?.startsWith("/") && !requestedPath.startsWith("//") && !requestedPath.startsWith("/login") && !requestedPath.startsWith("/signup")) {
            return requestedPath;
        }
        return session.role === "admin" ? "/admin" : "/results";
    }
    async function handleSubmit(event) {
        event.preventDefault();
        setIsLoading(true);
        setMessage("Creating account...");
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedName = name.trim();
        const existingLocalUser = getUsers().find((user) => user.email.toLowerCase() === normalizedEmail);
        if (existingLocalUser) {
            const existingSession = await loginLocalUser(normalizedEmail, password);
            if (existingSession) {
                setSession(existingSession);
                router.push(getSafeRedirect(existingSession));
                return;
            }
            setMessage("This email already has an account. Please login with the saved password.");
            setIsLoading(false);
            return;
        }
        const apiResult = await signupUser({ name: normalizedName, email: normalizedEmail, password });
        if (apiResult.ok) {
            await saveLocalUser({
                email: apiResult.session.email,
                name: normalizedName || apiResult.session.name,
                role: apiResult.session.role,
                password: apiResult.session.role === "admin" ? undefined : password,
                createdAt: apiResult.session.createdAt
            });
            setSession(apiResult.session);
            router.push(getSafeRedirect(apiResult.session));
            return;
        }
        if (apiResult.reason === "exists") {
            setMessage("This email is already registered. Please use the login page.");
            setIsLoading(false);
            return;
        }
        if (apiResult.reason === "server") {
            setMessage("The server could not create this account right now. Please try again.");
            setIsLoading(false);
            return;
        }
        const session = {
            email: normalizedEmail,
            name: normalizedName,
            role: "user",
            createdAt: new Date().toISOString()
        };
        await saveLocalUser({ ...session, password });
        setSession(session);
        router.push(getSafeRedirect(session));
    }
    return (<AppShell eyebrow="New client" title="Create a GrowKaro account" description="Save each user's ad result separately, then return later to compare history and export reports.">
      <section className="mx-auto grid w-full max-w-5xl gap-5 px-5 pb-16 lg:grid-cols-[1fr_0.85fr]">
        <form onSubmit={handleSubmit} className="glass-panel rounded-lg p-6 shadow-glow">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black uppercase text-cyanEdge">Private signup</p>
              <h2 className="mt-1 text-2xl font-black">Start a user workspace</h2>
            </div>
            <UserPlus className="h-7 w-7 text-limeSignal"/>
          </div>
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm font-bold text-white/70">
              Name
              <span className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-3">
                <UserRound className="h-4 w-4 text-cyanEdge"/>
                <input value={name} onChange={(event) => setName(event.target.value)} required minLength={2} className="w-full bg-transparent text-white outline-none"/>
              </span>
            </label>
            <label className="grid gap-2 text-sm font-bold text-white/70">
              Email
              <span className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-3">
                <Mail className="h-4 w-4 text-limeSignal"/>
                <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required placeholder="you@example.com" className="w-full bg-transparent text-white outline-none placeholder:text-white/28"/>
              </span>
            </label>
            <label className="grid gap-2 text-sm font-bold text-white/70">
              Password
              <span className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-3">
                <LockKeyhole className="h-4 w-4 text-amberSignal"/>
                <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" minLength={8} required placeholder="Minimum 8 characters" className="w-full bg-transparent text-white outline-none placeholder:text-white/28"/>
              </span>
            </label>
            <button type="submit" disabled={isLoading} className="rounded-lg bg-cyanEdge px-5 py-3 font-black text-midnight transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60">
              {isLoading ? "Saving..." : "Create account securely"}
            </button>
            {message && <p className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/64" aria-live="polite">{message}</p>}
            <Link href="/login" className="inline-flex items-center justify-center gap-2 rounded-lg border border-limeSignal/25 bg-limeSignal/10 px-4 py-3 text-sm font-black text-limeSignal">
              <LockKeyhole className="h-4 w-4"/>
              Login instead
            </Link>
          </div>
        </form>

        <aside className="glass-panel rounded-lg p-6">
          <div className="flex items-center gap-3 text-limeSignal">
            <ShieldCheck className="h-6 w-6"/>
            <p className="text-sm font-black uppercase">Separate records</p>
          </div>
          <h2 className="mt-3 text-2xl font-black">Each user keeps their own analysis history.</h2>
          <div className="mt-5 grid gap-3 text-sm leading-6 text-white/62">
            {["Saved reports stay tied to this email.", "Login is required before uploads or ad tools open.", "Admin access is handled only by backend role checks."].map((item) => (<p key={item} className="flex gap-2">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-limeSignal"/>
                <span>{item}</span>
              </p>))}
          </div>
        </aside>
      </section>
    </AppShell>);
}
