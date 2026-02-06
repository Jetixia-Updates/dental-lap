import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Search,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  Circle,
  Play,
  Send,
  RotateCcw,
  XCircle,
  Sparkles,
  ClipboardCheck,
  X,
  Save,
  AlertTriangle,
} from "lucide-react";

interface FinishingCase {
  id: number;
  caseId: string;
  doctor: string;
  patient: string;
  restorationType: string;
  material: string;
  status: "waiting" | "in-progress" | "qc-ready" | "completed" | "rejected";
  assignedTechnician: string;
  checklist: {
    surfacePolish: boolean;
    shadeAdjustment: boolean;
    glazeFiring: boolean;
    finalCleaning: boolean;
  };
  startDate: string;
  completedDate: string | null;
  notes: string;
}

const initialCases: FinishingCase[] = [
  {
    id: 1,
    caseId: "FIN-2401",
    doctor: "Dr. Sarah Mitchell",
    patient: "James Wilson",
    restorationType: "Crown - Anterior",
    material: "Lithium Disilicate",
    status: "in-progress",
    assignedTechnician: "Maria Lopez",
    checklist: {
      surfacePolish: true,
      shadeAdjustment: true,
      glazeFiring: false,
      finalCleaning: false,
    },
    startDate: "2026-02-04",
    completedDate: null,
    notes: "Shade A2, needs careful polishing on buccal surface.",
  },
  {
    id: 2,
    caseId: "FIN-2402",
    doctor: "Dr. Ahmed Khalil",
    patient: "Linda Torres",
    restorationType: "Bridge - 3 Unit",
    material: "Zirconia",
    status: "waiting",
    assignedTechnician: "Tom Brennan",
    checklist: {
      surfacePolish: false,
      shadeAdjustment: false,
      glazeFiring: false,
      finalCleaning: false,
    },
    startDate: "2026-02-05",
    completedDate: null,
    notes: "High-translucency zirconia, extra glaze layer requested.",
  },
  {
    id: 3,
    caseId: "FIN-2403",
    doctor: "Dr. Emily Chen",
    patient: "Robert Davis",
    restorationType: "Veneer - 6 Units",
    material: "Feldspathic Porcelain",
    status: "qc-ready",
    assignedTechnician: "Maria Lopez",
    checklist: {
      surfacePolish: true,
      shadeAdjustment: true,
      glazeFiring: true,
      finalCleaning: true,
    },
    startDate: "2026-02-01",
    completedDate: null,
    notes: "Minimal adjustment needed. Ready for QC inspection.",
  },
  {
    id: 4,
    caseId: "FIN-2404",
    doctor: "Dr. John Park",
    patient: "Susan Garcia",
    restorationType: "Inlay",
    material: "E-max CAD",
    status: "completed",
    assignedTechnician: "Tom Brennan",
    checklist: {
      surfacePolish: true,
      shadeAdjustment: true,
      glazeFiring: true,
      finalCleaning: true,
    },
    startDate: "2026-01-28",
    completedDate: "2026-02-03",
    notes: "Completed. Excellent fit and shade match confirmed by QC.",
  },
];

const statusColors: Record<FinishingCase["status"], string> = {
  waiting: "bg-yellow-100 text-yellow-800",
  "in-progress": "bg-blue-100 text-blue-800",
  "qc-ready": "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const statusLabels: Record<FinishingCase["status"], string> = {
  waiting: "Waiting",
  "in-progress": "In Progress",
  "qc-ready": "QC Ready",
  completed: "Completed",
  rejected: "Rejected",
};

const checklistLabels: Record<keyof FinishingCase["checklist"], string> = {
  surfacePolish: "Surface Polish",
  shadeAdjustment: "Shade Adjustment",
  glazeFiring: "Glaze Firing",
  finalCleaning: "Final Cleaning",
};

const emptyChecklist = {
  surfacePolish: false,
  shadeAdjustment: false,
  glazeFiring: false,
  finalCleaning: false,
};

export default function Finishing() {
  const [cases, setCases] = useState<FinishingCase[]>(initialCases);
  const [selectedId, setSelectedId] = useState<number | null>(initialCases[0]?.id ?? null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | FinishingCase["status"]>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editDraft, setEditDraft] = useState<{ technician: string; notes: string; material: string }>({
    technician: "",
    notes: "",
    material: "",
  });
  const [newCase, setNewCase] = useState({
    caseId: "",
    doctor: "",
    patient: "",
    restorationType: "",
    material: "",
    assignedTechnician: "",
    notes: "",
  });

  const filtered = cases.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      c.caseId.toLowerCase().includes(q) ||
      c.patient.toLowerCase().includes(q) ||
      c.doctor.toLowerCase().includes(q) ||
      c.assignedTechnician.toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const selected = cases.find((c) => c.id === selectedId) ?? null;

  const checklistDone = (cl: FinishingCase["checklist"]) =>
    Object.values(cl).filter(Boolean).length;

  // Stats
  const totalCases = cases.length;
  const completedCount = cases.filter((c) => c.status === "completed").length;
  const inProgressCount = cases.filter((c) => c.status === "in-progress").length;
  const rejectedCount = cases.filter((c) => c.status === "rejected").length;

  // CRUD: Add
  const handleAddCase = () => {
    if (!newCase.caseId || !newCase.doctor || !newCase.patient) return;
    const c: FinishingCase = {
      id: Date.now(),
      caseId: newCase.caseId,
      doctor: newCase.doctor,
      patient: newCase.patient,
      restorationType: newCase.restorationType,
      material: newCase.material,
      status: "waiting",
      assignedTechnician: newCase.assignedTechnician,
      checklist: { ...emptyChecklist },
      startDate: new Date().toISOString().slice(0, 10),
      completedDate: null,
      notes: newCase.notes,
    };
    setCases((prev) => [...prev, c]);
    setSelectedId(c.id);
    setShowAddModal(false);
    setNewCase({ caseId: "", doctor: "", patient: "", restorationType: "", material: "", assignedTechnician: "", notes: "" });
  };

  // CRUD: Delete
  const handleDelete = (id: number) => {
    setCases((prev) => prev.filter((c) => c.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  // Edit helpers
  const startEdit = () => {
    if (!selected) return;
    setEditDraft({ technician: selected.assignedTechnician, notes: selected.notes, material: selected.material });
    setEditMode(true);
  };

  const saveEdit = () => {
    if (!selected) return;
    setCases((prev) =>
      prev.map((c) =>
        c.id === selected.id
          ? { ...c, assignedTechnician: editDraft.technician, notes: editDraft.notes, material: editDraft.material }
          : c,
      ),
    );
    setEditMode(false);
  };

  // Checklist toggle
  const toggleChecklist = (key: keyof FinishingCase["checklist"]) => {
    if (!selected || selected.status !== "in-progress") return;
    setCases((prev) =>
      prev.map((c) =>
        c.id === selected.id ? { ...c, checklist: { ...c.checklist, [key]: !c.checklist[key] } } : c,
      ),
    );
  };

  // Status transitions
  const startWork = () => {
    if (!selected || selected.status !== "waiting") return;
    setCases((prev) => prev.map((c) => (c.id === selected.id ? { ...c, status: "in-progress" as const } : c)));
  };

  const sendToQC = () => {
    if (!selected || selected.status !== "in-progress") return;
    if (checklistDone(selected.checklist) < 4) return;
    setCases((prev) => prev.map((c) => (c.id === selected.id ? { ...c, status: "qc-ready" as const } : c)));
  };

  const completeCase = () => {
    if (!selected || selected.status !== "qc-ready") return;
    setCases((prev) =>
      prev.map((c) =>
        c.id === selected.id
          ? { ...c, status: "completed" as const, completedDate: new Date().toISOString().slice(0, 10) }
          : c,
      ),
    );
  };

  const rejectCase = () => {
    if (!selected || selected.status !== "qc-ready") return;
    setCases((prev) =>
      prev.map((c) =>
        c.id === selected.id ? { ...c, status: "rejected" as const, checklist: { ...emptyChecklist } } : c,
      ),
    );
  };

  const restartCase = () => {
    if (!selected || selected.status !== "rejected") return;
    setCases((prev) =>
      prev.map((c) =>
        c.id === selected.id ? { ...c, status: "waiting" as const, completedDate: null } : c,
      ),
    );
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-purple-600" />
              Finishing &amp; Polishing Department
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Surface finishing, shade adjustment, glaze firing &amp; final quality preparation
            </p>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Add Case
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Cases", value: totalCases, color: "text-slate-700" },
            { label: "Completed", value: completedCount, color: "text-green-700" },
            { label: "In Progress", value: inProgressCount, color: "text-blue-700" },
            { label: "Rejected", value: rejectedCount, color: "text-red-700" },
          ].map((s) => (
            <div key={s.label} className="dlos-card rounded-lg border p-4 text-center">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Left panel - Case list */}
          <div className="w-1/3 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                className="w-full pl-9 pr-3 py-2 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Search cases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="w-full py-2 px-3 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
            >
              <option value="all">All Statuses</option>
              <option value="waiting">Waiting</option>
              <option value="in-progress">In Progress</option>
              <option value="qc-ready">QC Ready</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              {filtered.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">No cases found.</p>
              )}
              {filtered.map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelectedId(c.id);
                    setEditMode(false);
                  }}
                  className={`dlos-card rounded-lg border p-3 cursor-pointer transition-all hover:shadow-md ${
                    selectedId === c.id ? "ring-2 ring-purple-500" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm">{c.caseId}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[c.status]}`}>
                      {statusLabels[c.status]}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{c.patient} — {c.doctor}</p>
                  <p className="text-xs text-muted-foreground">{c.restorationType} • {c.material}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">Tech: {c.assignedTechnician}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(c.id);
                      }}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel - Detail */}
          <div className="w-2/3">
            {!selected ? (
              <div className="dlos-card rounded-lg border p-12 text-center text-muted-foreground">
                <Sparkles className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p>Select a case to view details</p>
              </div>
            ) : (
              <div className="dlos-card rounded-lg border p-5 space-y-5">
                {/* Detail header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold">{selected.caseId}</h2>
                    <p className="text-sm text-muted-foreground">
                      {selected.patient} — {selected.doctor}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[selected.status]}`}
                    >
                      {statusLabels[selected.status]}
                    </span>
                    {!editMode && (
                      <Button size="sm" variant="outline" className="gap-1" onClick={startEdit}>
                        <Edit className="h-3.5 w-3.5" /> Edit
                      </Button>
                    )}
                  </div>
                </div>

                {/* Info grid */}
                {!editMode ? (
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Restoration Type</p>
                      <p className="font-medium">{selected.restorationType}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Material</p>
                      <p className="font-medium">{selected.material}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Assigned Technician</p>
                      <p className="font-medium">{selected.assignedTechnician}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Start Date</p>
                      <p className="font-medium">{selected.startDate}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Completed Date</p>
                      <p className="font-medium">{selected.completedDate ?? "—"}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground text-xs">Notes</p>
                      <p className="font-medium">{selected.notes || "—"}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground">Assigned Technician</label>
                      <input
                        className="w-full mt-1 px-3 py-2 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={editDraft.technician}
                        onChange={(e) => setEditDraft((d) => ({ ...d, technician: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Material</label>
                      <input
                        className="w-full mt-1 px-3 py-2 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={editDraft.material}
                        onChange={(e) => setEditDraft((d) => ({ ...d, material: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Notes</label>
                      <textarea
                        className="w-full mt-1 px-3 py-2 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        rows={3}
                        value={editDraft.notes}
                        onChange={(e) => setEditDraft((d) => ({ ...d, notes: e.target.value }))}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="gap-1" onClick={saveEdit}>
                        <Save className="h-3.5 w-3.5" /> Save
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1" onClick={() => setEditMode(false)}>
                        <X className="h-3.5 w-3.5" /> Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Checklist */}
                <div>
                  <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <ClipboardCheck className="h-4 w-4 text-purple-600" />
                    Finishing Checklist
                  </h3>
                  {/* Progress bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{checklistDone(selected.checklist)}/4 completed</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${(checklistDone(selected.checklist) / 4) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(selected.checklist) as (keyof FinishingCase["checklist"])[]).map((key) => (
                      <button
                        key={key}
                        onClick={() => toggleChecklist(key)}
                        disabled={selected.status !== "in-progress"}
                        className={`flex items-center gap-2 p-2 rounded-md border text-sm transition-colors ${
                          selected.checklist[key]
                            ? "bg-green-50 border-green-300 text-green-800"
                            : "bg-white border-gray-200 text-gray-600"
                        } ${selected.status === "in-progress" ? "hover:shadow cursor-pointer" : "opacity-70 cursor-default"}`}
                      >
                        {selected.checklist[key] ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                        ) : (
                          <Circle className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        )}
                        {checklistLabels[key]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-2 border-t">
                  {selected.status === "waiting" && (
                    <Button size="sm" className="gap-1" onClick={startWork}>
                      <Play className="h-3.5 w-3.5" /> Start Work
                    </Button>
                  )}
                  {selected.status === "in-progress" && (
                    <Button
                      size="sm"
                      className="gap-1"
                      onClick={sendToQC}
                      disabled={checklistDone(selected.checklist) < 4}
                    >
                      <Send className="h-3.5 w-3.5" /> Send to QC
                      {checklistDone(selected.checklist) < 4 && (
                        <span className="text-xs opacity-70 ml-1">(complete checklist first)</span>
                      )}
                    </Button>
                  )}
                  {selected.status === "qc-ready" && (
                    <>
                      <Button size="sm" className="gap-1 bg-green-600 hover:bg-green-700" onClick={completeCase}>
                        <CheckCircle2 className="h-3.5 w-3.5" /> Complete
                      </Button>
                      <Button size="sm" variant="destructive" className="gap-1" onClick={rejectCase}>
                        <XCircle className="h-3.5 w-3.5" /> Reject
                      </Button>
                    </>
                  )}
                  {selected.status === "rejected" && (
                    <Button size="sm" variant="outline" className="gap-1" onClick={restartCase}>
                      <RotateCcw className="h-3.5 w-3.5" /> Restart
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quality Standards */}
        <div className="dlos-card rounded-lg border p-5">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Finishing Quality Standards Reference
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="font-medium text-purple-700">Surface Polish</p>
              <p className="text-xs text-muted-foreground">
                All surfaces must achieve mirror finish. No scratches visible under 10x magnification.
              </p>
            </div>
            <div>
              <p className="font-medium text-purple-700">Shade Adjustment</p>
              <p className="text-xs text-muted-foreground">
                Shade must match prescription within ΔE &lt; 1.5. Verify under D65 illuminant.
              </p>
            </div>
            <div>
              <p className="font-medium text-purple-700">Glaze Firing</p>
              <p className="text-xs text-muted-foreground">
                Follow manufacturer firing schedule exactly. No over-glazing; maintain surface texture.
              </p>
            </div>
            <div>
              <p className="font-medium text-purple-700">Final Cleaning</p>
              <p className="text-xs text-muted-foreground">
                Ultrasonic clean 10 min, steam clean, inspect for debris. Package in sealed container.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Case Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Add Finishing Case</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            {[
              { label: "Case ID", key: "caseId" as const, placeholder: "FIN-XXXX" },
              { label: "Doctor", key: "doctor" as const, placeholder: "Dr. Name" },
              { label: "Patient", key: "patient" as const, placeholder: "Patient name" },
              { label: "Restoration Type", key: "restorationType" as const, placeholder: "e.g. Crown, Bridge" },
              { label: "Material", key: "material" as const, placeholder: "e.g. Zirconia, Lithium Disilicate" },
              { label: "Assigned Technician", key: "assignedTechnician" as const, placeholder: "Technician name" },
            ].map((f) => (
              <div key={f.key}>
                <label className="text-xs text-muted-foreground">{f.label}</label>
                <input
                  className="w-full mt-1 px-3 py-2 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={f.placeholder}
                  value={newCase[f.key]}
                  onChange={(e) => setNewCase((prev) => ({ ...prev, [f.key]: e.target.value }))}
                />
              </div>
            ))}
            <div>
              <label className="text-xs text-muted-foreground">Notes</label>
              <textarea
                className="w-full mt-1 px-3 py-2 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={2}
                value={newCase.notes}
                onChange={(e) => setNewCase((prev) => ({ ...prev, notes: e.target.value }))}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCase} disabled={!newCase.caseId || !newCase.doctor || !newCase.patient}>
                Add Case
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
