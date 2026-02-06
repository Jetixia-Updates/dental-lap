import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Search, Check, X, RotateCcw, ScanLine, Star,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface ScanCase {
  id: string;
  patient: string;
  restorationType: string;
  toothNumbers: string;
  scanType: "impression" | "digital-scan" | "model";
  scanQuality: number; // 1-5
  scanner: string;
  status: "queued" | "scanning" | "review" | "approved" | "rescan";
  notes: string;
}

const INITIAL: ScanCase[] = [
  { id: "CASE-001", patient: "Ahmed M.", restorationType: "Crown", toothNumbers: "14, 15", scanType: "digital-scan", scanQuality: 4, scanner: "TRIOS 3", status: "approved", notes: "" },
  { id: "CASE-002", patient: "Sara K.", restorationType: "Veneer", toothNumbers: "21", scanType: "impression", scanQuality: 0, scanner: "", status: "queued", notes: "Alginate impression received" },
  { id: "CASE-003", patient: "Omar R.", restorationType: "Bridge", toothNumbers: "35-37", scanType: "digital-scan", scanQuality: 2, scanner: "TRIOS 3", status: "rescan", notes: "Margins unclear on 36" },
];

const SCANNERS = ["TRIOS 3", "iTero 5D", "Medit i700", "3Shape E4"];

export default function ModelScan() {
  const { t } = useTranslation();
  const [cases, setCases] = useState<ScanCase[]>(INITIAL);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [reviewForm, setReviewForm] = useState({ scanQuality: 3, scanner: SCANNERS[0], notes: "" });

  const filtered = cases.filter(c => {
    const match = `${c.id} ${c.patient}`.toLowerCase().includes(search.toLowerCase());
    const status = filterStatus === "all" || c.status === filterStatus;
    return match && status;
  });

  const startReview = (c: ScanCase) => {
    setReviewForm({ scanQuality: c.scanQuality || 3, scanner: c.scanner || SCANNERS[0], notes: c.notes });
    setReviewingId(c.id);
  };

  const approveCase = () => {
    if (!reviewingId) return;
    setCases(prev => prev.map(c => c.id === reviewingId
      ? { ...c, ...reviewForm, status: "approved" }
      : c
    ));
    setReviewingId(null);
  };

  const requestRescan = () => {
    if (!reviewingId) return;
    setCases(prev => prev.map(c => c.id === reviewingId
      ? { ...c, ...reviewForm, status: "rescan" }
      : c
    ));
    setReviewingId(null);
  };

  const startScan = (id: string) => {
    setCases(prev => prev.map(c => c.id === id ? { ...c, status: "scanning" } : c));
  };

  const finishScan = (id: string) => {
    setCases(prev => prev.map(c => c.id === id ? { ...c, status: "review" } : c));
  };

  const statusColor: Record<string, string> = {
    queued: "bg-gray-100 text-gray-700",
    scanning: "bg-blue-100 text-blue-800",
    review: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rescan: "bg-red-100 text-red-800",
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><ScanLine className="w-8 h-8" /> {t("deptPages.modelScan.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("deptPages.modelScan.subtitle")}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {["queued", "scanning", "review", "approved", "rescan"].map(s => (
            <div key={s} className="bg-card border rounded-lg p-4">
              <p className="text-sm text-muted-foreground capitalize">{s}</p>
              <p className="text-2xl font-bold">{cases.filter(c => c.status === s).length}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search cases..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border rounded-md px-3 py-2 text-sm">
            <option value="all">All</option>
            <option value="queued">Queued</option>
            <option value="scanning">Scanning</option>
            <option value="review">In Review</option>
            <option value="approved">Approved</option>
            <option value="rescan">Rescan</option>
          </select>
        </div>

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No cases found</div>
          ) : filtered.map(c => (
            <div key={c.id} className="bg-card border rounded-lg p-5">
              {reviewingId === c.id ? (
                <div className="space-y-4">
                  <h3 className="font-semibold">{c.id} — {c.patient} — {c.restorationType} ({c.toothNumbers})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Scanner</Label>
                      <select value={reviewForm.scanner} onChange={e => setReviewForm({ ...reviewForm, scanner: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm">
                        {SCANNERS.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <Label>Scan Quality (1-5)</Label>
                      <div className="flex gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map(n => (
                          <button key={n} onClick={() => setReviewForm({ ...reviewForm, scanQuality: n })}
                            className={`p-1 ${n <= reviewForm.scanQuality ? "text-yellow-500" : "text-gray-300"}`}>
                            <Star className="w-6 h-6 fill-current" />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label>Notes</Label>
                      <Input value={reviewForm.notes} onChange={e => setReviewForm({ ...reviewForm, notes: e.target.value })} placeholder="Observations..." />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setReviewingId(null)}><X className="w-4 h-4 mr-1" /> Cancel</Button>
                    <Button variant="outline" className="text-red-600 border-red-200" onClick={requestRescan}><RotateCcw className="w-4 h-4 mr-1" /> Request Rescan</Button>
                    <Button onClick={approveCase} className="bg-green-600 hover:bg-green-700"><Check className="w-4 h-4 mr-1" /> Approve</Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold">{c.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[c.status]}`}>{c.status}</span>
                      <span className="text-xs bg-muted px-2 py-0.5 rounded">{c.scanType}</span>
                    </div>
                    <p className="text-sm"><strong>{c.patient}</strong> — {c.restorationType} ({c.toothNumbers})</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {c.scanner && <span>Scanner: {c.scanner}</span>}
                      {c.scanQuality > 0 && (
                        <span className="flex items-center gap-0.5">
                          Quality: {[1,2,3,4,5].map(n => <Star key={n} className={`w-3 h-3 ${n <= c.scanQuality ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} />)}
                        </span>
                      )}
                      {c.notes && <span>• {c.notes}</span>}
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    {c.status === "queued" && <Button size="sm" onClick={() => startScan(c.id)}>Start Scan</Button>}
                    {c.status === "scanning" && <Button size="sm" onClick={() => finishScan(c.id)}>Finish Scan</Button>}
                    {c.status === "rescan" && <Button size="sm" variant="outline" onClick={() => startScan(c.id)}><RotateCcw className="w-4 h-4 mr-1" /> Rescan</Button>}
                    {(c.status === "review" || c.status === "approved") && (
                      <Button size="sm" variant="outline" onClick={() => startReview(c)}>Review Quality</Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
