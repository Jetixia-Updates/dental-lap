import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Search, Check, X, Pause, Play, Cog, Clock,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface ProductionCase {
  id: string;
  patient: string;
  restorationType: string;
  toothNumbers: string;
  material: string;
  equipment: string;
  operator: string;
  estimatedMinutes: number;
  actualMinutes: number;
  status: "queued" | "milling" | "paused" | "completed" | "failed";
  notes: string;
}

const INITIAL: ProductionCase[] = [
  { id: "CASE-001", patient: "Ahmed M.", restorationType: "Crown", toothNumbers: "14, 15", material: "Zirconia", equipment: "Roland DWX-52D", operator: "Tech. Mahmoud", estimatedMinutes: 90, actualMinutes: 85, status: "completed", notes: "" },
  { id: "CASE-002", patient: "Sara K.", restorationType: "Veneer", toothNumbers: "21", material: "E-max", equipment: "", operator: "", estimatedMinutes: 45, actualMinutes: 0, status: "queued", notes: "" },
  { id: "CASE-003", patient: "Omar R.", restorationType: "Bridge", toothNumbers: "35-37", material: "PFM", equipment: "Imes-icore 350i", operator: "Tech. Amira", estimatedMinutes: 120, actualMinutes: 50, status: "milling", notes: "Using new bur set" },
];

const EQUIPMENT = ["Roland DWX-52D", "Imes-icore 350i", "VHF K5+", "Amann Girrbach Ceramill Motion 2"];
const OPERATORS = ["Tech. Mahmoud", "Tech. Amira", "Tech. Rami", "Tech. Huda"];

export default function CAMProduction() {
  const { t } = useTranslation();
  const [cases, setCases] = useState<ProductionCase[]>(INITIAL);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ equipment: "", operator: "", estimatedMinutes: 60, notes: "" });

  const filtered = cases.filter(c => {
    const match = `${c.id} ${c.patient} ${c.operator}`.toLowerCase().includes(search.toLowerCase());
    const status = filterStatus === "all" || c.status === filterStatus;
    return match && status;
  });

  const startEdit = (c: ProductionCase) => {
    setForm({ equipment: c.equipment, operator: c.operator, estimatedMinutes: c.estimatedMinutes, notes: c.notes });
    setEditingId(c.id);
  };

  const saveEdit = () => {
    if (!editingId) return;
    setCases(prev => prev.map(c => c.id === editingId ? { ...c, ...form } : c));
    setEditingId(null);
  };

  const startMilling = (id: string) => setCases(prev => prev.map(c => c.id === id ? { ...c, status: "milling" } : c));
  const pauseMilling = (id: string) => setCases(prev => prev.map(c => c.id === id ? { ...c, status: "paused" } : c));
  const resumeMilling = (id: string) => setCases(prev => prev.map(c => c.id === id ? { ...c, status: "milling" } : c));
  const completeMilling = (id: string) => setCases(prev => prev.map(c => c.id === id ? { ...c, status: "completed", actualMinutes: c.estimatedMinutes } : c));
  const markFailed = (id: string) => setCases(prev => prev.map(c => c.id === id ? { ...c, status: "failed" } : c));
  const requeueFailed = (id: string) => setCases(prev => prev.map(c => c.id === id ? { ...c, status: "queued", actualMinutes: 0 } : c));

  const statusColor: Record<string, string> = {
    queued: "bg-gray-100 text-gray-700",
    milling: "bg-blue-100 text-blue-800",
    paused: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><Cog className="w-8 h-8" /> {t("deptPages.camProduction.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("deptPages.camProduction.subtitle")}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {["queued", "milling", "paused", "completed", "failed"].map(s => (
            <div key={s} className="bg-card border rounded-lg p-4">
              <p className="text-sm text-muted-foreground capitalize">{s}</p>
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
            {["queued", "milling", "paused", "completed", "failed"].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No cases found</div>
          ) : filtered.map(c => (
            <div key={c.id} className="bg-card border rounded-lg p-5">
              {editingId === c.id ? (
                <div className="space-y-4">
                  <h3 className="font-semibold">{c.id} — {c.patient}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Equipment</Label>
                      <select value={form.equipment} onChange={e => setForm({ ...form, equipment: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm">
                        <option value="">Select</option>
                        {EQUIPMENT.map(eq => <option key={eq} value={eq}>{eq}</option>)}
                      </select>
                    </div>
                    <div>
                      <Label>Operator</Label>
                      <select value={form.operator} onChange={e => setForm({ ...form, operator: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm">
                        <option value="">Select</option>
                        {OPERATORS.map(op => <option key={op} value={op}>{op}</option>)}
                      </select>
                    </div>
                    <div>
                      <Label>Estimated Time (min)</Label>
                      <Input type="number" value={form.estimatedMinutes} onChange={e => setForm({ ...form, estimatedMinutes: +e.target.value })} />
                    </div>
                  </div>
                  <div><Label>Notes</Label><Input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
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
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[c.status]}`}>{c.status}</span>
                    </div>
                    <p className="text-sm"><strong>{c.patient}</strong> — {c.restorationType} ({c.toothNumbers}) — {c.material}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      {c.equipment && <span><Cog className="w-3 h-3 inline mr-1" />{c.equipment}</span>}
                      {c.operator && <span>{c.operator}</span>}
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {c.actualMinutes}/{c.estimatedMinutes} min</span>
                    </div>
                    {c.notes && <p className="text-xs text-muted-foreground">Notes: {c.notes}</p>}
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button size="sm" variant="outline" onClick={() => startEdit(c)}><Cog className="w-4 h-4" /></Button>
                    {c.status === "queued" && <Button size="sm" onClick={() => startMilling(c.id)} disabled={!c.equipment}><Play className="w-4 h-4 mr-1" /> Start</Button>}
                    {c.status === "milling" && (
                      <>
                        <Button size="sm" variant="outline" className="text-yellow-600" onClick={() => pauseMilling(c.id)}><Pause className="w-4 h-4 mr-1" /> Pause</Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => completeMilling(c.id)}><Check className="w-4 h-4 mr-1" /> Done</Button>
                        <Button size="sm" variant="outline" className="text-red-600" onClick={() => markFailed(c.id)}><X className="w-4 h-4 mr-1" /> Fail</Button>
                      </>
                    )}
                    {c.status === "paused" && <Button size="sm" onClick={() => resumeMilling(c.id)}><Play className="w-4 h-4 mr-1" /> Resume</Button>}
                    {c.status === "failed" && <Button size="sm" variant="outline" onClick={() => requeueFailed(c.id)}>Re-queue</Button>}
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
