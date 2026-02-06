import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Plus, Check, X, AlertCircle, Clock, Trash2, Edit, Search,
  ScanLine, Eye, RefreshCw, UserCheck, Monitor, Smartphone, Hand,
  BarChart3, Star, ChevronRight,
} from "lucide-react";

interface ScanCase {
  id: string;
  caseId: string;
  doctor: string;
  patient: string;
  scanMethod: "desktop" | "intraoral" | "impression";
  scanQuality: "excellent" | "good" | "fair" | "poor" | "pending";
  status: "waiting" | "scanning" | "review" | "approved" | "rejected";
  assignedTechnician: string;
  scanDate: string;
  notes: string;
  resolution: string;
}

const technicians = ["Omar Al-Rashid", "Layla Mansour", "Tariq Hassan", "Nadia Khalil"];

const mockCases: ScanCase[] = [
  {
    id: "1",
    caseId: "CASE-2024-010",
    doctor: "Dr. John Smith",
    patient: "Jane Doe",
    scanMethod: "desktop",
    scanQuality: "excellent",
    status: "approved",
    assignedTechnician: "Omar Al-Rashid",
    scanDate: "2024-02-10",
    notes: "Clean margins, excellent detail capture",
    resolution: "high",
  },
  {
    id: "2",
    caseId: "CASE-2024-011",
    doctor: "Dr. Sarah Johnson",
    patient: "Michael Brown",
    scanMethod: "intraoral",
    scanQuality: "pending",
    status: "waiting",
    assignedTechnician: "Layla Mansour",
    scanDate: "",
    notes: "Intraoral scan file received from clinic",
    resolution: "high",
  },
  {
    id: "3",
    caseId: "CASE-2024-012",
    doctor: "Dr. Michael Brown",
    patient: "Emily Garcia",
    scanMethod: "impression",
    scanQuality: "good",
    status: "review",
    assignedTechnician: "Tariq Hassan",
    scanDate: "2024-02-09",
    notes: "Poured model scanned, minor bubble on #14 distal",
    resolution: "standard",
  },
  {
    id: "4",
    caseId: "CASE-2024-013",
    doctor: "Dr. Lisa Chen",
    patient: "Robert Wilson",
    scanMethod: "desktop",
    scanQuality: "poor",
    status: "rejected",
    assignedTechnician: "Nadia Khalil",
    scanDate: "2024-02-08",
    notes: "Incomplete scan data — margin not captured on buccal side",
    resolution: "high",
  },
];

let nextId = 14;

const statusColor: Record<ScanCase["status"], string> = {
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  scanning: "bg-blue-100 text-blue-800",
  review: "bg-amber-100 text-amber-800",
  waiting: "bg-gray-100 text-gray-700",
};

const qualityColor: Record<ScanCase["scanQuality"], string> = {
  excellent: "text-green-600",
  good: "text-blue-600",
  fair: "text-amber-600",
  poor: "text-red-600",
  pending: "text-gray-500",
};

const methodIcon: Record<ScanCase["scanMethod"], React.ReactNode> = {
  desktop: <Monitor className="w-4 h-4" />,
  intraoral: <Smartphone className="w-4 h-4" />,
  impression: <Hand className="w-4 h-4" />,
};

function blankCase(): Omit<ScanCase, "id"> {
  return {
    caseId: "",
    doctor: "",
    patient: "",
    scanMethod: "desktop",
    scanQuality: "pending",
    status: "waiting",
    assignedTechnician: technicians[0],
    scanDate: "",
    notes: "",
    resolution: "high",
  };
}

export default function ModelScan() {
  const [cases, setCases] = useState<ScanCase[]>(mockCases);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<ScanCase["status"] | "all">("all");
  const [draft, setDraft] = useState<Omit<ScanCase, "id">>(blankCase());
  const [editDraft, setEditDraft] = useState<ScanCase | null>(null);

  const selected = cases.find((c) => c.id === selectedId) ?? null;

  /* ---------- helpers ---------- */
  const filtered = cases.filter((c) => {
    const matchSearch =
      c.caseId.toLowerCase().includes(search.toLowerCase()) ||
      c.patient.toLowerCase().includes(search.toLowerCase()) ||
      c.doctor.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: cases.length,
    approved: cases.filter((c) => c.status === "approved").length,
    inProgress: cases.filter((c) => c.status === "scanning" || c.status === "review").length,
    rejected: cases.filter((c) => c.status === "rejected").length,
  };

  const qualityCounts = {
    excellent: cases.filter((c) => c.scanQuality === "excellent").length,
    good: cases.filter((c) => c.scanQuality === "good").length,
    fair: cases.filter((c) => c.scanQuality === "fair").length,
    poor: cases.filter((c) => c.scanQuality === "poor").length,
    pending: cases.filter((c) => c.scanQuality === "pending").length,
  };

  /* ---------- actions ---------- */
  function addCase() {
    const id = String(nextId++);
    const newCase: ScanCase = { ...draft, id, caseId: draft.caseId || `CASE-${Date.now()}` };
    setCases((prev) => [...prev, newCase]);
    setDraft(blankCase());
    setShowAdd(false);
    setSelectedId(id);
  }

  function deleteCase(id: string) {
    setCases((prev) => prev.filter((c) => c.id !== id));
    if (selectedId === id) { setSelectedId(null); setEditMode(false); }
  }

  function updateStatus(id: string, status: ScanCase["status"]) {
    setCases((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status, scanDate: status === "scanning" && !c.scanDate ? new Date().toISOString().slice(0, 10) : c.scanDate }
          : c,
      ),
    );
  }

  function reassignTechnician(id: string, tech: string) {
    setCases((prev) => prev.map((c) => (c.id === id ? { ...c, assignedTechnician: tech } : c)));
  }

  function startEdit() {
    if (!selected) return;
    setEditDraft({ ...selected });
    setEditMode(true);
  }

  function saveEdit() {
    if (!editDraft) return;
    setCases((prev) => prev.map((c) => (c.id === editDraft.id ? editDraft : c)));
    setEditMode(false);
    setEditDraft(null);
  }

  function cancelEdit() {
    setEditMode(false);
    setEditDraft(null);
  }

  /* ---------- render helpers ---------- */
  const fieldLabel = "block text-xs font-medium text-muted-foreground mb-1";
  const fieldInput =
    "w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary";

  /* ---------- UI ---------- */
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <ScanLine className="w-7 h-7 text-primary" />
              Model &amp; Scan Department
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Digital scanning, model management &amp; quality assessment
            </p>
          </div>
          <Button onClick={() => { setShowAdd(true); setDraft(blankCase()); }} className="gap-2">
            <Plus className="w-4 h-4" /> Add Scan Case
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Scans", value: stats.total, icon: <BarChart3 className="w-5 h-5 text-primary" /> },
            { label: "Approved", value: stats.approved, icon: <Check className="w-5 h-5 text-green-600" /> },
            { label: "In Progress", value: stats.inProgress, icon: <Clock className="w-5 h-5 text-blue-600" /> },
            { label: "Rejected", value: stats.rejected, icon: <AlertCircle className="w-5 h-5 text-red-600" /> },
          ].map((s) => (
            <div key={s.label} className="dlos-card rounded-xl border border-border bg-card p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary">{s.icon}</div>
              <div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Add Modal */}
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">New Scan Case</h2>
                <button onClick={() => setShowAdd(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={fieldLabel}>Case ID</label>
                  <input className={fieldInput} value={draft.caseId} onChange={(e) => setDraft({ ...draft, caseId: e.target.value })} placeholder="CASE-2024-XXX" />
                </div>
                <div>
                  <label className={fieldLabel}>Doctor</label>
                  <input className={fieldInput} value={draft.doctor} onChange={(e) => setDraft({ ...draft, doctor: e.target.value })} />
                </div>
                <div>
                  <label className={fieldLabel}>Patient</label>
                  <input className={fieldInput} value={draft.patient} onChange={(e) => setDraft({ ...draft, patient: e.target.value })} />
                </div>
                <div>
                  <label className={fieldLabel}>Scan Method</label>
                  <select className={fieldInput} value={draft.scanMethod} onChange={(e) => setDraft({ ...draft, scanMethod: e.target.value as ScanCase["scanMethod"] })}>
                    <option value="desktop">Desktop Scanner</option>
                    <option value="intraoral">Intraoral Scanner</option>
                    <option value="impression">Impression / Model</option>
                  </select>
                </div>
                <div>
                  <label className={fieldLabel}>Resolution</label>
                  <select className={fieldInput} value={draft.resolution} onChange={(e) => setDraft({ ...draft, resolution: e.target.value })}>
                    <option value="high">High</option>
                    <option value="standard">Standard</option>
                  </select>
                </div>
                <div>
                  <label className={fieldLabel}>Assigned Technician</label>
                  <select className={fieldInput} value={draft.assignedTechnician} onChange={(e) => setDraft({ ...draft, assignedTechnician: e.target.value })}>
                    {technicians.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={fieldLabel}>Notes</label>
                <textarea className={fieldInput} rows={2} value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
                <Button onClick={addCase} disabled={!draft.doctor || !draft.patient}>Create</Button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content – list + detail */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Case list (1/3) */}
          <div className="lg:col-span-1 space-y-3">
            {/* Search & Filter */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
                <input
                  className="w-full rounded-md border border-border bg-background pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Search cases..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select
                className="rounded-md border border-border bg-background px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as ScanCase["status"] | "all")}
              >
                <option value="all">All</option>
                <option value="waiting">Waiting</option>
                <option value="scanning">Scanning</option>
                <option value="review">Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* List */}
            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              {filtered.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">No cases found.</p>
              )}
              {filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { setSelectedId(c.id); setEditMode(false); setEditDraft(null); }}
                  className={`dlos-card w-full text-left rounded-lg border p-3 transition-colors ${
                    selectedId === c.id ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-foreground">{c.caseId}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[c.status]}`}>
                      {c.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{c.patient} — {c.doctor}</p>
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                    {methodIcon[c.scanMethod]}
                    <span className="capitalize">{c.scanMethod}</span>
                    <ChevronRight className="w-3 h-3 ml-auto" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Detail panel (2/3) */}
          <div className="lg:col-span-2">
            {!selected ? (
              <div className="dlos-card rounded-xl border border-border bg-card flex flex-col items-center justify-center py-24 text-muted-foreground">
                <Eye className="w-10 h-10 mb-3" />
                <p className="text-sm">Select a case from the list to view details</p>
              </div>
            ) : editMode && editDraft ? (
              /* ---- Edit Mode ---- */
              <div className="dlos-card rounded-xl border border-border bg-card p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">Edit — {editDraft.caseId}</h2>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={cancelEdit}>Cancel</Button>
                    <Button size="sm" onClick={saveEdit}>Save</Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={fieldLabel}>Case ID</label>
                    <input className={fieldInput} value={editDraft.caseId} onChange={(e) => setEditDraft({ ...editDraft, caseId: e.target.value })} />
                  </div>
                  <div>
                    <label className={fieldLabel}>Doctor</label>
                    <input className={fieldInput} value={editDraft.doctor} onChange={(e) => setEditDraft({ ...editDraft, doctor: e.target.value })} />
                  </div>
                  <div>
                    <label className={fieldLabel}>Patient</label>
                    <input className={fieldInput} value={editDraft.patient} onChange={(e) => setEditDraft({ ...editDraft, patient: e.target.value })} />
                  </div>
                  <div>
                    <label className={fieldLabel}>Scan Method</label>
                    <select className={fieldInput} value={editDraft.scanMethod} onChange={(e) => setEditDraft({ ...editDraft, scanMethod: e.target.value as ScanCase["scanMethod"] })}>
                      <option value="desktop">Desktop Scanner</option>
                      <option value="intraoral">Intraoral Scanner</option>
                      <option value="impression">Impression / Model</option>
                    </select>
                  </div>
                  <div>
                    <label className={fieldLabel}>Scan Quality</label>
                    <select className={fieldInput} value={editDraft.scanQuality} onChange={(e) => setEditDraft({ ...editDraft, scanQuality: e.target.value as ScanCase["scanQuality"] })}>
                      <option value="pending">Pending</option>
                      <option value="excellent">Excellent</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="poor">Poor</option>
                    </select>
                  </div>
                  <div>
                    <label className={fieldLabel}>Status</label>
                    <select className={fieldInput} value={editDraft.status} onChange={(e) => setEditDraft({ ...editDraft, status: e.target.value as ScanCase["status"] })}>
                      <option value="waiting">Waiting</option>
                      <option value="scanning">Scanning</option>
                      <option value="review">Review</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <div>
                    <label className={fieldLabel}>Resolution</label>
                    <select className={fieldInput} value={editDraft.resolution} onChange={(e) => setEditDraft({ ...editDraft, resolution: e.target.value })}>
                      <option value="high">High</option>
                      <option value="standard">Standard</option>
                    </select>
                  </div>
                  <div>
                    <label className={fieldLabel}>Assigned Technician</label>
                    <select className={fieldInput} value={editDraft.assignedTechnician} onChange={(e) => setEditDraft({ ...editDraft, assignedTechnician: e.target.value })}>
                      {technicians.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={fieldLabel}>Scan Date</label>
                    <input type="date" className={fieldInput} value={editDraft.scanDate} onChange={(e) => setEditDraft({ ...editDraft, scanDate: e.target.value })} />
                  </div>
                </div>

                <div>
                  <label className={fieldLabel}>Notes</label>
                  <textarea className={fieldInput} rows={3} value={editDraft.notes} onChange={(e) => setEditDraft({ ...editDraft, notes: e.target.value })} />
                </div>
              </div>
            ) : (
              /* ---- View Mode ---- */
              <div className="dlos-card rounded-xl border border-border bg-card p-6 space-y-5">
                {/* Top bar */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-lg font-semibold text-foreground">{selected.caseId}</h2>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1" onClick={startEdit}>
                      <Edit className="w-3.5 h-3.5" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1 text-red-600 hover:bg-red-50" onClick={() => deleteCase(selected.id)}>
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </Button>
                  </div>
                </div>

                {/* Status badge */}
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${statusColor[selected.status]}`}>
                    {selected.status.toUpperCase()}
                  </span>
                  <span className={`text-xs font-medium flex items-center gap-1 ${qualityColor[selected.scanQuality]}`}>
                    <Star className="w-3.5 h-3.5" /> Quality: {selected.scanQuality}
                  </span>
                </div>

                {/* Fields grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                  <div><p className="text-xs text-muted-foreground">Doctor</p><p className="font-medium text-foreground">{selected.doctor}</p></div>
                  <div><p className="text-xs text-muted-foreground">Patient</p><p className="font-medium text-foreground">{selected.patient}</p></div>
                  <div>
                    <p className="text-xs text-muted-foreground">Scan Method</p>
                    <p className="font-medium text-foreground flex items-center gap-1.5">{methodIcon[selected.scanMethod]} <span className="capitalize">{selected.scanMethod}</span></p>
                  </div>
                  <div><p className="text-xs text-muted-foreground">Resolution</p><p className="font-medium text-foreground capitalize">{selected.resolution}</p></div>
                  <div><p className="text-xs text-muted-foreground">Technician</p><p className="font-medium text-foreground">{selected.assignedTechnician}</p></div>
                  <div><p className="text-xs text-muted-foreground">Scan Date</p><p className="font-medium text-foreground">{selected.scanDate || "—"}</p></div>
                </div>

                {selected.notes && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Notes</p>
                    <p className="text-sm text-foreground bg-secondary/40 rounded-md px-3 py-2">{selected.notes}</p>
                  </div>
                )}

                {/* Reassign Technician */}
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-muted-foreground" />
                  <label className="text-xs font-medium text-muted-foreground">Reassign:</label>
                  <select
                    className="rounded-md border border-border bg-background px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                    value={selected.assignedTechnician}
                    onChange={(e) => reassignTechnician(selected.id, e.target.value)}
                  >
                    {technicians.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                  {selected.status === "waiting" && (
                    <Button size="sm" className="gap-1 bg-blue-600 hover:bg-blue-700" onClick={() => updateStatus(selected.id, "scanning")}>
                      <ScanLine className="w-3.5 h-3.5" /> Start Scanning
                    </Button>
                  )}
                  {selected.status === "scanning" && (
                    <Button size="sm" className="gap-1 bg-amber-600 hover:bg-amber-700" onClick={() => updateStatus(selected.id, "review")}>
                      <Eye className="w-3.5 h-3.5" /> Submit for Review
                    </Button>
                  )}
                  {selected.status === "review" && (
                    <>
                      <Button size="sm" className="gap-1 bg-green-600 hover:bg-green-700" onClick={() => updateStatus(selected.id, "approved")}>
                        <Check className="w-3.5 h-3.5" /> Approve Scan
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1 text-red-600 border-red-300 hover:bg-red-50" onClick={() => updateStatus(selected.id, "rejected")}>
                        <X className="w-3.5 h-3.5" /> Reject / Request Rescan
                      </Button>
                    </>
                  )}
                  {selected.status === "rejected" && (
                    <Button size="sm" className="gap-1" onClick={() => updateStatus(selected.id, "waiting")}>
                      <RefreshCw className="w-3.5 h-3.5" /> Restart Scan Process
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quality Assessment Section */}
        <div className="dlos-card rounded-xl border border-border bg-card p-6">
          <h3 className="text-md font-semibold text-foreground mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" /> Quality Assessment Overview
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {(["excellent", "good", "fair", "poor", "pending"] as const).map((q) => {
              const colors: Record<string, string> = {
                excellent: "bg-green-50 border-green-200 text-green-700",
                good: "bg-blue-50 border-blue-200 text-blue-700",
                fair: "bg-amber-50 border-amber-200 text-amber-700",
                poor: "bg-red-50 border-red-200 text-red-700",
                pending: "bg-gray-50 border-gray-200 text-gray-600",
              };
              return (
                <div key={q} className={`rounded-lg border p-3 text-center ${colors[q]}`}>
                  <p className="text-2xl font-bold">{qualityCounts[q]}</p>
                  <p className="text-xs font-medium capitalize mt-1">{q}</p>
                </div>
              );
            })}
          </div>
          {cases.length > 0 && (
            <div className="mt-4">
              <div className="flex h-3 rounded-full overflow-hidden bg-gray-100">
                {qualityCounts.excellent > 0 && <div className="bg-green-500" style={{ width: `${(qualityCounts.excellent / cases.length) * 100}%` }} />}
                {qualityCounts.good > 0 && <div className="bg-blue-500" style={{ width: `${(qualityCounts.good / cases.length) * 100}%` }} />}
                {qualityCounts.fair > 0 && <div className="bg-amber-500" style={{ width: `${(qualityCounts.fair / cases.length) * 100}%` }} />}
                {qualityCounts.poor > 0 && <div className="bg-red-500" style={{ width: `${(qualityCounts.poor / cases.length) * 100}%` }} />}
                {qualityCounts.pending > 0 && <div className="bg-gray-400" style={{ width: `${(qualityCounts.pending / cases.length) * 100}%` }} />}
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>Excellent</span><span>Good</span><span>Fair</span><span>Poor</span><span>Pending</span>
              </div>
            </div>
          )}
        </div>

        {/* Scan Method Comparison Guide */}
        <div className="dlos-card rounded-xl border border-border bg-card p-6">
          <h3 className="text-md font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" /> Scan Method Comparison Guide
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-2 font-medium text-muted-foreground">Feature</th>
                  <th className="pb-2 font-medium text-muted-foreground"><span className="flex items-center gap-1"><Monitor className="w-4 h-4" /> Desktop</span></th>
                  <th className="pb-2 font-medium text-muted-foreground"><span className="flex items-center gap-1"><Smartphone className="w-4 h-4" /> Intraoral</span></th>
                  <th className="pb-2 font-medium text-muted-foreground"><span className="flex items-center gap-1"><Hand className="w-4 h-4" /> Impression</span></th>
                </tr>
              </thead>
              <tbody className="text-foreground">
                <tr className="border-b border-border/50">
                  <td className="py-2 text-muted-foreground">Accuracy</td>
                  <td className="py-2 text-green-600 font-medium">Very High</td>
                  <td className="py-2 text-blue-600 font-medium">High</td>
                  <td className="py-2 text-amber-600 font-medium">Moderate</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 text-muted-foreground">Speed</td>
                  <td className="py-2">Moderate</td>
                  <td className="py-2 text-green-600 font-medium">Fast</td>
                  <td className="py-2">Slow (requires pouring)</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 text-muted-foreground">Patient Comfort</td>
                  <td className="py-2">N/A (lab-side)</td>
                  <td className="py-2 text-green-600 font-medium">Comfortable</td>
                  <td className="py-2 text-red-600">Less Comfortable</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 text-muted-foreground">Detail Capture</td>
                  <td className="py-2 text-green-600 font-medium">Excellent margins</td>
                  <td className="py-2">Good, moisture-sensitive</td>
                  <td className="py-2">Depends on impression quality</td>
                </tr>
                <tr>
                  <td className="py-2 text-muted-foreground">Best For</td>
                  <td className="py-2">Lab models, die scanning</td>
                  <td className="py-2">Direct digital workflow</td>
                  <td className="py-2">Legacy / analog workflow</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
