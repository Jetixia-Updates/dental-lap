import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  X,
  FileText,
  Users,
  Activity,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  Building,
  User,
  Stethoscope,
  MapPin,
  Download,
  Filter,
  ArrowUpDown,
  BarChart3,
  PieChart,
  LineChart,
  Archive,
  AlertTriangle,
  ClipboardCheck,
  XCircle,
  Pause,
  Play,
} from "lucide-react";

// ==================== INTERFACES ====================

interface Case {
  id: string;
  caseId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  clinicName: string;
  caseType: string;
  material: string;
  shade: string;
  toothNumbers: string;
  quantity: number;
  priority: "routine" | "urgent" | "rush" | "emergency";
  status: "intake" | "planning" | "scan" | "design" | "production" | "qc" | "finishing" | "ready" | "delivered" | "on-hold" | "cancelled";
  progress: number; // 0-100
  receivedDate: string;
  dueDate: string;
  completedDate?: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  technician?: string;
  designer?: string;
  notes: string;
  attachments: string[];
  timeline: TimelineEvent[];
  costs: CaseCost;
  qualityChecks: QualityCheck[];
}

interface TimelineEvent {
  id: string;
  timestamp: string;
  event: string;
  user: string;
  department: string;
  notes?: string;
}

interface CaseCost {
  labFee: number;
  materialCost: number;
  designFee: number;
  rushFee: number;
  total: number;
  paid: number;
  balance: number;
}

interface QualityCheck {
  id: string;
  stage: string;
  inspector: string;
  date: string;
  passed: boolean;
  score: number;
  notes: string;
}

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  licenseNumber: string;
  clinicName: string;
  phone: string;
  email: string;
  address: string;
  activeCases: number;
  completedCases: number;
  totalRevenue: number;
  averageRating: number;
  preferredMaterials: string[];
  notes: string;
  joinedDate: string;
  status: "active" | "inactive";
}

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "male" | "female";
  phone: string;
  email?: string;
  address?: string;
  medicalHistory: string[];
  allergies: string[];
  totalCases: number;
  activeCases: number;
  lastVisit: string;
  notes: string;
}

interface CaseAnalytics {
  totalCases: number;
  activeCases: number;
  completedCases: number;
  onTimeCases: number;
  delayedCases: number;
  cancelledCases: number;
  averageCompletionTime: number;
  revenueThisMonth: number;
  topCaseTypes: { type: string; count: number }[];
  topMaterials: { material: string; count: number }[];
  departmentWorkload: { department: string; cases: number }[];
}

// ==================== SAMPLE DATA ====================

const sampleCases: Case[] = [
  {
    id: "1",
    caseId: "CASE-2024-001",
    patientId: "P001",
    patientName: "أحمد محمد علي",
    doctorId: "D001",
    doctorName: "د. سارة أحمد",
    clinicName: "عيادة النخبة لطب الأسنان",
    caseType: "تاج زركونيا",
    material: "Zirconia",
    shade: "A2",
    toothNumbers: "#14",
    quantity: 1,
    priority: "urgent",
    status: "design",
    progress: 45,
    receivedDate: "2024-02-01",
    dueDate: "2024-02-10",
    estimatedDelivery: "2024-02-10",
    technician: "محمد حسن",
    designer: "أحمد علي",
    notes: "المريض لديه خط ابتسامة عالي. التأكد من المظهر الطبيعي.",
    attachments: ["scan1.stl", "photos.zip"],
    timeline: [
      { id: "t1", timestamp: "2024-02-01 09:00", event: "استلام الحالة", user: "فاطمة أحمد", department: "الاستقبال", notes: "تم استلام الطبعة والصور" },
      { id: "t2", timestamp: "2024-02-01 10:30", event: "بدء التخطيط", user: "محمود سعيد", department: "التخطيط", notes: "مراجعة المتطلبات" },
      { id: "t3", timestamp: "2024-02-02 11:00", event: "المسح الضوئي", user: "علي حسن", department: "المسح", notes: "تم المسح بنجاح" },
      { id: "t4", timestamp: "2024-02-03 14:00", event: "بدء التصميم", user: "أحمد علي", department: "التصميم", notes: "جاري التصميم الرقمي" },
    ],
    costs: {
      labFee: 800,
      materialCost: 200,
      designFee: 150,
      rushFee: 100,
      total: 1250,
      paid: 500,
      balance: 750,
    },
    qualityChecks: [
      { id: "q1", stage: "المسح", inspector: "علي حسن", date: "2024-02-02", passed: true, score: 98, notes: "جودة مسح ممتازة" },
      { id: "q2", stage: "التصميم", inspector: "محمد أحمد", date: "2024-02-03", passed: true, score: 95, notes: "تصميم مطابق للمواصفات" },
    ],
  },
  {
    id: "2",
    caseId: "CASE-2024-002",
    patientId: "P002",
    patientName: "فاطمة حسن محمود",
    doctorId: "D002",
    doctorName: "د. أحمد محمود",
    clinicName: "مركز الرعاية المتقدمة",
    caseType: "جسر E.max",
    material: "E.max",
    shade: "A3",
    toothNumbers: "#35-37",
    quantity: 3,
    priority: "routine",
    status: "production",
    progress: 70,
    receivedDate: "2024-01-28",
    dueDate: "2024-02-15",
    estimatedDelivery: "2024-02-15",
    technician: "خالد عمر",
    designer: "سارة أحمد",
    notes: "جسر يستبدل السن #36. فحص تصميم الدعامة لسهولة التنظيف.",
    attachments: ["prescription.pdf"],
    timeline: [
      { id: "t1", timestamp: "2024-01-28 10:00", event: "استلام الحالة", user: "نور الدين", department: "الاستقبال" },
      { id: "t2", timestamp: "2024-01-29 09:00", event: "التخطيط والمراجعة", user: "محمود سعيد", department: "التخطيط" },
      { id: "t3", timestamp: "2024-01-30 11:00", event: "التصميم الرقمي", user: "سارة أحمد", department: "التصميم" },
      { id: "t4", timestamp: "2024-02-02 08:00", event: "بدء الإنتاج", user: "خالد عمر", department: "الإنتاج" },
    ],
    costs: {
      labFee: 2100,
      materialCost: 450,
      designFee: 200,
      rushFee: 0,
      total: 2750,
      paid: 2750,
      balance: 0,
    },
    qualityChecks: [
      { id: "q1", stage: "التصميم", inspector: "محمد أحمد", date: "2024-01-30", passed: true, score: 96, notes: "تصميم جيد" },
    ],
  },
  {
    id: "3",
    caseId: "CASE-2024-003",
    patientId: "P003",
    patientName: "محمد سعيد إبراهيم",
    doctorId: "D001",
    doctorName: "د. سارة أحمد",
    clinicName: "عيادة النخبة لطب الأسنان",
    caseType: "تاج زرعة",
    material: "Zirconia",
    shade: "B1",
    toothNumbers: "#11",
    quantity: 1,
    priority: "rush",
    status: "qc",
    progress: 90,
    receivedDate: "2024-01-25",
    dueDate: "2024-02-05",
    estimatedDelivery: "2024-02-05",
    technician: "محمد حسن",
    designer: "أحمد علي",
    notes: "مدعوم بزرعة. قاعدة تيتانيوم. يفضل التصميم المثبت بالبرغي.",
    attachments: ["xray.jpg", "scan.stl"],
    timeline: [
      { id: "t1", timestamp: "2024-01-25 09:00", event: "استلام الحالة", user: "فاطمة أحمد", department: "الاستقبال" },
      { id: "t2", timestamp: "2024-01-26 10:00", event: "التصميم", user: "أحمد علي", department: "التصميم" },
      { id: "t3", timestamp: "2024-01-28 08:00", event: "الإنتاج", user: "محمد حسن", department: "الإنتاج" },
      { id: "t4", timestamp: "2024-02-01 14:00", event: "التشطيب", user: "سارة محمود", department: "التشطيب" },
      { id: "t5", timestamp: "2024-02-03 09:00", event: "مراقبة الجودة", user: "علي حسن", department: "الجودة" },
    ],
    costs: {
      labFee: 1200,
      materialCost: 300,
      designFee: 200,
      rushFee: 200,
      total: 1900,
      paid: 1000,
      balance: 900,
    },
    qualityChecks: [
      { id: "q1", stage: "التصميم", inspector: "محمد أحمد", date: "2024-01-26", passed: true, score: 97, notes: "ممتاز" },
      { id: "q2", stage: "الإنتاج", inspector: "علي حسن", date: "2024-01-28", passed: true, score: 94, notes: "جودة عالية" },
      { id: "q3", stage: "النهائي", inspector: "علي حسن", date: "2024-02-03", passed: true, score: 98, notes: "جاهز للتسليم" },
    ],
  },
  {
    id: "4",
    caseId: "CASE-2024-004",
    patientId: "P004",
    patientName: "نور الهدى عبدالله",
    doctorId: "D003",
    doctorName: "د. محمد علي",
    clinicName: "مجمع الابتسامة الطبي",
    caseType: "قشور تجميلية",
    material: "E.max",
    shade: "BL2",
    toothNumbers: "#13-23",
    quantity: 6,
    priority: "routine",
    status: "intake",
    progress: 10,
    receivedDate: "2024-02-06",
    dueDate: "2024-02-25",
    estimatedDelivery: "2024-02-25",
    notes: "6 قشور أمامية علوية. المريضة تريد ابتسامة أكثر إشراقاً.",
    attachments: ["smile_design.jpg"],
    timeline: [
      { id: "t1", timestamp: "2024-02-06 11:00", event: "استلام الحالة", user: "فاطمة أحمد", department: "الاستقبال", notes: "تم استلام الطبعات والصور" },
    ],
    costs: {
      labFee: 4200,
      materialCost: 900,
      designFee: 300,
      rushFee: 0,
      total: 5400,
      paid: 0,
      balance: 5400,
    },
    qualityChecks: [],
  },
];

const sampleDoctors: Doctor[] = [
  {
    id: "D001",
    name: "د. سارة أحمد محمود",
    specialization: "تيجان وجسور",
    licenseNumber: "DEN-2015-4523",
    clinicName: "عيادة النخبة لطب الأسنان",
    phone: "01012345678",
    email: "dr.sarah@elite-dental.com",
    address: "15 شارع الجمهورية، المعادي، القاهرة",
    activeCases: 12,
    completedCases: 284,
    totalRevenue: 456000,
    averageRating: 4.8,
    preferredMaterials: ["Zirconia", "E.max", "PFM"],
    notes: "طبيبة متميزة، تفضل الجودة العالية، دائماً تطلب صور تفصيلية.",
    joinedDate: "2018-03-15",
    status: "active",
  },
  {
    id: "D002",
    name: "د. أحمد محمود حسن",
    specialization: "زراعة الأسنان",
    licenseNumber: "DEN-2012-2156",
    clinicName: "مركز الرعاية المتقدمة",
    phone: "01123456789",
    email: "dr.ahmed@advancedcare.com",
    address: "42 شارع التحرير، الدقي، الجيزة",
    activeCases: 8,
    completedCases: 412,
    totalRevenue: 620000,
    averageRating: 4.9,
    preferredMaterials: ["Zirconia", "Titanium"],
    notes: "متخصص في الزراعة، يفضل التصاميم المثبتة بالبراغي.",
    joinedDate: "2016-07-22",
    status: "active",
  },
  {
    id: "D003",
    name: "د. محمد علي السيد",
    specialization: "تجميل الأسنان",
    licenseNumber: "DEN-2018-8934",
    clinicName: "مجمع الابتسامة الطبي",
    phone: "01234567890",
    email: "dr.mohamed@smile-complex.com",
    address: "78 شارع النيل، الزمالك، القاهرة",
    activeCases: 15,
    completedCases: 156,
    totalRevenue: 298000,
    averageRating: 4.7,
    preferredMaterials: ["E.max", "Composite", "Zirconia"],
    notes: "متخصص في التجميل، يهتم بالتفاصيل الدقيقة للون والشكل.",
    joinedDate: "2020-01-10",
    status: "active",
  },
  {
    id: "D004",
    name: "د. ليلى حسن إبراهيم",
    specialization: "تقويم الأسنان",
    licenseNumber: "DEN-2014-6712",
    clinicName: "عيادة الأمل التخصصية",
    phone: "01098765432",
    email: "dr.laila@hope-clinic.com",
    address: "23 شارع الهرم، الهرم، الجيزة",
    activeCases: 6,
    completedCases: 198,
    totalRevenue: 187000,
    averageRating: 4.6,
    preferredMaterials: ["Clear Aligners", "Ceramic Brackets"],
    notes: "تعمل في التقويم بشكل أساسي، تحتاج أحياناً تركيبات مؤقتة.",
    joinedDate: "2019-09-05",
    status: "active",
  },
];

const samplePatients: Patient[] = [
  {
    id: "P001",
    name: "أحمد محمد علي",
    age: 42,
    gender: "male",
    phone: "01011111111",
    email: "ahmed@email.com",
    address: "المعادي، القاهرة",
    medicalHistory: ["ضغط دم مرتفع"],
    allergies: ["لا يوجد"],
    totalCases: 3,
    activeCases: 1,
    lastVisit: "2024-02-01",
    notes: "مريض منتظم، يلتزم بالمواعيد",
  },
  {
    id: "P002",
    name: "فاطمة حسن محمود",
    age: 35,
    gender: "female",
    phone: "01022222222",
    email: "fatma@email.com",
    medicalHistory: ["لا يوجد"],
    allergies: ["حساسية من البنسلين"],
    totalCases: 5,
    activeCases: 1,
    lastVisit: "2024-01-28",
    notes: "حالة طبية ممتازة",
  },
  {
    id: "P003",
    name: "محمد سعيد إبراهيم",
    age: 28,
    gender: "male",
    phone: "01033333333",
    medicalHistory: ["لا يوجد"],
    allergies: ["لا يوجد"],
    totalCases: 2,
    activeCases: 1,
    lastVisit: "2024-01-25",
    notes: "مريض جديد",
  },
  {
    id: "P004",
    name: "نور الهدى عبدالله",
    age: 31,
    gender: "female",
    phone: "01044444444",
    email: "nour@email.com",
    address: "الزمالك، القاهرة",
    medicalHistory: ["لا يوجد"],
    allergies: ["لا يوجد"],
    totalCases: 1,
    activeCases: 1,
    lastVisit: "2024-02-06",
    notes: "تهتم بالتجميل",
  },
];

// ==================== MAIN COMPONENT ====================

export default function Cases() {
  const { t } = useTranslation();
  
  // State Management
  const [cases, setCases] = useState<Case[]>(sampleCases);
  const [doctors, setDoctors] = useState<Doctor[]>(sampleDoctors);
  const [patients, setPatients] = useState<Patient[]>(samplePatients);
  const [activeTab, setActiveTab] = useState("overview");

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");

  // Dialog States
  const [showAddCaseDialog, setShowAddCaseDialog] = useState(false);
  const [showEditCaseDialog, setShowEditCaseDialog] = useState(false);
  const [showCaseDetailsDialog, setShowCaseDetailsDialog] = useState(false);
  const [showAddDoctorDialog, setShowAddDoctorDialog] = useState(false);
  const [showEditDoctorDialog, setShowEditDoctorDialog] = useState(false);
  const [showDoctorDetailsDialog, setShowDoctorDetailsDialog] = useState(false);
  const [showAddPatientDialog, setShowAddPatientDialog] = useState(false);
  const [showEditPatientDialog, setShowEditPatientDialog] = useState(false);
  const [showPatientDetailsDialog, setShowPatientDetailsDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string } | null>(null);

  // Form States
  const [caseFormData, setCaseFormData] = useState<Partial<Case>>({});
  const [doctorFormData, setDoctorFormData] = useState<Partial<Doctor>>({});
  const [patientFormData, setPatientFormData] = useState<Partial<Patient>>({});

  // ==================== ANALYTICS CALCULATION ====================
  
  const analytics: CaseAnalytics = {
    totalCases: cases.length,
    activeCases: cases.filter(c => !["delivered", "cancelled"].includes(c.status)).length,
    completedCases: cases.filter(c => c.status === "delivered").length,
    onTimeCases: cases.filter(c => c.completedDate && c.completedDate <= c.dueDate).length,
    delayedCases: cases.filter(c => c.completedDate && c.completedDate > c.dueDate || (!c.completedDate && new Date(c.dueDate) < new Date())).length,
    cancelledCases: cases.filter(c => c.status === "cancelled").length,
    averageCompletionTime: 5.2,
    revenueThisMonth: cases.reduce((sum, c) => sum + c.costs.paid, 0),
    topCaseTypes: [
      { type: "تاج زركونيا", count: 45 },
      { type: "جسر E.max", count: 28 },
      { type: "تاج زرعة", count: 22 },
      { type: "قشور تجميلية", count: 15 },
    ],
    topMaterials: [
      { material: "Zirconia", count: 67 },
      { material: "E.max", count: 43 },
      { material: "PFM", count: 12 },
    ],
    departmentWorkload: [
      { department: "التصميم", cases: 8 },
      { department: "الإنتاج", cases: 12 },
      { department: "الجودة", cases: 6 },
      { department: "التشطيب", cases: 4 },
    ],
  };

  // ==================== STATUS & PRIORITY CONFIGS ====================

  const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    intake: { label: "الاستقبال", color: "bg-blue-100 text-blue-800", icon: FileText },
    planning: { label: "التخطيط", color: "bg-cyan-100 text-cyan-800", icon: ClipboardCheck },
    scan: { label: "المسح", color: "bg-indigo-100 text-indigo-800", icon: Activity },
    design: { label: "التصميم", color: "bg-purple-100 text-purple-800", icon: Edit },
    production: { label: "الإنتاج", color: "bg-amber-100 text-amber-800", icon: Play },
    qc: { label: "الجودة", color: "bg-orange-100 text-orange-800", icon: CheckCircle },
    finishing: { label: "التشطيب", color: "bg-pink-100 text-pink-800", icon: TrendingUp },
    ready: { label: "جاهز", color: "bg-green-100 text-green-800", icon: CheckCircle },
    delivered: { label: "تم التسليم", color: "bg-emerald-100 text-emerald-800", icon: CheckCircle },
    "on-hold": { label: "معلق", color: "bg-gray-100 text-gray-800", icon: Pause },
    cancelled: { label: "ملغي", color: "bg-red-100 text-red-800", icon: XCircle },
  };

  const priorityConfig: Record<string, { label: string; color: string }> = {
    routine: { label: "عادي", color: "bg-green-100 text-green-800" },
    urgent: { label: "عاجل", color: "bg-amber-100 text-amber-800" },
    rush: { label: "سريع", color: "bg-orange-100 text-orange-800" },
    emergency: { label: "طارئ", color: "bg-red-100 text-red-800" },
  };

  // ==================== HANDLERS ====================

  const handleAddCase = () => {
    const newCase: Case = {
      id: Date.now().toString(),
      caseId: `CASE-2024-${String(cases.length + 1).padStart(3, "0")}`,
      receivedDate: new Date().toISOString().split("T")[0],
      progress: 0,
      status: "intake",
      timeline: [{
        id: "t1",
        timestamp: new Date().toISOString(),
        event: "استلام الحالة",
        user: "النظام",
        department: "الاستقبال",
      }],
      costs: {
        labFee: 0,
        materialCost: 0,
        designFee: 0,
        rushFee: 0,
        total: 0,
        paid: 0,
        balance: 0,
      },
      qualityChecks: [],
      attachments: [],
      ...caseFormData,
    } as Case;
    setCases([newCase, ...cases]);
    setShowAddCaseDialog(false);
    setCaseFormData({});
  };

  const handleEditCase = () => {
    if (!selectedCase) return;
    setCases(cases.map(c => c.id === selectedCase.id ? { ...c, ...caseFormData } : c));
    setShowEditCaseDialog(false);
    setSelectedCase(null);
    setCaseFormData({});
  };

  const handleAddDoctor = () => {
    const newDoctor: Doctor = {
      id: `D${String(doctors.length + 1).padStart(3, "0")}`,
      activeCases: 0,
      completedCases: 0,
      totalRevenue: 0,
      averageRating: 0,
      preferredMaterials: [],
      joinedDate: new Date().toISOString().split("T")[0],
      status: "active",
      ...doctorFormData,
    } as Doctor;
    setDoctors([newDoctor, ...doctors]);
    setShowAddDoctorDialog(false);
    setDoctorFormData({});
  };

  const handleEditDoctor = () => {
    if (!selectedDoctor) return;
    setDoctors(doctors.map(d => d.id === selectedDoctor.id ? { ...d, ...doctorFormData } : d));
    setShowEditDoctorDialog(false);
    setSelectedDoctor(null);
    setDoctorFormData({});
  };

  const handleAddPatient = () => {
    const newPatient: Patient = {
      id: `P${String(patients.length + 1).padStart(3, "0")}`,
      totalCases: 0,
      activeCases: 0,
      lastVisit: new Date().toISOString().split("T")[0],
      medicalHistory: [],
      allergies: [],
      ...patientFormData,
    } as Patient;
    setPatients([newPatient, ...patients]);
    setShowAddPatientDialog(false);
    setPatientFormData({});
  };

  const handleEditPatient = () => {
    if (!selectedPatient) return;
    setPatients(patients.map(p => p.id === selectedPatient.id ? { ...p, ...patientFormData } : p));
    setShowEditPatientDialog(false);
    setSelectedPatient(null);
    setPatientFormData({});
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === "case") {
      setCases(cases.filter(c => c.id !== deleteTarget.id));
    } else if (deleteTarget.type === "doctor") {
      setDoctors(doctors.filter(d => d.id !== deleteTarget.id));
    } else if (deleteTarget.type === "patient") {
      setPatients(patients.filter(p => p.id !== deleteTarget.id));
    }
    setShowDeleteDialog(false);
    setDeleteTarget(null);
  };

  // Filter cases
  const filteredCases = cases.filter(c => {
    const matchesSearch = 
      c.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.caseType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || c.status === filterStatus;
    const matchesPriority = !filterPriority || c.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // ==================== RENDER ====================

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">إدارة الحالات الشاملة</h1>
        <p className="text-muted-foreground">نظام متكامل لإدارة وتتبع جميع الحالات والأطباء والمرضى</p>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            نظرة عامة
          </TabsTrigger>
          <TabsTrigger value="cases" className="gap-2">
            <FileText className="w-4 h-4" />
            الحالات
          </TabsTrigger>
          <TabsTrigger value="doctors" className="gap-2">
            <Stethoscope className="w-4 h-4" />
            الأطباء
          </TabsTrigger>
          <TabsTrigger value="patients" className="gap-2">
            <Users className="w-4 h-4" />
            المرضى
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <PieChart className="w-4 h-4" />
            التحليلات
          </TabsTrigger>
          <TabsTrigger value="timeline" className="gap-2">
            <Clock className="w-4 h-4" />
            الجدول الزمني
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card className="p-5">
              <div className="flex items-center justify-between mb-2">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground">{analytics.totalCases}</div>
              <p className="text-sm text-muted-foreground">إجمالي الحالات</p>
            </Card>
            <Card className="p-5">
              <div className="flex items-center justify-between mb-2">
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-600">{analytics.activeCases}</div>
              <p className="text-sm text-muted-foreground">حالات نشطة</p>
            </Card>
            <Card className="p-5">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-600">{analytics.completedCases}</div>
              <p className="text-sm text-muted-foreground">حالات مكتملة</p>
            </Card>
            <Card className="p-5">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
              <div className="text-3xl font-bold text-amber-600">{analytics.delayedCases}</div>
              <p className="text-sm text-muted-foreground">حالات متأخرة</p>
            </Card>
            <Card className="p-5">
              <div className="flex items-center justify-between mb-2">
                <Stethoscope className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-purple-600">{doctors.length}</div>
              <p className="text-sm text-muted-foreground">أطباء نشطون</p>
            </Card>
            <Card className="p-5">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-pink-600" />
              </div>
              <div className="text-3xl font-bold text-pink-600">{patients.length}</div>
              <p className="text-sm text-muted-foreground">المرضى</p>
            </Card>
          </div>

          {/* Recent Cases */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              الحالات الحديثة
            </h3>
            <div className="space-y-4">
              {cases.slice(0, 5).map((c) => {
                const StatusIcon = statusConfig[c.status].icon;
                return (
                  <div key={c.id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                    <div className="flex items-center gap-4">
                      <StatusIcon className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold text-foreground">{c.caseId}</p>
                        <p className="text-sm text-muted-foreground">{c.patientName} - {c.caseType}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge className={statusConfig[c.status].color}>
                          {statusConfig[c.status].label}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {c.dueDate}
                        </p>
                      </div>
                      <Progress value={c.progress} className="w-24" />
                      <span className="text-sm font-semibold text-foreground">{c.progress}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">أعلى أنواع الحالات</h3>
              <div className="space-y-3">
                {analytics.topCaseTypes.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{item.type}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={(item.count / analytics.topCaseTypes[0].count) * 100} className="w-32" />
                      <span className="text-sm font-semibold text-foreground w-8">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">حمل العمل حسب القسم</h3>
              <div className="space-y-3">
                {analytics.departmentWorkload.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{item.department}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={(item.cases / analytics.departmentWorkload[0].cases) * 100} className="w-32" />
                      <span className="text-sm font-semibold text-foreground w-8">{item.cases}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Cases Management Tab */}
        <TabsContent value="cases" className="space-y-6">
          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="بحث عن حالة، مريض، طبيب..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md border border-border bg-background text-foreground"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 rounded-md border border-border bg-background text-foreground"
            >
              <option value="">كل الحالات</option>
              {Object.entries(statusConfig).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2 rounded-md border border-border bg-background text-foreground"
            >
              <option value="">كل الأولويات</option>
              {Object.entries(priorityConfig).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
            <Button onClick={() => setShowAddCaseDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              حالة جديدة
            </Button>
          </div>

          {/* Cases Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredCases.map((c) => {
              const StatusIcon = statusConfig[c.status].icon;
              return (
                <Card key={c.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-primary">{c.caseId}</h3>
                      <p className="text-sm text-muted-foreground">{c.patientName}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedCase(c);
                          setShowCaseDetailsDialog(true);
                        }}
                        className="p-2 hover:bg-secondary rounded-md"
                      >
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCase(c);
                          setCaseFormData(c);
                          setShowEditCaseDialog(true);
                        }}
                        className="p-2 hover:bg-secondary rounded-md"
                      >
                        <Edit className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteTarget({ type: "case", id: c.id });
                          setShowDeleteDialog(true);
                        }}
                        className="p-2 hover:bg-secondary rounded-md"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">الطبيب:</span>
                      <span className="text-foreground font-medium">{c.doctorName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">النوع:</span>
                      <span className="text-foreground font-medium">{c.caseType}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">المادة:</span>
                      <span className="text-foreground font-medium">{c.material}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">موعد التسليم:</span>
                      <span className="text-foreground font-medium">{c.dueDate}</span>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex items-center justify-between">
                    <Badge className={statusConfig[c.status].color}>
                      {statusConfig[c.status].label}
                    </Badge>
                    <Badge className={priorityConfig[c.priority].color}>
                      {priorityConfig[c.priority].label}
                    </Badge>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">التقدم</span>
                      <span className="text-sm font-semibold text-foreground">{c.progress}%</span>
                    </div>
                    <Progress value={c.progress} />
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">التكلفة: {c.costs.total.toLocaleString()} ج.م</span>
                    <span className="text-muted-foreground">المتبقي: {c.costs.balance.toLocaleString()} ج.م</span>
                  </div>
                </Card>
              );
            })}
          </div>

          {filteredCases.length === 0 && (
            <Card className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">لا توجد حالات مطابقة للبحث</p>
            </Card>
          )}
        </TabsContent>

        {/* Doctors Tab */}
        <TabsContent value="doctors" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-foreground">إدارة الأطباء</h2>
            <Button onClick={() => setShowAddDoctorDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              إضافة طبيب
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctors.map((doctor) => (
              <Card key={doctor.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Stethoscope className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">{doctor.name}</h3>
                      <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setSelectedDoctor(doctor);
                        setShowDoctorDetailsDialog(true);
                      }}
                      className="p-1 hover:bg-secondary rounded-md"
                    >
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedDoctor(doctor);
                        setDoctorFormData(doctor);
                        setShowEditDoctorDialog(true);
                      }}
                      className="p-1 hover:bg-secondary rounded-md"
                    >
                      <Edit className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => {
                        setDeleteTarget({ type: "doctor", id: doctor.id });
                        setShowDeleteDialog(true);
                      }}
                      className="p-1 hover:bg-secondary rounded-md"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building className="w-4 h-4" />
                    <span>{doctor.clinicName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{doctor.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{doctor.email}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{doctor.activeCases}</div>
                    <p className="text-xs text-muted-foreground">نشطة</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{doctor.completedCases}</div>
                    <p className="text-xs text-muted-foreground">مكتملة</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-amber-600">{doctor.averageRating}</div>
                    <p className="text-xs text-muted-foreground">التقييم</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    الإيرادات: {doctor.totalRevenue.toLocaleString()} ج.م
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Patients Tab */}
        <TabsContent value="patients" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-foreground">إدارة المرضى</h2>
            <Button onClick={() => setShowAddPatientDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              إضافة مريض
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {patients.map((patient) => (
              <Card key={patient.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                      <User className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">{patient.name}</h3>
                      <p className="text-sm text-muted-foreground">{patient.age} سنة - {patient.gender === "male" ? "ذكر" : "أنثى"}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setSelectedPatient(patient);
                        setShowPatientDetailsDialog(true);
                      }}
                      className="p-1 hover:bg-secondary rounded-md"
                    >
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPatient(patient);
                        setPatientFormData(patient);
                        setShowEditPatientDialog(true);
                      }}
                      className="p-1 hover:bg-secondary rounded-md"
                    >
                      <Edit className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => {
                        setDeleteTarget({ type: "patient", id: patient.id });
                        setShowDeleteDialog(true);
                      }}
                      className="p-1 hover:bg-secondary rounded-md"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{patient.phone}</span>
                  </div>
                  {patient.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{patient.email}</span>
                    </div>
                  )}
                  {patient.address && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{patient.address}</span>
                    </div>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">{patient.totalCases}</div>
                    <p className="text-xs text-muted-foreground">إجمالي</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{patient.activeCases}</div>
                    <p className="text-xs text-muted-foreground">نشطة</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{patient.totalCases - patient.activeCases}</div>
                    <p className="text-xs text-muted-foreground">مكتملة</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    آخر زيارة: {patient.lastVisit}
                  </p>
                </div>

                {patient.allergies.length > 0 && patient.allergies[0] !== "لا يوجد" && (
                  <div className="mt-3">
                    <Badge variant="destructive" className="gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      حساسية: {patient.allergies.join(", ")}
                    </Badge>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">التحليلات والإحصائيات</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 rounded-lg bg-green-100">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">معدل الإنجاز في الوقت</p>
                  <p className="text-2xl font-bold text-foreground">
                    {Math.round((analytics.onTimeCases / analytics.totalCases) * 100)}%
                  </p>
                </div>
              </div>
              <Progress value={(analytics.onTimeCases / analytics.totalCases) * 100} className="mb-2" />
              <p className="text-xs text-muted-foreground">
                {analytics.onTimeCases} من {analytics.totalCases} حالة
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 rounded-lg bg-amber-100">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">متوسط وقت الإنجاز</p>
                  <p className="text-2xl font-bold text-foreground">
                    {analytics.averageCompletionTime} أيام
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                تحسن بنسبة 12% عن الشهر الماضي
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 rounded-lg bg-blue-100">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">الإيرادات هذا الشهر</p>
                  <p className="text-2xl font-bold text-foreground">
                    {analytics.revenueThisMonth.toLocaleString()} ج.م
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                زيادة 8% عن الشهر الماضي
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 rounded-lg bg-red-100">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">معدل الإلغاء</p>
                  <p className="text-2xl font-bold text-foreground">
                    {Math.round((analytics.cancelledCases / analytics.totalCases) * 100)}%
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {analytics.cancelledCases} حالة ملغاة
              </p>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-primary" />
                توزيع المواد المستخدمة
              </h3>
              <div className="space-y-4">
                {analytics.topMaterials.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">{item.material}</span>
                      <span className="text-sm font-semibold text-foreground">{item.count} حالة</span>
                    </div>
                    <Progress value={(item.count / analytics.topMaterials[0].count) * 100} />
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                أداء الأقسام
              </h3>
              <div className="space-y-4">
                {analytics.departmentWorkload.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">{item.department}</span>
                      <span className="text-sm font-semibold text-foreground">{item.cases} حالة</span>
                    </div>
                    <Progress value={(item.cases / analytics.departmentWorkload[0].cases) * 100} />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">تحليل الأولويات</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(priorityConfig).map(([key, config]) => {
                const count = cases.filter(c => c.priority === key).length;
                return (
                  <div key={key} className="text-center p-4 bg-secondary/30 rounded-lg">
                    <div className="text-3xl font-bold text-foreground mb-2">{count}</div>
                    <Badge className={config.color}>{config.label}</Badge>
                  </div>
                );
              })}
            </div>
          </Card>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">الجدول الزمني للحالات</h2>

          <Card className="p-6">
            <div className="space-y-6">
              {cases.slice(0, 3).map((c) => (
                <div key={c.id} className="border-l-2 border-primary pl-6 relative">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-primary"></div>
                  <h3 className="font-bold text-foreground mb-2">{c.caseId} - {c.patientName}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{c.caseType}</p>
                  <div className="space-y-3">
                    {c.timeline.map((event) => (
                      <div key={event.id} className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
                        <Calendar className="w-4 h-4 text-primary mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-foreground text-sm">{event.event}</p>
                            <span className="text-xs text-muted-foreground">
                              {new Date(event.timestamp).toLocaleString("ar-EG")}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {event.user} - {event.department}
                          </p>
                          {event.notes && (
                            <p className="text-xs text-muted-foreground mt-1">{event.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-6" />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ==================== DIALOGS ==================== */}

      {/* Add Case Dialog */}
      {showAddCaseDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-foreground">إضافة حالة جديدة</h2>
              <button onClick={() => setShowAddCaseDialog(false)} className="p-1 hover:bg-secondary rounded-md">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">اسم المريض *</label>
                  <input
                    type="text"
                    value={caseFormData.patientName || ""}
                    onChange={(e) => setCaseFormData({ ...caseFormData, patientName: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">اسم الطبيب *</label>
                  <input
                    type="text"
                    value={caseFormData.doctorName || ""}
                    onChange={(e) => setCaseFormData({ ...caseFormData, doctorName: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">اسم العيادة *</label>
                  <input
                    type="text"
                    value={caseFormData.clinicName || ""}
                    onChange={(e) => setCaseFormData({ ...caseFormData, clinicName: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">نوع الحالة *</label>
                  <input
                    type="text"
                    value={caseFormData.caseType || ""}
                    onChange={(e) => setCaseFormData({ ...caseFormData, caseType: e.target.value })}
                    placeholder="تاج زركونيا، جسر E.max..."
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">المادة *</label>
                  <input
                    type="text"
                    value={caseFormData.material || ""}
                    onChange={(e) => setCaseFormData({ ...caseFormData, material: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">اللون</label>
                  <input
                    type="text"
                    value={caseFormData.shade || ""}
                    onChange={(e) => setCaseFormData({ ...caseFormData, shade: e.target.value })}
                    placeholder="A2, B1..."
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">أرقام الأسنان</label>
                  <input
                    type="text"
                    value={caseFormData.toothNumbers || ""}
                    onChange={(e) => setCaseFormData({ ...caseFormData, toothNumbers: e.target.value })}
                    placeholder="#14, #11-13..."
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">الكمية</label>
                  <input
                    type="number"
                    value={caseFormData.quantity || 1}
                    onChange={(e) => setCaseFormData({ ...caseFormData, quantity: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">الأولوية</label>
                  <select
                    value={caseFormData.priority || "routine"}
                    onChange={(e) => setCaseFormData({ ...caseFormData, priority: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  >
                    <option value="routine">عادي</option>
                    <option value="urgent">عاجل</option>
                    <option value="rush">سريع</option>
                    <option value="emergency">طارئ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">موعد التسليم *</label>
                  <input
                    type="date"
                    value={caseFormData.dueDate || ""}
                    onChange={(e) => setCaseFormData({ ...caseFormData, dueDate: e.target.value, estimatedDelivery: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">ملاحظات</label>
                <textarea
                  value={caseFormData.notes || ""}
                  onChange={(e) => setCaseFormData({ ...caseFormData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-md border bg-background resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t justify-end">
              <Button variant="outline" onClick={() => setShowAddCaseDialog(false)}>إلغاء</Button>
              <Button onClick={handleAddCase}>
                <Plus className="w-4 h-4 mr-2" />
                إضافة
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Case Dialog */}
      {showEditCaseDialog && selectedCase && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-foreground">تعديل الحالة - {selectedCase.caseId}</h2>
              <button onClick={() => { setShowEditCaseDialog(false); setSelectedCase(null); }} className="p-1 hover:bg-secondary rounded-md">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">اسم المريض</label>
                  <input
                    type="text"
                    value={caseFormData.patientName || ""}
                    onChange={(e) => setCaseFormData({ ...caseFormData, patientName: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">اسم الطبيب</label>
                  <input
                    type="text"
                    value={caseFormData.doctorName || ""}
                    onChange={(e) => setCaseFormData({ ...caseFormData, doctorName: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">نوع الحالة</label>
                  <input
                    type="text"
                    value={caseFormData.caseType || ""}
                    onChange={(e) => setCaseFormData({ ...caseFormData, caseType: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">المادة</label>
                  <input
                    type="text"
                    value={caseFormData.material || ""}
                    onChange={(e) => setCaseFormData({ ...caseFormData, material: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">الحالة</label>
                  <select
                    value={caseFormData.status || "intake"}
                    onChange={(e) => setCaseFormData({ ...caseFormData, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  >
                    {Object.entries(statusConfig).map(([key, val]) => (
                      <option key={key} value={key}>{val.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">الأولوية</label>
                  <select
                    value={caseFormData.priority || "routine"}
                    onChange={(e) => setCaseFormData({ ...caseFormData, priority: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  >
                    <option value="routine">عادي</option>
                    <option value="urgent">عاجل</option>
                    <option value="rush">سريع</option>
                    <option value="emergency">طارئ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">التقدم (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={caseFormData.progress || 0}
                    onChange={(e) => setCaseFormData({ ...caseFormData, progress: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">موعد التسليم</label>
                  <input
                    type="date"
                    value={caseFormData.dueDate || ""}
                    onChange={(e) => setCaseFormData({ ...caseFormData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">ملاحظات</label>
                <textarea
                  value={caseFormData.notes || ""}
                  onChange={(e) => setCaseFormData({ ...caseFormData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-md border bg-background resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t justify-end">
              <Button variant="outline" onClick={() => { setShowEditCaseDialog(false); setSelectedCase(null); }}>إلغاء</Button>
              <Button onClick={handleEditCase}>
                <CheckCircle className="w-4 h-4 mr-2" />
                حفظ التغييرات
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Case Details Dialog */}
      {showCaseDetailsDialog && selectedCase && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-foreground">تفاصيل الحالة - {selectedCase.caseId}</h2>
              <button onClick={() => setShowCaseDetailsDialog(false)} className="p-1 hover:bg-secondary rounded-md">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">المعلومات الأساسية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">المريض:</span>
                    <span className="font-medium">{selectedCase.patientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الطبيب:</span>
                    <span className="font-medium">{selectedCase.doctorName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">العيادة:</span>
                    <span className="font-medium">{selectedCase.clinicName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">نوع الحالة:</span>
                    <span className="font-medium">{selectedCase.caseType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">المادة:</span>
                    <span className="font-medium">{selectedCase.material}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">اللون:</span>
                    <span className="font-medium">{selectedCase.shade}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Progress & Status */}
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">الحالة والتقدم</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">التقدم</span>
                      <span className="text-sm font-semibold">{selectedCase.progress}%</span>
                    </div>
                    <Progress value={selectedCase.progress} />
                  </div>
                  <div className="flex gap-3">
                    <Badge className={statusConfig[selectedCase.status].color}>
                      {statusConfig[selectedCase.status].label}
                    </Badge>
                    <Badge className={priorityConfig[selectedCase.priority].color}>
                      {priorityConfig[selectedCase.priority].label}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Timeline */}
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">الجدول الزمني</h3>
                <div className="space-y-3">
                  {selectedCase.timeline.map((event) => (
                    <div key={event.id} className="flex gap-3 p-3 bg-secondary/30 rounded-lg">
                      <Calendar className="w-4 h-4 text-primary mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-sm">{event.event}</p>
                          <span className="text-xs text-muted-foreground">
                            {new Date(event.timestamp).toLocaleString("ar-EG")}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{event.user} - {event.department}</p>
                        {event.notes && <p className="text-xs text-muted-foreground mt-1">{event.notes}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Costs */}
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">التكاليف المالية</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-secondary/30 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-1">رسوم المعمل</p>
                    <p className="text-lg font-bold text-foreground">{selectedCase.costs.labFee.toLocaleString()} ج.م</p>
                  </div>
                  <div className="p-4 bg-secondary/30 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-1">تكلفة المواد</p>
                    <p className="text-lg font-bold text-foreground">{selectedCase.costs.materialCost.toLocaleString()} ج.م</p>
                  </div>
                  <div className="p-4 bg-secondary/30 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-1">رسوم التصميم</p>
                    <p className="text-lg font-bold text-foreground">{selectedCase.costs.designFee.toLocaleString()} ج.م</p>
                  </div>
                  <div className="p-4 bg-secondary/30 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-1">رسوم السرعة</p>
                    <p className="text-lg font-bold text-foreground">{selectedCase.costs.rushFee.toLocaleString()} ج.م</p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">الإجمالي:</span>
                    <span className="text-xl font-bold text-primary">{selectedCase.costs.total.toLocaleString()} ج.م</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">المدفوع:</span>
                    <span className="text-green-600 font-medium">{selectedCase.costs.paid.toLocaleString()} ج.م</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">المتبقي:</span>
                    <span className="text-red-600 font-medium">{selectedCase.costs.balance.toLocaleString()} ج.م</span>
                  </div>
                </div>
              </div>

              {selectedCase.qualityChecks.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-4">فحوصات الجودة</h3>
                    <div className="space-y-3">
                      {selectedCase.qualityChecks.map((check) => (
                        <div key={check.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold">{check.stage}</span>
                            <Badge className={check.passed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                              {check.passed ? "نجح" : "فشل"}
                            </Badge>
                          </div>
                          <div className="text-sm space-y-1">
                            <p className="text-muted-foreground">الفاحص: {check.inspector}</p>
                            <p className="text-muted-foreground">التاريخ: {check.date}</p>
                            <p className="text-muted-foreground">النتيجة: {check.score}/100</p>
                            {check.notes && <p className="text-muted-foreground">ملاحظات: {check.notes}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="flex gap-3 p-6 border-t justify-end">
              <Button variant="outline" onClick={() => setShowCaseDetailsDialog(false)}>إغلاق</Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Doctor Dialog */}
      {showAddDoctorDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-foreground">إضافة طبيب جديد</h2>
              <button onClick={() => setShowAddDoctorDialog(false)} className="p-1 hover:bg-secondary rounded-md">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">الاسم *</label>
                  <input
                    type="text"
                    value={doctorFormData.name || ""}
                    onChange={(e) => setDoctorFormData({ ...doctorFormData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">التخصص *</label>
                  <input
                    type="text"
                    value={doctorFormData.specialization || ""}
                    onChange={(e) => setDoctorFormData({ ...doctorFormData, specialization: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">رقم الترخيص *</label>
                  <input
                    type="text"
                    value={doctorFormData.licenseNumber || ""}
                    onChange={(e) => setDoctorFormData({ ...doctorFormData, licenseNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">اسم العيادة *</label>
                  <input
                    type="text"
                    value={doctorFormData.clinicName || ""}
                    onChange={(e) => setDoctorFormData({ ...doctorFormData, clinicName: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">الهاتف *</label>
                  <input
                    type="text"
                    value={doctorFormData.phone || ""}
                    onChange={(e) => setDoctorFormData({ ...doctorFormData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">البريد الإلكتروني *</label>
                  <input
                    type="email"
                    value={doctorFormData.email || ""}
                    onChange={(e) => setDoctorFormData({ ...doctorFormData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">العنوان</label>
                <input
                  type="text"
                  value={doctorFormData.address || ""}
                  onChange={(e) => setDoctorFormData({ ...doctorFormData, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">ملاحظات</label>
                <textarea
                  value={doctorFormData.notes || ""}
                  onChange={(e) => setDoctorFormData({ ...doctorFormData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-md border bg-background resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t justify-end">
              <Button variant="outline" onClick={() => setShowAddDoctorDialog(false)}>إلغاء</Button>
              <Button onClick={handleAddDoctor}>
                <Plus className="w-4 h-4 mr-2" />
                إضافة
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Doctor Dialog */}
      {showEditDoctorDialog && selectedDoctor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-foreground">تعديل بيانات الطبيب</h2>
              <button onClick={() => { setShowEditDoctorDialog(false); setSelectedDoctor(null); }} className="p-1 hover:bg-secondary rounded-md">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">الاسم</label>
                  <input
                    type="text"
                    value={doctorFormData.name || ""}
                    onChange={(e) => setDoctorFormData({ ...doctorFormData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">التخصص</label>
                  <input
                    type="text"
                    value={doctorFormData.specialization || ""}
                    onChange={(e) => setDoctorFormData({ ...doctorFormData, specialization: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">اسم العيادة</label>
                  <input
                    type="text"
                    value={doctorFormData.clinicName || ""}
                    onChange={(e) => setDoctorFormData({ ...doctorFormData, clinicName: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">الهاتف</label>
                  <input
                    type="text"
                    value={doctorFormData.phone || ""}
                    onChange={(e) => setDoctorFormData({ ...doctorFormData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={doctorFormData.email || ""}
                    onChange={(e) => setDoctorFormData({ ...doctorFormData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">الحالة</label>
                  <select
                    value={doctorFormData.status || "active"}
                    onChange={(e) => setDoctorFormData({ ...doctorFormData, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  >
                    <option value="active">نشط</option>
                    <option value="inactive">غير نشط</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">العنوان</label>
                <input
                  type="text"
                  value={doctorFormData.address || ""}
                  onChange={(e) => setDoctorFormData({ ...doctorFormData, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">ملاحظات</label>
                <textarea
                  value={doctorFormData.notes || ""}
                  onChange={(e) => setDoctorFormData({ ...doctorFormData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-md border bg-background resize-none"
                />
              </div>
            </div>
        

      {/* Edit Patient Dialog */}
      {showEditPatientDialog && selectedPatient && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-foreground">تعديل بيانات المريض</h2>
              <button onClick={() => { setShowEditPatientDialog(false); setSelectedPatient(null); }} className="p-1 hover:bg-secondary rounded-md">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">الاسم</label>
                  <input
                    type="text"
                    value={patientFormData.name || ""}
                    onChange={(e) => setPatientFormData({ ...patientFormData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">العمر</label>
                  <input
                    type="number"
                    value={patientFormData.age || ""}
                    onChange={(e) => setPatientFormData({ ...patientFormData, age: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">الجنس</label>
                  <select
                    value={patientFormData.gender || "male"}
                    onChange={(e) => setPatientFormData({ ...patientFormData, gender: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  >
                    <option value="male">ذكر</option>
                    <option value="female">أنثى</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">الهاتف</label>
                  <input
                    type="text"
                    value={patientFormData.phone || ""}
                    onChange={(e) => setPatientFormData({ ...patientFormData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={patientFormData.email || ""}
                    onChange={(e) => setPatientFormData({ ...patientFormData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">العنوان</label>
                  <input
                    type="text"
                    value={patientFormData.address || ""}
                    onChange={(e) => setPatientFormData({ ...patientFormData, address: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">ملاحظات</label>
                <textarea
                  value={patientFormData.notes || ""}
                  onChange={(e) => setPatientFormData({ ...patientFormData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-md border bg-background resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t justify-end">
              <Button variant="outline" onClick={() => { setShowEditPatientDialog(false); setSelectedPatient(null); }}>إلغاء</Button>
              <Button onClick={handleEditPatient}>
                <CheckCircle className="w-4 h-4 mr-2" />
                حفظ التغييرات
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Patient Details Dialog */}
      {showPatientDetailsDialog && selectedPatient && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-foreground">تفاصيل المريض</h2>
              <button onClick={() => setShowPatientDetailsDialog(false)} className="p-1 hover:bg-secondary rounded-md">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-pink-100 flex items-center justify-center">
                  <User className="w-10 h-10 text-pink-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{selectedPatient.name}</h3>
                  <p className="text-muted-foreground">{selectedPatient.age} سنة - {selectedPatient.gender === "male" ? "ذكر" : "أنثى"}</p>
                  <p className="text-sm text-muted-foreground">معرف المريض: {selectedPatient.id}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">معلومات الاتصال</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">الهاتف</p>
                      <p className="font-medium">{selectedPatient.phone}</p>
                    </div>
                  </div>
                  {selectedPatient.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">البريد الإلكتروني</p>
                        <p className="font-medium">{selectedPatient.email}</p>
                      </div>
                    </div>
                  )}
                  {selectedPatient.address && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">العنوان</p>
                        <p className="font-medium">{selectedPatient.address}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">آخر زيارة</p>
                      <p className="font-medium">{selectedPatient.lastVisit}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">الحالات</h3>
                <div className="grid grid-cols-3 gap-4">
                  <Card className="p-4 text-center">
                    <div className="text-3xl font-bold text-primary">{selectedPatient.totalCases}</div>
                    <p className="text-sm text-muted-foreground">إجمالي الحالات</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-3xl font-bold text-blue-600">{selectedPatient.activeCases}</div>
                    <p className="text-sm text-muted-foreground">حالات نشطة</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-3xl font-bold text-green-600">{selectedPatient.totalCases - selectedPatient.activeCases}</div>
                    <p className="text-sm text-muted-foreground">حالات مكتملة</p>
                  </Card>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">المعلومات الطبية</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">التاريخ الطبي</p>
                    {selectedPatient.medicalHistory.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedPatient.medicalHistory.map((item, index) => (
                          <Badge key={index} variant="outline">{item}</Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm">لا يوجد</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">الحساسية</p>
                    {selectedPatient.allergies.length > 0 && selectedPatient.allergies[0] !== "لا يوجد" ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedPatient.allergies.map((item, index) => (
                          <Badge key={index} variant="destructive" className="gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {item}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm">لا يوجد</p>
                    )}
                  </div>
                  {selectedPatient.notes && (
                    <div>
                      <p className="text-sm text-muted-foreground">ملاحظات</p>
                      <p className="text-sm">{selectedPatient.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t justify-end">
              <Button variant="outline" onClick={() => setShowPatientDetailsDialog(false)}>إغلاق</Button>
            </div>
          </div>
        </div>
      )}    <div className="flex gap-3 p-6 border-t justify-end">
              <Button variant="outline" onClick={() => { setShowEditDoctorDialog(false); setSelectedDoctor(null); }}>إلغاء</Button>
              <Button onClick={handleEditDoctor}>
                <CheckCircle className="w-4 h-4 mr-2" />
                حفظ التغييرات
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Doctor Details Dialog */}
      {showDoctorDetailsDialog && selectedDoctor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-foreground">تفاصيل الطبيب</h2>
              <button onClick={() => setShowDoctorDetailsDialog(false)} className="p-1 hover:bg-secondary rounded-md">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <Stethoscope className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{selectedDoctor.name}</h3>
                  <p className="text-muted-foreground">{selectedDoctor.specialization}</p>
                  <Badge className={selectedDoctor.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                    {selectedDoctor.status === "active" ? "نشط" : "غير نشط"}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">معلومات الاتصال</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">العيادة</p>
                      <p className="font-medium">{selectedDoctor.clinicName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">الهاتف</p>
                      <p className="font-medium">{selectedDoctor.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">البريد الإلكتروني</p>
                      <p className="font-medium">{selectedDoctor.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">العنوان</p>
                      <p className="font-medium">{selectedDoctor.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">الإحصائيات</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{selectedDoctor.activeCases}</div>
                    <p className="text-xs text-muted-foreground">حالات نشطة</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{selectedDoctor.completedCases}</div>
                    <p className="text-xs text-muted-foreground">حالات مكتملة</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-amber-600">{selectedDoctor.averageRating}</div>
                    <p className="text-xs text-muted-foreground">التقييم</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{selectedDoctor.totalRevenue.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">الإيرادات (ج.م)</p>
                  </Card>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">معلومات إضافية</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">رقم الترخيص</p>
                    <p className="font-medium">{selectedDoctor.licenseNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">تاريخ الانضمام</p>
                    <p className="font-medium">{selectedDoctor.joinedDate}</p>
                  </div>
                  {selectedDoctor.preferredMaterials.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">المواد المفضلة</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedDoctor.preferredMaterials.map((material, index) => (
                          <Badge key={index} variant="outline">{material}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedDoctor.notes && (
                    <div>
                      <p className="text-sm text-muted-foreground">ملاحظات</p>
                      <p className="text-sm">{selectedDoctor.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t justify-end">
              <Button variant="outline" onClick={() => setShowDoctorDetailsDialog(false)}>إغلاق</Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Patient Dialog */}
      {showAddPatientDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-foreground">إضافة مريض جديد</h2>
              <button onClick={() => setShowAddPatientDialog(false)} className="p-1 hover:bg-secondary rounded-md">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">الاسم *</label>
                  <input
                    type="text"
                    value={patientFormData.name || ""}
                    onChange={(e) => setPatientFormData({ ...patientFormData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">العمر *</label>
                  <input
                    type="number"
                    value={patientFormData.age || ""}
                    onChange={(e) => setPatientFormData({ ...patientFormData, age: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">الجنس *</label>
                  <select
                    value={patientFormData.gender || "male"}
                    onChange={(e) => setPatientFormData({ ...patientFormData, gender: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  >
                    <option value="male">ذكر</option>
                    <option value="female">أنثى</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">الهاتف *</label>
                  <input
                    type="text"
                    value={patientFormData.phone || ""}
                    onChange={(e) => setPatientFormData({ ...patientFormData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={patientFormData.email || ""}
                    onChange={(e) => setPatientFormData({ ...patientFormData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">العنوان</label>
                  <input
                    type="text"
                    value={patientFormData.address || ""}
                    onChange={(e) => setPatientFormData({ ...patientFormData, address: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">ملاحظات</label>
                <textarea
                  value={patientFormData.notes || ""}
                  onChange={(e) => setPatientFormData({ ...patientFormData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-md border bg-background resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t justify-end">
              <Button variant="outline" onClick={() => setShowAddPatientDialog(false)}>إلغاء</Button>
              <Button onClick={handleAddPatient}>
                <Plus className="w-4 h-4 mr-2" />
                إضافة
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && deleteTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-lg font-bold text-foreground mb-2">تأكيد الحذف</h2>
              <p className="text-muted-foreground text-sm">
                هل أنت متأكد من حذف هذا {deleteTarget.type === "case" ? "الحالة" : deleteTarget.type === "doctor" ? "الطبيب" : "المريض"}؟
              </p>
            </div>
            <div className="flex gap-3 p-6 border-t justify-end">
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>إلغاء</Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
                حذف
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
