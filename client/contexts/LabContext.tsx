import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import {
  DentalCase,
  Staff,
  CaseNote,
  WorkflowStep,
  PauseRecord,
  FileAttachment,
  CaseCategory,
  FixedMaterial,
  RemovableSubType,
  OrthodonticsType,
  UserRole,
  PauseReason,
  FinalStatus,
  getFixedWorkflowStages,
  getRemovableWorkflowStages,
  getOrthodonticsWorkflowStages,
  shouldAutoPause,
} from "@shared/api";

// ==================== CONTEXT TYPES ====================

interface LabContextType {
  // Data
  cases: DentalCase[];
  staff: Staff[];
  currentUserRole: UserRole;
  isLoading: boolean;

  // Case CRUD
  addCase: (caseData: Partial<DentalCase>) => Promise<DentalCase>;
  updateCase: (id: string, updates: Partial<DentalCase>) => Promise<void>;
  deleteCase: (id: string) => Promise<void>;
  getCase: (id: string) => DentalCase | undefined;

  // Workflow actions
  advanceStage: (caseId: string) => Promise<void>;
  completeCurrentStage: (caseId: string) => Promise<void>;
  skipStage: (caseId: string, stageIndex: number) => Promise<void>;

  // Pause/Resume
  pauseCase: (caseId: string, reason: PauseReason) => Promise<void>;
  resumeCase: (caseId: string, returnNotes?: string) => Promise<void>;

  // Final status
  setFinalStatus: (caseId: string, status: FinalStatus) => void;

  // Notes
  addCaseNote: (caseId: string, author: string, note: string, type: CaseNote["type"]) => void;

  // Attachments
  addAttachment: (caseId: string, attachment: Omit<FileAttachment, "id">) => void;
  removeAttachment: (caseId: string, attachmentId: string) => void;

  // Staff
  addStaff: (staffData: Omit<Staff, "id">) => void;
  updateStaff: (id: string, updates: Partial<Staff>) => void;

  // Filters
  getCasesByCategory: (category: CaseCategory) => DentalCase[];
  getCasesByDepartment: (department: string) => DentalCase[];
  getPausedCases: () => DentalCase[];
  getActiveCases: () => DentalCase[];

  // User role
  setCurrentUserRole: (role: UserRole) => void;

  // Custom products
  addCustomProduct: (
    name: string,
    category: CaseCategory,
    steps: { stage: string; stageKey: string; department: string }[]
  ) => void;
}

const LabContext = createContext<LabContextType | undefined>(undefined);

// ==================== SAMPLE DATA ====================

const sampleCases: DentalCase[] = [
  {
    id: "CASE-001",
    doctorName: "د. أحمد محمد",
    patientName: "محمد علي",
    toothNumbers: "14, 15",
    shade: "A2",
    priority: "normal",
    dateReceived: "2026-02-05",
    dueDate: "2026-02-12",
    specialInstructions: "",
    category: "fixed",
    impressionType: "physical_impression",
    classification: "normal",
    fixedMaterial: "zirconia_monolithic",
    workflow: getFixedWorkflowStages("zirconia_monolithic").map((s, i) => ({
      ...s,
      status: i < 3 ? "completed" as const : i === 3 ? "in_progress" as const : "pending" as const,
      startedAt: i <= 3 ? "2026-02-05T10:00:00" : undefined,
      completedAt: i < 3 ? "2026-02-06T14:00:00" : undefined,
    })),
    currentStageIndex: 3,
    isPaused: false,
    pauseHistory: [],
    finalStatus: undefined,
    attachments: [],
    notes: [
      {
        id: "note-1",
        caseId: "CASE-001",
        author: "موظف الاستقبال",
        note: "تم استلام الحالة والتحقق",
        timestamp: "2026-02-05T10:00:00",
        type: "update",
      },
    ],
  },
  {
    id: "CASE-002",
    doctorName: "د. سارة أحمد",
    patientName: "فاطمة حسن",
    toothNumbers: "21",
    shade: "B1",
    priority: "rush",
    dateReceived: "2026-02-06",
    dueDate: "2026-02-09",
    specialInstructions: "Match adjacent teeth",
    category: "fixed",
    impressionType: "intraoral_scan",
    classification: "implant",
    implantType: "open_tray",
    fixedMaterial: "zirconia_cutback",
    workflow: getFixedWorkflowStages("zirconia_cutback").map((s, i) => ({
      ...s,
      status: i < 5 ? "completed" as const : i === 5 ? "in_progress" as const : "pending" as const,
      startedAt: i <= 5 ? "2026-02-06T09:00:00" : undefined,
      completedAt: i < 5 ? "2026-02-07T16:00:00" : undefined,
    })),
    currentStageIndex: 5,
    isPaused: false,
    pauseHistory: [],
    finalStatus: undefined,
    attachments: [],
    notes: [],
  },
  {
    id: "CASE-003",
    doctorName: "د. خالد يوسف",
    patientName: "أحمد إبراهيم",
    toothNumbers: "-",
    shade: "-",
    priority: "normal",
    dateReceived: "2026-02-08",
    dueDate: "2026-02-15",
    specialInstructions: "",
    category: "removable",
    removableSubType: "full_denture",
    workflow: getRemovableWorkflowStages("full_denture").map((s, i) => ({
      ...s,
      status: i < 2 ? "completed" as const : i === 2 ? "in_progress" as const : "pending" as const,
      startedAt: i <= 2 ? "2026-02-08T09:00:00" : undefined,
      completedAt: i < 2 ? "2026-02-09T12:00:00" : undefined,
    })),
    currentStageIndex: 2,
    isPaused: false,
    pauseHistory: [],
    finalStatus: undefined,
    attachments: [],
    notes: [],
  },
  {
    id: "CASE-004",
    doctorName: "د. ليلى محمود",
    patientName: "سمير حسين",
    toothNumbers: "-",
    shade: "-",
    priority: "normal",
    dateReceived: "2026-02-10",
    dueDate: "2026-02-17",
    specialInstructions: "حجم 3 مم",
    category: "removable",
    removableSubType: "night_guard",
    nightGuardType: "hard",
    nightGuardSize: 3,
    workflow: getRemovableWorkflowStages("night_guard").map((s, i) => ({
      ...s,
      status: i === 0 ? "completed" as const : i === 1 ? "in_progress" as const : "pending" as const,
    })),
    currentStageIndex: 1,
    isPaused: false,
    pauseHistory: [],
    finalStatus: undefined,
    attachments: [],
    notes: [],
  },
  {
    id: "CASE-005",
    doctorName: "د. عمر سعيد",
    patientName: "ياسمين علي",
    toothNumbers: "-",
    shade: "-",
    priority: "normal",
    dateReceived: "2026-02-11",
    dueDate: "2026-02-20",
    specialInstructions: "",
    category: "orthodontics",
    orthodonticsType: "hawley_retainer",
    workflow: getOrthodonticsWorkflowStages().map((s, i) => ({
      ...s,
      status: i === 0 ? "in_progress" as const : "pending" as const,
    })),
    currentStageIndex: 0,
    isPaused: false,
    pauseHistory: [],
    finalStatus: undefined,
    attachments: [],
    notes: [],
  },
];

const sampleStaff: Staff[] = [
  { id: "staff-1", name: "أحمد محمد", department: "reception", role: "technician", email: "ahmed@lab.com", phone: "+20 123 456 7890", status: "active" },
  { id: "staff-2", name: "سارة علي", department: "digital", role: "technician", email: "sara@lab.com", phone: "+20 123 456 7891", status: "busy" },
  { id: "staff-3", name: "محمد حسن", department: "digital", role: "technician", email: "mohamed@lab.com", phone: "+20 123 456 7892", status: "active" },
  { id: "staff-4", name: "ليلى أحمد", department: "porcelain", role: "technician", email: "layla@lab.com", phone: "+20 123 456 7893", status: "active" },
  { id: "staff-5", name: "يوسف إبراهيم", department: "management", role: "admin", email: "yousef@lab.com", phone: "+20 123 456 7894", status: "active" },
  { id: "staff-6", name: "منى خالد", department: "removable", role: "technician", email: "mona@lab.com", phone: "+20 123 456 7895", status: "active" },
];

// ==================== PROVIDER ====================

export function LabProvider({ children }: { children: ReactNode }) {
  const [cases, setCases] = useState<DentalCase[]>([]);
  const [staff, setStaff] = useState<Staff[]>(sampleStaff);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>("admin");
  const [isLoading, setIsLoading] = useState(true);

  // ---- Fetch Data ----
  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await fetch("/api/cases");
        if (response.ok) {
          const data = await response.json();
          // Map DB fields to what frontend expects
          const mapped = data.map((c: any) => ({
            ...c,
            id: c.caseId, // Use case_id as the primary id for frontend
          }));
          setCases(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch cases:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCases();
  }, []);

  // ---- Case CRUD ----

  const addCase = useCallback(async (caseData: Partial<DentalCase>): Promise<DentalCase> => {
    // Generate workflow based on category and material
    let workflow: WorkflowStep[] = [];
    if (caseData.category === "fixed" && caseData.fixedMaterial) {
      workflow = getFixedWorkflowStages(caseData.fixedMaterial);
    } else if (caseData.category === "removable" && caseData.removableSubType) {
      workflow = getRemovableWorkflowStages(caseData.removableSubType);
    } else if (caseData.category === "orthodontics") {
      workflow = getOrthodonticsWorkflowStages();
    }

    // If custom product with custom steps
    if (caseData.isCustomProduct && caseData.customProductSteps) {
      workflow = caseData.customProductSteps.map((step, i) => ({
        id: String(i + 1),
        stage: step,
        stageKey: `custom_${i}`,
        department: "reception" as const,
        status: "pending" as const,
      }));
    }

    // Mark first step as in_progress
    if (workflow.length > 0) {
      workflow[0].status = "in_progress";
      workflow[0].startedAt = new Date().toISOString();
    }

    // For intraoral scan: skip to design (margin_marking stage)
    if (
      caseData.category === "fixed" &&
      caseData.impressionType === "intraoral_scan"
    ) {
      workflow = workflow.map((step) => {
        if (step.stageKey === "model_preparation") {
          return { ...step, status: "skipped" as const };
        }
        return step;
      });
      // Find the margin_marking or cad_design stage index
      const designIdx = workflow.findIndex(
        (s) => s.stageKey === "margin_marking" || s.stageKey === "cad_design"
      );
      if (designIdx > 0) {
        // Complete reception stages
        for (let i = 0; i < designIdx; i++) {
          if (workflow[i].status !== "skipped") {
            workflow[i].status = "completed";
            workflow[i].completedAt = new Date().toISOString();
          }
        }
        workflow[designIdx].status = "in_progress";
        workflow[designIdx].startedAt = new Date().toISOString();
      }
    }

    const payload = {
      ...caseData,
      workflow,
      currentStageIndex: caseData.impressionType === "intraoral_scan"
        ? workflow.findIndex((s) => s.status === "in_progress")
        : 0,
      isPaused: false,
      pauseHistory: [],
    };

    const response = await fetch("/api/cases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("Failed to create case");
    const newCaseData = await response.json();
    const newCase = { ...newCaseData, id: newCaseData.caseId };
    
    setCases((prev) => [newCase, ...prev]);
    return newCase;
  }, []);

  const updateCase = useCallback(async (id: string, updates: Partial<DentalCase>) => {
    const response = await fetch(`/api/cases/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    if (!response.ok) throw new Error("Failed to update case");
    const updatedData = await response.json();
    const updated = { ...updatedData, id: updatedData.caseId };
    
    setCases((prev) => prev.map((c) => (c.id === id ? updated : c)));
  }, []);

  const deleteCase = useCallback(async (id: string) => {
    const response = await fetch(`/api/cases/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Failed to delete case");
    setCases((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const getCase = useCallback(
    (id: string) => cases.find((c) => c.id === id),
    [cases]
  );

  // ---- Workflow actions ----

  const advanceStage = useCallback(async (caseId: string) => {
    const c = cases.find(x => x.id === caseId);
    if (!c || c.isPaused) return;

    const now = new Date().toISOString();
    const currentIdx = c.currentStageIndex;
    const workflow = [...c.workflow];

    // Complete current stage
    if (currentIdx >= 0 && currentIdx < workflow.length) {
      workflow[currentIdx] = {
        ...workflow[currentIdx],
        status: "completed",
        completedAt: now,
      };
    }

    // Find next non-skipped stage
    let nextIdx = currentIdx + 1;
    while (nextIdx < workflow.length && workflow[nextIdx].status === "skipped") {
      nextIdx++;
    }

    if (nextIdx < workflow.length) {
      workflow[nextIdx] = {
        ...workflow[nextIdx],
        status: "in_progress",
        startedAt: now,
      };

      // Check if this stage triggers auto-pause
      const pauseReason = shouldAutoPause(workflow[nextIdx].stageKey);
      if (pauseReason && workflow[nextIdx].stageKey === "ready") {
        await updateCase(caseId, { workflow, currentStageIndex: nextIdx });
      } else {
        await updateCase(caseId, { workflow, currentStageIndex: nextIdx });
      }
    }
  }, [cases, updateCase]);

  const completeCurrentStage = useCallback(async (caseId: string) => {
    await advanceStage(caseId);
  }, [advanceStage]);

  const skipStage = useCallback(async (caseId: string, stageIndex: number) => {
    if (currentUserRole !== "admin") return; // Only admin can skip

    const c = cases.find(x => x.id === caseId);
    if (!c) return;

    const workflow = [...c.workflow];
    if (stageIndex >= 0 && stageIndex < workflow.length) {
      workflow[stageIndex] = { ...workflow[stageIndex], status: "skipped" };
    }
    await updateCase(caseId, { workflow });
  }, [currentUserRole, cases, updateCase]);

  // ---- Pause/Resume ----

  const pauseCase = useCallback(async (caseId: string, reason: PauseReason) => {
    const c = cases.find(x => x.id === caseId);
    if (!c) return;

    const pauseRecord: PauseRecord = {
      id: `pause-${Date.now()}`,
      reason,
      pausedAt: new Date().toISOString(),
      pausedAtStage: c.workflow[c.currentStageIndex]?.stageKey || "",
    };
    
    await updateCase(caseId, {
      isPaused: true,
      pauseHistory: [...c.pauseHistory, pauseRecord],
    });
  }, [cases, updateCase]);

  const resumeCase = useCallback(async (caseId: string, returnNotes?: string) => {
    const c = cases.find(x => x.id === caseId);
    if (!c || !c.isPaused) return;

    const pauseHistory = [...c.pauseHistory];
    const lastPause = pauseHistory[pauseHistory.length - 1];
    if (lastPause) {
      pauseHistory[pauseHistory.length - 1] = {
        ...lastPause,
        resumedAt: new Date().toISOString(),
        returnNotes: returnNotes || "",
      };
    }

    await updateCase(caseId, {
      isPaused: false,
      pauseHistory,
    });
  }, [cases, updateCase]);

  // ---- Final status ----

  const setFinalStatus = useCallback(async (caseId: string, status: FinalStatus) => {
    const c = cases.find(x => x.id === caseId);
    if (!c) return;

    if (status === "try_in") {
      // Auto-pause when Try-In
      const pauseRecord: PauseRecord = {
        id: `pause-${Date.now()}`,
        reason: "try_in",
        pausedAt: new Date().toISOString(),
        pausedAtStage: c.workflow[c.currentStageIndex]?.stageKey || "ready",
      };
      await updateCase(caseId, {
        finalStatus: status,
        isPaused: true,
        pauseHistory: [...c.pauseHistory, pauseRecord],
      });
    } else {
      await updateCase(caseId, { finalStatus: status });
    }
  }, [cases, updateCase]);

  // ---- Notes ----

  const addCaseNote = useCallback(
    (caseId: string, author: string, note: string, type: CaseNote["type"]) => {
      const newNote: CaseNote = {
        id: `note-${Date.now()}`,
        caseId,
        author,
        note,
        timestamp: new Date().toISOString(),
        type,
      };
      setCases((prev) =>
        prev.map((c) =>
          c.id === caseId ? { ...c, notes: [...c.notes, newNote] } : c
        )
      );
    },
    []
  );

  // ---- Attachments ----

  const addAttachment = useCallback(
    (caseId: string, attachment: Omit<FileAttachment, "id">) => {
      const newAttachment: FileAttachment = {
        ...attachment,
        id: `file-${Date.now()}`,
      };
      setCases((prev) =>
        prev.map((c) =>
          c.id === caseId
            ? { ...c, attachments: [...c.attachments, newAttachment] }
            : c
        )
      );
    },
    []
  );

  const removeAttachment = useCallback(
    (caseId: string, attachmentId: string) => {
      setCases((prev) =>
        prev.map((c) =>
          c.id === caseId
            ? {
                ...c,
                attachments: c.attachments.filter((a) => a.id !== attachmentId),
              }
            : c
        )
      );
    },
    []
  );

  // ---- Staff ----

  const addStaff = useCallback((staffData: Omit<Staff, "id">) => {
    const newStaff: Staff = {
      ...staffData,
      id: `staff-${Date.now()}`,
    };
    setStaff((prev) => [...prev, newStaff]);
  }, []);

  const updateStaff = useCallback((id: string, updates: Partial<Staff>) => {
    setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  }, []);

  // ---- Filters ----

  const getCasesByCategory = useCallback(
    (category: CaseCategory) => cases.filter((c) => c.category === category),
    [cases]
  );

  const getCasesByDepartment = useCallback(
    (department: string) =>
      cases.filter((c) => {
        const currentStep = c.workflow[c.currentStageIndex];
        return currentStep?.department === department;
      }),
    [cases]
  );

  const getPausedCases = useCallback(
    () => cases.filter((c) => c.isPaused),
    [cases]
  );

  const getActiveCases = useCallback(
    () => cases.filter((c) => !c.isPaused && c.finalStatus !== "delivery"),
    [cases]
  );

  // ---- Custom products ----

  const addCustomProduct = useCallback(
    (
      name: string,
      category: CaseCategory,
      steps: { stage: string; stageKey: string; department: string }[]
    ) => {
      // This creates a custom product template - stored in case data
      console.log("Custom product template created:", name, category, steps);
    },
    []
  );

  const value: LabContextType = {
    cases,
    staff,
    currentUserRole,
    isLoading,
    addCase,
    updateCase,
    deleteCase,
    getCase,
    advanceStage,
    completeCurrentStage,
    skipStage,
    pauseCase,
    resumeCase,
    setFinalStatus,
    addCaseNote,
    addAttachment,
    removeAttachment,
    addStaff,
    updateStaff,
    getCasesByCategory,
    getCasesByDepartment,
    getPausedCases,
    getActiveCases,
    setCurrentUserRole,
    addCustomProduct,
  };

  return <LabContext.Provider value={value}>{children}</LabContext.Provider>;
}

export function useLabContext() {
  const context = useContext(LabContext);
  if (!context) {
    throw new Error("useLabContext must be used within LabProvider");
  }
  return context;
}
