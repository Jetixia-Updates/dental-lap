import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  Circle,
  Play,
  Send,
  ThumbsUp,
  RotateCcw,
  X,
  Monitor,
  ClipboardCheck,
  AlertTriangle,
  CheckSquare,
} from "lucide-react";

interface DesignCase {
  id: number;
  caseId: string;
  doctor: string;
  patient: string;
  restorationType: string;
  material: string;
  designer: string;
  status: "queued" | "designing" | "review" | "approved" | "revision";
  progress: number;
  checklist: {
    margins: boolean;
    contacts: boolean;
    occlusion: boolean;
    anatomy: boolean;
    thickness: boolean;
  };
  designNotes: string;
  startDate: string;
  software: string;
}

const initialCases: DesignCase[] = [
  {
    id: 1,
    caseId: "CAD-2401",
    doctor: "Dr. Williams",
    patient: "Sarah Johnson",
    restorationType: "Crown - #14",
    material: "Zirconia",
    designer: "Ahmed K.",
    status: "designing",
    progress: 65,
    checklist: { margins: true, contacts: true, occlusion: false, anatomy: false, thickness: true },
    designNotes: "Patient has tight occlusion, minimal reduction on lingual.",
    startDate: "2026-02-04",
    software: "exocad DentalCAD",
  },
  {
    id: 2,
    caseId: "CAD-2402",
    doctor: "Dr. Chen",
    patient: "Mark Rivera",
    restorationType: "Bridge - #3-5",
    material: "eMax",
    designer: "Lina M.",
    status: "review",
    progress: 100,
    checklist: { margins: true, contacts: true, occlusion: true, anatomy: true, thickness: true },
    designNotes: "Three-unit bridge, pontic designed with ovate shape per doctor request.",
    startDate: "2026-02-02",
    software: "3Shape Dental System",
  },
  {
    id: 3,
    caseId: "CAD-2403",
    doctor: "Dr. Patel",
    patient: "Emily Tran",
    restorationType: "Veneer - #8, #9",
    material: "Lithium Disilicate",
    designer: "",
    status: "queued",
    progress: 0,
    checklist: { margins: false, contacts: false, occlusion: false, anatomy: false, thickness: false },
    designNotes: "",
    startDate: "2026-02-06",
    software: "exocad DentalCAD",
  },
  {
    id: 4,
    caseId: "CAD-2404",
    doctor: "Dr. Garcia",
    patient: "Tom Bradley",
    restorationType: "Inlay - #19",
    material: "Zirconia",
    designer: "Ahmed K.",
    status: "revision",
    progress: 40,
    checklist: { margins: true, contacts: false, occlusion: false, anatomy: true, thickness: true },
    designNotes: "Doctor requested tighter contact on mesial. Revising design.",
    startDate: "2026-02-03",
    software: "exocad DentalCAD",
  },
];

const statusColors: Record<DesignCase["status"], string> = {
  queued: "bg-gray-100 text-gray-700",
  designing: "bg-blue-100 text-blue-700",
  review: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  revision: "bg-red-100 text-red-700",
};

const statusLabels: Record<DesignCase["status"], string> = {
  queued: "Queued",
  designing: "Designing",
  review: "In Review",
  approved: "Approved",
  revision: "Revision",
};

const checklistLabels: Record<keyof DesignCase["checklist"], string> = {
  margins: "Margin Integrity",
  contacts: "Proximal Contacts",
  occlusion: "Occlusal Clearance",
  anatomy: "Anatomical Form",
  thickness: "Material Thickness",
};

export default function CADDesign() {
  const [cases, setCases] = useState<DesignCase[]>(initialCases);
  const [selectedId, setSelectedId] = useState<number | null>(initialCases[0]?.id ?? null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<DesignCase["status"] | "all">("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [newCase, setNewCase] = useState({
    caseId: "",
    doctor: "",
    patient: "",
    restorationType: "",
    material: "Zirconia",
    designer: "",
    software: "exocad DentalCAD",
    designNotes: "",
  });

  const [editForm, setEditForm] = useState({
    designer: "",
    software: "",
    material: "",
    designNotes: "",
  });

  const selectedCase = cases.find((c) => c.id === selectedId) ?? null;

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.caseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.doctor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || c.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalDesigns = cases.length;
  const approvedCount = cases.filter((c) => c.status === "approved").length;
  const inProgressCount = cases.filter(
    (c) => c.status === "designing" || c.status === "review"
  ).length;
  const revisionCount = cases.filter((c) => c.status === "revision").length;

  function handleAddCase() {
    const id = Math.max(0, ...cases.map((c) => c.id)) + 1;
    const entry: DesignCase = {
      id,
      caseId: newCase.caseId || `CAD-${2400 + id}`,
      doctor: newCase.doctor,
      patient: newCase.patient,
      restorationType: newCase.restorationType,
      material: newCase.material,
      designer: newCase.designer,
      status: "queued",
      progress: 0,
      checklist: {
        margins: false,
        contacts: false,
        occlusion: false,
        anatomy: false,
        thickness: false,
      },
      designNotes: newCase.designNotes,
      startDate: new Date().toISOString().slice(0, 10),
      software: newCase.software,
    };
    setCases((prev) => [...prev, entry]);
    setSelectedId(id);
    setShowAddModal(false);
    setNewCase({
      caseId: "",
      doctor: "",
      patient: "",
      restorationType: "",
      material: "Zirconia",
      designer: "",
      software: "exocad DentalCAD",
      designNotes: "",
    });
  }

  function handleDelete(id: number) {
    setCases((prev) => prev.filter((c) => c.id !== id));
    if (selectedId === id)
      setSelectedId(cases.find((c) => c.id !== id)?.id ?? null);
  }

  function updateCase(id: number, patch: Partial<DesignCase>) {
    setCases((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c))
    );
  }

  function toggleChecklist(key: keyof DesignCase["checklist"]) {
    if (!selectedCase) return;
    updateCase(selectedCase.id, {
      checklist: {
        ...selectedCase.checklist,
        [key]: !selectedCase.checklist[key],
      },
    });
  }

  function allChecklistPassed(c: DesignCase) {
    return Object.values(c.checklist).every(Boolean);
  }

  function startDesigning() {
    if (!selectedCase) return;
    updateCase(selectedCase.id, {
      status: "designing",
      progress: selectedCase.progress || 5,
    });
  }

  function submitForReview() {
    if (!selectedCase || !allChecklistPassed(selectedCase)) return;
    updateCase(selectedCase.id, { status: "review", progress: 100 });
  }

  function approveDesign() {
    if (!selectedCase) return;
    updateCase(selectedCase.id, { status: "approved" });
  }

  function requestRevision() {
    if (!selectedCase) return;
    updateCase(selectedCase.id, {
      status: selectedCase.status === "review" ? "revision" : "designing",
      progress: Math.min(selectedCase.progress, 50),
    });
  }

  function startEdit() {
    if (!selectedCase) return;
    setEditForm({
      designer: selectedCase.designer,
      software: selectedCase.software,
      material: selectedCase.material,
      designNotes: selectedCase.designNotes,
    });
    setEditMode(true);
  }

  function saveEdit() {
    if (!selectedCase) return;
    updateCase(selectedCase.id, { ...editForm });
    setEditMode(false);
  }

  function handleProgressChange(val: number) {
    if (!selectedCase) return;
    if (
      selectedCase.status === "designing" ||
      selectedCase.status === "review"
    ) {
      updateCase(selectedCase.id, { progress: val });
    }
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">CAD/CAM Design Department</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="dlos-card p-4 flex items-center gap-3">
            <Monitor className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Total Designs</p>
              <p className="text-2xl font-bold">{totalDesigns}</p>
            </div>
          </div>
          <div className="dlos-card p-4 flex items-center gap-3">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Approved</p>
              <p className="text-2xl font-bold">{approvedCount}</p>
            </div>
          </div>
          <div className="dlos-card p-4 flex items-center gap-3">
            <ClipboardCheck className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="text-2xl font-bold">{inProgressCount}</p>
            </div>
          </div>
          <div className="dlos-card p-4 flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-sm text-muted-foreground">In Revision</p>
              <p className="text-2xl font-bold">{revisionCount}</p>
            </div>
          </div>
        </div>

        {/* Main Panel */}
        <div className="flex gap-6 flex-col lg:flex-row">
          {/* Case List - Left 1/3 */}
          <div className="w-full lg:w-1/3 space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search cases..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border rounded-md text-sm"
                />
              </div>
              <Button size="sm" onClick={() => setShowAddModal(true)}>
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>

            {/* Filter */}
            <div className="flex gap-1 flex-wrap">
              {(
                [
                  "all",
                  "queued",
                  "designing",
                  "review",
                  "approved",
                  "revision",
                ] as const
              ).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    filterStatus === s
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {s === "all"
                    ? "All"
                    : statusLabels[s as DesignCase["status"]]}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              {filteredCases.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No cases found.
                </p>
              )}
              {filteredCases.map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelectedId(c.id);
                    setEditMode(false);
                  }}
                  className={`dlos-card p-3 cursor-pointer transition-colors ${
                    selectedId === c.id
                      ? "ring-2 ring-primary"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-sm">{c.caseId}</p>
                      <p className="text-xs text-muted-foreground">
                        {c.patient} &middot; {c.doctor}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {c.restorationType}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[c.status]}`}
                      >
                        {statusLabels[c.status]}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(c.id);
                        }}
                        className="text-muted-foreground hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full transition-all"
                        style={{ width: `${c.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detail Panel - Right 2/3 */}
          <div className="w-full lg:w-2/3">
            {!selectedCase ? (
              <div className="dlos-card p-8 text-center text-muted-foreground">
                Select a case to view details
              </div>
            ) : editMode ? (
              <div className="dlos-card p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold">
                    Edit {selectedCase.caseId}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditMode(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Designer</label>
                    <input
                      className="w-full border rounded-md px-3 py-2 text-sm mt-1"
                      value={editForm.designer}
                      onChange={(e) =>
                        setEditForm((f) => ({
                          ...f,
                          designer: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Software</label>
                    <input
                      className="w-full border rounded-md px-3 py-2 text-sm mt-1"
                      value={editForm.software}
                      onChange={(e) =>
                        setEditForm((f) => ({
                          ...f,
                          software: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Material</label>
                    <input
                      className="w-full border rounded-md px-3 py-2 text-sm mt-1"
                      value={editForm.material}
                      onChange={(e) =>
                        setEditForm((f) => ({
                          ...f,
                          material: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium">
                      Design Notes
                    </label>
                    <textarea
                      className="w-full border rounded-md px-3 py-2 text-sm mt-1 min-h-[80px]"
                      value={editForm.designNotes}
                      onChange={(e) =>
                        setEditForm((f) => ({
                          ...f,
                          designNotes: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={saveEdit}>Save Changes</Button>
                </div>
              </div>
            ) : (
              <div className="dlos-card p-6 space-y-5">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-bold">
                      {selectedCase.caseId}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {selectedCase.patient} &middot; {selectedCase.doctor}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[selectedCase.status]}`}
                    >
                      {statusLabels[selectedCase.status]}
                    </span>
                    <Button variant="outline" size="sm" onClick={startEdit}>
                      <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                    </Button>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Restoration</span>
                    <p className="font-medium">
                      {selectedCase.restorationType}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Material</span>
                    <p className="font-medium">{selectedCase.material}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Designer</span>
                    <p className="font-medium">
                      {selectedCase.designer || "—"}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Software</span>
                    <p className="font-medium">{selectedCase.software}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Start Date</span>
                    <p className="font-medium">{selectedCase.startDate}</p>
                  </div>
                </div>

                {/* Progress */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm font-semibold">
                      {selectedCase.progress}%
                    </span>
                  </div>
                  {selectedCase.status === "designing" ||
                  selectedCase.status === "review" ? (
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={selectedCase.progress}
                      onChange={(e) =>
                        handleProgressChange(Number(e.target.value))
                      }
                      className="w-full accent-blue-500"
                    />
                  ) : (
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-500 h-2.5 rounded-full transition-all"
                        style={{ width: `${selectedCase.progress}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Design Notes */}
                {selectedCase.designNotes && (
                  <div>
                    <span className="text-sm font-medium">Design Notes</span>
                    <p className="text-sm text-muted-foreground mt-1 bg-muted/50 rounded-md p-3">
                      {selectedCase.designNotes}
                    </p>
                  </div>
                )}

                {/* Interactive Checklist */}
                <div>
                  <span className="text-sm font-medium block mb-2">
                    Design Checklist
                  </span>
                  <div className="space-y-1.5">
                    {(
                      Object.keys(selectedCase.checklist) as (keyof DesignCase["checklist"])[]
                    ).map((key) => (
                      <button
                        key={key}
                        onClick={() => toggleChecklist(key)}
                        className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-md hover:bg-muted/50 transition-colors text-sm"
                      >
                        {selectedCase.checklist[key] ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                        ) : (
                          <Circle className="h-4 w-4 text-gray-300 flex-shrink-0" />
                        )}
                        <span
                          className={
                            selectedCase.checklist[key]
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }
                        >
                          {checklistLabels[key]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-2 border-t">
                  {selectedCase.status === "queued" && (
                    <Button onClick={startDesigning} className="gap-1">
                      <Play className="h-4 w-4" /> Start Designing
                    </Button>
                  )}
                  {selectedCase.status === "designing" && (
                    <Button
                      onClick={submitForReview}
                      disabled={!allChecklistPassed(selectedCase)}
                      className="gap-1"
                    >
                      <Send className="h-4 w-4" /> Submit for Review
                    </Button>
                  )}
                  {selectedCase.status === "review" && (
                    <>
                      <Button
                        onClick={approveDesign}
                        className="gap-1 bg-green-600 hover:bg-green-700"
                      >
                        <ThumbsUp className="h-4 w-4" /> Approve Design
                      </Button>
                      <Button
                        variant="outline"
                        onClick={requestRevision}
                        className="gap-1 text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <RotateCcw className="h-4 w-4" /> Request Revision
                      </Button>
                    </>
                  )}
                  {selectedCase.status === "revision" && (
                    <Button onClick={requestRevision} className="gap-1">
                      <RotateCcw className="h-4 w-4" /> Back to Designing
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Design Standards Reference */}
        <div className="dlos-card p-5">
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
            <CheckSquare className="h-4 w-4" /> Design Standards Checklist
            Reference
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
            <div className="space-y-1">
              <p className="font-medium">Margin Integrity</p>
              <p className="text-xs text-muted-foreground">
                Margins must be smooth, continuous, and follow the prep line
                with no gaps exceeding 50μm.
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-medium">Proximal Contacts</p>
              <p className="text-xs text-muted-foreground">
                Contacts verified at 25-50μm with adjacent teeth. Proper
                embrasure form for tissue health.
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-medium">Occlusal Clearance</p>
              <p className="text-xs text-muted-foreground">
                Minimum 1.0mm clearance in centric, 0.5mm in lateral
                excursions. Verified in dynamic articulation.
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-medium">Anatomical Form</p>
              <p className="text-xs text-muted-foreground">
                Natural anatomy with proper cusp tips, ridges, fossae, and
                grooves matching the patient's dentition.
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-medium">Material Thickness</p>
              <p className="text-xs text-muted-foreground">
                Minimum wall thickness per material: Zirconia 0.5mm, eMax
                1.0mm, Lithium Disilicate 0.8mm.
              </p>
            </div>
          </div>
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg shadow-xl w-full max-w-lg p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">Add Design Case</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Case ID</label>
                  <input
                    className="w-full border rounded-md px-3 py-2 text-sm mt-1"
                    placeholder="CAD-XXXX"
                    value={newCase.caseId}
                    onChange={(e) =>
                      setNewCase((f) => ({ ...f, caseId: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Doctor</label>
                  <input
                    className="w-full border rounded-md px-3 py-2 text-sm mt-1"
                    value={newCase.doctor}
                    onChange={(e) =>
                      setNewCase((f) => ({ ...f, doctor: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Patient</label>
                  <input
                    className="w-full border rounded-md px-3 py-2 text-sm mt-1"
                    value={newCase.patient}
                    onChange={(e) =>
                      setNewCase((f) => ({ ...f, patient: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Restoration Type
                  </label>
                  <input
                    className="w-full border rounded-md px-3 py-2 text-sm mt-1"
                    placeholder="Crown - #14"
                    value={newCase.restorationType}
                    onChange={(e) =>
                      setNewCase((f) => ({
                        ...f,
                        restorationType: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Material</label>
                  <select
                    className="w-full border rounded-md px-3 py-2 text-sm mt-1"
                    value={newCase.material}
                    onChange={(e) =>
                      setNewCase((f) => ({
                        ...f,
                        material: e.target.value,
                      }))
                    }
                  >
                    <option>Zirconia</option>
                    <option>eMax</option>
                    <option>Lithium Disilicate</option>
                    <option>PMMA</option>
                    <option>Composite</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Designer</label>
                  <input
                    className="w-full border rounded-md px-3 py-2 text-sm mt-1"
                    value={newCase.designer}
                    onChange={(e) =>
                      setNewCase((f) => ({
                        ...f,
                        designer: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Software</label>
                  <select
                    className="w-full border rounded-md px-3 py-2 text-sm mt-1"
                    value={newCase.software}
                    onChange={(e) =>
                      setNewCase((f) => ({
                        ...f,
                        software: e.target.value,
                      }))
                    }
                  >
                    <option>exocad DentalCAD</option>
                    <option>3Shape Dental System</option>
                    <option>Medit Design</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">
                    Design Notes
                  </label>
                  <textarea
                    className="w-full border rounded-md px-3 py-2 text-sm mt-1 min-h-[60px]"
                    value={newCase.designNotes}
                    onChange={(e) =>
                      setNewCase((f) => ({
                        ...f,
                        designNotes: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddCase}
                  disabled={
                    !newCase.doctor ||
                    !newCase.patient ||
                    !newCase.restorationType
                  }
                >
                  Add Case
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
