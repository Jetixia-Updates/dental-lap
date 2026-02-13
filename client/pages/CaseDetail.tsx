import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useLabContext } from "@/contexts/LabContext";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertCircle,
  Pause,
  Play,
  Upload,
  FileText,
  Image,
  Trash2,
  ChevronRight,
  SkipForward,
  MessageSquare,
  Shield,
  Package,
  Send,
} from "lucide-react";
import {
  FIXED_MATERIAL_NAMES,
  REMOVABLE_SUBTYPE_NAMES,
  ORTHODONTICS_TYPE_NAMES,
  IMPLANT_TYPE_NAMES,
  PauseReason,
  FinalStatus,
  DentalCase,
} from "@shared/api";

export default function CaseDetail() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    getCase,
    advanceStage,
    pauseCase,
    resumeCase,
    setFinalStatus,
    addCaseNote,
    addAttachment,
    removeAttachment,
    skipStage,
    currentUserRole,
  } = useLabContext();

  const caseData = getCase(caseId || "");

  // Local state
  const [newNote, setNewNote] = useState("");
  const [noteType, setNoteType] = useState<"update" | "issue" | "feedback">("update");
  const [resumeNotes, setResumeNotes] = useState("");
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [showPauseDialog, setShowPauseDialog] = useState(false);
  const [pauseReason, setPauseReason] = useState<PauseReason>("try_in");

  if (!caseData) {
    return (
      <Layout>
        <div className="text-center py-16">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">{t("caseDetail.notFound")}</h2>
          <p className="text-muted-foreground mb-4">{t("caseDetail.notFoundDesc")}</p>
          <Button onClick={() => navigate("/cases")}>{t("caseDetail.backToCases")}</Button>
        </div>
      </Layout>
    );
  }

  const progress = useMemo(() => {
    const completed = caseData.workflow.filter(
      (s) => s.status === "completed" || s.status === "skipped"
    ).length;
    return Math.round((completed / caseData.workflow.length) * 100);
  }, [caseData.workflow]);

  const currentStage = caseData.workflow[caseData.currentStageIndex];

  const getCategoryLabel = () => {
    switch (caseData.category) {
      case "fixed": return t("casesPage.fixedLabel");
      case "removable": return t("casesPage.removableLabel");
      case "orthodontics": return t("casesPage.orthoLabel");
    }
  };

  const getMaterialLabel = () => {
    if (caseData.category === "fixed" && caseData.fixedMaterial) {
      return FIXED_MATERIAL_NAMES[caseData.fixedMaterial];
    }
    if (caseData.category === "removable" && caseData.removableSubType) {
      return REMOVABLE_SUBTYPE_NAMES[caseData.removableSubType];
    }
    if (caseData.category === "orthodontics" && caseData.orthodonticsType) {
      return ORTHODONTICS_TYPE_NAMES[caseData.orthodonticsType];
    }
    return "";
  };

  const handleAdvanceStage = () => {
    if (caseData.isPaused) return;
    advanceStage(caseData.id);
  };

  const handlePause = () => {
    pauseCase(caseData.id, pauseReason);
    addCaseNote(
      caseData.id,
      "النظام",
      `تم إيقاف الحالة مؤقتاً - السبب: ${getPauseReasonLabel(pauseReason)}`,
      "pause"
    );
    setShowPauseDialog(false);
  };

  const handleResume = () => {
    resumeCase(caseData.id, resumeNotes);
    addCaseNote(
      caseData.id,
      "النظام",
      `تم استكمال الحالة بعد الرجوع من الطبيب${resumeNotes ? ` - ملاحظات: ${resumeNotes}` : ""}`,
      "resume"
    );
    setResumeNotes("");
    setShowResumeDialog(false);
  };

  const handleSetFinalStatus = (status: FinalStatus) => {
    setFinalStatus(caseData.id, status);
    if (status === "try_in") {
      addCaseNote(caseData.id, "النظام", "تم تحويل الحالة إلى Try-In وإيقافها مؤقتاً", "pause");
    } else {
      addCaseNote(caseData.id, "النظام", "تم تسليم الحالة - Delivery", "update");
    }
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      addCaseNote(caseData.id, "فريق العمل", newNote, noteType);
      setNewNote("");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((f) => {
      addAttachment(caseData.id, {
        name: f.name,
        url: URL.createObjectURL(f),
        type: f.type.startsWith("image") ? "image" : "file",
        uploadedAt: new Date().toISOString(),
        uploadedBy: "current_user",
      });
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "in_progress": return <Clock className="w-5 h-5 text-blue-600" />;
      case "skipped": return <SkipForward className="w-5 h-5 text-gray-400" />;
      case "paused": return <Pause className="w-5 h-5 text-amber-600" />;
      default: return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-50 border-green-200";
      case "in_progress": return "bg-blue-50 border-blue-200";
      case "skipped": return "bg-gray-50 border-gray-200";
      case "paused": return "bg-amber-50 border-amber-200";
      default: return "bg-white border-gray-200";
    }
  };

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/cases")}
            className="p-2 hover:bg-secondary rounded-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-foreground">{caseData.id}</h1>
              <span className="text-xs px-2 py-1 rounded font-medium bg-primary/10 text-primary">
                {getCategoryLabel()}
              </span>
              <span className={`text-xs px-2 py-1 rounded font-semibold ${
                caseData.priority === "emergency"
                  ? "bg-red-100 text-red-800"
                  : caseData.priority === "rush"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-green-100 text-green-800"
              }`}>
                {caseData.priority}
              </span>
              {caseData.isPaused && (
                <span className="text-xs px-2 py-1 rounded font-semibold bg-amber-100 text-amber-800 flex items-center gap-1">
                  <Pause className="w-3 h-3" />
                  {t("caseDetail.paused")}
                </span>
              )}
              {caseData.classification === "implant" && (
                <span className="text-xs px-2 py-1 rounded font-semibold bg-blue-100 text-blue-800">
                  Implant
                </span>
              )}
            </div>
            <p className="text-muted-foreground text-sm mt-1">
              {getMaterialLabel()} &bull; {caseData.doctorName} &bull; {caseData.patientName}
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {caseData.isPaused ? (
            <Button onClick={() => setShowResumeDialog(true)} className="bg-green-600 hover:bg-green-700">
              <Play className="w-4 h-4 mr-2" />
              {t("caseDetail.resumeWork")}
            </Button>
          ) : (
            <>
              {!caseData.finalStatus && (
                <Button variant="outline" onClick={() => setShowPauseDialog(true)}>
                  <Pause className="w-4 h-4 mr-2" />
                  {t("caseDetail.pauseCase")}
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Pause Banner */}
      {caseData.isPaused && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Pause className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-amber-800">{t("caseDetail.casePaused")}</h3>
              <p className="text-sm text-amber-700 mt-1">{t("caseDetail.casePausedDesc")}</p>
              {caseData.pauseHistory.length > 0 && (
                <div className="mt-3 space-y-2">
                  {caseData.pauseHistory.map((p, idx) => (
                    <div key={p.id} className="text-xs text-amber-700 bg-amber-100/50 p-2 rounded">
                      <span className="font-medium">
                        {t("caseDetail.pauseReason")}: {getPauseReasonLabel(p.reason)}
                      </span>
                      <span className="mx-2">|</span>
                      <span>{new Date(p.pausedAt).toLocaleString("ar-EG")}</span>
                      {p.resumedAt && (
                        <>
                          <span className="mx-2">→</span>
                          <span className="text-green-700">
                            {t("caseDetail.resumed")}: {new Date(p.resumedAt).toLocaleString("ar-EG")}
                          </span>
                        </>
                      )}
                      {p.returnNotes && (
                        <p className="mt-1">{t("caseDetail.returnNotes")}: {p.returnNotes}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Case Information */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">{t("caseDetail.caseInformation")}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <InfoItem label={t("caseDetail.doctor")} value={caseData.doctorName} />
              <InfoItem label={t("caseDetail.patient")} value={caseData.patientName} />
              {caseData.toothNumbers && caseData.toothNumbers !== "-" && (
                <InfoItem label={t("caseDetail.tooth")} value={caseData.toothNumbers} />
              )}
              {caseData.shade && caseData.shade !== "-" && (
                <InfoItem label={t("caseDetail.shade")} value={caseData.shade} />
              )}
              <InfoItem label={t("caseDetail.material")} value={getMaterialLabel()} />
              <InfoItem label={t("caseDetail.createdDate")} value={new Date(caseData.dateReceived).toLocaleDateString("ar-EG")} />
              <InfoItem label={t("caseDetail.dueDate")} value={new Date(caseData.dueDate).toLocaleDateString("ar-EG")} />

              {/* Fixed-specific info */}
              {caseData.category === "fixed" && (
                <>
                  <InfoItem
                    label={t("caseDetail.impressionType")}
                    value={caseData.impressionType === "intraoral_scan" ? "Intraoral Scan" : "Physical Impression"}
                  />
                  {caseData.classification === "implant" && caseData.implantType && (
                    <InfoItem
                      label={t("caseDetail.implantType")}
                      value={IMPLANT_TYPE_NAMES[caseData.implantType]}
                    />
                  )}
                </>
              )}

              {/* Removable-specific info */}
              {caseData.nightGuardType && (
                <InfoItem label={t("caseDetail.nightGuardType")} value={`${caseData.nightGuardType} - ${caseData.nightGuardSize}mm`} />
              )}
              {caseData.addToothCount && (
                <InfoItem label={t("caseDetail.addToothCount")} value={String(caseData.addToothCount)} />
              )}
            </div>
            {caseData.specialInstructions && (
              <div className="mt-4 p-3 bg-secondary/30 rounded-md">
                <p className="text-xs text-muted-foreground mb-1">{t("caseDetail.specialInstructions")}</p>
                <p className="text-sm text-foreground">{caseData.specialInstructions}</p>
              </div>
            )}
          </div>

          {/* Workflow Progress */}
          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground">{t("caseDetail.workflowProgress")}</h2>
              <span className="text-sm font-medium text-primary">{progress}%</span>
            </div>

            {/* Progress Bar */}
            <div className="h-3 bg-secondary rounded-full overflow-hidden mb-6">
              <div
                className={`h-full transition-all ${
                  progress >= 90 ? "bg-green-500" : progress >= 60 ? "bg-blue-500" : progress >= 30 ? "bg-amber-500" : "bg-red-500"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Workflow Steps */}
            <div className="space-y-3">
              {caseData.workflow.map((step, idx) => {
                const isCurrentStep = idx === caseData.currentStageIndex;
                const canAdvance =
                  isCurrentStep &&
                  step.status === "in_progress" &&
                  !caseData.isPaused;

                return (
                  <div
                    key={step.id}
                    className={`flex items-center gap-4 p-3 rounded-lg border transition-all ${
                      getStatusBg(step.status)
                    } ${isCurrentStep ? "ring-2 ring-primary/30" : ""}`}
                  >
                    {/* Step number & icon */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="w-7 h-7 rounded-full bg-background border flex items-center justify-center text-xs font-bold text-muted-foreground">
                        {idx + 1}
                      </span>
                      {getStatusIcon(step.status)}
                    </div>

                    {/* Step info */}
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm ${
                        step.status === "skipped" ? "text-gray-400 line-through" : "text-foreground"
                      }`}>
                        {step.stage}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {getDepartmentLabel(step.department)}
                        {step.completedAt && (
                          <> &bull; {new Date(step.completedAt).toLocaleDateString("ar-EG")}</>
                        )}
                      </p>
                    </div>

                    {/* Status badge */}
                    <span className={`text-xs px-2 py-1 rounded whitespace-nowrap font-medium ${
                      step.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : step.status === "in_progress"
                        ? "bg-blue-100 text-blue-800"
                        : step.status === "skipped"
                        ? "bg-gray-100 text-gray-500"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {getStatusLabel(step.status, t)}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      {canAdvance && (
                        <Button size="sm" onClick={handleAdvanceStage}>
                          <CheckCircle className="w-3.5 h-3.5 mr-1" />
                          {t("caseDetail.completeStep")}
                        </Button>
                      )}
                      {step.status === "pending" && currentUserRole === "admin" && (
                        <button
                          onClick={() => skipStage(caseData.id, idx)}
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                          title={t("caseDetail.skipStep")}
                        >
                          <SkipForward className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Final Status Buttons */}
            {progress >= 90 && !caseData.finalStatus && !caseData.isPaused && (
              <div className="mt-6 p-4 bg-secondary/30 rounded-lg">
                <h3 className="font-semibold text-foreground mb-3">{t("caseDetail.finalStatus")}</h3>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleSetFinalStatus("try_in")}
                    className="flex-1"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Try-In
                  </Button>
                  <Button
                    onClick={() => handleSetFinalStatus("delivery")}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Delivery
                  </Button>
                </div>
              </div>
            )}

            {caseData.finalStatus && (
              <div className={`mt-6 p-4 rounded-lg ${
                caseData.finalStatus === "delivery"
                  ? "bg-green-50 border border-green-200"
                  : "bg-amber-50 border border-amber-200"
              }`}>
                <div className="flex items-center gap-2">
                  {caseData.finalStatus === "delivery" ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <Send className="w-5 h-5 text-amber-600" />
                  )}
                  <p className="font-semibold">
                    {caseData.finalStatus === "delivery" ? t("caseDetail.delivered") : "Try-In"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Notes Section */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">{t("caseDetail.caseNotes")}</h2>

            {/* Add Note */}
            <div className="mb-6 pb-6 border-b border-border">
              <div className="flex gap-2 mb-3">
                <select
                  value={noteType}
                  onChange={(e) => setNoteType(e.target.value as any)}
                  className="px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm"
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
              <div className="flex justify-end mt-3">
                <Button onClick={handleAddNote} disabled={!newNote.trim()}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {t("caseDetail.postNote")}
                </Button>
              </div>
            </div>

            {/* Notes list */}
            <div className="space-y-3">
              {caseData.notes.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">{t("caseDetail.noNotes")}</p>
              ) : (
                [...caseData.notes].reverse().map((note) => (
                  <div key={note.id} className="p-3 rounded-md border border-border">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-foreground">{note.author}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded ${getNoteTypeColor(note.type)}`}>
                          {getNoteTypeLabel(note.type, t)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(note.timestamp).toLocaleString("ar-EG")}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-foreground">{note.note}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress Card */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">{t("caseDetail.caseStatus")}</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t("caseDetail.overallProgress")}</span>
                <span className="font-bold text-primary">{progress}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t("caseDetail.daysInLab")}</span>
                <span className="font-semibold text-foreground">
                  {Math.floor((Date.now() - new Date(caseData.dateReceived).getTime()) / 86400000)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t("caseDetail.daysRemaining")}</span>
                <span className={`font-semibold ${
                  Math.floor((new Date(caseData.dueDate).getTime() - Date.now()) / 86400000) <= 1
                    ? "text-red-600"
                    : "text-green-600"
                }`}>
                  {Math.max(0, Math.floor((new Date(caseData.dueDate).getTime() - Date.now()) / 86400000))}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t("caseDetail.stepsCompleted")}</span>
                <span className="font-semibold text-foreground">
                  {caseData.workflow.filter((s) => s.status === "completed" || s.status === "skipped").length}/
                  {caseData.workflow.length}
                </span>
              </div>
              {currentStage && (
                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1">{t("caseDetail.currentPhase")}</p>
                  <p className="font-semibold text-foreground">{currentStage.stage}</p>
                  <p className="text-xs text-muted-foreground">{getDepartmentLabel(currentStage.department)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Attachments */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">{t("caseDetail.attachments")}</h3>
            <label className="block cursor-pointer mb-4">
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">{t("caseDetail.uploadFiles")}</p>
              </div>
              <input
                type="file"
                multiple
                accept="image/*,.pdf,.stl"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {caseData.attachments.length > 0 ? (
              <div className="space-y-2">
                {caseData.attachments.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-2 bg-secondary/30 rounded-md group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {file.type === "image" ? (
                        <Image className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      ) : (
                        <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className="text-sm text-foreground truncate">{file.name}</span>
                    </div>
                    <button
                      onClick={() => removeAttachment(caseData.id, file.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-opacity"
                    >
                      <Trash2 className="w-3 h-3 text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center">{t("caseDetail.noAttachments")}</p>
            )}
          </div>

          {/* Role indicator */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-bold text-foreground mb-3">{t("caseDetail.permissions")}</h3>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground">
                {currentUserRole === "admin" ? t("caseDetail.adminRole") : t("caseDetail.techRole")}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {currentUserRole === "admin"
                ? t("caseDetail.adminRoleDesc")
                : t("caseDetail.techRoleDesc")}
            </p>
          </div>
        </div>
      </div>

      {/* Resume Dialog */}
      {showResumeDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-lg font-bold text-foreground mb-2">{t("caseDetail.resumeTitle")}</h2>
              <p className="text-sm text-muted-foreground mb-4">{t("caseDetail.resumeDesc")}</p>

              {/* Show previous pause info */}
              {caseData.pauseHistory.length > 0 && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <p className="text-xs font-medium text-amber-800 mb-1">{t("caseDetail.lastPauseInfo")}</p>
                  <p className="text-xs text-amber-700">
                    {getPauseReasonLabel(caseData.pauseHistory[caseData.pauseHistory.length - 1].reason)}
                    {" - "}
                    {new Date(caseData.pauseHistory[caseData.pauseHistory.length - 1].pausedAt).toLocaleString("ar-EG")}
                  </p>
                </div>
              )}

              <textarea
                value={resumeNotes}
                onChange={(e) => setResumeNotes(e.target.value)}
                placeholder={t("caseDetail.resumeNotesPlaceholder")}
                rows={4}
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
            <div className="flex gap-3 p-6 pt-0 justify-end">
              <Button variant="outline" onClick={() => setShowResumeDialog(false)}>
                {t("common.cancel")}
              </Button>
              <Button onClick={handleResume} className="bg-green-600 hover:bg-green-700">
                <Play className="w-4 h-4 mr-2" />
                {t("caseDetail.confirmResume")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Pause Dialog */}
      {showPauseDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-lg font-bold text-foreground mb-2">{t("caseDetail.pauseTitle")}</h2>
              <p className="text-sm text-muted-foreground mb-4">{t("caseDetail.pauseDesc")}</p>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t("caseDetail.pauseReason")}
              </label>
              <select
                value={pauseReason}
                onChange={(e) => setPauseReason(e.target.value as PauseReason)}
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="try_in">Try-In</option>
                <option value="special_tray">Special Tray</option>
                <option value="bite_registration">Bite Registration</option>
              </select>
            </div>
            <div className="flex gap-3 p-6 pt-0 justify-end">
              <Button variant="outline" onClick={() => setShowPauseDialog(false)}>
                {t("common.cancel")}
              </Button>
              <Button onClick={handlePause} className="bg-amber-600 hover:bg-amber-700">
                <Pause className="w-4 h-4 mr-2" />
                {t("caseDetail.confirmPause")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

// ==================== Helper components & functions ====================

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="font-semibold text-foreground text-sm">{value || "-"}</p>
    </div>
  );
}

function getDepartmentLabel(dept: string): string {
  const labels: Record<string, string> = {
    reception: "قسم الاستقبال",
    digital: "قسم الديجيتال",
    porcelain: "قسم البورسلين",
    removable: "قسم المتحركة",
    orthodontics: "قسم التقويم",
    management: "الإدارة",
  };
  return labels[dept] || dept;
}

function getStatusLabel(status: string, t: any): string {
  switch (status) {
    case "completed": return t("caseDetail.statusCompleted");
    case "in_progress": return t("caseDetail.statusInProgress");
    case "skipped": return t("caseDetail.statusSkipped");
    case "paused": return t("caseDetail.statusPaused");
    default: return t("caseDetail.statusPending");
  }
}

function getPauseReasonLabel(reason: string): string {
  switch (reason) {
    case "try_in": return "Try-In";
    case "special_tray": return "Special Tray";
    case "bite_registration": return "Bite Registration";
    default: return reason;
  }
}

function getNoteTypeColor(type: string): string {
  switch (type) {
    case "update": return "bg-blue-100 text-blue-800";
    case "feedback": return "bg-purple-100 text-purple-800";
    case "issue": return "bg-red-100 text-red-800";
    case "pause": return "bg-amber-100 text-amber-800";
    case "resume": return "bg-green-100 text-green-800";
    default: return "bg-gray-100 text-gray-800";
  }
}

function getNoteTypeLabel(type: string, t: any): string {
  switch (type) {
    case "update": return t("caseDetail.updateType");
    case "feedback": return t("caseDetail.feedbackType");
    case "issue": return t("caseDetail.issueType");
    case "pause": return t("caseDetail.pauseType");
    case "resume": return t("caseDetail.resumeType");
    default: return type;
  }
}
