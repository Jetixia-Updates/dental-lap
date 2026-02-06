import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus, Search, Trash2, Check, X, AlertTriangle, TrendingUp, ChevronDown, ChevronUp,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface ErrorReport {
  id: string;
  caseId: string;
  department: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  rootCause: string;
  correctiveAction: string;
  reportedBy: string;
  dateReported: string;
  status: "open" | "investigating" | "resolved" | "closed";
}

const INITIAL: ErrorReport[] = [
  { id: "ERR-001", caseId: "CASE-012", department: "CAD Design", severity: "medium", description: "Incorrect margin design on tooth 14", rootCause: "Scan quality issue", correctiveAction: "Added margin verification step to checklist", reportedBy: "Tech. Karim", dateReported: "2026-02-01", status: "resolved" },
  { id: "ERR-002", caseId: "CASE-018", department: "CAM Production", severity: "high", description: "Milling bur breakage during crown production", rootCause: "Bur exceeded usage limit", correctiveAction: "Implement bur usage counter", reportedBy: "Tech. Mahmoud", dateReported: "2026-02-03", status: "investigating" },
  { id: "ERR-003", caseId: "CASE-021", department: "Finishing", severity: "low", description: "Minor shade mismatch on veneer", rootCause: "Lighting condition during shade matching", correctiveAction: "Calibrate shade matching light", reportedBy: "Tech. Mona", dateReported: "2026-02-05", status: "open" },
  { id: "ERR-004", caseId: "CASE-009", department: "Reception", severity: "critical", description: "Wrong patient file attached to case", rootCause: "Manual entry error", correctiveAction: "Add barcode scanning verification", reportedBy: "Admin Sara", dateReported: "2026-01-28", status: "closed" },
];

const DEPARTMENTS = ["Reception", "Case Planning", "Model & Scan", "CAD Design", "CAM Production", "Finishing", "Logistics"];

export default function ContinuousImprovement() {
  const { t } = useTranslation();
  const [reports, setReports] = useState<ErrorReport[]>(INITIAL);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    caseId: "", department: DEPARTMENTS[0], severity: "medium" as ErrorReport["severity"],
    description: "", rootCause: "", correctiveAction: "", reportedBy: "",
  });

  const filtered = reports.filter(r => {
    const match = `${r.id} ${r.caseId} ${r.description} ${r.department}`.toLowerCase().includes(search.toLowerCase());
    const status = filterStatus === "all" || r.status === filterStatus;
    const severity = filterSeverity === "all" || r.severity === filterSeverity;
    return match && status && severity;
  });

  const resetForm = () => {
    setForm({ caseId: "", department: DEPARTMENTS[0], severity: "medium", description: "", rootCause: "", correctiveAction: "", reportedBy: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = () => {
    if (!form.description || !form.reportedBy) return;
    if (editingId) {
      setReports(prev => prev.map(r => r.id === editingId ? { ...r, ...form } : r));
    } else {
      const nextId = `ERR-${String(reports.length + 1).padStart(3, "0")}`;
      setReports(prev => [...prev, { ...form, id: nextId, dateReported: new Date().toISOString().split("T")[0], status: "open" }]);
    }
    resetForm();
  };

  const startEdit = (r: ErrorReport) => {
    setForm({ caseId: r.caseId, department: r.department, severity: r.severity, description: r.description, rootCause: r.rootCause, correctiveAction: r.correctiveAction, reportedBy: r.reportedBy });
    setEditingId(r.id);
    setShowForm(true);
  };

  const advanceStatus = (id: string) => {
    setReports(prev => prev.map(r => {
      if (r.id !== id) return r;
      const next: Record<string, ErrorReport["status"]> = { open: "investigating", investigating: "resolved", resolved: "closed" };
      return { ...r, status: next[r.status] || r.status };
    }));
  };

  const severityColor: Record<string, string> = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    critical: "bg-red-100 text-red-800",
  };

  const statusColor: Record<string, string> = {
    open: "bg-red-100 text-red-700",
    investigating: "bg-yellow-100 text-yellow-800",
    resolved: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-700",
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2"><TrendingUp className="w-8 h-8" /> {t("deptPages.continuousImprovement.title")}</h1>
            <p className="text-muted-foreground mt-1">{t("deptPages.continuousImprovement.subtitle")}</p>
          </div>
          <Button onClick={() => { resetForm(); setShowForm(true); }}><Plus className="w-4 h-4 mr-2" /> Report Error</Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Open Issues</p>
            <p className="text-2xl font-bold text-red-600">{reports.filter(r => r.status === "open").length}</p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Investigating</p>
            <p className="text-2xl font-bold text-yellow-600">{reports.filter(r => r.status === "investigating").length}</p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Resolved</p>
            <p className="text-2xl font-bold text-green-600">{reports.filter(r => r.status === "resolved" || r.status === "closed").length}</p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Critical/High</p>
            <p className="text-2xl font-bold text-orange-600">{reports.filter(r => r.severity === "critical" || r.severity === "high").length}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search errors..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border rounded-md px-3 py-2 text-sm">
            <option value="all">All Status</option>
            {["open", "investigating", "resolved", "closed"].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filterSeverity} onChange={e => setFilterSeverity(e.target.value)} className="border rounded-md px-3 py-2 text-sm">
            <option value="all">All Severity</option>
            {["low", "medium", "high", "critical"].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {showForm && (
          <div className="bg-card border rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold">{editingId ? "Edit Report" : "New Error Report"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><Label>Case ID</Label><Input value={form.caseId} onChange={e => setForm({ ...form, caseId: e.target.value })} placeholder="CASE-XXX" /></div>
              <div>
                <Label>Department</Label>
                <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm">
                  {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <Label>Severity</Label>
                <select value={form.severity} onChange={e => setForm({ ...form, severity: e.target.value as ErrorReport["severity"] })} className="w-full border rounded-md px-3 py-2 text-sm">
                  {["low", "medium", "high", "critical"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="md:col-span-3"><Label>Description *</Label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm min-h-[60px]" /></div>
              <div className="md:col-span-3"><Label>Root Cause</Label><Input value={form.rootCause} onChange={e => setForm({ ...form, rootCause: e.target.value })} /></div>
              <div className="md:col-span-2"><Label>Corrective Action</Label><Input value={form.correctiveAction} onChange={e => setForm({ ...form, correctiveAction: e.target.value })} /></div>
              <div><Label>Reported By *</Label><Input value={form.reportedBy} onChange={e => setForm({ ...form, reportedBy: e.target.value })} /></div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={resetForm}><X className="w-4 h-4 mr-1" /> Cancel</Button>
              <Button onClick={handleSubmit} disabled={!form.description || !form.reportedBy}>
                <Check className="w-4 h-4 mr-1" /> {editingId ? "Update" : "Submit Report"}
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No error reports found</div>
          ) : filtered.map(r => (
            <div key={r.id} className="bg-card border rounded-lg p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1 flex-1 cursor-pointer" onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold">{r.id}</span>
                    {r.caseId && <span className="text-xs text-muted-foreground">{r.caseId}</span>}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severityColor[r.severity]}`}>{r.severity}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[r.status]}`}>{r.status}</span>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded">{r.department}</span>
                  </div>
                  <p className="text-sm">{r.description}</p>
                  <p className="text-xs text-muted-foreground">{r.reportedBy} — {r.dateReported}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0 items-center">
                  <Button size="sm" variant="ghost" onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}>
                    {expandedId === r.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => startEdit(r)}>Edit</Button>
                  {r.status !== "closed" && (
                    <Button size="sm" onClick={() => advanceStatus(r.id)}>
                      {r.status === "open" ? "Investigate" : r.status === "investigating" ? "Resolve" : "Close"}
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" className="text-red-500" onClick={() => setReports(prev => prev.filter(x => x.id !== r.id))}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
              {expandedId === r.id && (
                <div className="mt-4 pt-4 border-t space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase">Root Cause</p>
                      <p className="text-sm mt-1">{r.rootCause || "Not identified yet"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase">Corrective Action</p>
                      <p className="text-sm mt-1">{r.correctiveAction || "Not defined yet"}</p>
                    </div>
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
