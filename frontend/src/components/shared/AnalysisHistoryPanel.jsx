"use client";
import { useEffect, useState } from "react";
import { Clock3, Download, Trash2 } from "lucide-react";
import { deleteAnalysis, exportHistoryCsv, getAllHistory, getUserHistory } from "@/lib/local-history";
import { formatPercent, getTopResultAds } from "@/lib/analysis";
export function AnalysisHistoryPanel({ scope = "user", limit = 8 }) {
    const [records, setRecords] = useState([]);
    useEffect(() => {
        setRecords(scope === "admin" ? getAllHistory() : getUserHistory());
    }, [scope]);
    function removeRecord(id) {
        deleteAnalysis(id);
        setRecords(scope === "admin" ? getAllHistory() : getUserHistory());
    }
    const visibleRecords = records.slice(0, limit);
    return (<section className="glass-panel rounded-lg p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black uppercase text-limeSignal">{scope === "admin" ? "Admin history" : "Your history"}</p>
          <h2 className="mt-1 text-xl font-black">Saved analysis</h2>
        </div>
        <button type="button" onClick={() => exportHistoryCsv(records)} disabled={!records.length} className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/[0.05] text-white/70 disabled:opacity-40" aria-label="Export history CSV" title="Export history CSV">
          <Download className="h-4 w-4"/>
        </button>
      </div>

      <div className="mt-4 grid gap-3">
        {visibleRecords.length ? (visibleRecords.map((record) => {
            const topAds = getTopResultAds(record.stats);
            return (<article key={record.id} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-black text-white">{record.stats.filename}</p>
                  <p className="mt-1 text-xs text-white/45">
                    {scope === "admin" ? `${record.ownerEmail} - ` : ""}
                    {new Date(record.createdAt).toLocaleString()}
                  </p>
                </div>
                <button type="button" onClick={() => removeRecord(record.id)} className="grid h-8 w-8 place-items-center rounded-lg border border-roseEdge/25 bg-roseEdge/10 text-rose-100" aria-label="Delete saved analysis" title="Delete saved analysis">
                  <Trash2 className="h-4 w-4"/>
                </button>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                <span className="rounded-lg bg-white/[0.05] p-2">
                  <b>{record.growScore}</b>
                  <br />
                  <span className="text-white/45">Score</span>
                </span>
                <span className="rounded-lg bg-white/[0.05] p-2">
                  <b>{formatPercent(record.stats.overallCtr)}</b>
                  <br />
                  <span className="text-white/45">CTR</span>
                </span>
                <span className="rounded-lg bg-white/[0.05] p-2">
                  <b>{topAds.length}/{record.stats.columns}</b>
                  <br />
                  <span className="text-white/45">Ranked ads</span>
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {topAds.map((ad) => (<span key={ad.ad} className="rounded-lg border border-limeSignal/20 bg-limeSignal/10 px-2 py-1 text-xs font-black text-limeSignal">
                    #{ad.rank} {ad.ad}
                  </span>))}
              </div>
            </article>);
        })) : (<div className="rounded-lg border border-dashed border-white/15 bg-white/[0.03] p-6 text-center text-sm text-white/50">
            <Clock3 className="mx-auto mb-3 h-6 w-6 text-cyanEdge"/>
            No saved analysis yet.
          </div>)}
      </div>
    </section>);
}
