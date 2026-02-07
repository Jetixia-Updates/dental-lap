import { createContext, useContext, useState, ReactNode } from "react";

// Types
export interface Case {
  id: string;
  doctor: string;
  patient: string;
  toothNumbers: string;
  restorationType: string;
  shade: string;
  material: string;
  priority: "normal" | "rush" | "emergency";
  currentDepartment: string;
  status: string;
  dateReceived: string;
  dueDate: string;
  specialInstructions: string;
  workflow: WorkflowStep[];
  assignedStaff: { [department: string]: string };
  notes: CaseNote[];
}

export interface WorkflowStep {
  department: string;
  status: "pending" | "in-progress" | "completed" | "skipped";
  assignedTo: string;
  startedAt?: string;
  completedAt?: string;
  duration?: number;
}

export interface CaseNote {
  id: string;
  caseId: string;
  department: string;
  author: string;
  note: string;
  timestamp: string;
  type: "update" | "issue" | "feedback";
}

export interface Staff {
  id: string;
  name: string;
  department: string;
  role: string;
  email: string;
  phone: string;
  status: "active" | "busy" | "offline";
  performance: number;
  tasksCompleted: number;
}

export interface Task {
  id: string;
  caseId: string;
  department: string;
  title: string;
  assignedTo: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed";
  dueDate: string;
}

interface LabContextType {
  cases: Case[];
  staff: Staff[];
  tasks: Task[];
  addCase: (caseData: Omit<Case, "id" | "workflow" | "notes" | "assignedStaff">) => void;
  updateCase: (id: string, updates: Partial<Case>) => void;
  moveToNextDepartment: (caseId: string) => void;
  assignStaffToCase: (caseId: string, department: string, staffId: string) => void;
  addCaseNote: (caseId: string, department: string, author: string, note: string, type: CaseNote["type"]) => void;
  addStaff: (staffData: Omit<Staff, "id">) => void;
  updateStaff: (id: string, updates: Partial<Staff>) => void;
  addTask: (taskData: Omit<Task, "id">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  getCasesByDepartment: (department: string) => Case[];
  getStaffByDepartment: (department: string) => Staff[];
  getTasksByDepartment: (department: string) => Task[];
}

const LabContext = createContext<LabContextType | undefined>(undefined);

// Workflow order
const WORKFLOW_ORDER = [
  "reception",
  "case-planning", 
  "model-scan",
  "cad-design",
  "cam-production",
  "finishing",
  "quality-control",
  "logistics"
];

export function LabProvider({ children }: { children: ReactNode }) {
  const [cases, setCases] = useState<Case[]>([
    {
      id: "CASE-001",
      doctor: "د. أحمد محمد",
      patient: "محمد علي",
      toothNumbers: "14, 15",
      restorationType: "Crown",
      shade: "A2",
      material: "Zirconia",
      priority: "normal",
      currentDepartment: "reception",
      status: "validated",
      dateReceived: "2026-02-05",
      dueDate: "2026-02-12",
      specialInstructions: "Implant-supported",
      assignedStaff: {},
      workflow: WORKFLOW_ORDER.map((dept, idx) => ({
        department: dept,
        status: idx === 0 ? "completed" : "pending",
        assignedTo: "",
        completedAt: idx === 0 ? "2026-02-05T10:30:00" : undefined
      })),
      notes: []
    },
    {
      id: "CASE-002",
      doctor: "د. سارة أحمد",
      patient: "فاطمة حسن",
      toothNumbers: "21",
      restorationType: "Veneer",
      shade: "B1",
      material: "E-max",
      priority: "rush",
      currentDepartment: "cad-design",
      status: "designing",
      dateReceived: "2026-02-06",
      dueDate: "2026-02-09",
      specialInstructions: "Match adjacent teeth",
      assignedStaff: { "cad-design": "staff-2" },
      workflow: WORKFLOW_ORDER.map((dept, idx) => ({
        department: dept,
        status: idx < 3 ? "completed" : idx === 3 ? "in-progress" : "pending",
        assignedTo: idx === 3 ? "staff-2" : "",
        completedAt: idx < 3 ? "2026-02-06T14:00:00" : undefined
      })),
      notes: [
        {
          id: "note-1",
          caseId: "CASE-002",
          department: "reception",
          author: "موظف الاستقبال",
          note: "تم استلام الحالة والتحقق من الوصفة",
          timestamp: "2026-02-06T09:00:00",
          type: "update"
        }
      ]
    }
  ]);

  const [staff, setStaff] = useState<Staff[]>([
    { id: "staff-1", name: "أحمد محمد", department: "reception", role: "Reception Specialist", email: "ahmed@lab.com", phone: "+20 123 456 7890", status: "active", performance: 95, tasksCompleted: 45 },
    { id: "staff-2", name: "سارة علي", department: "cad-design", role: "CAD Designer", email: "sara@lab.com", phone: "+20 123 456 7891", status: "busy", performance: 92, tasksCompleted: 38 },
    { id: "staff-3", name: "محمد حسن", department: "cam-production", role: "CAM Operator", email: "mohamed@lab.com", phone: "+20 123 456 7892", status: "active", performance: 88, tasksCompleted: 42 },
    { id: "staff-4", name: "ليلى أحمد", department: "finishing", role: "Finishing Technician", email: "layla@lab.com", phone: "+20 123 456 7893", status: "active", performance: 90, tasksCompleted: 40 },
    { id: "staff-5", name: "يوسف إبراهيم", department: "quality-control", role: "QC Inspector", email: "yousef@lab.com", phone: "+20 123 456 7894", status: "active", performance: 96, tasksCompleted: 50 },
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    { id: "T-001", caseId: "CASE-002", department: "cad-design", title: "تصميم الفينير للحالة CASE-002", assignedTo: "staff-2", priority: "high", status: "in-progress", dueDate: "2026-02-08" },
    { id: "T-002", caseId: "CASE-001", department: "case-planning", title: "تخطيط الحالة CASE-001", assignedTo: "", priority: "medium", status: "pending", dueDate: "2026-02-07" },
  ]);

  const addCase = (caseData: Omit<Case, "id" | "workflow" | "notes" | "assignedStaff">) => {
    const newCase: Case = {
      ...caseData,
      id: `CASE-${String(cases.length + 1).padStart(3, "0")}`,
      currentDepartment: "reception",
      assignedStaff: {},
      workflow: WORKFLOW_ORDER.map((dept, idx) => ({
        department: dept,
        status: idx === 0 ? "in-progress" : "pending",
        assignedTo: ""
      })),
      notes: []
    };
    setCases(prev => [...prev, newCase]);
  };

  const updateCase = (id: string, updates: Partial<Case>) => {
    setCases(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const moveToNextDepartment = (caseId: string) => {
    setCases(prev => prev.map(c => {
      if (c.id !== caseId) return c;
      
      const currentIdx = WORKFLOW_ORDER.indexOf(c.currentDepartment);
      if (currentIdx === -1 || currentIdx === WORKFLOW_ORDER.length - 1) return c;
      
      const nextDept = WORKFLOW_ORDER[currentIdx + 1];
      const now = new Date().toISOString();
      
      return {
        ...c,
        currentDepartment: nextDept,
        workflow: c.workflow.map((step, idx) => {
          if (idx === currentIdx) {
            return { ...step, status: "completed" as const, completedAt: now };
          }
          if (idx === currentIdx + 1) {
            return { ...step, status: "in-progress" as const, startedAt: now };
          }
          return step;
        })
      };
    }));
  };

  const assignStaffToCase = (caseId: string, department: string, staffId: string) => {
    setCases(prev => prev.map(c => {
      if (c.id !== caseId) return c;
      return {
        ...c,
        assignedStaff: { ...c.assignedStaff, [department]: staffId },
        workflow: c.workflow.map(step => 
          step.department === department 
            ? { ...step, assignedTo: staffId }
            : step
        )
      };
    }));
  };

  const addCaseNote = (caseId: string, department: string, author: string, note: string, type: CaseNote["type"]) => {
    const newNote: CaseNote = {
      id: `note-${Date.now()}`,
      caseId,
      department,
      author,
      note,
      timestamp: new Date().toISOString(),
      type
    };
    
    setCases(prev => prev.map(c => 
      c.id === caseId 
        ? { ...c, notes: [...c.notes, newNote] }
        : c
    ));
  };

  const addStaff = (staffData: Omit<Staff, "id">) => {
    const newStaff: Staff = {
      ...staffData,
      id: `staff-${staff.length + 1}`
    };
    setStaff(prev => [...prev, newStaff]);
  };

  const updateStaff = (id: string, updates: Partial<Staff>) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const addTask = (taskData: Omit<Task, "id">) => {
    const newTask: Task = {
      ...taskData,
      id: `T-${String(tasks.length + 1).padStart(3, "0")}`
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const getCasesByDepartment = (department: string) => {
    return cases.filter(c => c.currentDepartment === department);
  };

  const getStaffByDepartment = (department: string) => {
    return staff.filter(s => s.department === department);
  };

  const getTasksByDepartment = (department: string) => {
    return tasks.filter(t => t.department === department);
  };

  const value: LabContextType = {
    cases,
    staff,
    tasks,
    addCase,
    updateCase,
    moveToNextDepartment,
    assignStaffToCase,
    addCaseNote,
    addStaff,
    updateStaff,
    addTask,
    updateTask,
    getCasesByDepartment,
    getStaffByDepartment,
    getTasksByDepartment
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
