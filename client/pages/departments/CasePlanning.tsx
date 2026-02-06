import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus, Search, Trash2, Edit, Check, X, ClipboardList, User,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface PlanCase {
  id: string;
  patient: string;
  doctor: string;
  restorationType: string;
  toothNumbers: string;
  material: string;
  complexity: "simple" | "moderate" | "complex";
  assignedPlanner: string;
  notes: string;
  status: "pending" | "planning" | "planned" | "revision";
}

const INITIAL: PlanCase[] = [
  { id: "CASE-001", patient: "Ahmed M.", doctor: "Dr. Smith", restorationType: "Crown", toothNumbers: "14, 15", material: "Zirconia", complexity: "moderate", assignedPlanner: "Eng. Ali", notes: "Check implant height", status: "planned" },
  { id: "CASE-002", patient: "Sara K.", doctor: "Dr. Johnson", restorationType: "Veneer", toothNumbers: "21", material: "E-max", complexity: "simple", assignedPlanner: "", notes: "", status: "pending" },
  { id: "CASE-003", patient: "Omar R.", doctor: "Dr. Lee", restorationType: "Bridge", toothNumbers: "35-37", material: "PFM", complexity: "complex", assignedPlanner: "Eng. Nora", notes: "Cantilever design requested", status: "planning" },
];

const PLANNERS = ["Eng. Ali", "Eng. Nora", "Eng. Hassan", "Dr. Fatima"];

export default function CasePlanning() {
  const { t } = useTranslation();
  const [cases, setCases] = useState<PlanCase[]>(INITIAL);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ assignedPlanner: "", complexity: "simple" as PlanCase["complexity"], notes: "" });

  const filtered = cases.filter(c => {
    const match = `${c.id} ${c.patient} ${c.doctor} ${c.assignedPlanner}`.toLowerCase().includes(search.toLowerCase());
    const status = filterStatus === "all" || c.status === filterStatus;
    return match && status;
  });

  const startEdit = (c: PlanCase) => {
    setForm({ assignedPlanner: c.assignedPlanner, complexity: c.complexity, notes: c.notes });
    setEditingId(c.id);
  };

  const saveEdit = () => {
    if (!editingId) return;
    setCases(prev => prev.map(c => c.id === editingId
      ? { ...c, ...form, status: form.assignedPlanner ? "planning" : c.status }
      : c
    ));
    setEditingId(null);
  };

  const advanceStatus = (id: string) => {
    setCases(prev => prev.map(c => {
      if (c.id !== id) return c;
      const next: Record<string, PlanCase["status"]> = { pending: "planning", planning: "planned", revision: "planning" };
      return { ...c, status: next[c.status] || c.status };
    }));
  };

  const sendBack = (id: string) => {
    setCases(prev => prev.map(c => c.id === id ? { ...c, status: "revision" } : c));
  };

  const statusColor: Record<string, string> = {
    pending: "bg-gray-100 text-gray-700",
    planning: "bg-blue-100 text-blue-800",
    planned: "bg-green-100 text-green-800",
    revision: "bg-yellow-100 text-yellow-800",
  };

  const complexityColor: Record<string, string> = {
    simple: "bg-green-100 text-green-700",
    moderate: "bg-yellow-100 text-yellow-700",
    complex: "bg-red-100 text-red-700",
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><ClipboardList className="w-8 h-8" /> {t("deptPages.casePlanning.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("deptPages.casePlanning.subtitle")}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Pending", value: cases.filter(c => c.status === "pending").length, color: "text-gray-600" },
            { label: "In Planning", value: cases.filter(c => c.status === "planning").length, color: "text-blue-600" },
            { label: "Planned", value: cases.filter(c => c.status === "planned").length, color: "text-green-600" },
            { label: "Revision", value: cases.filter(c => c.status === "revision").length, color: "text-yellow-600" },
          ].map(s => (
            <div key={s.label} className="bg-card border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search cases..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border rounded-md px-3 py-2 text-sm">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="planning">In Planning</option>
            <option value="planned">Planned</option>
            <option value="revision">Revision</option>
          </select>
        </div>

        {/* Cases list */}
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
                      <Label>Assign Planner</Label>
                      <select value={form.assignedPlanner} onChange={e => setForm({ ...form, assignedPlanner: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm">
                        <option value="">Unassigned</option>
                        {PLANNERS.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                    <div>
                      <Label>Complexity</Label>
                      <select value={form.complexity} onChange={e => setForm({ ...form, complexity: e.target.value as PlanCase["complexity"] })} className="w-full border rounded-md px-3 py-2 text-sm">
                        <option value="simple">Simple</option>
                        <option value="moderate">Moderate</option>
                        <option value="complex">Complex</option>
                      </select>
                    </div>
                    <div>
                      <Label>Notes</Label>
                      <Input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
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
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[c.status]}`}>{c.status}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${complexityColor[c.complexity]}`}>{c.complexity}</span>
                    </div>
                    <p className="text-sm"><strong>{c.patient}</strong> — {c.doctor} — {c.restorationType} ({c.toothNumbers}) — {c.material}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <User className="w-3 h-3" /> {c.assignedPlanner || "Unassigned"}
                      {c.notes && <span className="ml-2">• {c.notes}</span>}
                    </p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button size="sm" variant="outline" onClick={() => startEdit(c)}><Edit className="w-4 h-4" /></Button>
                    {c.status !== "planned" && (
                      <Button size="sm" onClick={() => advanceStatus(c.id)}>
                        {c.status === "pending" ? "Start Planning" : c.status === "revision" ? "Re-plan" : "Mark Planned"}
                      </Button>
                    )}
                    {c.status === "planned" && (
                      <Button size="sm" variant="outline" className="text-yellow-600" onClick={() => sendBack(c.id)}>Send to Revision</Button>
                    )}
                    <Button size="sm" variant="ghost" className="text-red-500" onClick={() => setCases(prev => prev.filter(x => x.id !== c.id))}><Trash2 className="w-4 h-4" /></Button>
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
