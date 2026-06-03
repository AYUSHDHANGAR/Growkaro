"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Database, Download, ShieldAlert, Trash2, UsersRound } from "lucide-react";

import { AppShell } from "@/components/shared/AppShell";
import { AnalysisHistoryPanel } from "@/components/shared/AnalysisHistoryPanel";
import { getTopResultAds } from "@/lib/analysis";
import { deleteAnalysis, exportHistoryCsv, getAllHistory, getSession, getUsers } from "@/lib/local-history";
import type { AnalysisRecord, SavedUser, UserSession } from "@/types";

export default function AdminPage() {
  const [session, setSessionState] = useState<UserSession | null>(null);
  const [records, setRecords] = useState<AnalysisRecord[]>([]);
  const [users, setUsers] = useState<SavedUser[]>([]);

  useEffect(() => {
    setSessionState(getSession());
    setRecords(getAllHistory());
    setUsers(getUsers());
  }, []);

  const groupedUsers = useMemo(
    () =>
      users.map((user) => ({
        ...user,
        analysisCount: records.filter((record) => record.ownerEmail.toLowerCase() === user.email.toLowerCase()).length
      })),
    [records, users]
  );

  function removeRecord(id: string) {
    deleteAnalysis(id);
    setRecords(getAllHistory());
  }

  if (session?.role !== "admin") {
    return (
      <AppShell eyebrow="Admin panel" title="Admin login required" description="Use the admin account to review all saved user analyses and export system history.">
        <section className="mx-auto w-full max-w-3xl px-5 pb-16">
          <div className="glass-panel rounded-lg p-6">
            <ShieldAlert className="h-8 w-8 text-amberSignal" />
            <h2 className="mt-4 text-2xl font-black">Full access is protected.</h2>
            <p className="mt-3 text-sm leading-6 text-white/62">Login with the GrowKaro admin account to see every user result, delete records, and export analysis history.</p>
            <Link href="/login" className="mt-5 inline-flex rounded-lg bg-limeSignal px-5 py-3 font-black text-midnight">
              Go to login
            </Link>
          </div>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell eyebrow="Admin panel" title="Full GrowKaro access" description="Review every user, every saved ad analysis, and export client performance records.">
      <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 pb-16">
        <div className="grid gap-4 md:grid-cols-3">
          <article className="glass-panel rounded-lg p-5">
            <UsersRound className="h-6 w-6 text-cyanEdge" />
            <p className="mt-4 text-sm font-black uppercase text-white/42">Users</p>
            <p className="mt-1 text-4xl font-black">{users.length}</p>
          </article>
          <article className="glass-panel rounded-lg p-5">
            <Database className="h-6 w-6 text-limeSignal" />
            <p className="mt-4 text-sm font-black uppercase text-white/42">Saved analyses</p>
            <p className="mt-1 text-4xl font-black">{records.length}</p>
          </article>
          <article className="glass-panel rounded-lg p-5">
            <Download className="h-6 w-6 text-amberSignal" />
            <p className="mt-4 text-sm font-black uppercase text-white/42">Export</p>
            <button type="button" onClick={() => exportHistoryCsv(records)} className="mt-2 rounded-lg bg-limeSignal px-4 py-2 font-black text-midnight">
              Download CSV
            </button>
          </article>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
          <section className="glass-panel rounded-lg p-5">
            <p className="text-sm font-black uppercase text-cyanEdge">All user records</p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[820px] border-separate border-spacing-y-2 text-left text-sm">
                <thead className="text-xs uppercase text-white/40">
                  <tr>
                    <th className="px-3 py-2">User</th>
                    <th className="px-3 py-2">File</th>
                    <th className="px-3 py-2">GrowScore</th>
                    <th className="px-3 py-2">CTR</th>
                    <th className="px-3 py-2">Ranked ads</th>
                    <th className="px-3 py-2">Saved</th>
                    <th className="px-3 py-2">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => {
                    const topAds = getTopResultAds(record.stats);
                    return (
                      <tr key={record.id} className="bg-white/[0.04]">
                        <td className="rounded-l-lg px-3 py-3 font-bold">{record.ownerEmail}</td>
                        <td className="px-3 py-3">{record.stats.filename}</td>
                        <td className="px-3 py-3 font-black text-limeSignal">{record.growScore}</td>
                        <td className="px-3 py-3">{record.stats.overallCtr.toFixed(2)}%</td>
                        <td className="px-3 py-3">{topAds.map((ad) => `#${ad.rank} ${ad.ad}`).join(", ")}</td>
                        <td className="px-3 py-3 text-white/54">{new Date(record.createdAt).toLocaleString()}</td>
                        <td className="rounded-r-lg px-3 py-3">
                          <button
                            type="button"
                            onClick={() => removeRecord(record.id)}
                            className="grid h-9 w-9 place-items-center rounded-lg border border-roseEdge/25 bg-roseEdge/10 text-rose-100"
                            aria-label="Delete analysis"
                            title="Delete analysis"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <div className="grid gap-5">
            <section className="glass-panel rounded-lg p-5">
              <p className="text-sm font-black uppercase text-limeSignal">User panel</p>
              <div className="mt-4 grid gap-3">
                {groupedUsers.map((user) => (
                  <article key={user.email} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                    <p className="font-black">{user.name}</p>
                    <p className="mt-1 text-sm text-white/50">{user.email}</p>
                    <p className="mt-3 text-sm font-bold text-cyanEdge">{user.analysisCount} saved analyses</p>
                  </article>
                ))}
              </div>
            </section>
            <AnalysisHistoryPanel scope="admin" limit={4} />
          </div>
        </div>
      </section>
    </AppShell>
  );
}
