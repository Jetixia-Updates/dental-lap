/**
 * Dental Lab Workflow Management System
 * نظام إدارة مراحل العمل - معمل لاستر لتركيبات الأسنان
 */

// ==================== ENUMS & CONSTANTS ====================

/** Case main categories */
export type CaseCategory = "fixed" | "removable" | "orthodontics";

/** Impression type for fixed cases */
export type ImpressionType = "physical_impression" | "intraoral_scan";

/** Case classification */
export type CaseClassification = "normal" | "implant";

/** Implant types */
export type ImplantType =
  | "open_tray"
  | "close_tray"
  | "scan_with_scan_body"
  | "scan_without_scan_body";

/** Technical review result */
export type TechnicalReviewResult = "accepted" | "rejected" | "doctor_review";

/** Fixed materials */
export type FixedMaterial =
  | "zirconia_monolithic"
  | "zirconia_cutback"
  | "zirconia_on_bar"
  | "zirconia_on_implant"
  | "emax_full"
  | "emax_cutback"
  | "pfm"
  | "pmma_temporary"
  | "pmma_milling";

/** Removable sub-types */
export type RemovableSubType =
  | "full_denture"
  | "partial_denture"
  | "flexible"
  | "night_guard"
  | "denture_repair"
  | "add_tooth"
  | "soft_relining"
  | "base_change"
  | "temporary_acrylic_crown";

/** Night guard type */
export type NightGuardType = "soft" | "hard";

/** Orthodontics types */
export type OrthodonticsType =
  | "twin_block"
  | "expansion_device"
  | "hawley_retainer"
  | "space_maintainer";

/** Final case status */
export type FinalStatus = "try_in" | "delivery";

/** User roles */
export type UserRole = "technician" | "admin";

/** Pause reasons */
export type PauseReason = "try_in" | "special_tray" | "bite_registration";

// ==================== WORKFLOW STAGES ====================

/** Fixed prosthodontics workflow stages */
export type FixedWorkflowStage =
  | "case_reception"
  | "technical_review"
  | "model_preparation"
  | "margin_marking"
  | "cad_design"
  | "milling_pressing"
  | "firing"
  | "build_up"
  | "finishing_glazing"
  | "final_review"
  | "ready";

/** Removable prosthodontics workflow stages */
export type RemovableWorkflowStage =
  | "case_reception"
  | "model_casting"
  | "special_tray"
  | "bite_registration"
  | "teeth_setting"
  | "acrylic_cooking"
  | "finishing_polishing"
  | "ready";

/** Stage status */
export type StageStatus = "pending" | "in_progress" | "completed" | "skipped" | "paused";

/** Department assignments for stages */
export type Department =
  | "reception"
  | "digital"
  | "porcelain"
  | "removable"
  | "orthodontics"
  | "management";

// ==================== INTERFACES ====================

/** Workflow step definition */
export interface WorkflowStep {
  id: string;
  stage: string;
  stageKey: string; // translation key
  department: Department;
  status: StageStatus;
  assignedTo?: string;
  startedAt?: string;
  completedAt?: string;
  notes?: string;
}

/** Pause record */
export interface PauseRecord {
  id: string;
  reason: PauseReason;
  pausedAt: string;
  pausedAtStage: string;
  resumedAt?: string;
  returnNotes?: string;
  doctorFeedback?: string;
}

/** File attachment */
export interface FileAttachment {
  id: string;
  name: string;
  url: string;
  type: string; // image, pdf, stl, etc.
  uploadedAt: string;
  uploadedBy: string;
}

/** Case note */
export interface CaseNote {
  id: string;
  caseId: string;
  author: string;
  note: string;
  timestamp: string;
  type: "update" | "issue" | "feedback" | "pause" | "resume";
}

/** Main Case model */
export interface DentalCase {
  id: string;

  // Basic info
  doctorName: string;
  patientName: string;
  toothNumbers: string;
  shade: string;
  priority: "normal" | "rush" | "emergency";
  dateReceived: string;
  dueDate: string;
  specialInstructions: string;

  // Category
  category: CaseCategory;

  // Fixed-specific fields
  impressionType?: ImpressionType;
  classification?: CaseClassification;
  implantType?: ImplantType;
  fixedMaterial?: FixedMaterial;
  technicalReviewResult?: TechnicalReviewResult;

  // Removable-specific fields
  removableSubType?: RemovableSubType;
  nightGuardType?: NightGuardType;
  nightGuardSize?: number; // in mm
  addToothCount?: number; // number of teeth added

  // Orthodontics-specific fields
  orthodonticsType?: OrthodonticsType;

  // Workflow
  workflow: WorkflowStep[];
  currentStageIndex: number;

  // Pause state
  isPaused: boolean;
  pauseHistory: PauseRecord[];

  // Final status
  finalStatus?: FinalStatus;

  // Attachments & notes
  attachments: FileAttachment[];
  notes: CaseNote[];

  // Custom product flag
  isCustomProduct?: boolean;
  customProductName?: string;
  customProductSteps?: string[];
}

/** Staff member */
export interface Staff {
  id: string;
  name: string;
  department: Department;
  role: UserRole;
  email: string;
  phone: string;
  status: "active" | "busy" | "offline";
}

// ==================== WORKFLOW LOGIC ====================

/** Get fixed workflow stages based on material */
export function getFixedWorkflowStages(material: FixedMaterial): WorkflowStep[] {
  const stages: WorkflowStep[] = [
    { id: "1", stage: "استلام الحالة", stageKey: "case_reception", department: "reception", status: "pending" },
    { id: "2", stage: "مراجعة فنية", stageKey: "technical_review", department: "reception", status: "pending" },
    { id: "3", stage: "تجهيز موديل", stageKey: "model_preparation", department: "reception", status: "pending" },
    { id: "4", stage: "تحديد المارجن", stageKey: "margin_marking", department: "digital", status: "pending" },
    { id: "5", stage: "التصميم CAD", stageKey: "cad_design", department: "digital", status: "pending" },
    { id: "6", stage: "الخراطة / الكبس", stageKey: "milling_pressing", department: "digital", status: "pending" },
  ];

  // PMMA: skip firing and build up
  if (material !== "pmma_temporary" && material !== "pmma_milling") {
    stages.push({ id: "7", stage: "الحرق", stageKey: "firing", department: "digital", status: "pending" });
  }

  // Build Up is mandatory for: Cut-Back, on Bar, PFM
  const needsBuildUp = [
    "zirconia_cutback",
    "zirconia_on_bar",
    "emax_cutback",
    "pfm",
  ].includes(material);

  if (needsBuildUp) {
    stages.push({ id: "8", stage: "Build Up", stageKey: "build_up", department: "porcelain", status: "pending" });
  }

  stages.push(
    { id: "9", stage: "التشطيب والتزجيج", stageKey: "finishing_glazing", department: "porcelain", status: "pending" },
    { id: "10", stage: "مراجعة نهائية", stageKey: "final_review", department: "management", status: "pending" },
    { id: "11", stage: "جاهز", stageKey: "ready", department: "reception", status: "pending" }
  );

  // Re-number IDs sequentially
  return stages.map((s, i) => ({ ...s, id: String(i + 1) }));
}

/** Get removable workflow stages */
export function getRemovableWorkflowStages(subType: RemovableSubType): WorkflowStep[] {
  // Standard removable workflow
  const standardStages: WorkflowStep[] = [
    { id: "1", stage: "استلام الحالة", stageKey: "case_reception", department: "reception", status: "pending" },
    { id: "2", stage: "صب الموديل", stageKey: "model_casting", department: "removable", status: "pending" },
    { id: "3", stage: "Special Tray", stageKey: "special_tray", department: "removable", status: "pending" },
    { id: "4", stage: "Bite Registration", stageKey: "bite_registration", department: "removable", status: "pending" },
    { id: "5", stage: "رص الأسنان", stageKey: "teeth_setting", department: "removable", status: "pending" },
    { id: "6", stage: "طبخ الأكريل / الفليكس", stageKey: "acrylic_cooking", department: "removable", status: "pending" },
    { id: "7", stage: "التشطيب والتلميع", stageKey: "finishing_polishing", department: "removable", status: "pending" },
    { id: "8", stage: "جاهز", stageKey: "ready", department: "reception", status: "pending" },
  ];

  // Simplified stages for certain sub-types
  const simpleSubTypes: RemovableSubType[] = [
    "night_guard",
    "denture_repair",
    "add_tooth",
    "soft_relining",
    "base_change",
    "temporary_acrylic_crown",
  ];

  if (simpleSubTypes.includes(subType)) {
    return [
      { id: "1", stage: "استلام الحالة", stageKey: "case_reception", department: "reception", status: "pending" },
      { id: "2", stage: "صب الموديل", stageKey: "model_casting", department: "removable", status: "pending" },
      { id: "3", stage: "التنفيذ", stageKey: "execution", department: "removable", status: "pending" },
      { id: "4", stage: "التشطيب والتلميع", stageKey: "finishing_polishing", department: "removable", status: "pending" },
      { id: "5", stage: "جاهز", stageKey: "ready", department: "reception", status: "pending" },
    ];
  }

  return standardStages;
}

/** Get orthodontics workflow stages */
export function getOrthodonticsWorkflowStages(): WorkflowStep[] {
  return [
    { id: "1", stage: "استلام الحالة", stageKey: "case_reception", department: "reception", status: "pending" },
    { id: "2", stage: "صب الموديل", stageKey: "model_casting", department: "orthodontics", status: "pending" },
    { id: "3", stage: "التصنيع", stageKey: "fabrication", department: "orthodontics", status: "pending" },
    { id: "4", stage: "التشطيب والتلميع", stageKey: "finishing_polishing", department: "orthodontics", status: "pending" },
    { id: "5", stage: "جاهز", stageKey: "ready", department: "reception", status: "pending" },
  ];
}

/** Check if a stage triggers auto-pause */
export function shouldAutoPause(stageKey: string): PauseReason | null {
  switch (stageKey) {
    case "ready":
      return "try_in";
    case "special_tray":
      return "special_tray";
    case "bite_registration":
      return "bite_registration";
    default:
      return null;
  }
}

/** Material display names (Arabic) */
export const FIXED_MATERIAL_NAMES: Record<FixedMaterial, string> = {
  zirconia_monolithic: "Zirconia Monolithic",
  zirconia_cutback: "Zirconia Cut-Back",
  zirconia_on_bar: "Zirconia on Bar",
  zirconia_on_implant: "Zirconia on Implant",
  emax_full: "E.max Full Contour",
  emax_cutback: "E.max Cut-Back",
  pfm: "PFM",
  pmma_temporary: "PMMA Temporary",
  pmma_milling: "PMMA Milling",
};

/** Removable sub-type display names */
export const REMOVABLE_SUBTYPE_NAMES: Record<RemovableSubType, string> = {
  full_denture: "طقم كامل",
  partial_denture: "طقم جزئي",
  flexible: "فليكس",
  night_guard: "Night Guard",
  denture_repair: "تصليح طقم",
  add_tooth: "إضافة سنة",
  soft_relining: "تبطين سوفت",
  base_change: "تغيير قاعدة",
  temporary_acrylic_crown: "طربوش مؤقت أكريل",
};

/** Orthodontics type display names */
export const ORTHODONTICS_TYPE_NAMES: Record<OrthodonticsType, string> = {
  twin_block: "توين بلوك",
  expansion_device: "جهاز توسيع",
  hawley_retainer: "هاولي ريتينر",
  space_maintainer: "حافظ مسافة",
};

/** Implant type display names */
export const IMPLANT_TYPE_NAMES: Record<ImplantType, string> = {
  open_tray: "Open Tray",
  close_tray: "Close Tray",
  scan_with_scan_body: "Scan with Scan Body",
  scan_without_scan_body: "Scan without Scan Body",
};

/** Demo response */
export interface DemoResponse {
  message: string;
}
