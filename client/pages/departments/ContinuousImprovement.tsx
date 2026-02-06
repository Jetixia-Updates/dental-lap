import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Search,
  Plus,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  Edit2,
  Trash2,
  Save,
  X,
  ArrowRight,
  RotateCcw,
  TrendingUp,
  BarChart3,
  ShieldAlert,
  FileWarning,
} from "lucide-react";

interface ErrorReport {
  id: number;
  reportId: string;
  caseId: string;
  department: string;
  category: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "reported" | "investigating" | "correcting" | "resolved" | "closed";
  reportedBy: string;
  reportedDate: string;
  description: string;
  rootCause: string;
  correctiveAction: string;
  resolvedDate: string | null;
}

const initialReports: ErrorReport[] = [
  {
    id: 1,
    reportId: "ERR-2024-001",
    caseId: "CASE-1042",
    department: "CAM Production",
    category: "Material Defect",
    severity: "high",
    status: "investigating",
    reportedBy: "Ahmed K.",
    reportedDate: "2024-12-10",
    description:
      "Zirconia block showed micro-cracks after milling. The restoration fractured during finishing stage, requiring a complete remake.",
    rootCause: "",
    correctiveAction: "",
    resolvedDate: null,
  },
  {
    id: 2,
    reportId: "ERR-2024-002",
    caseId: "CASE-1055",
    department: "CAD Design",
    category: "Design Error",
    severity: "medium",
    status: "correcting",
    reportedBy: "Sara M.",
    reportedDate: "2024-12-12",
    description:
      "Margins were not properly defined in the CAD design leading to an ill-fitting crown. Detected during quality control.",
    rootCause: "Operator did not verify scan data against the physical model before designing.",
    correctiveAction: "",
    resolvedDate: null,
  },
  {
    id: 3,
    reportId: "ERR-2024-003",
    caseId: "CASE-0998",
    department: "Finishing",
    category: "Human Error",
    severity: "low",
    status: "resolved",
    reportedBy: "Omar R.",
    reportedDate: "2024-12-05",
    description:
      "Shade mismatch on a porcelain veneer. The wrong shade guide reference was used during the layering process.",
    rootCause: "Technician referenced an outdated shade prescription from a previous case revision.",
    correctiveAction:
      "Implemented mandatory shade verification step with dual sign-off before layering begins.",
    resolvedDate: "2024-12-08",
  },
  {
    id: 4,
    reportId: "ERR-2024-004",
    caseId: "CASE-1070",
    department: "CAM Production",
    category: "Equipment Failure",
    severity: "critical",
    status: "reported",
    reportedBy: "Khalid T.",
    reportedDate: "2024-12-14",
    description:
      "CNC milling machine spindle vibration exceeds tolerance. Multiple units produced in the last batch may be out of spec.",
    rootCause: "",
    correctiveAction: "",
    resolvedDate: null,
  },
];

const categories = [
  "Material Defect",
  "Process Error",
  "Equipment Failure",
  "Human Error",
  "Design Error",
];

const departments = [
  "Reception",
  "Model & Scan",
  "Case Planning",
  "CAD Design",
  "CAM Production",
  "Finishing",
  "Quality Control",
  "Logistics",
];

const severityColors: Record<string, string> = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
};

const statusColors: Record<string, string> = {
  reported: "bg-gray-100 text-gray-800",
  investigating: "bg-purple-100 text-purple-800",
  correcting: "bg-amber-100 text-amber-800",
  resolved: "bg-green-100 text-green-800",
  closed: "bg-slate-200 text-slate-600",
};

const statusLabels: Record<string, string> = {
  reported: "Reported",
  investigating: "Investigating",
  correcting: "Correcting",
  resolved: "Resolved",
  closed: "Closed",
};

const emptyForm: Omit<ErrorReport, "id"> = {
  reportId: "",
  caseId: "",
  department: departments[0],
  category: categories[0],
  severity: "medium",
  status: "reported",
  reportedBy: "",
  reportedDate: new Date().toISOString().split("T")[0],
  description: "",
  rootCause: "",
  correctiveAction: "",
  resolvedDate: null,
};

export default function ContinuousImprovement() {
  const [reports, setReports] = useState<ErrorReport[]>(initialReports);
  const [selectedId, setSelectedId] = useState<number | null>(initialReports[0]?.id ?? null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<ErrorReport>>({});
  const [formData, setFormData] = useState<Omit<ErrorReport, "id">>(emptyForm);
  const [rootCauseInput, setRootCauseInput] = useState("");
  const [correctiveActionInput, setCorrectiveActionInput] = useState("");

  // ── helpers ──
  const nextId = () => Math.max(0, ...reports.map((r) => r.id)) + 1;
  const nextReportId = () => {
    const nums = reports.map((r) => parseInt(r.reportId.split("-").pop() || "0", 10));
    const next = Math.max(0, ...nums) + 1;
    return `ERR-2024-${String(next).padStart(3, "0")}`;
  };

  // ── filters ──
  const filtered = reports.filter((r) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      r.reportId.toLowerCase().includes(q) ||
      r.caseId.toLowerCase().includes(q) ||
      r.department.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.reportedBy.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    const matchSeverity = severityFilter === "all" || r.severity === severityFilter;
    return matchSearch && matchStatus && matchSeverity;
  });

  const selected = reports.find((r) => r.id === selectedId) ?? null;

  // ── CRUD ──
  function handleAdd() {
    const newReport: ErrorReport = {
      ...formData,
      id: nextId(),
      reportId: nextReportId(),
      status: "reported",
      resolvedDate: null,
    };
    setReports((prev) => [newReport, ...prev]);
    setSelectedId(newReport.id);
    setShowAddModal(false);
    setFormData(emptyForm);
  }

  function handleDelete(id: number) {
    setReports((prev) => prev.filter((r) => r.id !== id));
    if (selectedId === id) setSelectedId(reports.find((r) => r.id !== id)?.id ?? null);
  }

  function startEdit(report: ErrorReport) {
    setEditingId(report.id);
    setEditDraft({
      department: report.department,
      category: report.category,
      severity: report.severity,
      description: report.description,
      rootCause: report.rootCause,
      correctiveAction: report.correctiveAction,
    });
  }

  function saveEdit() {
    if (editingId === null) return;
    setReports((prev) =>
      prev.map((r) => (r.id === editingId ? { ...r, ...editDraft } : r))
    );
    setEditingId(null);
    setEditDraft({});
  }

  function cancelEdit() {
    setEditingId(null);
    setEditDraft({});
  }

  // ── workflow actions ──
  function startInvestigation(id: number) {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "investigating" as const } : r))
    );
  }

  function addRootCause(id: number) {
    if (!rootCauseInput.trim()) return;
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, rootCause: rootCauseInput.trim() } : r))
    );
    setRootCauseInput("");
  }

  function startCorrection(id: number) {
    const report = reports.find((r) => r.id === id);
    if (!report || !report.rootCause) return;
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "correcting" as const } : r))
    );
  }

  function addCorrectiveAction(id: number) {
    if (!correctiveActionInput.trim()) return;
    setReports((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, correctiveAction: correctiveActionInput.trim() } : r
      )
    );
    setCorrectiveActionInput("");
  }

  function markResolved(id: number) {
    const report = reports.find((r) => r.id === id);
    if (!report || !report.correctiveAction) return;
    setReports((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "resolved" as const,
              resolvedDate: new Date().toISOString().split("T")[0],
            }
          : r
      )
    );
  }

  function closeReport(id: number) {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "closed" as const } : r))
    );
  }

  function reopenReport(id: number) {
    setReports((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: "reported" as const, resolvedDate: null }
          : r
      )
    );
  }

  // ── stats ──
  const totalReports = reports.length;
  const openReports = reports.filter(
    (r) => r.status !== "resolved" && r.status !== "closed"
  ).length;
  const criticalReports = reports.filter((r) => r.severity === "critical").length;
  const resolvedAndClosed = reports.filter(
    (r) => r.status === "resolved" || r.status === "closed"
  ).length;
  const resolutionRate =
    totalReports > 0 ? Math.round((resolvedAndClosed / totalReports) * 100) : 0;

  // ── category breakdown ──
  const categoryBreakdown = categories.map((cat) => {
    const count = reports.filter((r) => r.category === cat).length;
    return { category: cat, count };
  });

  // ── trend data (mock) ──
  const trendMonths = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb"];
  const trendReported = [3, 5, 2, 4, 3, 1];
  const trendResolved = [2, 4, 3, 3, 2, 1];
  const maxTrend = Math.max(...trendReported, ...trendResolved, 1);

  // ── render helpers ──
  function renderBadge(text: string, colorClass: string) {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
      >
        {text}
      </span>
    );
  }

  function renderWorkflowActions(report: ErrorReport) {
    const actions: JSX.Element[] = [];

    if (report.status === "reported") {
      actions.push(
        <Button
          key="investigate"
          size="sm"
          onClick={() => startInvestigation(report.id)}
          className="gap-1"
        >
          <ArrowRight className="h-3.5 w-3.5" /> Start Investigation
        </Button>
      );
    }

    if (report.status === "investigating") {
      if (!report.rootCause) {
        actions.push(
          <div key="rootcause" className="flex gap-2 items-start w-full">
            <textarea
              className="flex-1 border rounded-md p-2 text-sm min-h-[60px]"
              placeholder="Enter root cause analysis..."
              value={rootCauseInput}
              onChange={(e) => setRootCauseInput(e.target.value)}
            />
            <Button size="sm" onClick={() => addRootCause(report.id)} className="gap-1">
              <Save className="h-3.5 w-3.5" /> Save Root Cause
            </Button>
          </div>
        );
      }
      actions.push(
        <Button
          key="correct"
          size="sm"
          onClick={() => startCorrection(report.id)}
          disabled={!report.rootCause}
          className="gap-1"
        >
          <ArrowRight className="h-3.5 w-3.5" /> Start Correction
          {!report.rootCause && <span className="text-xs opacity-60 ml-1">(needs root cause)</span>}
        </Button>
      );
    }

    if (report.status === "correcting") {
      if (!report.correctiveAction) {
        actions.push(
          <div key="action" className="flex gap-2 items-start w-full">
            <textarea
              className="flex-1 border rounded-md p-2 text-sm min-h-[60px]"
              placeholder="Enter corrective action taken..."
              value={correctiveActionInput}
              onChange={(e) => setCorrectiveActionInput(e.target.value)}
            />
            <Button
              size="sm"
              onClick={() => addCorrectiveAction(report.id)}
              className="gap-1"
            >
              <Save className="h-3.5 w-3.5" /> Save Action
            </Button>
          </div>
        );
      }
      actions.push(
        <Button
          key="resolve"
          size="sm"
          onClick={() => markResolved(report.id)}
          disabled={!report.correctiveAction}
          className="gap-1 bg-green-600 hover:bg-green-700"
        >
          <CheckCircle2 className="h-3.5 w-3.5" /> Mark Resolved
          {!report.correctiveAction && (
            <span className="text-xs opacity-60 ml-1">(needs corrective action)</span>
          )}
        </Button>
      );
    }

    if (report.status === "resolved") {
      actions.push(
        <Button
          key="close"
          size="sm"
          variant="outline"
          onClick={() => closeReport(report.id)}
          className="gap-1"
        >
          <XCircle className="h-3.5 w-3.5" /> Close Report
        </Button>
      );
    }

    if (report.status === "closed") {
      actions.push(
        <Button
          key="reopen"
          size="sm"
          variant="outline"
          onClick={() => reopenReport(report.id)}
          className="gap-1"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reopen
        </Button>
      );
    }

    return <div className="flex flex-wrap gap-2 mt-2">{actions}</div>;
  }

  // ── JSX ──
  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <ShieldAlert className="h-6 w-6 text-red-600" />
              Continuous Improvement &amp; Error Tracking
            </h1>
            <p className="text-muted-foreground mt-1">
              Track, investigate and resolve quality issues across all departments
            </p>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="gap-2">
            <Plus className="h-4 w-4" /> New Error Report
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="dlos-card p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-50">
              <FileWarning className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Reports</p>
              <p className="text-2xl font-bold">{totalReports}</p>
            </div>
          </div>
          <div className="dlos-card p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-orange-50">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Open</p>
              <p className="text-2xl font-bold">{openReports}</p>
            </div>
          </div>
          <div className="dlos-card p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-red-50">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Critical</p>
              <p className="text-2xl font-bold">{criticalReports}</p>
            </div>
          </div>
          <div className="dlos-card p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-green-50">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Resolution Rate</p>
              <p className="text-2xl font-bold">{resolutionRate}%</p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left: Report List ── */}
          <div className="lg:col-span-1 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search reports..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <div className="flex-1">
                <select
                  className="w-full border rounded-md p-2 text-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="reported">Reported</option>
                  <option value="investigating">Investigating</option>
                  <option value="correcting">Correcting</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div className="flex-1">
                <select
                  className="w-full border rounded-md p-2 text-sm"
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                >
                  <option value="all">All Severities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            {/* Report list */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filtered.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No reports match your filters.
                </p>
              )}
              {filtered.map((r) => (
                <div
                  key={r.id}
                  onClick={() => setSelectedId(r.id)}
                  className={`dlos-card p-3 cursor-pointer transition-colors hover:border-primary/40 ${
                    selectedId === r.id ? "border-primary ring-1 ring-primary/20" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{r.reportId}</span>
                    {renderBadge(
                      r.severity.charAt(0).toUpperCase() + r.severity.slice(1),
                      severityColors[r.severity]
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{r.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">{r.department}</span>
                    {renderBadge(statusLabels[r.status], statusColors[r.status])}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Detail Panel ── */}
          <div className="lg:col-span-2">
            {!selected ? (
              <div className="dlos-card p-12 text-center text-muted-foreground">
                <FileWarning className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>Select a report to view details</p>
              </div>
            ) : editingId === selected.id ? (
              /* ── Edit Mode ── */
              <div className="dlos-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">{selected.reportId} — Edit</h2>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={saveEdit} className="gap-1">
                      <Save className="h-3.5 w-3.5" /> Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={cancelEdit} className="gap-1">
                      <X className="h-3.5 w-3.5" /> Cancel
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Department</label>
                    <select
                      className="w-full border rounded-md p-2 text-sm mt-1"
                      value={editDraft.department ?? ""}
                      onChange={(e) =>
                        setEditDraft((d) => ({ ...d, department: e.target.value }))
                      }
                    >
                      {departments.map((dep) => (
                        <option key={dep} value={dep}>
                          {dep}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <select
                      className="w-full border rounded-md p-2 text-sm mt-1"
                      value={editDraft.category ?? ""}
                      onChange={(e) =>
                        setEditDraft((d) => ({ ...d, category: e.target.value }))
                      }
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Severity</label>
                    <select
                      className="w-full border rounded-md p-2 text-sm mt-1"
                      value={editDraft.severity ?? "medium"}
                      onChange={(e) =>
                        setEditDraft((d) => ({
                          ...d,
                          severity: e.target.value as ErrorReport["severity"],
                        }))
                      }
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    className="w-full border rounded-md p-2 text-sm mt-1 min-h-[80px]"
                    value={editDraft.description ?? ""}
                    onChange={(e) =>
                      setEditDraft((d) => ({ ...d, description: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Root Cause</label>
                  <textarea
                    className="w-full border rounded-md p-2 text-sm mt-1 min-h-[60px]"
                    value={editDraft.rootCause ?? ""}
                    onChange={(e) =>
                      setEditDraft((d) => ({ ...d, rootCause: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Corrective Action</label>
                  <textarea
                    className="w-full border rounded-md p-2 text-sm mt-1 min-h-[60px]"
                    value={editDraft.correctiveAction ?? ""}
                    onChange={(e) =>
                      setEditDraft((d) => ({ ...d, correctiveAction: e.target.value }))
                    }
                  />
                </div>
              </div>
            ) : (
              /* ── View Mode ── */
              <div className="dlos-card p-6 space-y-5">
                {/* Header row */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-lg font-semibold">{selected.reportId}</h2>
                      {renderBadge(
                        selected.severity.charAt(0).toUpperCase() +
                          selected.severity.slice(1),
                        severityColors[selected.severity]
                      )}
                      {renderBadge(
                        statusLabels[selected.status],
                        statusColors[selected.status]
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Case: {selected.caseId} · Reported by {selected.reportedBy} on{" "}
                      {selected.reportedDate}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEdit(selected)}
                      className="gap-1"
                    >
                      <Edit2 className="h-3.5 w-3.5" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(selected.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </Button>
                  </div>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Department</p>
                    <p className="font-medium">{selected.department}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Category</p>
                    <p className="font-medium">{selected.category}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Severity</p>
                    <p className="font-medium capitalize">{selected.severity}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Resolved Date</p>
                    <p className="font-medium">{selected.resolvedDate ?? "—"}</p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-sm font-semibold mb-1">Description</h3>
                  <p className="text-sm">{selected.description}</p>
                </div>

                {/* Root Cause */}
                <div>
                  <h3 className="text-sm font-semibold mb-1">Root Cause</h3>
                  <p className="text-sm">
                    {selected.rootCause || (
                      <span className="text-muted-foreground italic">Not yet determined</span>
                    )}
                  </p>
                </div>

                {/* Corrective Action */}
                <div>
                  <h3 className="text-sm font-semibold mb-1">Corrective Action</h3>
                  <p className="text-sm">
                    {selected.correctiveAction || (
                      <span className="text-muted-foreground italic">Not yet defined</span>
                    )}
                  </p>
                </div>

                {/* Workflow Actions */}
                <div className="border-t pt-4">
                  <h3 className="text-sm font-semibold mb-2">Actions</h3>
                  {renderWorkflowActions(selected)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Bottom: Metrics ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Improvement Trends */}
          <div className="dlos-card p-5">
            <h3 className="text-base font-semibold flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4" /> Improvement Trends (6 Months)
            </h3>
            <div className="space-y-3">
              {trendMonths.map((month, i) => (
                <div key={month} className="flex items-center gap-3 text-sm">
                  <span className="w-8 text-muted-foreground">{month}</span>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 bg-gray-100 rounded-full h-4 relative overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-red-400 rounded-full"
                        style={{ width: `${(trendReported[i] / maxTrend) * 100}%` }}
                      />
                    </div>
                    <span className="w-4 text-xs text-red-600">{trendReported[i]}</span>
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 bg-gray-100 rounded-full h-4 relative overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-green-400 rounded-full"
                        style={{ width: `${(trendResolved[i] / maxTrend) * 100}%` }}
                      />
                    </div>
                    <span className="w-4 text-xs text-green-600">{trendResolved[i]}</span>
                  </div>
                </div>
              ))}
              <div className="flex gap-6 text-xs text-muted-foreground mt-2 justify-center">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-red-400 inline-block" /> Reported
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-green-400 inline-block" /> Resolved
                </span>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="dlos-card p-5">
            <h3 className="text-base font-semibold flex items-center gap-2 mb-4">
              <BarChart3 className="h-4 w-4" /> Category Breakdown
            </h3>
            <div className="space-y-3">
              {categoryBreakdown.map((item) => {
                const pct =
                  totalReports > 0
                    ? Math.round((item.count / totalReports) * 100)
                    : 0;
                return (
                  <div key={item.category} className="flex items-center gap-3 text-sm">
                    <span className="w-32 truncate">{item.category}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-4 relative overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-blue-500 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-16 text-right text-muted-foreground">
                      {item.count} ({pct}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Add Modal ── */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">New Error Report</h2>
                <button onClick={() => setShowAddModal(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Case ID</label>
                  <input
                    className="w-full border rounded-md p-2 text-sm mt-1"
                    value={formData.caseId}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, caseId: e.target.value }))
                    }
                    placeholder="e.g. CASE-1100"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Reported By</label>
                  <input
                    className="w-full border rounded-md p-2 text-sm mt-1"
                    value={formData.reportedBy}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, reportedBy: e.target.value }))
                    }
                    placeholder="Name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Department</label>
                  <select
                    className="w-full border rounded-md p-2 text-sm mt-1"
                    value={formData.department}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, department: e.target.value }))
                    }
                  >
                    {departments.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <select
                    className="w-full border rounded-md p-2 text-sm mt-1"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, category: e.target.value }))
                    }
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Severity</label>
                  <select
                    className="w-full border rounded-md p-2 text-sm mt-1"
                    value={formData.severity}
                    onChange={(e) =>
                      setFormData((f) => ({
                        ...f,
                        severity: e.target.value as ErrorReport["severity"],
                      }))
                    }
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Date</label>
                  <input
                    type="date"
                    className="w-full border rounded-md p-2 text-sm mt-1"
                    value={formData.reportedDate}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, reportedDate: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                  className="w-full border rounded-md p-2 text-sm mt-1 min-h-[80px]"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="Describe the error in detail..."
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAdd}
                  disabled={
                    !formData.caseId.trim() ||
                    !formData.reportedBy.trim() ||
                    !formData.description.trim()
                  }
                >
                  Create Report
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
