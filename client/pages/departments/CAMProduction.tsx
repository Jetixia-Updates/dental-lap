import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Plus, Check, X, AlertCircle, Clock, Trash2, Edit, Send, Search,
  Play, Pause, RotateCcw, Factory, Cog, ChevronRight, AlertTriangle,
} from "lucide-react";

interface ProductionJob {
  id: string;
  caseId: string;
  doctor: string;
  patient: string;
  restorationType: string;
  material: string;
  equipment: string;
  status: "queued" | "running" | "paused" | "completed" | "failed";
  progress: number;
  operator: string;
  estimatedTime: string;
  actualTime: string;
  startDate: string;
  notes: string;
}

const equipmentOptions = ["5-Axis Mill", "3D Printer", "Sintering Oven", "Wet Mill", "Dry Mill"];
const materialOptions = ["Zirconia", "E.max", "PMMA", "Wax", "Titanium", "Composite"];
const restorationOptions = ["Crown", "Bridge", "Veneer", "Inlay/Onlay", "Implant Crown", "Full Arch"];

const mockJobs: ProductionJob[] = [
  {
    id: "1",
    caseId: "CASE-2024-010",
    doctor: "Dr. John Smith",
    patient: "Jane Doe",
    restorationType: "Crown",
    material: "Zirconia",
    equipment: "5-Axis Mill",
    status: "running",
    progress: 65,
    operator: "Carlos M.",
    estimatedTime: "45 min",
    actualTime: "30 min",
    startDate: "2024-02-10",
    notes: "High translucency disc, program #12",
  },
  {
    id: "2",
    caseId: "CASE-2024-011",
    doctor: "Dr. Sarah Johnson",
    patient: "Michael Brown",
    restorationType: "Bridge",
    material: "E.max",
    equipment: "Wet Mill",
    status: "queued",
    progress: 0,
    operator: "Ana R.",
    estimatedTime: "90 min",
    actualTime: "",
    startDate: "2024-02-10",
    notes: "3-unit bridge, check nesting layout",
  },
  {
    id: "3",
    caseId: "CASE-2024-012",
    doctor: "Dr. Michael Brown",
    patient: "Emily Garcia",
    restorationType: "Veneer",
    material: "E.max",
    equipment: "5-Axis Mill",
    status: "completed",
    progress: 100,
    operator: "Carlos M.",
    estimatedTime: "35 min",
    actualTime: "38 min",
    startDate: "2024-02-09",
    notes: "Completed successfully, sent to finishing",
  },
  {
    id: "4",
    caseId: "CASE-2024-013",
    doctor: "Dr. Lisa Chen",
    patient: "Robert Wilson",
    restorationType: "Implant Crown",
    material: "Titanium",
    equipment: "5-Axis Mill",
    status: "failed",
    progress: 42,
    operator: "Ana R.",
    estimatedTime: "60 min",
    actualTime: "27 min",
    startDate: "2024-02-10",
    notes: "Tool breakage at 42%, need recalibration",
  },
];

let nextId = 14;

export default function CAMProduction() {
  const [jobs, setJobs] = useState<ProductionJob[]>(mockJobs);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [showAddJob, setShowAddJob] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [newJob, setNewJob] = useState({
    caseId: "",
    doctor: "",
    patient: "",
    restorationType: "",
    material: "",
    equipment: "5-Axis Mill",
    operator: "",
    estimatedTime: "",
    notes: "",
  });
  const [editData, setEditData] = useState<Partial<ProductionJob>>({});

  const sel = jobs.find((j) => j.id === selectedJob);

  const filtered = jobs.filter((j) => {
    const s = searchTerm.toLowerCase();
    const matchSearch =
      !s ||
      j.caseId.toLowerCase().includes(s) ||
      j.doctor.toLowerCase().includes(s) ||
      j.patient.toLowerCase().includes(s) ||
      j.operator.toLowerCase().includes(s);
    const matchFilter = !filterStatus || j.status === filterStatus;
    return matchSearch && matchFilter;
  });

  const counts = {
    total: jobs.length,
    completed: jobs.filter((j) => j.status === "completed").length,
    running: jobs.filter((j) => j.status === "running").length,
    failed: jobs.filter((j) => j.status === "failed").length,
  };

  /* Equipment utilization */
  const equipmentUtil = equipmentOptions.map((eq) => {
    const eqJobs = jobs.filter((j) => j.equipment === eq);
    const active = eqJobs.filter((j) => j.status === "running").length;
    const total = eqJobs.length;
    return { name: eq, active, total };
  });

  const handleAdd = () => {
    if (!newJob.caseId.trim() || !newJob.doctor.trim() || !newJob.patient.trim()) return;
    const j: ProductionJob = {
      id: Date.now().toString(),
      caseId: newJob.caseId || `CASE-2024-${String(nextId++).padStart(3, "0")}`,
      doctor: newJob.doctor,
      patient: newJob.patient,
      restorationType: newJob.restorationType,
      material: newJob.material,
      equipment: newJob.equipment,
      status: "queued",
      progress: 0,
      operator: newJob.operator,
      estimatedTime: newJob.estimatedTime,
      actualTime: "",
      startDate: new Date().toISOString().split("T")[0],
      notes: newJob.notes,
    };
    setJobs((prev) => [...prev, j]);
    setNewJob({ caseId: "", doctor: "", patient: "", restorationType: "", material: "", equipment: "5-Axis Mill", operator: "", estimatedTime: "", notes: "" });
    setShowAddJob(false);
    setSelectedJob(j.id);
  };

  const handleDelete = (id: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
    if (selectedJob === id) setSelectedJob(null);
  };

  const updateStatus = (id: string, status: ProductionJob["status"], extraFields?: Partial<ProductionJob>) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status, ...extraFields } : j)),
    );
  };

  const handleStart = (id: string) => updateStatus(id, "running");
  const handlePause = (id: string) => updateStatus(id, "paused");
  const handleResume = (id: string) => updateStatus(id, "running");
  const handleComplete = (id: string) => updateStatus(id, "completed", { progress: 100 });
  const handleFail = (id: string) => updateStatus(id, "failed");
  const handleRetry = (id: string) => updateStatus(id, "queued", { progress: 0 });

  const handleProgressChange = (id: string, progress: number) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, progress } : j)));
  };

  const startEdit = () => {
    if (sel) {
      setEditData({ ...sel });
      setEditMode(true);
    }
  };

  const saveEdit = () => {
    if (!sel || !editData) return;
    setJobs((prev) =>
      prev.map((j) =>
        j.id === sel.id
          ? {
              ...j,
              operator: editData.operator ?? j.operator,
              equipment: editData.equipment ?? j.equipment,
              estimatedTime: editData.estimatedTime ?? j.estimatedTime,
              notes: editData.notes ?? j.notes,
            }
          : j,
      ),
    );
    setEditMode(false);
  };

  const statusColor = (s: ProductionJob["status"]) => {
    if (s === "completed") return "bg-green-100 text-green-800";
    if (s === "running") return "bg-blue-100 text-blue-800";
    if (s === "paused") return "bg-amber-100 text-amber-800";
    if (s === "failed") return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-600";
  };

  const progressColor = (s: ProductionJob["status"]) => {
    if (s === "completed") return "bg-green-500";
    if (s === "running") return "bg-blue-500";
    if (s === "paused") return "bg-amber-500";
    if (s === "failed") return "bg-red-500";
    return "bg-gray-400";
  };

  const inp =
    "w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">CAM / Production</h1>
        <p className="text-muted-foreground">
          Manage milling, printing, and sintering production jobs
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Jobs", value: counts.total, icon: Factory, color: "text-primary" },
          { label: "Completed", value: counts.completed, icon: Check, color: "text-green-600" },
          { label: "Running", value: counts.running, icon: Play, color: "text-blue-600" },
          { label: "Failed", value: counts.failed, icon: AlertTriangle, color: "text-red-600" },
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
        {/* Left: job list */}
        <div className="lg:col-span-1">
          <div className="dlos-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">Production Queue</h2>
              <Button size="sm" onClick={() => setShowAddJob(true)}>
                <Plus className="w-4 h-4 mr-2" />New
              </Button>
            </div>
            <div className="space-y-2 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`${inp} pl-10`}
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`${inp} text-xs py-1.5`}
              >
                <option value="">All Status</option>
                <option value="queued">Queued</option>
                <option value="running">Running</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {filtered.map((j) => (
                <button
                  key={j.id}
                  onClick={() => {
                    setSelectedJob(j.id);
                    setEditMode(false);
                  }}
                  className={`w-full text-left p-3 rounded-md border transition-all ${
                    selectedJob === j.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-semibold text-sm text-foreground">{j.caseId}</p>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded ${statusColor(j.status)}`}
                    >
                      {j.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {j.patient} &bull; {j.equipment}
                  </p>
                  <div className="mt-2">
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${progressColor(j.status)}`}
                        style={{ width: `${j.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 text-right">
                      {j.progress}%
                    </p>
                  </div>
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No jobs found
                </p>
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
                  <span
                    className={`inline-block mt-1 text-xs px-2 py-1 rounded font-semibold ${statusColor(
                      sel.status,
                    )}`}
                  >
                    {sel.status.toUpperCase()}
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
                      <label className="block text-xs text-muted-foreground mb-1">
                        Operator
                      </label>
                      <input
                        type="text"
                        value={editData.operator ?? ""}
                        onChange={(e) =>
                          setEditData({ ...editData, operator: e.target.value })
                        }
                        className={inp}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">
                        Equipment
                      </label>
                      <select
                        value={editData.equipment ?? ""}
                        onChange={(e) =>
                          setEditData({ ...editData, equipment: e.target.value })
                        }
                        className={inp}
                      >
                        {equipmentOptions.map((eq) => (
                          <option key={eq} value={eq}>
                            {eq}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">
                        Estimated Time
                      </label>
                      <input
                        type="text"
                        value={editData.estimatedTime ?? ""}
                        onChange={(e) =>
                          setEditData({ ...editData, estimatedTime: e.target.value })
                        }
                        placeholder="e.g. 45 min"
                        className={inp}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Notes</label>
                    <textarea
                      value={editData.notes ?? ""}
                      onChange={(e) =>
                        setEditData({ ...editData, notes: e.target.value })
                      }
                      rows={3}
                      className={`${inp} resize-none`}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setEditMode(false)}>
                      Cancel
                    </Button>
                    <Button onClick={saveEdit}>
                      <Check className="w-4 h-4 mr-2" />Save
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Detail fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {(
                      [
                        ["Doctor", sel.doctor],
                        ["Patient", sel.patient],
                        ["Restoration", sel.restorationType],
                        ["Material", sel.material],
                        ["Equipment", sel.equipment],
                        ["Operator", sel.operator],
                        ["Estimated Time", sel.estimatedTime],
                        ["Actual Time", sel.actualTime || "\u2014"],
                        ["Start Date", sel.startDate],
                      ] as [string, string][]
                    ).map(([label, val]) => (
                      <div key={label}>
                        <p className="text-xs text-muted-foreground mb-1">{label}</p>
                        <p className="font-semibold text-foreground">{val || "\u2014"}</p>
                      </div>
                    ))}
                  </div>

                  {/* Notes */}
                  {sel.notes && (
                    <div className="mb-6">
                      <p className="text-xs text-muted-foreground mb-1">Notes</p>
                      <p className="text-sm bg-secondary/30 p-3 rounded-md">{sel.notes}</p>
                    </div>
                  )}

                  {/* Progress bar + slider */}
                  <div className="border-t border-border pt-6 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-foreground">Production Progress</h3>
                      <span className="text-sm font-bold">{sel.progress}%</span>
                    </div>
                    <div className="h-3 bg-secondary rounded-full overflow-hidden mb-3">
                      <div
                        className={`h-full transition-all ${progressColor(sel.status)}`}
                        style={{ width: `${sel.progress}%` }}
                      />
                    </div>
                    {(sel.status === "running" || sel.status === "paused") && (
                      <div>
                        <label className="text-xs text-muted-foreground">
                          Adjust progress
                        </label>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={sel.progress}
                          onChange={(e) =>
                            handleProgressChange(sel.id, Number(e.target.value))
                          }
                          className="w-full mt-1 accent-primary"
                        />
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                    {sel.status === "queued" && (
                      <Button onClick={() => handleStart(sel.id)}>
                        <Play className="w-4 h-4 mr-2" />Start Production
                      </Button>
                    )}
                    {sel.status === "running" && (
                      <>
                        <Button
                          variant="outline"
                          onClick={() => handlePause(sel.id)}
                        >
                          <Pause className="w-4 h-4 mr-2" />Pause
                        </Button>
                        <Button onClick={() => handleComplete(sel.id)}>
                          <Check className="w-4 h-4 mr-2" />Complete
                        </Button>
                        <Button
                          variant="outline"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleFail(sel.id)}
                        >
                          <AlertTriangle className="w-4 h-4 mr-2" />Mark Failed
                        </Button>
                      </>
                    )}
                    {sel.status === "paused" && (
                      <Button onClick={() => handleResume(sel.id)}>
                        <Play className="w-4 h-4 mr-2" />Resume
                      </Button>
                    )}
                    {sel.status === "completed" && (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-green-600 font-semibold">
                          <Check className="w-5 h-5" />Production Complete
                        </div>
                        <Button size="sm">
                          <Send className="w-4 h-4 mr-2" />Send to Finishing
                        </Button>
                      </div>
                    )}
                    {sel.status === "failed" && (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-red-600 font-semibold">
                          <AlertTriangle className="w-5 h-5" />Job Failed
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => handleRetry(sel.id)}
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />Retry
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="dlos-card flex items-center justify-center min-h-[300px]">
              <p className="text-muted-foreground">Select a job to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Equipment utilization */}
      <div className="mt-8">
        <div className="dlos-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Equipment Utilization
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {equipmentUtil.map((eq) => (
              <div
                key={eq.name}
                className="p-4 border border-border rounded-lg flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Cog className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {eq.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {eq.active} active / {eq.total} total jobs
                  </p>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{
                        width: eq.total > 0 ? `${(eq.active / eq.total) * 100}%` : "0%",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom info cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="dlos-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Production Guidelines
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>&bull; Verify CAM file nesting before starting</li>
            <li>&bull; Check tool wear and coolant levels</li>
            <li>&bull; Confirm material lot number and shade</li>
            <li>&bull; Monitor spindle RPM and feed rates</li>
            <li>&bull; Inspect blanks for cracks before milling</li>
            <li>&bull; Log all tool changes and calibrations</li>
            <li>&bull; Follow sintering profile for material type</li>
          </ul>
        </div>
        <div className="dlos-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Equipment Maintenance
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>&bull; Daily: Clean spindle and collet</li>
            <li>&bull; Daily: Check coolant concentration</li>
            <li>&bull; Weekly: Calibrate axes alignment</li>
            <li>&bull; Weekly: Inspect tool holders</li>
            <li>&bull; Monthly: Full machine calibration</li>
            <li>&bull; Monthly: Replace filters and seals</li>
            <li>&bull; Log all maintenance in equipment log</li>
          </ul>
        </div>
      </div>

      {/* Add Job Modal */}
      {showAddJob && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border border-border shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">
                New Production Job
              </h2>
              <button
                onClick={() => setShowAddJob(false)}
                className="p-1 hover:bg-secondary rounded-md"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Case ID *</label>
                  <input
                    type="text"
                    value={newJob.caseId}
                    onChange={(e) =>
                      setNewJob({ ...newJob, caseId: e.target.value })
                    }
                    placeholder="CASE-2024-015"
                    className={inp}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Doctor *</label>
                  <input
                    type="text"
                    value={newJob.doctor}
                    onChange={(e) =>
                      setNewJob({ ...newJob, doctor: e.target.value })
                    }
                    placeholder="Dr. Jane Smith"
                    className={inp}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Patient *</label>
                  <input
                    type="text"
                    value={newJob.patient}
                    onChange={(e) =>
                      setNewJob({ ...newJob, patient: e.target.value })
                    }
                    placeholder="Patient name"
                    className={inp}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Restoration Type
                  </label>
                  <select
                    value={newJob.restorationType}
                    onChange={(e) =>
                      setNewJob({ ...newJob, restorationType: e.target.value })
                    }
                    className={inp}
                  >
                    <option value="">Select...</option>
                    {restorationOptions.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Material</label>
                  <select
                    value={newJob.material}
                    onChange={(e) =>
                      setNewJob({ ...newJob, material: e.target.value })
                    }
                    className={inp}
                  >
                    <option value="">Select...</option>
                    {materialOptions.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Equipment</label>
                  <select
                    value={newJob.equipment}
                    onChange={(e) =>
                      setNewJob({ ...newJob, equipment: e.target.value })
                    }
                    className={inp}
                  >
                    {equipmentOptions.map((eq) => (
                      <option key={eq} value={eq}>
                        {eq}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Operator</label>
                  <input
                    type="text"
                    value={newJob.operator}
                    onChange={(e) =>
                      setNewJob({ ...newJob, operator: e.target.value })
                    }
                    placeholder="Operator name"
                    className={inp}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Estimated Time
                  </label>
                  <input
                    type="text"
                    value={newJob.estimatedTime}
                    onChange={(e) =>
                      setNewJob({ ...newJob, estimatedTime: e.target.value })
                    }
                    placeholder="e.g. 45 min"
                    className={inp}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={newJob.notes}
                  onChange={(e) =>
                    setNewJob({ ...newJob, notes: e.target.value })
                  }
                  rows={3}
                  placeholder="Production notes..."
                  className={`${inp} resize-none`}
                />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-border justify-end">
              <Button variant="outline" onClick={() => setShowAddJob(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAdd}
                disabled={
                  !newJob.caseId.trim() ||
                  !newJob.doctor.trim() ||
                  !newJob.patient.trim()
                }
              >
                <Plus className="w-4 h-4 mr-2" />Create Job
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
