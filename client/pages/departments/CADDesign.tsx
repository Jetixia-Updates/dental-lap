import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Search, Monitor, Pencil, RotateCcw, CheckCircle, XCircle, Clock,
  Eye, Download, Upload, Database, Users, BarChart3, FileText,
  Calendar, Activity, Layers, Box, Settings, TrendingUp, PlayCircle,
  PauseCircle, AlertTriangle, CheckSquare, BookOpen, Microscope
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface DesignCase {
  id: string;
  patient: string;
  restorationType: string;
  toothNumbers: string;
  material: string;
  designer: string;
  software: string;
  progress: number;
  status: "queued" | "designing" | "review" | "approved" | "revision" | "paused";
  checklist: {
    margins: boolean;
    contacts: boolean;
    occlusion: boolean;
    anatomy: boolean;
    thickness: boolean;
  };
  revisionCount: number;
  notes: string;
  priority: "normal" | "rush" | "emergency";
  scanQuality: "excellent" | "good" | "acceptable" | "poor";
  startDate?: string;
  deadline?: string;
  completionDate?: string;
  timeSpent: number; // in minutes
}

interface Designer {
  id: string;
  name: string;
  specialization: string;
  activeCases: number;
  completedCases: number;
  averageTime: number; // minutes per case
  qualityScore: number; // 0-100
  status: "available" | "busy" | "offline";
}

interface Software {
  id: string;
  name: string;
  version: string;
  licenses: number;
  inUse: number;
  type: "CAD" | "Viewer" | "Library" | "Scanner" | "Mill";
  lastUpdate: string;
  purchaseDate: string;
  expiryDate: string;
  monthlyCost: number; // بالجنيه المصري
  annualCost: number;
  vendor: string;
  supportContact: string;
  assignedUsers: string[];
  autoRenewal: boolean;
  status: "active" | "expiring" | "expired";
}

interface SoftwareUser {
  id: string;
  name: string;
  software: string[];
  lastLogin: string;
}

interface DesignLibrary {
  id: string;
  name: string;
  category: "تيجان" | "جسور" | "قشور" | "زراعة" | "أطقم";
  manufacturer: string;
  downloads: number;
  rating: number;
}

interface QualityMetric {
  id: string;
  caseId: string;
  reviewer: string;
  date: string;
  scores: {
    margins: number;
    contacts: number;
    occlusion: number;
    anatomy: number;
    thickness: number;
  };
  overallScore: number;
  feedback: string;
  approved: boolean;
}

export default function CADDesign() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [cases, setCases] = useState<DesignCase[]>([
    {
      id: "CAD-001",
      patient: "د. أحمد محمد",
      restorationType: "تاج زركونيا",
      toothNumbers: "14, 15",
      material: "زركونيا شفافة",
      designer: "م. كريم سعيد",
      software: "exocad",
      progress: 100,
      status: "approved",
      checklist: { margins: true, contacts: true, occlusion: true, anatomy: true, thickness: true },
      revisionCount: 0,
      notes: "تصميم معتمد جاهز للطحن",
      priority: "normal",
      scanQuality: "excellent",
      startDate: "2024-01-14",
      deadline: "2024-01-16",
      completionDate: "2024-01-15",
      timeSpent: 45
    },
    {
      id: "CAD-002",
      patient: "د. سارة حسن",
      restorationType: "قشور e.max",
      toothNumbers: "11-13, 21-23",
      material: "ليثيوم دايسيليكات",
      designer: "م. ليلى أحمد",
      software: "3Shape",
      progress: 65,
      status: "designing",
      checklist: { margins: true, contacts: true, occlusion: false, anatomy: true, thickness: false },
      revisionCount: 0,
      notes: "جاري العمل على التشريح النهائي",
      priority: "rush",
      scanQuality: "good",
      startDate: "2024-01-15",
      deadline: "2024-01-17",
      timeSpent: 90
    },
    {
      id: "CAD-003",
      patient: "د. محمود علي",
      restorationType: "جسر ثلاثي",
      toothNumbers: "24, 25, 26",
      material: "زركونيا متعددة الطبقات",
      designer: "م. يوسف خالد",
      software: "exocad",
      progress: 100,
      status: "review",
      checklist: { margins: true, contacts: true, occlusion: true, anatomy: true, thickness: true },
      revisionCount: 1,
      notes: "جاهز للمراجعة النهائية",
      priority: "normal",
      scanQuality: "excellent",
      startDate: "2024-01-13",
      deadline: "2024-01-16",
      timeSpent: 120
    },
    {
      id: "CAD-004",
      patient: "د. فاطمة إبراهيم",
      restorationType: "زراعة تاج",
      toothNumbers: "36",
      material: "زركونيا على تيتانيوم",
      designer: "",
      software: "",
      progress: 0,
      status: "queued",
      checklist: { margins: false, contacts: false, occlusion: false, anatomy: false, thickness: false },
      revisionCount: 0,
      notes: "",
      priority: "emergency",
      scanQuality: "good",
      startDate: "2024-01-15",
      deadline: "2024-01-16",
      timeSpent: 0
    }
  ]);

  const [designers, setDesigners] = useState<Designer[]>([
    {
      id: "DES-001",
      name: "م. كريم سعيد",
      specialization: "تيجان وجسور",
      activeCases: 2,
      completedCases: 145,
      averageTime: 45,
      qualityScore: 96,
      status: "busy"
    },
    {
      id: "DES-002",
      name: "م. ليلى أحمد",
      specialization: "قشور وتجميل",
      activeCases: 1,
      completedCases: 178,
      averageTime: 38,
      qualityScore: 98,
      status: "busy"
    },
    {
      id: "DES-003",
      name: "م. يوسف خالد",
      specialization: "زراعات",
      activeCases: 1,
      completedCases: 132,
      averageTime: 52,
      qualityScore: 94,
      status: "busy"
    },
    {
      id: "DES-004",
      name: "م. دينا محمود",
      specialization: "أطقم كاملة",
      activeCases: 0,
      completedCases: 89,
      averageTime: 65,
      qualityScore: 92,
      status: "available"
    }
  ]);

  const [software, setSoftware] = useState<Software[]>([
    {
      id: "SW-001",
      name: "exocad",
      version: "3.1 Rijeka",
      licenses: 5,
      inUse: 2,
      type: "CAD",
      lastUpdate: "2024-01-10",
      purchaseDate: "2023-03-15",
      expiryDate: "2026-03-15",
      monthlyCost: 4500,
      annualCost: 54000,
      vendor: "exocad GmbH",
      supportContact: "support@exocad.com",
      assignedUsers: ["م. كريم سعيد", "م. ليلى أحمد"],
      autoRenewal: true,
      status: "active"
    },
    {
      id: "SW-002",
      name: "3Shape Dental System",
      version: "2023.2",
      licenses: 3,
      inUse: 1,
      type: "CAD",
      lastUpdate: "2024-01-05",
      purchaseDate: "2023-06-20",
      expiryDate: "2026-06-20",
      monthlyCost: 3800,
      annualCost: 45600,
      vendor: "3Shape A/S",
      supportContact: "support@3shape.com",
      assignedUsers: ["م. يوسف خالد"],
      autoRenewal: true,
      status: "active"
    },
    {
      id: "SW-003",
      name: "DentalCAD",
      version: "3.0",
      licenses: 2,
      inUse: 0,
      type: "CAD",
      lastUpdate: "2023-12-20",
      purchaseDate: "2023-01-10",
      expiryDate: "2026-01-10",
      monthlyCost: 2500,
      annualCost: 30000,
      vendor: "Dental Wings",
      supportContact: "info@dentalwings.com",
      assignedUsers: [],
      autoRenewal: false,
      status: "active"
    },
    {
      id: "SW-004",
      name: "Medit Design",
      version: "2.8",
      licenses: 2,
      inUse: 1,
      type: "CAD",
      lastUpdate: "2024-01-12",
      purchaseDate: "2023-09-05",
      expiryDate: "2026-03-20",
      monthlyCost: 2200,
      annualCost: 26400,
      vendor: "Medit Corp",
      supportContact: "support@medit.com",
      assignedUsers: ["م. دينا محمود"],
      autoRenewal: true,
      status: "expiring"
    },
    {
      id: "SW-005",
      name: "Medit Link Scanner",
      version: "2.5",
      licenses: 3,
      inUse: 2,
      type: "Scanner",
      lastUpdate: "2024-01-08",
      purchaseDate: "2023-07-15",
      expiryDate: "2026-07-15",
      monthlyCost: 1800,
      annualCost: 21600,
      vendor: "Medit Corp",
      supportContact: "support@medit.com",
      assignedUsers: ["فني المسح 1", "فني المسح 2"],
      autoRenewal: true,
      status: "active"
    },
    {
      id: "SW-006",
      name: "Meshmixer",
      version: "3.5",
      licenses: 10,
      inUse: 3,
      type: "Library",
      lastUpdate: "2023-11-25",
      purchaseDate: "2023-05-01",
      expiryDate: "2030-12-31",
      monthlyCost: 0,
      annualCost: 0,
      vendor: "Autodesk",
      supportContact: "opensource",
      assignedUsers: ["م. كريم سعيد", "م. ليلى أحمد", "م. يوسف خالد"],
      autoRenewal: false,
      status: "active"
    }
  ]);

  const [designLibrary, setDesignLibrary] = useState<DesignLibrary[]>([
    { id: "LIB-001", name: "مكتبة تيجان طبيعية", category: "تيجان", manufacturer: "exocad", downloads: 245, rating: 4.8 },
    { id: "LIB-002", name: "قشور تجميلية متقدمة", category: "قشور", manufacturer: "3Shape", downloads: 189, rating: 4.9 },
    { id: "LIB-003", name: "جسور متعددة الوحدات", category: "جسور", manufacturer: "exocad", downloads: 156, rating: 4.7 },
    { id: "LIB-004", name: "أبوتمنت زراعات", category: "زراعة", manufacturer: "Nobel Biocare", downloads: 234, rating: 4.9 },
    { id: "LIB-005", name: "أطقم كاملة رقمية", category: "أطقم", manufacturer: "Ivoclar", downloads: 98, rating: 4.6 }
  ]);

  const [qualityMetrics, setQualityMetrics] = useState<QualityMetric[]>([
    {
      id: "QM-001",
      caseId: "CAD-001",
      reviewer: "د. هشام علي",
      date: "2024-01-15",
      scores: { margins: 98, contacts: 96, occlusion: 97, anatomy: 95, thickness: 99 },
      overallScore: 97,
      feedback: "تصميم ممتاز - جميع المعايير مستوفاة",
      approved: true
    },
    {
      id: "QM-002",
      caseId: "CAD-003",
      reviewer: "د. هشام علي",
      date: "2024-01-15",
      scores: { margins: 94, contacts: 92, occlusion: 96, anatomy: 93, thickness: 95 },
      overallScore: 94,
      feedback: "جودة جيدة جداً - يحتاج تعديل بسيط في التماس",
      approved: false
    }
  ]);

  const [activeTab, setActiveTab] = useState("overview");
  const [showNewCaseDialog, setShowNewCaseDialog] = useState(false);
  const [showDesignerDialog, setShowDesignerDialog] = useState(false);
  const [showLibraryDialog, setShowLibraryDialog] = useState(false);
  const [showQualityDialog, setShowQualityDialog] = useState(false);
  const [selectedCase, setSelectedCase] = useState<DesignCase | null>(null);
  const [editingCase, setEditingCase] = useState<DesignCase | null>(null);

  const [newCase, setNewCase] = useState<Partial<DesignCase>>({
    status: "queued",
    priority: "normal",
    progress: 0,
    checklist: { margins: false, contacts: false, occlusion: false, anatomy: false, thickness: false },
    revisionCount: 0,
    timeSpent: 0
  });

  const [newQualityMetric, setNewQualityMetric] = useState<Partial<QualityMetric>>({
    scores: { margins: 0, contacts: 0, occlusion: 0, anatomy: 0, thickness: 0 }
  });

  const [newDesigner, setNewDesigner] = useState<Partial<Designer>>({
    activeCases: 0,
    completedCases: 0,
    averageTime: 0,
    qualityScore: 0,
    status: "available"
  });

  const [newLibraryItem, setNewLibraryItem] = useState<Partial<DesignLibrary>>({
    downloads: 0,
    rating: 0
  });

  const [newSoftware, setNewSoftware] = useState<Partial<Software>>({
    licenses: 1,
    inUse: 0,
    type: "CAD",
    monthlyCost: 0,
    annualCost: 0,
    assignedUsers: [],
    autoRenewal: false,
    status: "active"
  });

  const [showSoftwareDialog, setShowSoftwareDialog] = useState(false);
  const [editingSoftware, setEditingSoftware] = useState<Software | null>(null);
  const [showSoftwareDetailsDialog, setShowSoftwareDetailsDialog] = useState(false);
  const [selectedSoftware, setSelectedSoftware] = useState<Software | null>(null);

  // إحصائيات التصميم
  const designStats = {
    totalCases: cases.length,
    queuedCases: cases.filter(c => c.status === "queued").length,
    designingCases: cases.filter(c => c.status === "designing").length,
    reviewCases: cases.filter(c => c.status === "review").length,
    approvedCases: cases.filter(c => c.status === "approved").length,
    revisionCases: cases.filter(c => c.status === "revision").length,
    avgProgress: Math.round(cases.reduce((sum, c) => sum + c.progress, 0) / Math.max(cases.length, 1)),
    availableDesigners: designers.filter(d => d.status === "available").length,
    totalDesigners: designers.length,
    avgQuality: Math.round(designers.reduce((sum, d) => sum + d.qualityScore, 0) / Math.max(designers.length, 1)),
    availableLicenses: software.reduce((sum, s) => sum + (s.licenses - s.inUse), 0),
    totalLicenses: software.reduce((sum, s) => sum + s.licenses, 0)
  };

  const handleAddCase = () => {
    if (newCase.patient && newCase.restorationType && newCase.material) {
      const caseToAdd: DesignCase = {
        id: `CAD-${String(cases.length + 1).padStart(3, '0')}`,
        patient: newCase.patient,
        restorationType: newCase.restorationType,
        toothNumbers: newCase.toothNumbers || "",
        material: newCase.material,
        designer: newCase.designer || "",
        software: newCase.software || "",
        progress: 0,
        status: "queued",
        checklist: { margins: false, contacts: false, occlusion: false, anatomy: false, thickness: false },
        revisionCount: 0,
        notes: newCase.notes || "",
        priority: newCase.priority || "normal",
        scanQuality: newCase.scanQuality || "good",
        startDate: new Date().toISOString().split('T')[0],
        deadline: newCase.deadline,
        timeSpent: 0
      };
      setCases([...cases, caseToAdd]);
      setShowNewCaseDialog(false);
      setNewCase({
        status: "queued",
        priority: "normal",
        progress: 0,
        checklist: { margins: false, contacts: false, occlusion: false, anatomy: false, thickness: false },
        revisionCount: 0,
        timeSpent: 0
      });
    }
  };

  const handleAddDesigner = () => {
    if (newDesigner.name && newDesigner.specialization) {
      const designerToAdd: Designer = {
        id: `DES-${String(designers.length + 1).padStart(3, '0')}`,
        name: newDesigner.name,
        specialization: newDesigner.specialization,
        activeCases: 0,
        completedCases: newDesigner.completedCases || 0,
        averageTime: newDesigner.averageTime || 45,
        qualityScore: newDesigner.qualityScore || 90,
        status: "available"
      };
      setDesigners([...designers, designerToAdd]);
      setShowDesignerDialog(false);
      setNewDesigner({
        activeCases: 0,
        completedCases: 0,
        averageTime: 0,
        qualityScore: 0,
        status: "available"
      });
    }
  };

  const handleAddLibraryItem = () => {
    if (newLibraryItem.name && newLibraryItem.category && newLibraryItem.manufacturer) {
      const libraryToAdd: DesignLibrary = {
        id: `LIB-${String(designLibrary.length + 1).padStart(3, '0')}`,
        name: newLibraryItem.name,
        category: newLibraryItem.category as any,
        manufacturer: newLibraryItem.manufacturer,
        downloads: 0,
        rating: newLibraryItem.rating || 0
      };
      setDesignLibrary([...designLibrary, libraryToAdd]);
      setShowLibraryDialog(false);
      setNewLibraryItem({
        downloads: 0,
        rating: 0
      });
    }
  };

  const handleAddSoftware = () => {
    if (newSoftware.name && newSoftware.version && newSoftware.vendor) {
      const softwareToAdd: Software = {
        id: `SW-${String(software.length + 1).padStart(3, '0')}`,
        name: newSoftware.name,
        version: newSoftware.version,
        licenses: newSoftware.licenses || 1,
        inUse: 0,
        type: newSoftware.type || "CAD",
        lastUpdate: new Date().toISOString().split('T')[0],
        purchaseDate: newSoftware.purchaseDate || new Date().toISOString().split('T')[0],
        expiryDate: newSoftware.expiryDate || "",
        monthlyCost: newSoftware.monthlyCost || 0,
        annualCost: newSoftware.annualCost || 0,
        vendor: newSoftware.vendor,
        supportContact: newSoftware.supportContact || "",
        assignedUsers: newSoftware.assignedUsers || [],
        autoRenewal: newSoftware.autoRenewal || false,
        status: newSoftware.status || "active"
      };
      setSoftware([...software, softwareToAdd]);
      setShowSoftwareDialog(false);
      setNewSoftware({
        licenses: 1,
        inUse: 0,
        type: "CAD",
        monthlyCost: 0,
        annualCost: 0,
        assignedUsers: [],
        autoRenewal: false,
        status: "active"
      });
    }
  };

  const handleUpdateSoftware = () => {
    if (editingSoftware) {
      setSoftware(software.map(s => s.id === editingSoftware.id ? editingSoftware : s));
      setEditingSoftware(null);
    }
  };

  const handleDeleteSoftware = (id: string) => {
    setSoftware(software.filter(s => s.id !== id));
  };

  const handleRenewLicense = (id: string, months: number) => {
    setSoftware(software.map(s => {
      if (s.id === id) {
        const currentExpiry = new Date(s.expiryDate);
        currentExpiry.setMonth(currentExpiry.getMonth() + months);
        return {
          ...s,
          expiryDate: currentExpiry.toISOString().split('T')[0],
          status: "active" as const
        };
      }
      return s;
    }));
  };

  const getExpiryStatus = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return { status: "expired", days: daysUntilExpiry, color: "text-red-600" };
    if (daysUntilExpiry < 30) return { status: "expiring", days: daysUntilExpiry, color: "text-orange-600" };
    return { status: "active", days: daysUntilExpiry, color: "text-green-600" };
  };

  const handleAddQualityMetric = () => {
    if (newQualityMetric.caseId && newQualityMetric.reviewer) {
      const scores = newQualityMetric.scores!;
      const overallScore = Math.round(
        (scores.margins + scores.contacts + scores.occlusion + scores.anatomy + scores.thickness) / 5
      );
      
      const metricToAdd: QualityMetric = {
        id: `QM-${String(qualityMetrics.length + 1).padStart(3, '0')}`,
        caseId: newQualityMetric.caseId,
        reviewer: newQualityMetric.reviewer,
        date: new Date().toISOString().split('T')[0],
        scores: scores,
        overallScore: overallScore,
        feedback: newQualityMetric.feedback || "",
        approved: newQualityMetric.approved || false
      };
      
      setQualityMetrics([...qualityMetrics, metricToAdd]);
      
      // تحديث حالة التصميم
      if (newQualityMetric.approved) {
        setCases(cases.map(c => 
          c.id === newQualityMetric.caseId 
            ? { ...c, status: "approved", completionDate: new Date().toISOString().split('T')[0] }
            : c
        ));
      } else {
        setCases(cases.map(c => 
          c.id === newQualityMetric.caseId 
            ? { ...c, status: "revision", revisionCount: c.revisionCount + 1 }
            : c
        ));
      }
      
      setShowQualityDialog(false);
      setNewQualityMetric({ scores: { margins: 0, contacts: 0, occlusion: 0, anatomy: 0, thickness: 0 } });
    }
  };

  const updateCaseStatus = (caseId: string, newStatus: DesignCase["status"]) => {
    setCases(cases.map(c => c.id === caseId ? { ...c, status: newStatus } : c));
  };

  const updateCaseProgress = (caseId: string, progress: number) => {
    setCases(cases.map(c => c.id === caseId ? { ...c, progress } : c));
  };

  const getStatusColor = (status: DesignCase["status"]) => {
    switch (status) {
      case "approved": return "text-green-600 bg-green-50";
      case "designing": return "text-blue-600 bg-blue-50";
      case "queued": return "text-gray-600 bg-gray-50";
      case "review": return "text-yellow-600 bg-yellow-50";
      case "revision": return "text-red-600 bg-red-50";
      case "paused": return "text-orange-600 bg-orange-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getPriorityColor = (priority: DesignCase["priority"]) => {
    switch (priority) {
      case "emergency": return "bg-red-100 text-red-800 border-red-300";
      case "rush": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getDesignerStatusColor = (status: Designer["status"]) => {
    switch (status) {
      case "available": return "text-green-600";
      case "busy": return "text-blue-600";
      case "offline": return "text-gray-600";
      default: return "text-gray-600";
    }
  };

  return (
    <Layout>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">إدارة التصميم الرقمي CAD</h1>
            <p className="text-muted-foreground">نظام شامل لإدارة التصميم الرقمي</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="cases">حالات التصميم</TabsTrigger>
            <TabsTrigger value="designers">المصممون</TabsTrigger>
            <TabsTrigger value="software">البرامج</TabsTrigger>
            <TabsTrigger value="library">المكتبة</TabsTrigger>
            <TabsTrigger value="quality">الجودة</TabsTrigger>
          </TabsList>

          {/* نظرة عامة */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">إجمالي الحالات</CardTitle>
                  <Layers className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{designStats.totalCases}</div>
                  <p className="text-xs text-muted-foreground">حالة نشطة</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">قيد التصميم</CardTitle>
                  <Pencil className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{designStats.designingCases}</div>
                  <p className="text-xs text-muted-foreground">حالة جارية</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">للمراجعة</CardTitle>
                  <Eye className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{designStats.reviewCases}</div>
                  <p className="text-xs text-muted-foreground">بانتظار الموافقة</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">معتمد</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{designStats.approvedCases}</div>
                  <p className="text-xs text-muted-foreground">جاهز للإنتاج</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    حالة المصممين
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {designers.map(designer => (
                    <div key={designer.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{designer.name}</span>
                          <Badge variant="outline" className={getDesignerStatusColor(designer.status)}>
                            {designer.status === "available" ? "متاح" : designer.status === "busy" ? "مشغول" : "غير متصل"}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">{designer.qualityScore}%</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                        <div>نشط: {designer.activeCases}</div>
                        <div>مكتمل: {designer.completedCases}</div>
                        <div>متوسط: {designer.averageTime}د</div>
                      </div>
                      <Progress value={(designer.activeCases / 5) * 100} className="h-1" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    البرامج والتراخيص
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {software.map(sw => {
                    const usagePercent = (sw.inUse / sw.licenses) * 100;
                    return (
                      <div key={sw.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">{sw.name}</span>
                            <p className="text-xs text-muted-foreground">{sw.version}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-medium">{sw.inUse}/{sw.licenses}</span>
                            <p className="text-xs text-muted-foreground">مستخدم</p>
                          </div>
                        </div>
                        <Progress value={usagePercent} />
                      </div>
                    );
                  })}
                  <div className="pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">التراخيص المتاحة</span>
                      <span className="text-lg font-bold text-green-600">{designStats.availableLicenses}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">متوسط التقدم</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{designStats.avgProgress}%</div>
                  <Progress value={designStats.avgProgress} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">متوسط الجودة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{designStats.avgQuality}%</div>
                  <p className="text-xs text-muted-foreground mt-1">جودة ممتازة</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">في الانتظار</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-600">{designStats.queuedCases}</div>
                  <p className="text-xs text-muted-foreground mt-1">حالة بانتظار التصميم</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* حالات التصميم */}
          <TabsContent value="cases" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">حالات التصميم</h2>
              <Button onClick={() => setShowNewCaseDialog(true)}>
                <Layers className="h-4 w-4 mr-2" />
                حالة جديدة
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              <Card className="bg-gray-50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">في الانتظار</p>
                    <p className="text-3xl font-bold">{cases.filter(c => c.status === "queued").length}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">قيد التصميم</p>
                    <p className="text-3xl font-bold text-blue-600">{cases.filter(c => c.status === "designing").length}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-yellow-50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">للمراجعة</p>
                    <p className="text-3xl font-bold text-yellow-600">{cases.filter(c => c.status === "review").length}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">معتمد</p>
                    <p className="text-3xl font-bold text-green-600">{cases.filter(c => c.status === "approved").length}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-red-50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">مراجعة</p>
                    <p className="text-3xl font-bold text-red-600">{cases.filter(c => c.status === "revision").length}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-orange-50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">متوقف</p>
                    <p className="text-3xl font-bold text-orange-600">{cases.filter(c => c.status === "paused").length}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3">
              {cases.map(designCase => {
                const checklistComplete = Object.values(designCase.checklist).filter(Boolean).length;
                return (
                  <Card key={designCase.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="font-mono">{designCase.id}</Badge>
                            <div>
                              <h3 className="font-semibold text-lg">{designCase.patient}</h3>
                              <p className="text-sm text-muted-foreground">{designCase.restorationType}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getPriorityColor(designCase.priority)}>
                              {designCase.priority === "emergency" ? "طارئ" : designCase.priority === "rush" ? "سريع" : "عادي"}
                            </Badge>
                            <Badge variant="outline" className={getStatusColor(designCase.status)}>
                              {designCase.status === "queued" ? "في الانتظار" :
                               designCase.status === "designing" ? "قيد التصميم" :
                               designCase.status === "review" ? "للمراجعة" :
                               designCase.status === "approved" ? "معتمد" :
                               designCase.status === "revision" ? "مراجعة" : "متوقف"}
                            </Badge>
                            {designCase.revisionCount > 0 && (
                              <Badge variant="outline" className="bg-red-50 text-red-700">
                                مراجعة #{designCase.revisionCount}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">الأسنان</p>
                            <p className="font-medium">{designCase.toothNumbers}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">المادة</p>
                            <p className="font-medium">{designCase.material}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">المصمم</p>
                            <p className="font-medium">{designCase.designer || "غير معين"}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">البرنامج</p>
                            <p className="font-medium">{designCase.software || "-"}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">جودة المسح</p>
                            <p className="font-medium">
                              {designCase.scanQuality === "excellent" ? "ممتاز" :
                               designCase.scanQuality === "good" ? "جيد" :
                               designCase.scanQuality === "acceptable" ? "مقبول" : "ضعيف"}
                            </p>
                          </div>
                        </div>

                        {designCase.status !== "queued" && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>التقدم</span>
                              <span>{designCase.progress}%</span>
                            </div>
                            <Progress value={designCase.progress} />
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckSquare className="h-4 w-4 text-green-600" />
                            <span>{checklistComplete}/5 معايير</span>
                          </div>
                          <Separator orientation="vertical" className="h-4" />
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-600" />
                            <span>{designCase.timeSpent} دقيقة</span>
                          </div>
                          {designCase.deadline && (
                            <>
                              <Separator orientation="vertical" className="h-4" />
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-orange-600" />
                                <span>{designCase.deadline}</span>
                              </div>
                            </>
                          )}
                        </div>

                        {designCase.notes && (
                          <p className="text-sm text-muted-foreground italic bg-gray-50 p-2 rounded">
                            {designCase.notes}
                          </p>
                        )}

                        <div className="flex gap-2 pt-2">
                          {designCase.status === "queued" && (
                            <Button size="sm" onClick={() => updateCaseStatus(designCase.id, "designing")}>
                              <PlayCircle className="h-4 w-4 mr-1" />
                              بدء التصميم
                            </Button>
                          )}
                          {designCase.status === "designing" && (
                            <>
                              <Button size="sm" onClick={() => updateCaseStatus(designCase.id, "review")}>
                                <Eye className="h-4 w-4 mr-1" />
                                للمراجعة
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => updateCaseStatus(designCase.id, "paused")}>
                                <PauseCircle className="h-4 w-4 mr-1" />
                                إيقاف مؤقت
                              </Button>
                            </>
                          )}
                          {designCase.status === "review" && (
                            <>
                              <Button size="sm" variant="default" onClick={() => updateCaseStatus(designCase.id, "approved")}>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                اعتماد
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => updateCaseStatus(designCase.id, "revision")}>
                                <RotateCcw className="h-4 w-4 mr-1" />
                                مراجعة
                              </Button>
                            </>
                          )}
                          {designCase.status === "revision" && (
                            <Button size="sm" onClick={() => updateCaseStatus(designCase.id, "designing")}>
                              <PlayCircle className="h-4 w-4 mr-1" />
                              استئناف
                            </Button>
                          )}
                          {designCase.status === "paused" && (
                            <Button size="sm" onClick={() => updateCaseStatus(designCase.id, "designing")}>
                              <PlayCircle className="h-4 w-4 mr-1" />
                              متابعة
                            </Button>
                          )}
                          <Button size="sm" variant="outline" onClick={() => setEditingCase(designCase)}>
                            <Pencil className="h-4 w-4 mr-1" />
                            تعديل
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* المصممون */}
          <TabsContent value="designers" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">فريق المصممين</h2>
              <Button onClick={() => setShowDesignerDialog(true)}>
                <Users className="h-4 w-4 mr-2" />
                إضافة مصمم
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">إجمالي المصممين</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{designers.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">المتاحين</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {designers.filter(d => d.status === "available").length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">متوسط الجودة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{designStats.avgQuality}%</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {designers.map(designer => (
                <Card key={designer.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          {designer.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{designer.specialization}</p>
                      </div>
                      <Badge variant="outline" className={getDesignerStatusColor(designer.status)}>
                        {designer.status === "available" ? "متاح" : designer.status === "busy" ? "مشغول" : "غير متصل"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">حالات نشطة</p>
                        <p className="text-2xl font-bold">{designer.activeCases}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">مكتملة</p>
                        <p className="text-2xl font-bold">{designer.completedCases}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">متوسط الوقت</p>
                        <p className="text-2xl font-bold">{designer.averageTime}د</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>درجة الجودة</span>
                        <span className="font-bold">{designer.qualityScore}%</span>
                      </div>
                      <Progress value={designer.qualityScore} />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>الحمل الحالي</span>
                        <span>{designer.activeCases}/5</span>
                      </div>
                      <Progress value={(designer.activeCases / 5) * 100} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* البرامج */}
          <TabsContent value="software" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">البرامج والتراخيص</h2>
              <Button onClick={() => setShowSoftwareDialog(true)}>
                <Monitor className="h-4 w-4 mr-2" />
                إضافة برنامج
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">إجمالي البرامج</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{software.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">إجمالي التراخيص</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{designStats.totalLicenses}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">قيد الاستخدام</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {designStats.totalLicenses - designStats.availableLicenses}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">المتاحة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{designStats.availableLicenses}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">التكلفة الشهرية</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {software.reduce((sum, s) => sum + s.monthlyCost, 0).toLocaleString()} ج.م
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3">
              {software.map(sw => {
                const usagePercent = (sw.inUse / sw.licenses) * 100;
                const expiryInfo = getExpiryStatus(sw.expiryDate);
                return (
                  <Card key={sw.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="font-mono">{sw.id}</Badge>
                            <div>
                              <h3 className="font-semibold text-lg flex items-center gap-2">
                                <Monitor className="h-5 w-5" />
                                {sw.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">الإصدار {sw.version}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{sw.type}</Badge>
                            {expiryInfo.status === "expired" && (
                              <Badge className="bg-red-100 text-red-800">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                منتهي
                              </Badge>
                            )}
                            {expiryInfo.status === "expiring" && (
                              <Badge className="bg-orange-100 text-orange-800">
                                <Clock className="h-3 w-3 mr-1" />
                                قريب الانتهاء
                              </Badge>
                            )}
                            {sw.autoRenewal && (
                              <Badge className="bg-green-100 text-green-800">
                                <RotateCcw className="h-3 w-3 mr-1" />
                                تجديد تلقائي
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">التراخيص</p>
                            <p className="font-medium text-lg">{sw.licenses}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">قيد الاستخدام</p>
                            <p className="font-medium text-lg text-blue-600">{sw.inUse}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">المتاحة</p>
                            <p className="font-medium text-lg text-green-600">{sw.licenses - sw.inUse}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">التكلفة الشهرية</p>
                            <p className="font-medium text-lg">{sw.monthlyCost.toLocaleString()} ج.م</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">التكلفة السنوية</p>
                            <p className="font-medium text-lg">{sw.annualCost.toLocaleString()} ج.م</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>نسبة الاستخدام</span>
                            <span>{Math.round(usagePercent)}%</span>
                          </div>
                          <Progress value={usagePercent} />
                        </div>

                        <Separator />

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">الشراء</p>
                            <p className="font-medium">{sw.purchaseDate}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">الانتهاء</p>
                            <p className={`font-medium ${expiryInfo.color}`}>
                              {sw.expiryDate}
                              {expiryInfo.days >= 0 && ` (${expiryInfo.days} يوم)`}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">المورد</p>
                            <p className="font-medium">{sw.vendor}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">آخر تحديث</p>
                            <p className="font-medium">{sw.lastUpdate}</p>
                          </div>
                        </div>

                        {sw.assignedUsers.length > 0 && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">المستخدمون المعينون:</p>
                            <div className="flex flex-wrap gap-2">
                              {sw.assignedUsers.map((user, idx) => (
                                <Badge key={idx} variant="outline" className="bg-blue-50">
                                  <Users className="h-3 w-3 mr-1" />
                                  {user}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2 pt-2">
                          <Button size="sm" onClick={() => {
                            setSelectedSoftware(sw);
                            setShowSoftwareDetailsDialog(true);
                          }}>
                            <Eye className="h-4 w-4 mr-1" />
                            التفاصيل
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingSoftware(sw)}>
                            <Pencil className="h-4 w-4 mr-1" />
                            تعديل
                          </Button>
                          {expiryInfo.status !== "active" && (
                            <Button size="sm" variant="default" onClick={() => handleRenewLicense(sw.id, 12)}>
                              <RotateCcw className="h-4 w-4 mr-1" />
                              تجديد سنة
                            </Button>
                          )}
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteSoftware(sw.id)}>
                            <XCircle className="h-4 w-4 mr-1" />
                            حذف
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* المكتبة */}
          <TabsContent value="library" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">مكتبة التصاميم</h2>
              <Button onClick={() => setShowLibraryDialog(true)}>
                <BookOpen className="h-4 w-4 mr-2" />
                إضافة تصميم
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">إجمالي التصاميم</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{designLibrary.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">إجمالي التنزيلات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {designLibrary.reduce((sum, lib) => sum + lib.downloads, 0)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">متوسط التقييم</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {(designLibrary.reduce((sum, lib) => sum + lib.rating, 0) / designLibrary.length).toFixed(1)}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3">
              {designLibrary.map(lib => (
                <Card key={lib.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="font-mono">{lib.id}</Badge>
                          <h3 className="font-semibold text-lg">{lib.name}</h3>
                          <Badge>{lib.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">المصنع: {lib.manufacturer}</p>
                        <div className="flex items-center gap-4 mt-3 text-sm">
                          <div className="flex items-center gap-1">
                            <Download className="h-4 w-4 text-blue-600" />
                            <span>{lib.downloads} تنزيل</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">★</span>
                            <span>{lib.rating}</span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        تنزيل
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* الجودة */}
          <TabsContent value="quality" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">مراقبة الجودة</h2>
              <Button onClick={() => setShowQualityDialog(true)}>
                <Microscope className="h-4 w-4 mr-2" />
                فحص جودة
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">إجمالي الفحوصات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{qualityMetrics.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">معتمد</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {qualityMetrics.filter(q => q.approved).length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">مرفوض</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">
                    {qualityMetrics.filter(q => !q.approved).length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">متوسط الدرجة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {Math.round(qualityMetrics.reduce((sum, q) => sum + q.overallScore, 0) / Math.max(qualityMetrics.length, 1))}%
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3">
              {qualityMetrics.map(metric => {
                const caseData = cases.find(c => c.id === metric.caseId);
                return (
                  <Card key={metric.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="font-mono">{metric.id}</Badge>
                            <div>
                              <h3 className="font-semibold">{caseData?.patient}</h3>
                              <p className="text-sm text-muted-foreground">{caseData?.restorationType}</p>
                            </div>
                          </div>
                          <Badge className={metric.approved ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {metric.approved ? "معتمد" : "مرفوض"}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">المراجع</p>
                            <p className="font-medium">{metric.reviewer}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">التاريخ</p>
                            <p className="font-medium">{metric.date}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">الدرجة الكلية</p>
                            <p className="font-medium text-lg">{metric.overallScore}%</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>الهوامش (Margins)</span>
                              <span>{metric.scores.margins}%</span>
                            </div>
                            <Progress value={metric.scores.margins} />
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>التماس (Contacts)</span>
                              <span>{metric.scores.contacts}%</span>
                            </div>
                            <Progress value={metric.scores.contacts} />
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>الإطباق (Occlusion)</span>
                              <span>{metric.scores.occlusion}%</span>
                            </div>
                            <Progress value={metric.scores.occlusion} />
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>التشريح (Anatomy)</span>
                              <span>{metric.scores.anatomy}%</span>
                            </div>
                            <Progress value={metric.scores.anatomy} />
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>السُمك (Thickness)</span>
                              <span>{metric.scores.thickness}%</span>
                            </div>
                            <Progress value={metric.scores.thickness} />
                          </div>
                        </div>

                        {metric.feedback && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm font-medium text-gray-900">ملاحظات</p>
                            <p className="text-sm text-gray-700">{metric.feedback}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* حوار حالة جديدة */}
        <Dialog open={showNewCaseDialog} onOpenChange={setShowNewCaseDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>حالة تصميم جديدة</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>اسم المريض/الطبيب</Label>
                <Input
                  value={newCase.patient || ""}
                  onChange={(e) => setNewCase({ ...newCase, patient: e.target.value })}
                  placeholder="د. أحمد محمد"
                />
              </div>
              <div className="space-y-2">
                <Label>نوع الترميم</Label>
                <Input
                  value={newCase.restorationType || ""}
                  onChange={(e) => setNewCase({ ...newCase, restorationType: e.target.value })}
                  placeholder="تاج زركونيا"
                />
              </div>
              <div className="space-y-2">
                <Label>أرقام الأسنان</Label>
                <Input
                  value={newCase.toothNumbers || ""}
                  onChange={(e) => setNewCase({ ...newCase, toothNumbers: e.target.value })}
                  placeholder="14, 15"
                />
              </div>
              <div className="space-y-2">
                <Label>المادة</Label>
                <Input
                  value={newCase.material || ""}
                  onChange={(e) => setNewCase({ ...newCase, material: e.target.value })}
                  placeholder="زركونيا شفافة"
                />
              </div>
              <div className="space-y-2">
                <Label>المصمم</Label>
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={newCase.designer || ""}
                  onChange={(e) => setNewCase({ ...newCase, designer: e.target.value })}
                >
                  <option value="">اختر المصمم</option>
                  {designers.filter(d => d.status === "available").map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>البرنامج</Label>
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={newCase.software || ""}
                  onChange={(e) => setNewCase({ ...newCase, software: e.target.value })}
                >
                  <option value="">اختر البرنامج</option>
                  {software.filter(s => s.inUse < s.licenses).map(s => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>الأولوية</Label>
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={newCase.priority || "normal"}
                  onChange={(e) => setNewCase({ ...newCase, priority: e.target.value as any })}
                >
                  <option value="normal">عادي</option>
                  <option value="rush">سريع</option>
                  <option value="emergency">طارئ</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>جودة المسح</Label>
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={newCase.scanQuality || "good"}
                  onChange={(e) => setNewCase({ ...newCase, scanQuality: e.target.value as any })}
                >
                  <option value="excellent">ممتاز</option>
                  <option value="good">جيد</option>
                  <option value="acceptable">مقبول</option>
                  <option value="poor">ضعيف</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>الموعد النهائي</Label>
                <Input
                  type="date"
                  value={newCase.deadline || ""}
                  onChange={(e) => setNewCase({ ...newCase, deadline: e.target.value })}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>ملاحظات</Label>
                <Input
                  value={newCase.notes || ""}
                  onChange={(e) => setNewCase({ ...newCase, notes: e.target.value })}
                  placeholder="أي ملاحظات إضافية"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewCaseDialog(false)}>إلغاء</Button>
              <Button onClick={handleAddCase}>إضافة</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* حوار إضافة مصمم جديد */}
        <Dialog open={showDesignerDialog} onOpenChange={setShowDesignerDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة مصمم جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>اسم المصمم</Label>
                <Input
                  value={newDesigner.name || ""}
                  onChange={(e) => setNewDesigner({ ...newDesigner, name: e.target.value })}
                  placeholder="م. أحمد محمود"
                />
              </div>
              <div className="space-y-2">
                <Label>التخصص</Label>
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={newDesigner.specialization || ""}
                  onChange={(e) => setNewDesigner({ ...newDesigner, specialization: e.target.value })}
                >
                  <option value="">اختر التخصص</option>
                  <option value="تيجان وجسور">تيجان وجسور</option>
                  <option value="قشور وتجميل">قشور وتجميل</option>
                  <option value="زراعات">زراعات</option>
                  <option value="أطقم كاملة">أطقم كاملة</option>
                  <option value="أطقم جزئية">أطقم جزئية</option>
                  <option value="تقويم">تقويم</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>عدد الحالات المكتملة السابقة</Label>
                <Input
                  type="number"
                  min="0"
                  value={newDesigner.completedCases || ""}
                  onChange={(e) => setNewDesigner({ ...newDesigner, completedCases: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>متوسط الوقت لكل حالة (دقيقة)</Label>
                <Input
                  type="number"
                  min="0"
                  value={newDesigner.averageTime || ""}
                  onChange={(e) => setNewDesigner({ ...newDesigner, averageTime: parseInt(e.target.value) || 45 })}
                  placeholder="45"
                />
              </div>
              <div className="space-y-2">
                <Label>درجة الجودة المبدئية (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={newDesigner.qualityScore || ""}
                  onChange={(e) => setNewDesigner({ ...newDesigner, qualityScore: parseInt(e.target.value) || 90 })}
                  placeholder="90"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDesignerDialog(false)}>إلغاء</Button>
              <Button onClick={handleAddDesigner}>إضافة المصمم</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* حوار إضافة تصميم للمكتبة */}
        <Dialog open={showLibraryDialog} onOpenChange={setShowLibraryDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة تصميم جديد للمكتبة</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>اسم التصميم</Label>
                <Input
                  value={newLibraryItem.name || ""}
                  onChange={(e) => setNewLibraryItem({ ...newLibraryItem, name: e.target.value })}
                  placeholder="مكتبة تيجان طبيعية متقدمة"
                />
              </div>
              <div className="space-y-2">
                <Label>الفئة</Label>
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={newLibraryItem.category || ""}
                  onChange={(e) => setNewLibraryItem({ ...newLibraryItem, category: e.target.value as any })}
                >
                  <option value="">اختر الفئة</option>
                  <option value="تيجان">تيجان</option>
                  <option value="جسور">جسور</option>
                  <option value="قشور">قشور</option>
                  <option value="زراعة">زراعة</option>
                  <option value="أطقم">أطقم</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>المصنع/المصدر</Label>
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={newLibraryItem.manufacturer || ""}
                  onChange={(e) => setNewLibraryItem({ ...newLibraryItem, manufacturer: e.target.value })}
                >
                  <option value="">اختر المصنع</option>
                  <option value="exocad">exocad</option>
                  <option value="3Shape">3Shape</option>
                  <option value="Nobel Biocare">Nobel Biocare</option>
                  <option value="Straumann">Straumann</option>
                  <option value="Ivoclar">Ivoclar</option>
                  <option value="Dentsply Sirona">Dentsply Sirona</option>
                  <option value="Medit">Medit</option>
                  <option value="مخصص">مخصص</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>التقييم المبدئي (0-5)</Label>
                <Input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={newLibraryItem.rating || ""}
                  onChange={(e) => setNewLibraryItem({ ...newLibraryItem, rating: parseFloat(e.target.value) || 0 })}
                  placeholder="4.5"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowLibraryDialog(false)}>إلغاء</Button>
              <Button onClick={handleAddLibraryItem}>إضافة للمكتبة</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* حوار إضافة/تعديل برنامج */}
        <Dialog open={showSoftwareDialog || editingSoftware !== null} onOpenChange={(open) => {
          if (!open) {
            setShowSoftwareDialog(false);
            setEditingSoftware(null);
          }
        }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingSoftware ? "تعديل البرنامج" : "إضافة برنامج جديد"}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>اسم البرنامج</Label>
                <Input
                  value={editingSoftware ? editingSoftware.name : newSoftware.name || ""}
                  onChange={(e) => editingSoftware 
                    ? setEditingSoftware({ ...editingSoftware, name: e.target.value })
                    : setNewSoftware({ ...newSoftware, name: e.target.value })}
                  placeholder="exocad"
                />
              </div>
              <div className="space-y-2">
                <Label>الإصدار</Label>
                <Input
                  value={editingSoftware ? editingSoftware.version : newSoftware.version || ""}
                  onChange={(e) => editingSoftware 
                    ? setEditingSoftware({ ...editingSoftware, version: e.target.value })
                    : setNewSoftware({ ...newSoftware, version: e.target.value })}
                  placeholder="3.1"
                />
              </div>
              <div className="space-y-2">
                <Label>النوع</Label>
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={editingSoftware ? editingSoftware.type : newSoftware.type || "CAD"}
                  onChange={(e) => editingSoftware 
                    ? setEditingSoftware({ ...editingSoftware, type: e.target.value as any })
                    : setNewSoftware({ ...newSoftware, type: e.target.value as any })}
                >
                  <option value="CAD">CAD - تصميم</option>
                  <option value="Scanner">Scanner - مسح</option>
                  <option value="Mill">Mill - طحن</option>
                  <option value="Viewer">Viewer - عرض</option>
                  <option value="Library">Library - مكتبة</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>عدد التراخيص</Label>
                <Input
                  type="number"
                  min="1"
                  value={editingSoftware ? editingSoftware.licenses : newSoftware.licenses || ""}
                  onChange={(e) => editingSoftware 
                    ? setEditingSoftware({ ...editingSoftware, licenses: parseInt(e.target.value) })
                    : setNewSoftware({ ...newSoftware, licenses: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>المورد</Label>
                <Input
                  value={editingSoftware ? editingSoftware.vendor : newSoftware.vendor || ""}
                  onChange={(e) => editingSoftware 
                    ? setEditingSoftware({ ...editingSoftware, vendor: e.target.value })
                    : setNewSoftware({ ...newSoftware, vendor: e.target.value })}
                  placeholder="exocad GmbH"
                />
              </div>
              <div className="space-y-2">
                <Label>الدعم الفني</Label>
                <Input
                  value={editingSoftware ? editingSoftware.supportContact : newSoftware.supportContact || ""}
                  onChange={(e) => editingSoftware 
                    ? setEditingSoftware({ ...editingSoftware, supportContact: e.target.value })
                    : setNewSoftware({ ...newSoftware, supportContact: e.target.value })}
                  placeholder="support@exocad.com"
                />
              </div>
              <div className="space-y-2">
                <Label>تاريخ الشراء</Label>
                <Input
                  type="date"
                  value={editingSoftware ? editingSoftware.purchaseDate : newSoftware.purchaseDate || ""}
                  onChange={(e) => editingSoftware 
                    ? setEditingSoftware({ ...editingSoftware, purchaseDate: e.target.value })
                    : setNewSoftware({ ...newSoftware, purchaseDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>تاريخ الانتهاء</Label>
                <Input
                  type="date"
                  value={editingSoftware ? editingSoftware.expiryDate : newSoftware.expiryDate || ""}
                  onChange={(e) => editingSoftware 
                    ? setEditingSoftware({ ...editingSoftware, expiryDate: e.target.value })
                    : setNewSoftware({ ...newSoftware, expiryDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>التكلفة الشهرية (ج.م)</Label>
                <Input
                  type="number"
                  min="0"
                  value={editingSoftware ? editingSoftware.monthlyCost : newSoftware.monthlyCost || ""}
                  onChange={(e) => editingSoftware 
                    ? setEditingSoftware({ ...editingSoftware, monthlyCost: parseFloat(e.target.value) })
                    : setNewSoftware({ ...newSoftware, monthlyCost: parseFloat(e.target.value) })}
                  placeholder="4500"
                />
              </div>
              <div className="space-y-2">
                <Label>التكلفة السنوية (ج.م)</Label>
                <Input
                  type="number"
                  min="0"
                  value={editingSoftware ? editingSoftware.annualCost : newSoftware.annualCost || ""}
                  onChange={(e) => editingSoftware 
                    ? setEditingSoftware({ ...editingSoftware, annualCost: parseFloat(e.target.value) })
                    : setNewSoftware({ ...newSoftware, annualCost: parseFloat(e.target.value) })}
                  placeholder="54000"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="autoRenewal"
                    checked={editingSoftware ? editingSoftware.autoRenewal : newSoftware.autoRenewal || false}
                    onChange={(e) => editingSoftware 
                      ? setEditingSoftware({ ...editingSoftware, autoRenewal: e.target.checked })
                      : setNewSoftware({ ...newSoftware, autoRenewal: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="autoRenewal">تجديد تلقائي عند الانتهاء</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowSoftwareDialog(false);
                setEditingSoftware(null);
              }}>إلغاء</Button>
              <Button onClick={editingSoftware ? handleUpdateSoftware : handleAddSoftware}>
                {editingSoftware ? "تحديث" : "إضافة"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* حوار تفاصيل البرنامج */}
        <Dialog open={showSoftwareDetailsDialog} onOpenChange={setShowSoftwareDetailsDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                تفاصيل البرنامج
              </DialogTitle>
            </DialogHeader>
            {selectedSoftware && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">المعلومات الأساسية</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">الرقم التعريفي:</span>
                        <span className="font-medium">{selectedSoftware.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">اسم البرنامج:</span>
                        <span className="font-medium">{selectedSoftware.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">الإصدار:</span>
                        <span className="font-medium">{selectedSoftware.version}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">النوع:</span>
                        <Badge>{selectedSoftware.type}</Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3">التراخيص</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">إجمالي التراخيص:</span>
                        <span className="font-medium">{selectedSoftware.licenses}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">قيد الاستخدام:</span>
                        <span className="font-medium text-blue-600">{selectedSoftware.inUse}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">المتاحة:</span>
                        <span className="font-medium text-green-600">{selectedSoftware.licenses - selectedSoftware.inUse}</span>
                      </div>
                      <div className="pt-2">
                        <Progress value={(selectedSoftware.inUse / selectedSoftware.licenses) * 100} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3">التواريخ</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">تاريخ الشراء:</span>
                        <span className="font-medium">{selectedSoftware.purchaseDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">تاريخ الانتهاء:</span>
                        <span className="font-medium">{selectedSoftware.expiryDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">آخر تحديث:</span>
                        <span className="font-medium">{selectedSoftware.lastUpdate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">الأيام المتبقية:</span>
                        <span className={`font-medium ${getExpiryStatus(selectedSoftware.expiryDate).color}`}>
                          {getExpiryStatus(selectedSoftware.expiryDate).days} يوم
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3">التكاليف</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">شهرياً:</span>
                        <span className="font-medium">{selectedSoftware.monthlyCost.toLocaleString()} ج.م</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">سنوياً:</span>
                        <span className="font-medium">{selectedSoftware.annualCost.toLocaleString()} ج.م</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">لكل ترخيص:</span>
                        <span className="font-medium">{Math.round(selectedSoftware.annualCost / selectedSoftware.licenses).toLocaleString()} ج.م</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">تجديد تلقائي:</span>
                        {selectedSoftware.autoRenewal ? (
                          <Badge className="bg-green-100 text-green-800">نعم</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">لا</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <h3 className="font-semibold text-lg mb-3">الدعم والتواصل</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">المورد:</span>
                        <span className="font-medium">{selectedSoftware.vendor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">الدعم الفني:</span>
                        <span className="font-medium">{selectedSoftware.supportContact}</span>
                      </div>
                    </div>
                  </div>

                  {selectedSoftware.assignedUsers.length > 0 && (
                    <div className="col-span-2">
                      <h3 className="font-semibold text-lg mb-3">المستخدمون المعينون ({selectedSoftware.assignedUsers.length})</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedSoftware.assignedUsers.map((user, idx) => (
                          <Badge key={idx} variant="outline" className="bg-blue-50">
                            <Users className="h-3 w-3 mr-1" />
                            {user}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex gap-2">
                  <Button onClick={() => {
                    setEditingSoftware(selectedSoftware);
                    setShowSoftwareDetailsDialog(false);
                  }}>
                    <Pencil className="h-4 w-4 mr-1" />
                    تعديل
                  </Button>
                  {getExpiryStatus(selectedSoftware.expiryDate).status !== "active" && (
                    <Button variant="default" onClick={() => {
                      handleRenewLicense(selectedSoftware.id, 12);
                      setShowSoftwareDetailsDialog(false);
                    }}>
                      <RotateCcw className="h-4 w-4 mr-1" />
                      تجديد سنة
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setShowSoftwareDetailsDialog(false)}>
                    إغلاق
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* حوار فحص جودة جديد */}
        <Dialog open={showQualityDialog} onOpenChange={setShowQualityDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>فحص جودة جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>الحالة</Label>
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={newQualityMetric.caseId || ""}
                  onChange={(e) => setNewQualityMetric({ ...newQualityMetric, caseId: e.target.value })}
                >
                  <option value="">اختر الحالة</option>
                  {cases.filter(c => c.status === "review").map(c => (
                    <option key={c.id} value={c.id}>{c.patient} - {c.restorationType}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>المراجع</Label>
                <Input
                  value={newQualityMetric.reviewer || ""}
                  onChange={(e) => setNewQualityMetric({ ...newQualityMetric, reviewer: e.target.value })}
                  placeholder="د. هشام علي"
                />
              </div>
              <div className="space-y-2">
                <Label>الهوامش Margins (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={newQualityMetric.scores?.margins || ""}
                  onChange={(e) => setNewQualityMetric({
                    ...newQualityMetric,
                    scores: { ...newQualityMetric.scores!, margins: parseInt(e.target.value) }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label>التماس Contacts (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={newQualityMetric.scores?.contacts || ""}
                  onChange={(e) => setNewQualityMetric({
                    ...newQualityMetric,
                    scores: { ...newQualityMetric.scores!, contacts: parseInt(e.target.value) }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label>الإطباق Occlusion (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={newQualityMetric.scores?.occlusion || ""}
                  onChange={(e) => setNewQualityMetric({
                    ...newQualityMetric,
                    scores: { ...newQualityMetric.scores!, occlusion: parseInt(e.target.value) }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label>التشريح Anatomy (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={newQualityMetric.scores?.anatomy || ""}
                  onChange={(e) => setNewQualityMetric({
                    ...newQualityMetric,
                    scores: { ...newQualityMetric.scores!, anatomy: parseInt(e.target.value) }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label>السُمك Thickness (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={newQualityMetric.scores?.thickness || ""}
                  onChange={(e) => setNewQualityMetric({
                    ...newQualityMetric,
                    scores: { ...newQualityMetric.scores!, thickness: parseInt(e.target.value) }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label>ملاحظات</Label>
                <Input
                  value={newQualityMetric.feedback || ""}
                  onChange={(e) => setNewQualityMetric({ ...newQualityMetric, feedback: e.target.value })}
                  placeholder="ملاحظات المراجعة"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="approved"
                  checked={newQualityMetric.approved || false}
                  onChange={(e) => setNewQualityMetric({ ...newQualityMetric, approved: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="approved">اعتماد التصميم</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowQualityDialog(false)}>إلغاء</Button>
              <Button onClick={handleAddQualityMetric}>حفظ</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
