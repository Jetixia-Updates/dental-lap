import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Edit,
  FileText,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle,
  Printer,
  Zap,
  Shield,
  Save,
  X,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface CaseNote {
  id: string;
  author: string;
  date: string;
  content: string;
  type: "update" | "feedback" | "issue";
}

interface WorkflowStep {
  step: string;
  status: "completed" | "in-progress" | "pending";
  date: string | null;
}

const allCasesData: Record<string, any> = {
  "CASE-2024-001": {
    id: "CASE-2024-001",
    doctor: "Dr. John Smith",
    clinic: "Smile Dental Center",
    patient: "Jane Doe",
    dateCreated: "2024-02-08",
    dueDate: "2024-02-15",
    caseType: "Zirconia Crown",
    tooth: "#14",
    shade: "A2",
    material: "Zirconia",
    margin: "Subgingival 0.5mm",
    status: "design",
    priority: "high",
    progress: 60,
    prescription: {
      restorationType: "Full Coverage Crown",
      material: "Zirconia",
      shade: "A2 (Natural Tooth Guide)",
      margin: "Subgingival, 0.5mm",
      cementation: "Adhesive Resin",
      occlusion: "Bilateral Balanced",
      specialNotes: "Patient has high smile line. Ensure natural emergence profile.",
    },
    workflow: [
      { step: "Intake", status: "completed", date: "2024-02-08" },
      { step: "Case Planning", status: "completed", date: "2024-02-08" },
      { step: "Digital Design", status: "in-progress", date: "2024-02-09" },
      { step: "CAM Milling", status: "pending", date: null },
      { step: "Finishing", status: "pending", date: null },
      { step: "Quality Control", status: "pending", date: null },
      { step: "Delivery", status: "pending", date: null },
    ],
    notes: [
      { id: "1", author: "Sarah Thompson", date: "2024-02-10", content: "Prescription received and validated. All clinical data complete. Case assigned to CAD team.", type: "update" },
      { id: "2", author: "Alex Morrison", date: "2024-02-09", content: "Digital design in progress. Preliminary design looks great. Expected to complete design phase by EOD tomorrow.", type: "update" },
      { id: "3", author: "Dr. John Smith", date: "2024-02-09", content: "Design looks good! One minor adjustment - can we refine the proximal contact area slightly?", type: "feedback" },
    ],
  },
  "CASE-2024-002": {
    id: "CASE-2024-002",
    doctor: "Dr. Sarah Johnson",
    clinic: "Professional Dental Group",
    patient: "Michael Brown",
    dateCreated: "2024-02-06",
    dueDate: "2024-02-20",
    caseType: "E.max Bridge",
    tooth: "#35-37",
    shade: "A3",
    material: "E.max",
    margin: "Supragingival",
    status: "production",
    priority: "medium",
    progress: 75,
    prescription: {
      restorationType: "3-Unit Bridge",
      material: "E.max",
      shade: "A3",
      margin: "Supragingival",
      cementation: "Glass Ionomer",
      occlusion: "Group Function",
      specialNotes: "Bridge replacing #36. Check pontic design for hygiene access.",
    },
    workflow: [
      { step: "Intake", status: "completed", date: "2024-02-06" },
      { step: "Case Planning", status: "completed", date: "2024-02-06" },
      { step: "Digital Design", status: "completed", date: "2024-02-08" },
      { step: "CAM Milling", status: "in-progress", date: "2024-02-10" },
      { step: "Finishing", status: "pending", date: null },
      { step: "Quality Control", status: "pending", date: null },
      { step: "Delivery", status: "pending", date: null },
    ],
    notes: [
      { id: "1", author: "Sarah Thompson", date: "2024-02-06", content: "Case received and validated. All data complete.", type: "update" },
      { id: "2", author: "Sophie Johnson", date: "2024-02-08", content: "Design completed and approved. Moving to production.", type: "update" },
    ],
  },
  "CASE-2024-003": {
    id: "CASE-2024-003",
    doctor: "Dr. James Wilson",
    clinic: "Advanced Dental Solutions",
    patient: "Emily Garcia",
    dateCreated: "2024-02-05",
    dueDate: "2024-02-12",
    caseType: "Implant Crown",
    tooth: "#11",
    shade: "B1",
    material: "Zirconia",
    margin: "Platform-switched",
    status: "qc",
    priority: "high",
    progress: 90,
    prescription: {
      restorationType: "Implant-Supported Crown",
      material: "Zirconia",
      shade: "B1",
      margin: "Platform-switched",
      cementation: "Screw-Retained",
      occlusion: "Canine Guidance",
      specialNotes: "Ti-base abutment. Screw-retained design preferred. High aesthetic zone.",
    },
    workflow: [
      { step: "Intake", status: "completed", date: "2024-02-05" },
      { step: "Case Planning", status: "completed", date: "2024-02-05" },
      { step: "Digital Design", status: "completed", date: "2024-02-07" },
      { step: "CAM Milling", status: "completed", date: "2024-02-09" },
      { step: "Finishing", status: "completed", date: "2024-02-10" },
      { step: "Quality Control", status: "in-progress", date: "2024-02-11" },
      { step: "Delivery", status: "pending", date: null },
    ],
    notes: [
      { id: "1", author: "Dr. Robert Hammond", date: "2024-02-11", content: "QC inspection in progress. Initial checks look good.", type: "update" },
    ],
  },
};

// Generate a default case for unknown IDs
const defaultCase = (caseId: string) => ({
  id: caseId,
  doctor: "Unknown Doctor",
  clinic: "Unknown Clinic",
  patient: "Unknown Patient",
  dateCreated: new Date().toISOString().split("T")[0],
  dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
  caseType: "Standard Crown",
  tooth: "#0",
  shade: "A2",
  material: "Zirconia",
  margin: "Standard",
  status: "intake",
  priority: "medium",
  progress: 10,
  prescription: {
    restorationType: "Crown",
    material: "Zirconia",
    shade: "A2",
    margin: "Standard",
    cementation: "Adhesive Resin",
    occlusion: "Standard",
    specialNotes: "No special notes.",
  },
  workflow: [
    { step: "Intake", status: "in-progress", date: new Date().toISOString().split("T")[0] },
    { step: "Case Planning", status: "pending", date: null },
    { step: "Digital Design", status: "pending", date: null },
    { step: "CAM Milling", status: "pending", date: null },
    { step: "Finishing", status: "pending", date: null },
    { step: "Quality Control", status: "pending", date: null },
    { step: "Delivery", status: "pending", date: null },
  ],
  notes: [],
});

export default function CaseDetail() {
  const navigate = useNavigate();
  const { caseId } = useParams();
  const { t } = useTranslation();
  const [caseData, setCaseData] = useState<any>(allCasesData[caseId || ""] || defaultCase(caseId || "UNKNOWN"));

  const [notes, setNotes] = useState<CaseNote[]>(caseData.notes || []);
  const [newNote, setNewNote] = useState("");
  const [noteType, setNoteType] = useState<CaseNote["type"]>("update");
  const [workflow, setWorkflow] = useState<WorkflowStep[]>(caseData.workflow || []);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    shade: caseData.shade,
    margin: caseData.margin,
    priority: caseData.priority,
    dueDate: caseData.dueDate,
  });

  // Load real case data from API if available, fallback to local mock
  useEffect(() => {
    const id = caseId || "";
    if (!id) return;
    const load = async () => {
      try {
        const res = await fetch(`/api/cases/${id}`);
        if (res.ok) {
          const data = await res.json();
          setCaseData(data);
          setNotes(data.notes || []);
          setWorkflow(data.workflow || []);
          setEditData({
            shade: data.shade,
            margin: data.margin,
            priority: data.priority,
            dueDate: data.dueDate,
          });
        }
      } catch (e) {
        // ignore and keep local mock
      }
    };
    load();
  }, [caseId]);

  const progress = Math.round(
    (workflow.filter((s) => s.status === "completed").length / workflow.length) * 100
  );

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note: CaseNote = {
        id: Date.now().toString(),
        author: "Lab Team",
        date: new Date().toISOString().split("T")[0],
        content: newNote,
        type: noteType,
      };
      const updatedNotes = [note, ...notes];
      setNotes(updatedNotes);
      setNewNote("");
      // optimistically update server
      (async () => {
        try {
          await fetch(`/api/cases/${caseData.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...caseData, notes: updatedNotes }),
          });
        } catch (e) {
          // ignore
        }
      })();
    }
  };

  const handleDeleteNote = (noteId: string) => {
    const updated = notes.filter((n) => n.id !== noteId);
    setNotes(updated);
    (async () => {
      try {
        await fetch(`/api/cases/${caseData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...caseData, notes: updated }),
        });
      } catch (e) {
        // ignore
      }
    })();
  };

  const handleAdvanceWorkflow = (stepIndex: number) => {
    setWorkflow(
      workflow.map((step, idx) => {
        if (idx === stepIndex && step.status === "pending") {
          return { ...step, status: "in-progress", date: new Date().toISOString().split("T")[0] };
        }
        if (idx === stepIndex && step.status === "in-progress") {
          return { ...step, status: "completed", date: step.date || new Date().toISOString().split("T")[0] };
        }
        return step;
      })
    );
  };

  const handleSaveEdit = () => {
    const updated = { ...caseData, shade: editData.shade, margin: editData.margin, priority: editData.priority, dueDate: editData.dueDate };
    setCaseData(updated);
    setIsEditing(false);
    (async () => {
      try {
        await fetch(`/api/cases/${caseData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        });
      } catch (e) {
        // ignore
      }
    })();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4" />;
      case "in-progress": return <Clock className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-secondary rounded-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-foreground">{caseData.id}</h1>
              <span className={`text-xs px-2 py-1 rounded font-semibold ${
                caseData.priority === "high" ? "bg-red-100 text-red-800"
                : caseData.priority === "medium" ? "bg-amber-100 text-amber-800"
                : "bg-green-100 text-green-800"
              }`}>
                {caseData.priority} {t("common.priority").toLowerCase()}
              </span>
            </div>
            <p className="text-muted-foreground">
              {caseData.caseType} &bull; {caseData.patient} &bull; {caseData.doctor}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                {t("common.edit")}
              </Button>
              <Link to="/communication">
                <Button>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {t("caseDetail.contactDoctor")}
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="w-4 h-4 mr-2" />
                {t("common.cancel")}
              </Button>
              <Button onClick={handleSaveEdit}>
                <Save className="w-4 h-4 mr-2" />
                {t("cases.saveChanges")}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Case Info */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-lg font-bold text-foreground mb-6">{t("caseDetail.caseInformation")}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-muted-foreground mb-1">{t("cases.doctor")}</p>
                <p className="font-semibold text-foreground">{caseData.doctor}</p>
                <p className="text-xs text-muted-foreground">{caseData.clinic}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">{t("cases.patient")}</p>
                <p className="font-semibold text-foreground">{caseData.patient}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">{t("caseDetail.tooth")}</p>
                <p className="font-semibold text-foreground">{caseData.tooth}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">{t("caseDetail.materialLabel")}</p>
                <p className="font-semibold text-foreground">{caseData.material}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">{t("caseDetail.shadeLabel")}</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.shade}
                    onChange={(e) => setEditData({ ...editData, shade: e.target.value })}
                    className="w-full px-2 py-1 rounded border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <p className="font-semibold text-foreground">{editData.shade}</p>
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">{t("caseDetail.marginType")}</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.margin}
                    onChange={(e) => setEditData({ ...editData, margin: e.target.value })}
                    className="w-full px-2 py-1 rounded border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <p className="font-semibold text-foreground">{editData.margin}</p>
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">{t("caseDetail.createdDate")}</p>
                <p className="font-semibold text-foreground">{new Date(caseData.dateCreated).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">{t("cases.dueDate")}</p>
                {isEditing ? (
                  <input
                    type="date"
                    value={editData.dueDate}
                    onChange={(e) => setEditData({ ...editData, dueDate: e.target.value })}
                    className="w-full px-2 py-1 rounded border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <p className="font-semibold text-foreground">{new Date(editData.dueDate).toLocaleDateString()}</p>
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">{t("common.priority")}</p>
                {isEditing ? (
                  <select
                    value={editData.priority}
                    onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                    className="w-full px-2 py-1 rounded border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="low">{t("cases.low")}</option>
                    <option value="medium">{t("cases.medium")}</option>
                    <option value="high">{t("cases.high")}</option>
                  </select>
                ) : (
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                    editData.priority === "high" ? "bg-red-100 text-red-800"
                    : editData.priority === "medium" ? "bg-amber-100 text-amber-800"
                    : "bg-green-100 text-green-800"
                  }`}>
                    {editData.priority}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Prescription */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              {t("caseDetail.prescription")}
            </h2>
            <div className="space-y-4">
              {Object.entries(caseData.prescription).map(([key, value]) => (
                <div key={key} className="flex justify-between items-start py-3 border-b border-border last:border-b-0">
                  <span className="text-sm text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <span className="font-medium text-foreground text-right flex-1 ml-4">{value as string}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Workflow Progress */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-lg font-bold text-foreground mb-6">{t("caseDetail.workflowProgress")}</h2>
            <div className="space-y-4">
              {workflow.map((step, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <button
                    onClick={() => handleAdvanceWorkflow(idx)}
                    disabled={step.status === "completed" || (idx > 0 && workflow[idx - 1].status !== "completed" && step.status === "pending")}
                    className={`flex-shrink-0 p-2 rounded-lg ${getStatusColor(step.status)} ${
                      step.status !== "completed" && !(idx > 0 && workflow[idx - 1].status !== "completed" && step.status === "pending")
                        ? "cursor-pointer hover:ring-2 hover:ring-primary"
                        : "cursor-default"
                    } transition-all`}
                    title={
                      step.status === "pending" ? t("caseDetail.startStep") :
                      step.status === "in-progress" ? t("caseDetail.completeStep") :
                      t("caseDetail.done")
                    }
                  >
                    {getStatusIcon(step.status)}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm">{step.step}</p>
                    {step.date && (
                      <p className="text-xs text-muted-foreground">{new Date(step.date).toLocaleDateString()}</p>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${getStatusColor(step.status)}`}>
                    {step.status === "completed" ? t("caseDetail.done") : step.status === "in-progress" ? t("caseDetail.inProgress") : t("caseDetail.pendingStatus")}
                  </span>
                  {step.status !== "completed" && !(idx > 0 && workflow[idx - 1].status !== "completed" && step.status === "pending") && (
                    <button
                      onClick={() => handleAdvanceWorkflow(idx)}
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      {step.status === "pending" ? t("caseDetail.startStep") : t("caseDetail.completeStep")}
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">{t("caseDetail.caseStatus")}</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{t("caseDetail.overallProgress")}</span>
                  <span className="text-sm font-bold text-primary">{progress}%</span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      progress >= 90 ? "bg-green-500" : progress >= 60 ? "bg-blue-500" : progress >= 30 ? "bg-amber-500" : "bg-red-500"
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <div className="pt-2 border-t border-border">
                <span className={`inline-block px-3 py-1 text-sm font-semibold rounded ${
                  getStatusColor(workflow.find((s) => s.status === "in-progress")?.status || "pending")
                }`}>
                  {workflow.find((s) => s.status === "in-progress")?.step || t("caseDetail.allCompleted")}{" "}
                  {workflow.find((s) => s.status === "in-progress") ? t("caseDetail.phase") : ""}
                </span>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">{t("caseDetail.keyMetrics")}</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t("caseDetail.daysInLab")}</span>
                <span className="font-semibold text-foreground">
                  {Math.floor((Date.now() - new Date(caseData.dateCreated).getTime()) / 86400000)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t("caseDetail.daysRemaining")}</span>
                <span className={`font-semibold ${
                  Math.floor((new Date(editData.dueDate).getTime() - Date.now()) / 86400000) <= 1 ? "text-red-600" : "text-primary"
                }`}>
                  {Math.max(0, Math.floor((new Date(editData.dueDate).getTime() - Date.now()) / 86400000))}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t("caseDetail.stepsCompleted")}</span>
                <span className="font-semibold text-foreground">
                  {workflow.filter((s) => s.status === "completed").length}/{workflow.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t("caseDetail.onTimeRisk")}</span>
                <span className={`font-semibold ${
                  Math.floor((new Date(editData.dueDate).getTime() - Date.now()) / 86400000) <= 1 ? "text-red-600"
                  : Math.floor((new Date(editData.dueDate).getTime() - Date.now()) / 86400000) <= 3 ? "text-amber-600"
                  : "text-green-600"
                }`}>
                  {Math.floor((new Date(editData.dueDate).getTime() - Date.now()) / 86400000) <= 1 ? t("cases.high")
                    : Math.floor((new Date(editData.dueDate).getTime() - Date.now()) / 86400000) <= 3 ? t("cases.medium")
                    : t("cases.low")}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">{t("caseDetail.quickActions")}</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  // Rush: set all pending steps to urgent
                  alert(t("caseDetail.rushAlert"));
                }}
              >
                <Zap className="w-4 h-4 mr-2" />
                {t("caseDetail.rushProcessing")}
              </Button>
              <Link to="/quality-control" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  {t("qualityControl.qcChecklist")}
                </Button>
              </Link>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.print()}
              >
                <Printer className="w-4 h-4 mr-2" />
                {t("caseDetail.printPrescription")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="mt-8 bg-card border rounded-lg p-6">
        <h2 className="text-lg font-bold text-foreground mb-6">{t("caseDetail.caseNotes")}</h2>

        {/* Add Note */}
        <div className="mb-6 pb-6 border-b border-border">
          <div className="flex gap-3 mb-3">
            <select
              value={noteType}
              onChange={(e) => setNoteType(e.target.value as CaseNote["type"])}
              className="px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="update">{t("caseDetail.updateType")}</option>
              <option value="feedback">{t("caseDetail.feedbackType")}</option>
              <option value="issue">{t("caseDetail.issueType")}</option>
            </select>
          </div>
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder={t("caseDetail.addNote")}
            rows={3}
            className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
          <div className="flex gap-2 mt-3 justify-end">
            <Button variant="outline" onClick={() => setNewNote("")}>{t("caseDetail.clearBtn")}</Button>
            <Button onClick={handleAddNote} disabled={!newNote.trim()}>{t("common.postNote")}</Button>
          </div>
        </div>

        {/* Notes List */}
        <div className="space-y-4">
          {notes.length > 0 ? (
            notes.map((note) => (
              <div key={note.id} className="pb-4 border-b border-border last:border-b-0 last:pb-0 group">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-foreground">{note.author}</p>
                    <p className="text-xs text-muted-foreground">{new Date(note.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      note.type === "update" ? "bg-blue-100 text-blue-800"
                      : note.type === "feedback" ? "bg-amber-100 text-amber-800"
                      : "bg-red-100 text-red-800"
                    }`}>
                      {note.type.charAt(0).toUpperCase() + note.type.slice(1)}
                    </span>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-opacity"
                    >
                      <Trash2 className="w-3 h-3 text-red-600" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-foreground">{note.content}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">{t("caseDetail.noNotes")}</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
