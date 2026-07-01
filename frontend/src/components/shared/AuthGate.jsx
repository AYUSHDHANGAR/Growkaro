"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LockKeyhole, ShieldAlert, UserPlus } from "lucide-react";
import { getSession } from "@/lib/local-history";

export function AuthGate({ children, requiredRole = "user", title = "Login required", description = "Sign in before using this GrowKaro workspace." }) {
    const router = useRouter();
    const [session, setSessionState] = useState(null);
    const [loginHref, setLoginHref] = useState("/login");
    const [signupHref, setSignupHref] = useState("/signup");
    const [isChecking, setIsChecking] = useState(true);
    useEffect(() => {
        const activeSession = getSession();
        const path = `${window.location.pathname}${window.location.search}`;
        const nextLoginHref = `/login?next=${encodeURIComponent(path)}`;
        const nextSignupHref = `/signup?next=${encodeURIComponent(path)}`;
        setSessionState(activeSession);
        setLoginHref(nextLoginHref);
        setSignupHref(nextSignupHref);
        setIsChecking(false);
        if (!activeSession) {
            router.replace(nextLoginHref);
        }
    }, [router]);
    if (isChecking) {
        return (<section className="mx-auto w-full max-w-4xl px-5 pb-16">
        <div className="glass-panel rounded-lg p-6">
          <div className="grid h-12 w-12 place-items-center rounded-lg border border-cyanEdge/25 bg-cyanEdge/10 text-cyanEdge">
            <LockKeyhole className="h-6 w-6"/>
          </div>
          <h2 className="mt-4 text-2xl font-black">Checking access...</h2>
          <p className="mt-2 text-sm leading-6 text-white/58">Please wait while GrowKaro verifies your local session.</p>
        </div>
      </section>);
    }
    if (!session) {
        return (<section className="mx-auto w-full max-w-4xl px-5 pb-16">
        <div className="glass-panel rounded-lg p-6">
          <div className="grid h-12 w-12 place-items-center rounded-lg border border-amberSignal/25 bg-amberSignal/10 text-amberSignal">
            <LockKeyhole className="h-6 w-6"/>
          </div>
          <h2 className="mt-4 text-2xl font-black">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/62">{description}</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link href={loginHref} className="inline-flex items-center justify-center gap-2 rounded-lg bg-limeSignal px-5 py-3 font-black text-midnight">
              <LockKeyhole className="h-4 w-4"/>
              Login
            </Link>
            <Link href={signupHref} className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.06] px-5 py-3 font-black text-white">
              <UserPlus className="h-4 w-4"/>
              Create account
            </Link>
          </div>
        </div>
      </section>);
    }
    if (requiredRole === "admin" && session.role !== "admin") {
        return (<section className="mx-auto w-full max-w-4xl px-5 pb-16">
        <div className="glass-panel rounded-lg p-6">
          <ShieldAlert className="h-8 w-8 text-amberSignal"/>
          <h2 className="mt-4 text-2xl font-black">Admin access required</h2>
          <p className="mt-2 text-sm leading-6 text-white/62">This area is restricted to verified admin accounts.</p>
        </div>
      </section>);
    }
    return children;
}
