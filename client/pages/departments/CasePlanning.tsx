import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Plus, Check, X, AlertCircle, Clock, Trash2, Edit, Search,
  ChevronUp, ChevronDown, ClipboardList, Flag, UserCheck, Play,
  BookOpen, BarChart3,
} from "lucide-react";

interface PlanCase {
  id: string;
  caseId: string;
  doctor: string;
  patient: string;
  toothNumbers: string;
  restorationType: string;
  material: string;
  complexity: "simple" | "moderate" | "complex";
  assignedPlanner: string;
  status: "pending" | "planning" | "planned" | "flagged";
  planNotes: string;
  dueDate: string;
  createdDate: string;
}

const materialOptions = ["Zirconia", "E.max", "PFM", "Composite", "PMMA", "Titanium", "Gold", "Cobalt-Chrome"];
const restorationOptions = ["Crown", "Bridge", "Veneer", "Inlay/Onlay", "Implant Crown", "Full Arch", "Partial Denture", "Full Denture"];
const complexityOptions: PlanCase["complexity"][] = ["simple", "moderate", "complex"];
const plannerOptions = ["Dr. Ahmed Hassan", "Dr. Lisa Park", "Dr. Omar Khalil", "Dr. Nina Chen"];

const mockCases: PlanCase[] = [
  {
    id: "1", caseId: "CASE-2024-010", doctor: "Dr. John Smith", patient: "Jane Doe",
    toothNumbers: "#14", restorationType: "Crown", material: "Zirconia",
    complexity: "simple", assignedPlanner: "Dr. Ahmed Hassan",
    status: "pending", planNotes: "", dueDate: "2024-02-15", createdDate: "2024-02-10",
  },
  {
    id: "2", caseId: "CASE-2024-011", doctor: "Dr. Sarah Johnson", patient: "Michael Brown",
    toothNumbers: "#21, #22, #23", restorationType: "Bridge", material: "E.max",
    complexity: "complex", assignedPlanner: "Dr. Lisa Park",
    status: "planning", planNotes: "3-unit anterior bridge. Check occlusion carefully. Patient has deep bite.",
    dueDate: "2024-02-14", createdDate: "2024-02-09",
  },
  {
    id: "3", caseId: "CASE-2024-012", doctor: "Dr. Michael Brown", patient: "Emily Garcia",
    toothNumbers: "#36", restorationType: "Implant Crown", material: "Zirconia",
    complexity: "moderate", assignedPlanner: "Dr. Omar Khalil",
    status: "planned", planNotes: "Screw-retained implant crown. Custom abutment needed. Ti-base selected.",
    dueDate: "2024-02-16", createdDate: "2024-02-08",
  },
  {
    id: "4", caseId: "CASE-2024-013", doctor: "Dr. Emily Davis", patient: "Robert Wilson",
    toothNumbers: "#11, #21", restorationType: "Veneer", material: "E.max",
    complexity: "complex", assignedPlanner: "Dr. Nina Chen",
    status: "flagged", planNotes: "Shade mismatch concern. Adjacent teeth have heavy tetracycline staining. Need shade photo under multiple lighting conditions.",
    dueDate: "2024-02-13", createdDate: "2024-02-07",
  },
];

let nextId = 14;

export default function CasePlanning() {
  const [cases, setCases] = useState<PlanCase[]>(mockCases);
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [showAddCase, setShowAddCase] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  const [newCase, setNewCase] = useState({
    doctor: "", patient: "", toothNumbers: "", restorationType: "",
    material: "", complexity: "simple" as PlanCase["complexity"],
    assignedPlanner: "", planNotes: "", dueDate: "",
  });
  const [editData, setEditData] = useState<Partial<PlanCase>>({});

  const sel = cases.find((c) => c.id === selectedCase);

  const filtered = cases
    .filter((c) => {
      const s = searchTerm.toLowerCase();
      const matchSearch =
        !s ||
        c.caseId.toLowerCase().includes(s) ||
        c.doctor.toLowerCase().includes(s) ||
        c.patient.toLowerCase().includes(s) ||
        c.assignedPlanner.toLowerCase().includes(s);
      const matchFilter = !filterStatus || c.status === filterStatus;
      return matchSearch && matchFilter;
    })
    .sort((a, b) => {
      const d = new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
      return sortAsc ? d : -d;
    });

  const counts = {
    total: cases.length,
    planned: cases.filter((c) => c.status === "planned").length,
    planning: cases.filter((c) => c.status === "planning").length,
    flagged: cases.filter((c) => c.status === "flagged").length,
  };

  const handleAdd = () => {
    if (!newCase.doctor.trim() || !newCase.patient.trim()) return;
    const c: PlanCase = {
      id: Date.now().toString(),
      caseId: `CASE-2024-${String(nextId++).padStart(3, "0")}`,
      ...newCase,
      status: "pending",
      createdDate: new Date().toISOString().split("T")[0],
      dueDate: newCase.dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
    };
    setCases((prev) => [...prev, c]);
    setNewCase({
      doctor: "", patient: "", toothNumbers: "", restorationType: "",
      material: "", complexity: "simple", assignedPlanner: "", planNotes: "", dueDate: "",
    });
    setShowAddCase(false);
    setSelectedCase(c.id);
  };

  const handleDelete = (id: string) => {
    setCases((prev) => prev.filter((c) => c.id !== id));
    if (selectedCase === id) setSelectedCase(null);
  };

  const handleStartPlanning = (id: string) =>
    setCases((prev) => prev.map((c) => (c.id === id ? { ...c, status: "planning" as const } : c)));

  const handleMarkPlanned = (id: string) =>
    setCases((prev) => prev.map((c) => (c.id === id ? { ...c, status: "planned" as const } : c)));

  const handleFlagIssue = (id: string) =>
    setCases((prev) => prev.map((c) => (c.id === id ? { ...c, status: "flagged" as const } : c)));

  const handleReassign = (id: string, planner: string) =>
    setCases((prev) => prev.map((c) => (c.id === id ? { ...c, assignedPlanner: planner } : c)));

  const startEdit = () => {
    if (sel) {
      setEditData({ ...sel });
      setEditMode(true);
    }
  };

  const saveEdit = () => {
    if (!sel || !editData) return;
    setCases((prev) =>
      prev.map((c) =>
        c.id === sel.id
          ? {
              ...c,
              doctor: editData.doctor || c.doctor,
              patient: editData.patient || c.patient,
              toothNumbers: editData.toothNumbers ?? c.toothNumbers,
              restorationType: editData.restorationType ?? c.restorationType,
              material: editData.material ?? c.material,
              complexity: editData.complexity || c.complexity,
              assignedPlanner: editData.assignedPlanner ?? c.assignedPlanner,
              planNotes: editData.planNotes ?? c.planNotes,
              dueDate: editData.dueDate ?? c.dueDate,
            }
          : c,
      ),
    );
    setEditMode(false);
  };

  const statusColor = (s: string) => {
    if (s === "planned") return "bg-green-100 text-green-800";
    if (s === "planning") return "bg-blue-100 text-blue-800";
    if (s === "pending") return "bg-gray-100 text-gray-800";
    if (s === "flagged") return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  const complexityColor = (c: string) => {
    if (c === "simple") return "bg-green-100 text-green-800";
    if (c === "moderate") return "bg-amber-100 text-amber-800";
    if (c === "complex") return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  const inp =
    "w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Case Planning</h1>
        <p className="text-muted-foreground">
          Plan restorations, assign complexity, select materials, and prepare cases for production
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Cases", value: counts.total, icon: ClipboardList, color: "text-primary" },
          { label: "Planned", value: counts.planned, icon: Check, color: "text-green-600" },
          { label: "In Planning", value: counts.planning, icon: Clock, color: "text-blue-600" },
          { label: "Flagged", value: counts.flagged, icon: Flag, color: "text-red-600" },
        ].map((s) => (
          <div key={s.label} className="dlos-card">
            <div className="flex items-center gap-3 mb-3">
              <s.icon className={`w-5 h-5 ${s.color}`} />
              <span className="text-sm text-muted-foreground">{s.label}</span>
            </div>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: case list */}
        <div className="lg:col-span-1">
          <div className="dlos-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">Cases to Plan</h2>
              <Button size="sm" onClick={() => setShowAddCase(true)}>
                <Plus className="w-4 h-4 mr-2" />New
              </Button>
            </div>
            <div className="space-y-2 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search cases..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`${inp} pl-10`}
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className={`flex-1 ${inp} text-xs py-1.5`}
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="planning">Planning</option>
                  <option value="planned">Planned</option>
                  <option value="flagged">Flagged</option>
                </select>
                <button
                  onClick={() => setSortAsc(!sortAsc)}
                  className="px-2 py-1.5 rounded-md border border-border hover:bg-secondary text-xs flex items-center gap-1"
                >
                  Date {sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>
            </div>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { setSelectedCase(c.id); setEditMode(false); }}
                  className={`w-full text-left p-3 rounded-md border transition-all ${
                    selectedCase === c.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-semibold text-sm text-foreground">{c.caseId}</p>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${complexityColor(c.complexity)}`}>
                      {c.complexity}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {c.doctor} &bull; {c.patient}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Planner: {c.assignedPlanner || "Unassigned"}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded inline-block ${statusColor(c.status)}`}>
                      {c.status}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Due {new Date(c.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No cases found</p>
              )}
            </div>
          </div>
        </div>

        {/* Right: detail */}
        <div className="lg:col-span-2">
          {sel ? (
            <div className="dlos-card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-foreground">{sel.caseId}</h2>
                  <span className={`text-xs px-2 py-1 rounded inline-block mt-1 ${statusColor(sel.status)}`}>
                    {sel.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  {!editMode && (
                    <Button size="sm" variant="outline" onClick={startEdit}>
                      <Edit className="w-4 h-4 mr-1" />Edit
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(sel.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {editMode ? (
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Doctor *</label>
                      <input
                        type="text"
                        value={editData.doctor ?? ""}
                        onChange={(e) => setEditData({ ...editData, doctor: e.target.value })}
                        className={inp}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Patient *</label>
                      <input
                        type="text"
                        value={editData.patient ?? ""}
                        onChange={(e) => setEditData({ ...editData, patient: e.target.value })}
                        className={inp}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Tooth Numbers</label>
                      <input
                        type="text"
                        value={editData.toothNumbers ?? ""}
                        onChange={(e) => setEditData({ ...editData, toothNumbers: e.target.value })}
                        className={inp}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Restoration Type</label>
                      <select
                        value={editData.restorationType ?? ""}
                        onChange={(e) => setEditData({ ...editData, restorationType: e.target.value })}
                        className={inp}
                      >
                        <option value="">Select...</option>
                        {restorationOptions.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Material</label>
                      <select
                        value={editData.material ?? ""}
                        onChange={(e) => setEditData({ ...editData, material: e.target.value })}
                        className={inp}
                      >
                        <option value="">Select...</option>
                        {materialOptions.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Complexity</label>
                      <select
                        value={editData.complexity ?? "simple"}
                        onChange={(e) =>
                          setEditData({ ...editData, complexity: e.target.value as PlanCase["complexity"] })
                        }
                        className={inp}
                      >
                        {complexityOptions.map((c) => (
                          <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Assigned Planner</label>
                      <select
                        value={editData.assignedPlanner ?? ""}
                        onChange={(e) => setEditData({ ...editData, assignedPlanner: e.target.value })}
                        className={inp}
                      >
                        <option value="">Select planner...</option>
                        {plannerOptions.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Due Date</label>
                      <input
                        type="date"
                        value={editData.dueDate ?? ""}
                        onChange={(e) => setEditData({ ...editData, dueDate: e.target.value })}
                        className={inp}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Plan Notes</label>
                    <textarea
                      value={editData.planNotes ?? ""}
                      onChange={(e) => setEditData({ ...editData, planNotes: e.target.value })}
                      rows={4}
                      className={`${inp} resize-none`}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
                    <Button onClick={saveEdit}>
                      <Check className="w-4 h-4 mr-2" />Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {([
                      ["Doctor", sel.doctor],
                      ["Patient", sel.patient],
                      ["Tooth Numbers", sel.toothNumbers],
                      ["Restoration", sel.restorationType],
                      ["Material", sel.material],
                      ["Created", new Date(sel.createdDate).toLocaleDateString()],
                      ["Due Date", new Date(sel.dueDate).toLocaleDateString()],
                    ] as [string, string][]).map(([label, val]) => (
                      <div key={label}>
                        <p className="text-xs text-muted-foreground mb-1">{label}</p>
                        <p className="font-semibold text-foreground">{val || "\u2014"}</p>
                      </div>
                    ))}
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Complexity</p>
                      <span className={`text-xs px-2 py-1 rounded font-semibold ${complexityColor(sel.complexity)}`}>
                        {sel.complexity}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Assigned Planner</p>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground">{sel.assignedPlanner || "\u2014"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Reassign planner */}
                  <div className="mb-6 p-3 bg-secondary/30 rounded-md">
                    <label className="block text-xs text-muted-foreground mb-2">Reassign Planner</label>
                    <div className="flex gap-2">
                      <select
                        className={`flex-1 ${inp} text-xs`}
                        defaultValue={sel.assignedPlanner}
                        onChange={(e) => handleReassign(sel.id, e.target.value)}
                      >
                        <option value="">Select planner...</option>
                        {plannerOptions.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                      <UserCheck className="w-5 h-5 text-muted-foreground mt-2" />
                    </div>
                  </div>

                  {sel.planNotes && (
                    <div className="mb-6">
                      <p className="text-xs text-muted-foreground mb-1">Plan Notes</p>
                      <p className="text-sm bg-secondary/30 p-3 rounded-md">{sel.planNotes}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-6 border-t border-border">
                    {sel.status === "pending" && (
                      <Button className="flex-1" onClick={() => handleStartPlanning(sel.id)}>
                        <Play className="w-4 h-4 mr-2" />Start Planning
                      </Button>
                    )}
                    {sel.status === "planning" && (
                      <Button className="flex-1" onClick={() => handleMarkPlanned(sel.id)}>
                        <Check className="w-4 h-4 mr-2" />Mark as Planned
                      </Button>
                    )}
                    {sel.status === "planned" && (
                      <div className="flex-1 flex items-center justify-center gap-2 text-green-600 font-semibold">
                        <Check className="w-5 h-5" />Planned — Ready for Production
                      </div>
                    )}
                    {sel.status === "flagged" && (
                      <Button variant="outline" className="flex-1" onClick={() => handleStartPlanning(sel.id)}>
                        <Play className="w-4 h-4 mr-2" />Resume Planning
                      </Button>
                    )}
                    {sel.status !== "flagged" && sel.status !== "planned" && (
                      <Button
                        variant="outline"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => handleFlagIssue(sel.id)}
                      >
                        <Flag className="w-4 h-4 mr-2" />Flag Issue
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="dlos-card flex items-center justify-center min-h-[300px]">
              <p className="text-muted-foreground">Select a case to view planning details</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom info cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="dlos-card">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Material Selection Guide</h3>
          </div>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex justify-between items-start p-2 rounded bg-secondary/30">
              <div>
                <p className="font-semibold text-foreground">Zirconia</p>
                <p>High strength, posterior restorations, bruxism patients</p>
              </div>
            </div>
            <div className="flex justify-between items-start p-2 rounded bg-secondary/30">
              <div>
                <p className="font-semibold text-foreground">E.max (Lithium Disilicate)</p>
                <p>Excellent aesthetics, anterior restorations, veneers</p>
              </div>
            </div>
            <div className="flex justify-between items-start p-2 rounded bg-secondary/30">
              <div>
                <p className="font-semibold text-foreground">PFM</p>
                <p>Proven track record, full coverage, long-span bridges</p>
              </div>
            </div>
            <div className="flex justify-between items-start p-2 rounded bg-secondary/30">
              <div>
                <p className="font-semibold text-foreground">Composite / PMMA</p>
                <p>Temporaries, provisional restorations, cost-effective</p>
              </div>
            </div>
            <div className="flex justify-between items-start p-2 rounded bg-secondary/30">
              <div>
                <p className="font-semibold text-foreground">Titanium / Cobalt-Chrome</p>
                <p>Implant frameworks, metal substructures, partial dentures</p>
              </div>
            </div>
          </div>
        </div>
        <div className="dlos-card">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Complexity Decision Matrix</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="p-3 rounded-md bg-green-50 border border-green-200">
              <p className="font-semibold text-green-800 mb-1">Simple</p>
              <ul className="space-y-1 text-green-700">
                <li>&bull; Single unit crowns with standard prep</li>
                <li>&bull; Standard shade matching</li>
                <li>&bull; No occlusal adjustments required</li>
                <li>&bull; Turnaround: 3-5 business days</li>
              </ul>
            </div>
            <div className="p-3 rounded-md bg-amber-50 border border-amber-200">
              <p className="font-semibold text-amber-800 mb-1">Moderate</p>
              <ul className="space-y-1 text-amber-700">
                <li>&bull; Multi-unit bridges (up to 3 units)</li>
                <li>&bull; Implant-supported restorations</li>
                <li>&bull; Custom shade or staining required</li>
                <li>&bull; Turnaround: 5-7 business days</li>
              </ul>
            </div>
            <div className="p-3 rounded-md bg-red-50 border border-red-200">
              <p className="font-semibold text-red-800 mb-1">Complex</p>
              <ul className="space-y-1 text-red-700">
                <li>&bull; Full arch restorations</li>
                <li>&bull; Multi-unit bridges (4+ units)</li>
                <li>&bull; Combination of materials</li>
                <li>&bull; Complex occlusal rehabilitation</li>
                <li>&bull; Turnaround: 7-14 business days</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Add Case Modal */}
      {showAddCase && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border border-border shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">New Case Plan</h2>
              <button
                onClick={() => setShowAddCase(false)}
                className="p-1 hover:bg-secondary rounded-md"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Doctor *</label>
                  <input
                    type="text"
                    value={newCase.doctor}
                    onChange={(e) => setNewCase({ ...newCase, doctor: e.target.value })}
                    placeholder="Dr. Jane Smith"
                    className={inp}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Patient *</label>
                  <input
                    type="text"
                    value={newCase.patient}
                    onChange={(e) => setNewCase({ ...newCase, patient: e.target.value })}
                    placeholder="Patient name"
                    className={inp}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tooth Numbers</label>
                  <input
                    type="text"
                    value={newCase.toothNumbers}
                    onChange={(e) => setNewCase({ ...newCase, toothNumbers: e.target.value })}
                    placeholder="#14, #15"
                    className={inp}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Restoration Type</label>
                  <select
                    value={newCase.restorationType}
                    onChange={(e) => setNewCase({ ...newCase, restorationType: e.target.value })}
                    className={inp}
                  >
                    <option value="">Select...</option>
                    {restorationOptions.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Material</label>
                  <select
                    value={newCase.material}
                    onChange={(e) => setNewCase({ ...newCase, material: e.target.value })}
                    className={inp}
                  >
                    <option value="">Select...</option>
                    {materialOptions.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Complexity</label>
                  <select
                    value={newCase.complexity}
                    onChange={(e) =>
                      setNewCase({ ...newCase, complexity: e.target.value as PlanCase["complexity"] })
                    }
                    className={inp}
                  >
                    {complexityOptions.map((c) => (
                      <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Assigned Planner</label>
                  <select
                    value={newCase.assignedPlanner}
                    onChange={(e) => setNewCase({ ...newCase, assignedPlanner: e.target.value })}
                    className={inp}
                  >
                    <option value="">Select planner...</option>
                    {plannerOptions.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newCase.dueDate}
                    onChange={(e) => setNewCase({ ...newCase, dueDate: e.target.value })}
                    className={inp}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Plan Notes</label>
                <textarea
                  value={newCase.planNotes}
                  onChange={(e) => setNewCase({ ...newCase, planNotes: e.target.value })}
                  rows={3}
                  placeholder="Planning notes, special considerations..."
                  className={`${inp} resize-none`}
                />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-border justify-end">
              <Button variant="outline" onClick={() => setShowAddCase(false)}>Cancel</Button>
              <Button
                onClick={handleAdd}
                disabled={!newCase.doctor.trim() || !newCase.patient.trim()}
              >
                <Plus className="w-4 h-4 mr-2" />Create Case Plan
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
