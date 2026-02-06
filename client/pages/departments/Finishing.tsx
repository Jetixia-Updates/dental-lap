import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Search, Check, X, Sparkles,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface FinishCase {
  id: string;
  patient: string;
  restorationType: string;
  toothNumbers: string;
  material: string;
  technician: string;
  status: "queued" | "finishing" | "qc-ready" | "passed" | "rework";
  checklist: { surfacePolish: boolean; shadeAdjustment: boolean; glazeFiring: boolean; finalCleaning: boolean };
  notes: string;
}

const INITIAL: FinishCase[] = [
  { id: "CASE-001", patient: "Ahmed M.", restorationType: "Crown", toothNumbers: "14, 15", material: "Zirconia", technician: "Tech. Mona", status: "passed", checklist: { surfacePolish: true, shadeAdjustment: true, glazeFiring: true, finalCleaning: true }, notes: "" },
  { id: "CASE-002", patient: "Sara K.", restorationType: "Veneer", toothNumbers: "21", material: "E-max", technician: "", status: "queued", checklist: { surfacePolish: false, shadeAdjustment: false, glazeFiring: false, finalCleaning: false }, notes: "" },
  { id: "CASE-003", patient: "Omar R.", restorationType: "Bridge", toothNumbers: "35-37", material: "PFM", technician: "Tech. Sami", status: "finishing", checklist: { surfacePolish: true, shadeAdjustment: false, glazeFiring: false, finalCleaning: false }, notes: "Shade match tricky" },
];

const TECHNICIANS = ["Tech. Mona", "Tech. Sami", "Tech. Nadia", "Tech. Walid"];

export default function Finishing() {
  const { t } = useTranslation();
  const [cases, setCases] = useState<FinishCase[]>(INITIAL);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ technician: "", notes: "", checklist: { surfacePolish: false, shadeAdjustment: false, glazeFiring: false, finalCleaning: false } });

  const filtered = cases.filter(c => {
    const match = `${c.id} ${c.patient} ${c.technician}`.toLowerCase().includes(search.toLowerCase());
    const status = filterStatus === "all" || c.status === filterStatus;
    return match && status;
  });

  const startEdit = (c: FinishCase) => {
    setForm({ technician: c.technician, notes: c.notes, checklist: { ...c.checklist } });
    setEditingId(c.id);
  };

  const saveEdit = () => {
    if (!editingId) return;
    const allDone = Object.values(form.checklist).every(Boolean);
    setCases(prev => prev.map(c => c.id === editingId
      ? { ...c, ...form, status: allDone ? "qc-ready" : form.technician ? "finishing" : c.status }
      : c
    ));
    setEditingId(null);
  };

  const markPassed = (id: string) => setCases(prev => prev.map(c => c.id === id ? { ...c, status: "passed" } : c));
  const markRework = (id: string) => setCases(prev => prev.map(c => c.id === id ? { ...c, status: "rework" } : c));
  const restartFinishing = (id: string) => setCases(prev => prev.map(c => c.id === id
    ? { ...c, status: "finishing", checklist: { surfacePolish: false, shadeAdjustment: false, glazeFiring: false, finalCleaning: false } }
    : c
  ));

  const statusColor: Record<string, string> = {
    queued: "bg-gray-100 text-gray-700",
    finishing: "bg-blue-100 text-blue-800",
    "qc-ready": "bg-yellow-100 text-yellow-800",
    passed: "bg-green-100 text-green-800",
    rework: "bg-red-100 text-red-800",
  };

  const checklistLabels: Record<string, string> = {
    surfacePolish: "Surface Polish", shadeAdjustment: "Shade Adjustment", glazeFiring: "Glaze Firing", finalCleaning: "Final Cleaning",
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><Sparkles className="w-8 h-8" /> {t("deptPages.finishing.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("deptPages.finishing.subtitle")}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {["queued", "finishing", "qc-ready", "passed", "rework"].map(s => (
            <div key={s} className="bg-card border rounded-lg p-4">
              <p className="text-sm text-muted-foreground capitalize">{s.replace("-", " ")}</p>
              <p className="text-2xl font-bold">{cases.filter(c => c.status === s).length}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border rounded-md px-3 py-2 text-sm">
            <option value="all">All</option>
            {["queued", "finishing", "qc-ready", "passed", "rework"].map(s => <option key={s} value={s}>{s.replace("-", " ")}</option>)}
          </select>
        </div>

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No cases found</div>
          ) : filtered.map(c => (
            <div key={c.id} className="bg-card border rounded-lg p-5">
              {editingId === c.id ? (
                <div className="space-y-4">
                  <h3 className="font-semibold">{c.id} — {c.patient} — {c.restorationType}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Technician</Label>
                      <select value={form.technician} onChange={e => setForm({ ...form, technician: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm">
                        <option value="">Unassigned</option>
                        {TECHNICIANS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <Label>Notes</Label>
                      <Input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <Label>Finishing Checklist</Label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {Object.entries(form.checklist).map(([key, val]) => (
                        <label key={key} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${val ? "bg-green-50 border-green-300" : "bg-white"}`}>
                          <input type="checkbox" checked={val} onChange={() => setForm({ ...form, checklist: { ...form.checklist, [key]: !val } })} className="rounded" />
                          <span className="text-sm font-medium">{checklistLabels[key]}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setEditingId(null)}><X className="w-4 h-4 mr-1" /> Cancel</Button>
                    <Button onClick={saveEdit}><Check className="w-4 h-4 mr-1" /> Save</Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold">{c.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[c.status]}`}>{c.status.replace("-", " ")}</span>
                    </div>
                    <p className="text-sm"><strong>{c.patient}</strong> — {c.restorationType} ({c.toothNumbers}) — {c.material}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      {c.technician && <span>{c.technician}</span>}
                      <span>✓ {Object.values(c.checklist).filter(Boolean).length}/4</span>
                      {c.notes && <span>• {c.notes}</span>}
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button size="sm" variant="outline" onClick={() => startEdit(c)}><Sparkles className="w-4 h-4" /></Button>
                    {c.status === "qc-ready" && (
                      <>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => markPassed(c.id)}><Check className="w-4 h-4 mr-1" /> Pass QC</Button>
                        <Button size="sm" variant="outline" className="text-red-600" onClick={() => markRework(c.id)}><X className="w-4 h-4 mr-1" /> Rework</Button>
                      </>
                    )}
                    {c.status === "rework" && <Button size="sm" onClick={() => restartFinishing(c.id)}>Restart Finishing</Button>}
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
