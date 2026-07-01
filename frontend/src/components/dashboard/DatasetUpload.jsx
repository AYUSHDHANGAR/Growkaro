"use client";
import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { uploadDataset } from "@/lib/api";
import { parseCsvPreview } from "@/lib/csv";
import { getSession } from "@/lib/local-history";
export function DatasetUpload({ onStats }) {
    const inputRef = useRef(null);
    const [message, setMessage] = useState("Drop your ad result sheet");
    const [isLoading, setIsLoading] = useState(false);
    async function handleFile(file) {
        if (!getSession()) {
            setMessage("Login is required before getting ad results.");
            return;
        }
        setIsLoading(true);
        setMessage("Validating dataset...");
        const backendStats = await uploadDataset(file);
        if (backendStats) {
            onStats(backendStats);
            setMessage("Dataset validated by API");
            setIsLoading(false);
            return;
        }
        if (file.name.toLowerCase().endsWith(".csv")) {
            try {
                const text = await file.text();
                const localStats = parseCsvPreview(file.name, text);
                onStats(localStats);
                setMessage("Dataset preview validated locally");
            }
            catch (error) {
                setMessage(error instanceof Error ? error.message : "Dataset validation failed");
            }
        }
        else {
            setMessage("XLSX upload is ready for the FastAPI backend. Start the API to validate this file.");
        }
        setIsLoading(false);
    }
    return (<section id="upload" className="glass-panel rounded-3xl p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase text-cyanEdge">Dataset upload</p>
          <h3 className="mt-2 text-2xl font-black">Validate ad results for Growkaro scoring</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/56">
            Columns are ads. Rows are customer impressions. Use 1 when a customer clicked and 0 when they did not.
          </p>
        </div>
        <button type="button" onClick={() => inputRef.current?.click()} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyanEdge px-5 py-3 font-black text-midnight transition hover:bg-white">
          <UploadCloud className="h-5 w-5"/>
          Upload dataset
        </button>
      </div>

      <label onDragOver={(event) => event.preventDefault()} onDrop={(event) => {
            event.preventDefault();
            const file = event.dataTransfer.files.item(0);
            if (file)
                void handleFile(file);
        }} className="mt-6 grid min-h-44 cursor-pointer place-items-center rounded-3xl border border-dashed border-white/20 bg-white/[0.04] p-8 text-center transition hover:border-cyanEdge/60">
        <input ref={inputRef} type="file" accept=".csv,.xlsx" className="sr-only" onChange={(event) => {
            const file = event.target.files?.item(0);
            if (file)
                void handleFile(file);
        }}/>
        <div>
          <UploadCloud className="mx-auto h-10 w-10 text-cyanEdge"/>
          <p className="mt-4 text-lg font-black">{isLoading ? "Reading file" : message}</p>
          <p className="mt-2 text-sm text-white/45">CSV previews work instantly. XLSX validation runs through the API.</p>
        </div>
      </label>
    </section>);
}
