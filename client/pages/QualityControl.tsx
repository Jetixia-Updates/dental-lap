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
  CheckCircle, XCircle, AlertCircle, Clock, Search, Eye, Microscope,
  ClipboardCheck, FileText, TrendingUp, BarChart3, AlertTriangle,
  Users, Calendar, Target, Award, Shield, Activity, Filter,
  CheckSquare, PlayCircle, PauseCircle, RefreshCw, Download,
  Upload, Settings, BookOpen, Layers, Box
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface QualityCase {
  id: string;
  caseId: string;
  patientName: string;
  doctorName: string;
  caseType: string;
  department: string;
  priority: "normal" | "rush" | "emergency";
  status: "pending" | "in-progress" | "passed" | "failed" | "needs-review" | "recheck";
  inspector: string;
  receivedDate: string;
  inspectionDate?: string;
  completionDate?: string;
  score: number; // 0-100
  defectsCount: number;
  notes: string;
}

interface QualityInspector {
  id: string;
  name: string;
  specialization: string;
  activeCases: number;
  completedCases: number;
  averageScore: number;
  efficiency: number; // حالات/يوم
  status: "available" | "busy" | "offline";
}

interface DefectRecord {
  id: string;
  caseId: string;
  category: string;
  severity: "minor" | "major" | "critical";
  description: string;
  department: string;
  detectedBy: string;
  detectedDate: string;
  resolvedDate?: string;
  status: "open" | "in-progress" | "resolved" | "rejected";
  correctiveAction: string;
}

interface QualityStandard {
  id: string;
  category: string;
  standardName: string;
  specification: string;
  tolerance: string;
  measurementMethod: string;
  isActive: boolean;
}

interface QualityMetric {
  id: string;
  metricName: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  trend: "up" | "down" | "stable";
  period: "daily" | "weekly" | "monthly";
}

interface QualityAudit {
  id: string;
  auditDate: string;
  auditor: string;
  department: string;
  casesAudited: number;
  issuesFound: number;
  complianceScore: number;
  findings: string;
  recommendations: string;
}

export default function QualityControl() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [cases, setCases] = useState<QualityCase[]>([
    {
      id: "QC-001",
      caseId: "CASE-2024-145",
      patientName: "د. أحمد محمد",
      doctorName: "د. محمود صالح",
      caseType: "تاج زركونيا",
      department: "CAM Production",
      priority: "normal",
      status: "passed",
      inspector: "م. هشام علي",
      receivedDate: "2024-01-10",
      inspectionDate: "2024-01-11",
      completionDate: "2024-01-11",
      score: 98,
      defectsCount: 0,
      notes: "جودة ممتازة - جميع المعايير مستوفاة"
    },
    {
      id: "QC-002",
      caseId: "CASE-2024-147",
      patientName: "د. سارة حسن",
      doctorName: "د. علي أحمد",
      caseType: "جسر e.max",
      department: "CAD Design",
      priority: "rush",
      status: "in-progress",
      inspector: "م. منى خالد",
      receivedDate: "2024-01-12",
      inspectionDate: "2024-01-12",
      score: 0,
      defectsCount: 0,
      notes: ""
    },
    {
      id: "QC-003",
      caseId: "CASE-2024-149",
      patientName: "د. محمد علي",
      doctorName: "د. فاطمة محمود",
      caseType: "قشور تجميلية",
      department: "Finishing",
      priority: "normal",
      status: "needs-review",
      inspector: "م. هشام علي",
      receivedDate: "2024-01-11",
      inspectionDate: "2024-01-12",
      score: 78,
      defectsCount: 2,
      notes: "يحتاج تحسين في اللمعان"
    },
    {
      id: "QC-004",
      caseId: "CASE-2024-151",
      patientName: "د. نور إبراهيم",
      doctorName: "د. حسام الدين",
      caseType: "زراعة كاملة",
      department: "CAM Production",
      priority: "emergency",
      status: "pending",
      inspector: "",
      receivedDate: "2024-01-13",
      score: 0,
      defectsCount: 0,
      notes: ""
    }
  ]);

  const [inspectors, setInspectors] = useState<QualityInspector[]>([
    {
      id: "INS-001",
      name: "م. هشام علي",
      specialization: "تيجان وجسور",
      activeCases: 2,
      completedCases: 234,
      averageScore: 96,
      efficiency: 12,
      status: "busy"
    },
    {
      id: "INS-002",
      name: "م. منى خالد",
      specialization: "قشور وتجميل",
      activeCases: 1,
      completedCases: 198,
      averageScore: 97,
      efficiency: 10,
      status: "busy"
    },
    {
      id: "INS-003",
      name: "م. سامي محمود",
      specialization: "زراعات",
      activeCases: 0,
      completedCases: 167,
      averageScore: 95,
      efficiency: 9,
      status: "available"
    },
    {
      id: "INS-004",
      name: "م. دينا سعيد",
      specialization: "أطقم كاملة",
      activeCases: 0,
      completedCases: 142,
      averageScore: 94,
      efficiency: 8,
      status: "available"
    }
  ]);

  const [defects, setDefects] = useState<DefectRecord[]>([
    {
      id: "DEF-001",
      caseId: "CASE-2024-149",
      category: "التشطيب",
      severity: "minor",
      description: "لمعان غير كافٍ على السطح الطاحن",
      department: "Finishing",
      detectedBy: "م. هشام علي",
      detectedDate: "2024-01-12",
      status: "in-progress",
      correctiveAction: "إعادة تلميع بأقراص الألماس"
    },
    {
      id: "DEF-002",
      caseId: "CASE-2024-143",
      category: "الهوامش",
      severity: "major",
      description: "فجوة في الهامش الوحشي 120 ميكرون",
      department: "CAM Production",
      detectedBy: "م. منى خالد",
      detectedDate: "2024-01-10",
      resolvedDate: "2024-01-11",
      status: "resolved",
      correctiveAction: "إعادة طحن بمعايير أدق"
    },
    {
      id: "DEF-003",
      caseId: "CASE-2024-138",
      category: "الإطباق",
      severity: "critical",
      description: "تداخل في الحركة الجانبية",
      department: "CAD Design",
      detectedBy: "م. هشام علي",
      detectedDate: "2024-01-08",
      resolvedDate: "2024-01-09",
      status: "resolved",
      correctiveAction: "إعادة التصميم مع تعديل نقاط التماس"
    }
  ]);

  const [standards, setStandards] = useState<QualityStandard[]>([
    {
      id: "STD-001",
      category: "الهوامش",
      standardName: "دقة الهوامش",
      specification: "أقصى فجوة مسموحة",
      tolerance: "50 ميكرون",
      measurementMethod: "قياس بالمجهر الرقمي",
      isActive: true
    },
    {
      id: "STD-002",
      category: "الإطباق",
      standardName: "نقاط التماس",
      specification: "توزيع متساوي للتماس",
      tolerance: "± 5 ميكرون",
      measurementMethod: "ورق الإطباق + Articulator",
      isActive: true
    },
    {
      id: "STD-003",
      category: "اللون",
      standardName: "مطابقة الظل",
      specification: "تطابق كامل مع العينة",
      tolerance: "ΔE < 2.0",
      measurementMethod: "Spectrophotometer",
      isActive: true
    },
    {
      id: "STD-004",
      category: "التشطيب",
      standardName: "نعومة السطح",
      specification: "سطح أملس لامع",
      tolerance: "Ra < 0.2 µm",
      measurementMethod: "فحص بصري + لمسي",
      isActive: true
    },
    {
      id: "STD-005",
      category: "السُمك",
      standardName: "السُمك الأدنى",
      specification: "حسب نوع المادة",
      tolerance: "0.5-2.0 مم",
      measurementMethod: "Digital Caliper",
      isActive: true
    }
  ]);

  const [metrics, setMetrics] = useState<QualityMetric[]>([
    {
      id: "MET-001",
      metricName: "معدل القبول",
      currentValue: 94.5,
      targetValue: 95,
      unit: "%",
      trend: "up",
      period: "monthly"
    },
    {
      id: "MET-002",
      metricName: "متوسط درجة الجودة",
      currentValue: 96.2,
      targetValue: 95,
      unit: "نقطة",
      trend: "up",
      period: "monthly"
    },
    {
      id: "MET-003",
      metricName: "العيوب الحرجة",
      currentValue: 1.2,
      targetValue: 2,
      unit: "%",
      trend: "down",
      period: "monthly"
    },
    {
      id: "MET-004",
      metricName: "وقت الفحص المتوسط",
      currentValue: 15,
      targetValue: 20,
      unit: "دقيقة",
      trend: "stable",
      period: "weekly"
    },
    {
      id: "MET-005",
      metricName: "إعادة العمل",
      currentValue: 3.8,
      targetValue: 5,
      unit: "%",
      trend: "down",
      period: "monthly"
    }
  ]);

  const [audits, setAudits] = useState<QualityAudit[]>([
    {
      id: "AUD-001",
      auditDate: "2024-01-08",
      auditor: "د. حسن محمود",
      department: "CAM Production",
      casesAudited: 25,
      issuesFound: 2,
      complianceScore: 98,
      findings: "التزام ممتاز بالمعايير - عيبان طفيفان في التشطيب",
      recommendations: "تحديث بروتوكول التلميع النهائي"
    },
    {
      id: "AUD-002",
      auditDate: "2024-01-05",
      auditor: "د. حسن محمود",
      department: "CAD Design",
      casesAudited: 30,
      issuesFound: 1,
      complianceScore: 99,
      findings: "أداء متميز - عيب واحد في تصميم معقد",
      recommendations: "لا توجد - الاستمرار على نفس المستوى"
    }
  ]);

  const [activeTab, setActiveTab] = useState("overview");
  const [showNewCaseDialog, setShowNewCaseDialog] = useState(false);
  const [showDefectDialog, setShowDefectDialog] = useState(false);
  const [showStandardDialog, setShowStandardDialog] = useState(false);
  const [showAuditDialog, setShowAuditDialog] = useState(false);
  const [selectedCase, setSelectedCase] = useState<QualityCase | null>(null);
  const [editingCase, setEditingCase] = useState<QualityCase | null>(null);

  const [newDefect, setNewDefect] = useState<Partial<DefectRecord>>({
    severity: "minor",
    status: "open"
  });

  const [newStandard, setNewStandard] = useState<Partial<QualityStandard>>({
    isActive: true
  });

  const [newAudit, setNewAudit] = useState<Partial<QualityAudit>>({});

  // إحصائيات الجودة
  const qualityStats = {
    totalCases: cases.length,
    pendingCases: cases.filter(c => c.status === "pending").length,
    inProgressCases: cases.filter(c => c.status === "in-progress").length,
    passedCases: cases.filter(c => c.status === "passed").length,
    failedCases: cases.filter(c => c.status === "failed").length,
    needsReviewCases: cases.filter(c => c.status === "needs-review").length,
    avgScore: Math.round(cases.filter(c => c.score > 0).reduce((sum, c) => sum + c.score, 0) / Math.max(cases.filter(c => c.score > 0).length, 1)),
    totalDefects: defects.length,
    openDefects: defects.filter(d => d.status === "open" || d.status === "in-progress").length,
    resolvedDefects: defects.filter(d => d.status === "resolved").length,
    criticalDefects: defects.filter(d => d.severity === "critical").length,
    availableInspectors: inspectors.filter(i => i.status === "available").length,
    totalInspectors: inspectors.length
  };

  const handleAddDefect = () => {
    if (newDefect.caseId && newDefect.category && newDefect.description) {
      const defectToAdd: DefectRecord = {
        id: `DEF-${String(defects.length + 1).padStart(3, '0')}`,
        caseId: newDefect.caseId,
        category: newDefect.category,
        severity: newDefect.severity || "minor",
        description: newDefect.description,
        department: newDefect.department || "",
        detectedBy: newDefect.detectedBy || "",
        detectedDate: new Date().toISOString().split('T')[0],
        status: "open",
        correctiveAction: newDefect.correctiveAction || ""
      };
      setDefects([...defects, defectToAdd]);
      setShowDefectDialog(false);
      setNewDefect({ severity: "minor", status: "open" });
    }
  };

  const handleAddStandard = () => {
    if (newStandard.category && newStandard.standardName && newStandard.specification) {
      const standardToAdd: QualityStandard = {
        id: `STD-${String(standards.length + 1).padStart(3, '0')}`,
        category: newStandard.category,
        standardName: newStandard.standardName,
        specification: newStandard.specification,
        tolerance: newStandard.tolerance || "",
        measurementMethod: newStandard.measurementMethod || "",
        isActive: true
      };
      setStandards([...standards, standardToAdd]);
      setShowStandardDialog(false);
      setNewStandard({ isActive: true });
    }
  };

  const handleAddAudit = () => {
    if (newAudit.auditor && newAudit.department) {
      const auditToAdd: QualityAudit = {
        id: `AUD-${String(audits.length + 1).padStart(3, '0')}`,
        auditDate: new Date().toISOString().split('T')[0],
        auditor: newAudit.auditor,
        department: newAudit.department,
        casesAudited: newAudit.casesAudited || 0,
        issuesFound: newAudit.issuesFound || 0,
        complianceScore: newAudit.complianceScore || 0,
        findings: newAudit.findings || "",
        recommendations: newAudit.recommendations || ""
      };
      setAudits([...audits, auditToAdd]);
      setShowAuditDialog(false);
      setNewAudit({});
    }
  };

  const updateCaseStatus = (caseId: string, newStatus: QualityCase["status"], score?: number) => {
    setCases(cases.map(c => c.id === caseId ? { 
      ...c, 
      status: newStatus,
      score: score !== undefined ? score : c.score,
      completionDate: newStatus === "passed" || newStatus === "failed" ? new Date().toISOString().split('T')[0] : c.completionDate
    } : c));
  };

  const getStatusColor = (status: QualityCase["status"]) => {
    switch (status) {
      case "passed": return "text-green-600 bg-green-50";
      case "failed": return "text-red-600 bg-red-50";
      case "in-progress": return "text-blue-600 bg-blue-50";
      case "needs-review": return "text-yellow-600 bg-yellow-50";
      case "pending": return "text-gray-600 bg-gray-50";
      case "recheck": return "text-orange-600 bg-orange-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getPriorityColor = (priority: QualityCase["priority"]) => {
    switch (priority) {
      case "emergency": return "bg-red-100 text-red-800 border-red-300";
      case "rush": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getSeverityColor = (severity: DefectRecord["severity"]) => {
    switch (severity) {
      case "critical": return "bg-red-100 text-red-800";
      case "major": return "bg-orange-100 text-orange-800";
      case "minor": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getInspectorStatusColor = (status: QualityInspector["status"]) => {
    switch (status) {
      case "available": return "text-green-600";
      case "busy": return "text-blue-600";
      case "offline": return "text-gray-600";
      default: return "text-gray-600";
    }
  };

  const getTrendIcon = (trend: QualityMetric["trend"]) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "down": return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      case "stable": return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Layout>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">إدارة مراقبة الجودة</h1>
            <p className="text-muted-foreground">نظام شامل لمراقبة وضمان الجودة</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="inspection">الفحص</TabsTrigger>
            <TabsTrigger value="defects">العيوب</TabsTrigger>
            <TabsTrigger value="standards">المعايير</TabsTrigger>
            <TabsTrigger value="inspectors">المفتشون</TabsTrigger>
            <TabsTrigger value="metrics">التقارير</TabsTrigger>
          </TabsList>

          {/* نظرة عامة */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">إجمالي الحالات</CardTitle>
                  <ClipboardCheck className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{qualityStats.totalCases}</div>
                  <p className="text-xs text-muted-foreground">حالة قيد الفحص</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">مقبول</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{qualityStats.passedCases}</div>
                  <p className="text-xs text-muted-foreground">اجتاز الفحص</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">يحتاج مراجعة</CardTitle>
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{qualityStats.needsReviewCases}</div>
                  <p className="text-xs text-muted-foreground">يحتاج تحسين</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">متوسط الدرجة</CardTitle>
                  <Award className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{qualityStats.avgScore}%</div>
                  <p className="text-xs text-muted-foreground">معدل الجودة</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Microscope className="h-5 w-5" />
                    حالة الفحص
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">في الانتظار</span>
                      <Badge variant="outline" className="bg-gray-50">{qualityStats.pendingCases}</Badge>
                    </div>
                    <Progress value={(qualityStats.pendingCases / qualityStats.totalCases) * 100} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">قيد الفحص</span>
                      <Badge variant="outline" className="bg-blue-50">{qualityStats.inProgressCases}</Badge>
                    </div>
                    <Progress value={(qualityStats.inProgressCases / qualityStats.totalCases) * 100} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">مقبول</span>
                      <Badge variant="outline" className="bg-green-50">{qualityStats.passedCases}</Badge>
                    </div>
                    <Progress value={(qualityStats.passedCases / qualityStats.totalCases) * 100} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">يحتاج مراجعة</span>
                      <Badge variant="outline" className="bg-yellow-50">{qualityStats.needsReviewCases}</Badge>
                    </div>
                    <Progress value={(qualityStats.needsReviewCases / qualityStats.totalCases) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    العيوب والمشاكل
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">إجمالي العيوب</p>
                      <p className="text-3xl font-bold">{qualityStats.totalDefects}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">مفتوح</p>
                      <p className="text-3xl font-bold text-red-600">{qualityStats.openDefects}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">تم الحل</span>
                      <span className="font-bold text-green-600">{qualityStats.resolvedDefects}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">عيوب حرجة</span>
                      <span className="font-bold text-red-600">{qualityStats.criticalDefects}</span>
                    </div>
                  </div>

                  <Progress value={(qualityStats.resolvedDefects / qualityStats.totalDefects) * 100} />
                  <p className="text-xs text-muted-foreground text-center">
                    {Math.round((qualityStats.resolvedDefects / qualityStats.totalDefects) * 100)}% معدل الحل
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    المفتشون
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {inspectors.slice(0, 4).map(inspector => (
                    <div key={inspector.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          inspector.status === "available" ? "bg-green-500" :
                          inspector.status === "busy" ? "bg-blue-500" : "bg-gray-500"
                        }`} />
                        <span className="text-sm font-medium">{inspector.name}</span>
                      </div>
                      <Badge variant="outline">{inspector.activeCases} نشط</Badge>
                    </div>
                  ))}

                  <Separator />

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">المتاحون</span>
                    <span className="text-lg font-bold text-green-600">
                      {qualityStats.availableInspectors}/{qualityStats.totalInspectors}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    مؤشرات الأداء الرئيسية
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {metrics.slice(0, 3).map(metric => (
                    <div key={metric.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{metric.metricName}</span>
                          {getTrendIcon(metric.trend)}
                        </div>
                        <span className="text-lg font-bold">
                          {metric.currentValue}{metric.unit}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={(metric.currentValue / metric.targetValue) * 100} 
                          className="flex-1"
                        />
                        <span className="text-xs text-muted-foreground">
                          الهدف: {metric.targetValue}{metric.unit}
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    آخر عمليات التدقيق
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {audits.slice(0, 2).map(audit => (
                    <div key={audit.id} className="p-3 bg-gray-50 rounded-lg space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{audit.department}</p>
                          <p className="text-xs text-muted-foreground">{audit.auditor}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          {audit.complianceScore}%
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>تم فحص: {audit.casesAudited}</div>
                        <div>مشاكل: {audit.issuesFound}</div>
                      </div>
                      <p className="text-xs text-muted-foreground">{audit.auditDate}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* الفحص */}
          <TabsContent value="inspection" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">حالات الفحص</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              <Card className="bg-gray-50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">في الانتظار</p>
                    <p className="text-3xl font-bold">{qualityStats.pendingCases}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">قيد الفحص</p>
                    <p className="text-3xl font-bold text-blue-600">{qualityStats.inProgressCases}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">مقبول</p>
                    <p className="text-3xl font-bold text-green-600">{qualityStats.passedCases}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-yellow-50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">يحتاج مراجعة</p>
                    <p className="text-3xl font-bold text-yellow-600">{qualityStats.needsReviewCases}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-red-50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">مرفوض</p>
                    <p className="text-3xl font-bold text-red-600">{qualityStats.failedCases}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-purple-50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">متوسط الدرجة</p>
                    <p className="text-3xl font-bold text-purple-600">{qualityStats.avgScore}%</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3">
              {cases.map(qualityCase => (
                <Card key={qualityCase.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="font-mono">{qualityCase.id}</Badge>
                          <div>
                            <h3 className="font-semibold text-lg">{qualityCase.patientName}</h3>
                            <p className="text-sm text-muted-foreground">{qualityCase.caseType}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(qualityCase.priority)}>
                            {qualityCase.priority === "emergency" ? "طارئ" : qualityCase.priority === "rush" ? "سريع" : "عادي"}
                          </Badge>
                          <Badge variant="outline" className={getStatusColor(qualityCase.status)}>
                            {qualityCase.status === "pending" ? "في الانتظار" :
                             qualityCase.status === "in-progress" ? "قيد الفحص" :
                             qualityCase.status === "passed" ? "مقبول" :
                             qualityCase.status === "failed" ? "مرفوض" :
                             qualityCase.status === "needs-review" ? "يحتاج مراجعة" : "إعادة فحص"}
                          </Badge>
                          {qualityCase.score > 0 && (
                            <Badge className="bg-purple-100 text-purple-800">
                              {qualityCase.score}%
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">رقم الحالة</p>
                          <p className="font-medium">{qualityCase.caseId}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">الطبيب</p>
                          <p className="font-medium">{qualityCase.doctorName}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">القسم</p>
                          <p className="font-medium">{qualityCase.department}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">المفتش</p>
                          <p className="font-medium">{qualityCase.inspector || "غير معين"}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">تاريخ الاستلام</p>
                          <p className="font-medium">{qualityCase.receivedDate}</p>
                        </div>
                      </div>

                      {qualityCase.defectsCount > 0 && (
                        <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <span className="text-sm text-red-800">
                            {qualityCase.defectsCount} عيب مكتشف
                          </span>
                        </div>
                      )}

                      {qualityCase.notes && (
                        <p className="text-sm text-muted-foreground italic bg-gray-50 p-2 rounded">
                          {qualityCase.notes}
                        </p>
                      )}

                      <div className="flex gap-2 pt-2">
                        {qualityCase.status === "pending" && (
                          <Button size="sm" onClick={() => updateCaseStatus(qualityCase.id, "in-progress")}>
                            <PlayCircle className="h-4 w-4 mr-1" />
                            بدء الفحص
                          </Button>
                        )}
                        {qualityCase.status === "in-progress" && (
                          <>
                            <Button size="sm" onClick={() => updateCaseStatus(qualityCase.id, "passed", 95)}>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              قبول
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => updateCaseStatus(qualityCase.id, "needs-review")}>
                              <AlertCircle className="h-4 w-4 mr-1" />
                              يحتاج مراجعة
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => updateCaseStatus(qualityCase.id, "failed", 45)}>
                              <XCircle className="h-4 w-4 mr-1" />
                              رفض
                            </Button>
                          </>
                        )}
                        {qualityCase.status === "needs-review" && (
                          <Button size="sm" onClick={() => updateCaseStatus(qualityCase.id, "recheck")}>
                            <RefreshCw className="h-4 w-4 mr-1" />
                            إعادة فحص
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => setSelectedCase(qualityCase)}>
                          <Eye className="h-4 w-4 mr-1" />
                          التفاصيل
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* العيوب */}
          <TabsContent value="defects" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">سجل العيوب والمشاكل</h2>
              <Button onClick={() => setShowDefectDialog(true)}>
                <AlertTriangle className="h-4 w-4 mr-2" />
                تسجيل عيب
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">إجمالي العيوب</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{defects.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">مفتوح</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">{qualityStats.openDefects}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">تم الحل</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{qualityStats.resolvedDefects}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">عيوب حرجة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">{qualityStats.criticalDefects}</div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3">
              {defects.map(defect => (
                <Card key={defect.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="font-mono">{defect.id}</Badge>
                          <div>
                            <h3 className="font-semibold">{defect.category}</h3>
                            <p className="text-sm text-muted-foreground">الحالة: {defect.caseId}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getSeverityColor(defect.severity)}>
                            {defect.severity === "critical" ? "حرج" : defect.severity === "major" ? "كبير" : "طفيف"}
                          </Badge>
                          <Badge variant="outline" className={
                            defect.status === "resolved" ? "bg-green-50 text-green-700" :
                            defect.status === "in-progress" ? "bg-blue-50 text-blue-700" :
                            "bg-red-50 text-red-700"
                          }>
                            {defect.status === "resolved" ? "محلول" :
                             defect.status === "in-progress" ? "قيد المعالجة" :
                             defect.status === "rejected" ? "مرفوض" : "مفتوح"}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-sm bg-gray-50 p-3 rounded-lg">{defect.description}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">القسم</p>
                          <p className="font-medium">{defect.department}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">الكاشف</p>
                          <p className="font-medium">{defect.detectedBy}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">تاريخ الاكتشاف</p>
                          <p className="font-medium">{defect.detectedDate}</p>
                        </div>
                        {defect.resolvedDate && (
                          <div>
                            <p className="text-muted-foreground">تاريخ الحل</p>
                            <p className="font-medium text-green-600">{defect.resolvedDate}</p>
                          </div>
                        )}
                      </div>

                      {defect.correctiveAction && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-blue-900">الإجراء التصحيحي:</p>
                          <p className="text-sm text-blue-800">{defect.correctiveAction}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* المعايير */}
          <TabsContent value="standards" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">معايير الجودة</h2>
              <Button onClick={() => setShowStandardDialog(true)}>
                <BookOpen className="h-4 w-4 mr-2" />
                إضافة معيار
              </Button>
            </div>

            <div className="space-y-3">
              {standards.map(standard => (
                <Card key={standard.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="font-mono">{standard.id}</Badge>
                          <div>
                            <h3 className="font-semibold text-lg">{standard.standardName}</h3>
                            <p className="text-sm text-muted-foreground">{standard.category}</p>
                          </div>
                        </div>
                        <Badge className={standard.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {standard.isActive ? "نشط" : "غير نشط"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-muted-foreground mb-1">المواصفة</p>
                          <p className="font-medium">{standard.specification}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-muted-foreground mb-1">التسامح</p>
                          <p className="font-medium">{standard.tolerance}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-muted-foreground mb-1">طريقة القياس</p>
                          <p className="font-medium">{standard.measurementMethod}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* المفتشون */}
          <TabsContent value="inspectors" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">فريق المفتشين</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">إجمالي المفتشين</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{inspectors.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">المتاحين</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {inspectors.filter(i => i.status === "available").length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">متوسط الكفاءة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {Math.round(inspectors.reduce((sum, i) => sum + i.efficiency, 0) / inspectors.length)} حالة/يوم
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inspectors.map(inspector => (
                <Card key={inspector.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          {inspector.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{inspector.specialization}</p>
                      </div>
                      <Badge variant="outline" className={getInspectorStatusColor(inspector.status)}>
                        {inspector.status === "available" ? "متاح" : inspector.status === "busy" ? "مشغول" : "غير متصل"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">حالات نشطة</p>
                        <p className="text-2xl font-bold">{inspector.activeCases}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">مكتملة</p>
                        <p className="text-2xl font-bold">{inspector.completedCases}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">كفاءة</p>
                        <p className="text-2xl font-bold">{inspector.efficiency}/يوم</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>متوسط الدرجة</span>
                        <span className="font-bold">{inspector.averageScore}%</span>
                      </div>
                      <Progress value={inspector.averageScore} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* التقارير */}
          <TabsContent value="metrics" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">التقارير ومؤشرات الأداء</h2>
              <Button onClick={() => setShowAuditDialog(true)}>
                <Shield className="h-4 w-4 mr-2" />
                تسجيل تدقيق
              </Button>
            </div>

            {/* مؤشرات الأداء */}
            <div>
              <h3 className="text-xl font-semibold mb-4">مؤشرات الأداء الرئيسية (KPIs)</h3>
              <div className="space-y-3">
                {metrics.map(metric => (
                  <Card key={metric.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="flex items-center gap-2">
                            {getTrendIcon(metric.trend)}
                            <div>
                              <h3 className="font-semibold text-lg">{metric.metricName}</h3>
                              <p className="text-xs text-muted-foreground">
                                {metric.period === "daily" ? "يومي" : metric.period === "weekly" ? "أسبوعي" : "شهري"}
                              </p>
                            </div>
                          </div>

                          <div className="flex-1 max-w-md space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>القيمة الحالية</span>
                              <span className="font-bold">{metric.currentValue}{metric.unit}</span>
                            </div>
                            <Progress value={(metric.currentValue / metric.targetValue) * 100} />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>الهدف: {metric.targetValue}{metric.unit}</span>
                              <span>{Math.round((metric.currentValue / metric.targetValue) * 100)}%</span>
                            </div>
                          </div>
                        </div>

                        <Badge className={
                          (metric.currentValue >= metric.targetValue && metric.trend === "up") ||
                          (metric.currentValue <= metric.targetValue && metric.trend === "down")
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }>
                          {(metric.currentValue >= metric.targetValue && metric.trend === "up") ||
                           (metric.currentValue <= metric.targetValue && metric.trend === "down")
                            ? "ممتاز" : "يحتاج تحسين"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Separator className="my-6" />

            {/* سجل التدقيق */}
            <div>
              <h3 className="text-xl font-semibold mb-4">سجل التدقيق الداخلي</h3>
              <div className="space-y-3">
                {audits.map(audit => (
                  <Card key={audit.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="font-mono">{audit.id}</Badge>
                            <div>
                              <h3 className="font-semibold text-lg">{audit.department}</h3>
                              <p className="text-sm text-muted-foreground">المدقق: {audit.auditor}</p>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">
                            {audit.complianceScore}%
                          </Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-muted-foreground">تم فحص</p>
                            <p className="text-2xl font-bold">{audit.casesAudited}</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-muted-foreground">مشاكل</p>
                            <p className="text-2xl font-bold text-orange-600">{audit.issuesFound}</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-muted-foreground">التاريخ</p>
                            <p className="text-lg font-medium">{audit.auditDate}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-sm font-medium text-blue-900">النتائج:</p>
                            <p className="text-sm text-blue-800">{audit.findings}</p>
                          </div>
                          <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-sm font-medium text-green-900">التوصيات:</p>
                            <p className="text-sm text-green-800">{audit.recommendations}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* حوار تسجيل عيب */}
        <Dialog open={showDefectDialog} onOpenChange={setShowDefectDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>تسجيل عيب جديد</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>رقم الحالة</Label>
                <Input
                  value={newDefect.caseId || ""}
                  onChange={(e) => setNewDefect({ ...newDefect, caseId: e.target.value })}
                  placeholder="CASE-2024-XXX"
                />
              </div>
              <div className="space-y-2">
                <Label>الفئة</Label>
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={newDefect.category || ""}
                  onChange={(e) => setNewDefect({ ...newDefect, category: e.target.value })}
                >
                  <option value="">اختر الفئة</option>
                  <option value="الهوامش">الهوامش</option>
                  <option value="الإطباق">الإطباق</option>
                  <option value="اللون">اللون</option>
                  <option value="التشطيب">التشطيب</option>
                  <option value="السُمك">السُمك</option>
                  <option value="التشريح">التشريح</option>
                  <option value="المادة">المادة</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>الخطورة</Label>
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={newDefect.severity || "minor"}
                  onChange={(e) => setNewDefect({ ...newDefect, severity: e.target.value as any })}
                >
                  <option value="minor">طفيف</option>
                  <option value="major">كبير</option>
                  <option value="critical">حرج</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>القسم</Label>
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={newDefect.department || ""}
                  onChange={(e) => setNewDefect({ ...newDefect, department: e.target.value })}
                >
                  <option value="">اختر القسم</option>
                  <option value="CAD Design">CAD Design</option>
                  <option value="CAM Production">CAM Production</option>
                  <option value="Finishing">Finishing</option>
                  <option value="Reception">Reception</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>الكاشف</Label>
                <Input
                  value={newDefect.detectedBy || ""}
                  onChange={(e) => setNewDefect({ ...newDefect, detectedBy: e.target.value })}
                  placeholder="اسم المفتش"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>الوصف</Label>
                <Input
                  value={newDefect.description || ""}
                  onChange={(e) => setNewDefect({ ...newDefect, description: e.target.value })}
                  placeholder="وصف تفصيلي للعيب"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>الإجراء التصحيحي</Label>
                <Input
                  value={newDefect.correctiveAction || ""}
                  onChange={(e) => setNewDefect({ ...newDefect, correctiveAction: e.target.value })}
                  placeholder="الإجراء المطلوب لتصحيح العيب"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDefectDialog(false)}>إلغاء</Button>
              <Button onClick={handleAddDefect}>تسجيل</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* حوار إضافة معيار */}
        <Dialog open={showStandardDialog} onOpenChange={setShowStandardDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>إضافة معيار جودة جديد</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>الفئة</Label>
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={newStandard.category || ""}
                  onChange={(e) => setNewStandard({ ...newStandard, category: e.target.value })}
                >
                  <option value="">اختر الفئة</option>
                  <option value="الهوامش">الهوامش</option>
                  <option value="الإطباق">الإطباق</option>
                  <option value="اللون">اللون</option>
                  <option value="التشطيب">التشطيب</option>
                  <option value="السُمك">السُمك</option>
                  <option value="التشريح">التشريح</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>اسم المعيار</Label>
                <Input
                  value={newStandard.standardName || ""}
                  onChange={(e) => setNewStandard({ ...newStandard, standardName: e.target.value })}
                  placeholder="مثل: دقة الهوامش"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>المواصفة</Label>
                <Input
                  value={newStandard.specification || ""}
                  onChange={(e) => setNewStandard({ ...newStandard, specification: e.target.value })}
                  placeholder="المواصفة المطلوبة"
                />
              </div>
              <div className="space-y-2">
                <Label>التسامح</Label>
                <Input
                  value={newStandard.tolerance || ""}
                  onChange={(e) => setNewStandard({ ...newStandard, tolerance: e.target.value })}
                  placeholder="± 5 ميكرون"
                />
              </div>
              <div className="space-y-2">
                <Label>طريقة القياس</Label>
                <Input
                  value={newStandard.measurementMethod || ""}
                  onChange={(e) => setNewStandard({ ...newStandard, measurementMethod: e.target.value })}
                  placeholder="الأداة أو الطريقة المستخدمة"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowStandardDialog(false)}>إلغاء</Button>
              <Button onClick={handleAddStandard}>إضافة</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* حوار تسجيل تدقيق */}
        <Dialog open={showAuditDialog} onOpenChange={setShowAuditDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>تسجيل تدقيق جديد</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>المدقق</Label>
                <Input
                  value={newAudit.auditor || ""}
                  onChange={(e) => setNewAudit({ ...newAudit, auditor: e.target.value })}
                  placeholder="اسم المدقق"
                />
              </div>
              <div className="space-y-2">
                <Label>القسم</Label>
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={newAudit.department || ""}
                  onChange={(e) => setNewAudit({ ...newAudit, department: e.target.value })}
                >
                  <option value="">اختر القسم</option>
                  <option value="CAD Design">CAD Design</option>
                  <option value="CAM Production">CAM Production</option>
                  <option value="Finishing">Finishing</option>
                  <option value="Reception">Reception</option>
                  <option value="Quality Control">Quality Control</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>عدد الحالات المدققة</Label>
                <Input
                  type="number"
                  min="0"
                  value={newAudit.casesAudited || ""}
                  onChange={(e) => setNewAudit({ ...newAudit, casesAudited: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>عدد المشاكل المكتشفة</Label>
                <Input
                  type="number"
                  min="0"
                  value={newAudit.issuesFound || ""}
                  onChange={(e) => setNewAudit({ ...newAudit, issuesFound: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>درجة الامتثال (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={newAudit.complianceScore || ""}
                  onChange={(e) => setNewAudit({ ...newAudit, complianceScore: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>النتائج</Label>
                <Input
                  value={newAudit.findings || ""}
                  onChange={(e) => setNewAudit({ ...newAudit, findings: e.target.value })}
                  placeholder="وصف النتائج"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>التوصيات</Label>
                <Input
                  value={newAudit.recommendations || ""}
                  onChange={(e) => setNewAudit({ ...newAudit, recommendations: e.target.value })}
                  placeholder="التوصيات والتحسينات المقترحة"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAuditDialog(false)}>إلغاء</Button>
              <Button onClick={handleAddAudit}>تسجيل</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
