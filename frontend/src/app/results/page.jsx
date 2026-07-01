"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileUp, Plus, Save, Trash2 } from "lucide-react";
import { AppShell } from "@/components/shared/AppShell";
import { AnalysisHistoryPanel } from "@/components/shared/AnalysisHistoryPanel";
import { ResultSummary } from "@/components/shared/ResultSummary";
import { buildAnalysisRecord, buildStatsFromManualRows } from "@/lib/analysis";
import { uploadDataset } from "@/lib/api";
import { parseCsvPreview } from "@/lib/csv";
import { getSession, saveAnalysis } from "@/lib/local-history";
import { openPdfReport } from "@/lib/report";
const emptyRows = [
    { ad: "Ad 1", impressions: 1000, clicks: 48, ctr: 0 },
    { ad: "Ad 2", impressions: 1000, clicks: 72, ctr: 0 },
    { ad: "Ad 3", impressions: 1000, clicks: 31, ctr: 0 }
];
export default function ResultsPage() {
    const router = useRouter();
    const inputRef = useRef(null);
    const [session, setSessionState] = useState(null);
    const [checkedAuth, setCheckedAuth] = useState(false);
    const [manualRows, setManualRows] = useState(emptyRows);
    const [showManualEntry, setShowManualEntry] = useState(false);
    const [record, setRecord] = useState(null);
    const [message, setMessage] = useState("Upload a CSV/XLSX or enter ad numbers manually.");
    const [historyVersion, setHistoryVersion] = useState(0);
    useEffect(() => {
        const activeSession = getSession();
        setSessionState(activeSession);
        setCheckedAuth(true);
        if (!activeSession) {
            router.replace("/login?next=/results");
        }
    }, [router]);
    function saveRecord(nextRecord) {
        if (!session) {
            setMessage("please log in first ! ");
            router.replace("/login?next=/results");
            return;
        }
        saveAnalysis(nextRecord);
        setRecord(nextRecord);
        setHistoryVersion((value) => value + 1);
        setMessage("Result saved to this user's history.");
    }
    async function handleFile(file) {
        if (!session) {
            setMessage("Login is required before getting results.");
            router.replace("/login?next=/results");
            return;
        }
        setMessage("Reading ad performance...");
        const apiStats = await uploadDataset(file);
        if (apiStats) {
            saveRecord(buildAnalysisRecord(apiStats, session, "upload"));
            return;
        }
        if (!file.name.toLowerCase().endsWith(".csv")) {
            setMessage("The API is needed for XLSX files. CSV files can be checked instantly in the browser.");
            return;
        }
        try {
            const stats = parseCsvPreview(file.name, await file.text());
            saveRecord(buildAnalysisRecord(stats, session, "upload"));
        }
        catch (error) {
            setMessage(error instanceof Error ? error.message : "Could not read this file.");
        }
    }
    function updateManualRow(index, key, value) {
        setManualRows((rows) => rows.map((row, rowIndex) => rowIndex === index
            ? {
                ...row,
                [key]: key === "ad" ? value : Number(value)
            }
            : row));
    }
    function analyzeManualRows() {
        if (!session) {
            setMessage("Login is required before getting results.");
            router.replace("/login?next=/results");
            return;
        }
        try {
            const stats = buildStatsFromManualRows(manualRows, "manual-client-result");
            saveRecord(buildAnalysisRecord(stats, session, "manual"));
        }
        catch (error) {
            setMessage(error instanceof Error ? error.message : "Manual analysis failed.");
        }
    }
    function handleUploadChange(event) {
        const file = event.target.files?.item(0);
        if (file)
            void handleFile(file);
    }
    return (<AppShell eyebrow="Client result page" title="Detailed ad performance result" description="Each user can upload or enter their own ad numbers, receive a clear GrowScore result, and save a separate report history.">
      {!checkedAuth || !session ? (<section className="mx-auto w-full max-w-3xl px-5 pb-16">
          <div className="glass-panel rounded-lg p-6">
            <h2 className="text-2xl font-black">Login required</h2>
            <p className="mt-3 text-sm leading-6 text-white/60">Create an account or login before generating a GrowKaro result. This keeps every user account history separate.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/login" className="rounded-lg bg-limeSignal px-5 py-3 font-black text-midnight">
                Login
              </Link>
              <Link href="/signup" className="rounded-lg border border-white/15 bg-white/[0.06] px-5 py-3 font-black text-white">
                Sign up
              </Link>
            </div>
          </div>
        </section>) : (<section className="mx-auto grid w-full max-w-7xl gap-5 px-5 pb-16 xl:grid-cols-[1fr_360px]">
        <div className="grid gap-5">
          <section className="glass-panel rounded-lg p-5">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <p className="text-sm font-black uppercase text-cyanEdge">Input</p>
                <h2 className="mt-1 text-2xl font-black">Upload result sheet or enter campaign numbers</h2>
                <p className="mt-2 text-sm text-white/56">{message}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={() => inputRef.current?.click()} className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyanEdge px-4 py-3 font-black text-midnight">
                  <FileUp className="h-4 w-4"/>
                  Upload file
                </button>
                <button type="button" onClick={() => setShowManualEntry((value) => !value)} className="inline-flex items-center justify-center gap-2 rounded-lg border border-limeSignal/30 bg-limeSignal/10 px-4 py-3 font-black text-limeSignal">
                  <Plus className="h-4 w-4"/>
                  {showManualEntry ? "Hide manual entry" : "Enter manual result"}
                </button>
              </div>
              <input ref={inputRef} type="file" accept=".csv,.xlsx" className="sr-only" onChange={handleUploadChange}/>
            </div>
          </section>

          {showManualEntry && (<section className="glass-panel rounded-lg p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black uppercase text-limeSignal">Manual result</p>
                <h2 className="mt-1 text-2xl font-black">Quick analysis for a new user</h2>
              </div>
              <button type="button" onClick={() => setManualRows((rows) => [...rows, { ad: `Ad ${rows.length + 1}`, impressions: 0, clicks: 0, ctr: 0 }])} className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/[0.05] text-white" aria-label="Add ad row" title="Add ad row">
                <Plus className="h-5 w-5"/>
              </button>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[620px] border-separate border-spacing-y-2 text-left text-sm">
                <thead className="text-xs uppercase text-white/40">
                  <tr>
                    <th className="px-3 py-2">Ad name</th>
                    <th className="px-3 py-2">Impressions</th>
                    <th className="px-3 py-2">Clicks</th>
                    <th className="px-3 py-2">CTR preview</th>
                    <th className="px-3 py-2">Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {manualRows.map((row, index) => {
                    const ctr = (row.clicks / Math.max(row.impressions, 1)) * 100;
                    return (<tr key={`${row.ad}-${index}`} className="bg-white/[0.04]">
                        <td className="rounded-l-lg px-3 py-2">
                          <input value={row.ad} onChange={(event) => updateManualRow(index, "ad", event.target.value)} className="w-full rounded-lg border border-white/10 bg-midnight/60 px-3 py-2 outline-none"/>
                        </td>
                        <td className="px-3 py-2">
                          <input value={row.impressions} min={0} type="number" onChange={(event) => updateManualRow(index, "impressions", event.target.value)} className="w-full rounded-lg border border-white/10 bg-midnight/60 px-3 py-2 outline-none"/>
                        </td>
                        <td className="px-3 py-2">
                          <input value={row.clicks} min={0} type="number" onChange={(event) => updateManualRow(index, "clicks", event.target.value)} className="w-full rounded-lg border border-white/10 bg-midnight/60 px-3 py-2 outline-none"/>
                        </td>
                        <td className="px-3 py-2 font-black text-limeSignal">{ctr.toFixed(2)}%</td>
                        <td className="rounded-r-lg px-3 py-2">
                          <button type="button" onClick={() => setManualRows((rows) => rows.filter((_, rowIndex) => rowIndex !== index))} className="grid h-9 w-9 place-items-center rounded-lg border border-roseEdge/25 bg-roseEdge/10 text-rose-100" aria-label="Remove ad row" title="Remove ad row">
                            <Trash2 className="h-4 w-4"/>
                          </button>
                        </td>
                      </tr>);
                })}
                </tbody>
              </table>
            </div>
            <button type="button" onClick={analyzeManualRows} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-limeSignal px-5 py-3 font-black text-midnight">
              <Save className="h-4 w-4"/>
              Save and show result
            </button>
          </section>)}

          {record && <ResultSummary record={record} onExportPdf={(budget) => openPdfReport(record, budget)}/>}
        </div>

        <div key={historyVersion}>
          <AnalysisHistoryPanel scope="user" limit={10}/>
        </div>
      </section>)}
    </AppShell>);
}
