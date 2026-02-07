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
  Search, Wrench, Package, BarChart3, FileText, Calendar,
  CheckCircle, XCircle, Timer, Activity, Zap, Box,
  AlertCircle, Download, Printer, User, Database, RefreshCw,
  Play, Pause, Check, X, Clock, Settings, TrendingUp, Cog
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface ProductionCase {
  id: string;
  patient: string;
  restorationType: string;
  toothNumbers: string;
  material: string;
  equipment: string;
  operator: string;
  estimatedMinutes: number;
  actualMinutes: number;
  status: "queued" | "milling" | "paused" | "completed" | "failed";
  notes: string;
  priority: "normal" | "rush" | "emergency";
  startTime?: string;
  endTime?: string;
  quality: "pending" | "passed" | "failed";
  millType: "5-axis" | "4-axis" | "3-axis";
}

interface Machine {
  id: string;
  name: string;
  model: string;
  type: "مطحنة" | "طابعة ثلاثية الأبعاد" | "ماسح ضوئي";
  status: "متاح" | "قيد التشغيل" | "صيانة" | "عطل";
  currentCase?: string;
  efficiency: number;
  hoursUsed: number;
  totalCapacity: number;
  lastMaintenance: string;
  nextMaintenance: string;
}

interface Material {
  id: string;
  name: string;
  type: string;
  quantity: number;
  unit: string;
  minStock: number;
  costPerUnit: number;
  supplier: string;
}

interface MaintenanceRecord {
  id: string;
  machineId: string;
  machineName: string;
  date: string;
  type: "دورية" | "طارئة" | "وقائية";
  technician: string;
  description: string;
  cost: number;
  status: "مجدولة" | "قيد التنفيذ" | "مكتملة";
}

interface QualityCheck {
  id: string;
  caseId: string;
  inspector: string;
  date: string;
  result: "ممتاز" | "جيد" | "مقبول" | "مرفوض";
  notes: string;
  measurements: {
    accuracy: number;
    surfaceQuality: number;
    fitQuality: number;
  };
}

export default function CAMProduction() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [cases, setCases] = useState<ProductionCase[]>([
    {
      id: "P-001",
      patient: "د. أحمد محمد",
      restorationType: "تاج زركونيا",
      toothNumbers: "14, 15",
      material: "زركونيا شفافة",
      equipment: "Roland DWX-52D",
      operator: "محمد أحمد",
      estimatedMinutes: 45,
      actualMinutes: 42,
      status: "completed",
      notes: "تم التصنيع بنجاح",
      priority: "normal",
      startTime: "2024-01-15 09:00",
      endTime: "2024-01-15 09:42",
      quality: "passed",
      millType: "5-axis"
    },
    {
      id: "P-002",
      patient: "د. سارة حسن",
      restorationType: "جسر ثلاثي",
      toothNumbers: "24, 25, 26",
      material: "زركونيا متعددة الطبقات",
      equipment: "Imes-icore 350i",
      operator: "أحمد سعيد",
      estimatedMinutes: 90,
      actualMinutes: 45,
      status: "milling",
      notes: "جاري التصنيع - 50% مكتمل",
      priority: "rush",
      startTime: "2024-01-15 10:00",
      quality: "pending",
      millType: "5-axis"
    },
    {
      id: "P-003",
      patient: "د. محمود علي",
      restorationType: "تاج e.max",
      toothNumbers: "36",
      material: "ليثيوم دايسيليكات",
      equipment: "VHF K5+",
      operator: "خالد حسن",
      estimatedMinutes: 30,
      actualMinutes: 0,
      status: "queued",
      notes: "في انتظار البدء",
      priority: "emergency",
      quality: "pending",
      millType: "4-axis"
    },
    {
      id: "P-004",
      patient: "د. فاطمة إبراهيم",
      restorationType: "قالب مؤقت PMMA",
      toothNumbers: "11-13",
      material: "PMMA أبيض",
      equipment: "Roland DWX-52D",
      operator: "محمد أحمد",
      estimatedMinutes: 25,
      actualMinutes: 28,
      status: "completed",
      notes: "تم التسليم",
      priority: "rush",
      startTime: "2024-01-14 14:00",
      endTime: "2024-01-14 14:28",
      quality: "passed",
      millType: "3-axis"
    }
  ]);

  const [machines, setMachines] = useState<Machine[]>([
    {
      id: "M-001",
      name: "Roland DWX-52D",
      model: "DWX-52D",
      type: "مطحنة",
      status: "متاح",
      efficiency: 95,
      hoursUsed: 245,
      totalCapacity: 1000,
      lastMaintenance: "2024-01-01",
      nextMaintenance: "2024-02-01"
    },
    {
      id: "M-002",
      name: "Imes-icore 350i",
      model: "350i",
      type: "مطحنة",
      status: "قيد التشغيل",
      currentCase: "P-002",
      efficiency: 88,
      hoursUsed: 320,
      totalCapacity: 1000,
      lastMaintenance: "2023-12-15",
      nextMaintenance: "2024-01-25"
    },
    {
      id: "M-003",
      name: "VHF K5+",
      model: "K5 Plus",
      type: "مطحنة",
      status: "متاح",
      efficiency: 92,
      hoursUsed: 180,
      totalCapacity: 1000,
      lastMaintenance: "2024-01-10",
      nextMaintenance: "2024-02-10"
    },
    {
      id: "M-004",
      name: "Amann Girrbach Ceramill Motion 2",
      model: "Motion 2",
      type: "مطحنة",
      status: "صيانة",
      efficiency: 90,
      hoursUsed: 410,
      totalCapacity: 1000,
      lastMaintenance: "2024-01-14",
      nextMaintenance: "2024-01-16"
    },
    {
      id: "M-005",
      name: "3Shape E3",
      model: "E3",
      type: "ماسح ضوئي",
      status: "متاح",
      efficiency: 98,
      hoursUsed: 120,
      totalCapacity: 800,
      lastMaintenance: "2024-01-05",
      nextMaintenance: "2024-02-05"
    }
  ]);

  const [materials, setMaterials] = useState<Material[]>([
    { id: "MAT-001", name: "زركونيا شفافة", type: "زركونيا", quantity: 25, unit: "قرص", minStock: 10, costPerUnit: 350, supplier: "Ivoclar Vivadent" },
    { id: "MAT-002", name: "زركونيا متعددة الطبقات", type: "زركونيا", quantity: 8, unit: "قرص", minStock: 8, costPerUnit: 450, supplier: "3M ESPE" },
    { id: "MAT-003", name: "ليثيوم دايسيليكات", type: "e.max", quantity: 30, unit: "قرص", minStock: 12, costPerUnit: 280, supplier: "Ivoclar Vivadent" },
    { id: "MAT-004", name: "PMMA أبيض", type: "أكريليك", quantity: 50, unit: "قرص", minStock: 20, costPerUnit: 85, supplier: "Metoxit" },
    { id: "MAT-005", name: "شمع قابل للطحن", type: "شمع", quantity: 40, unit: "قرص", minStock: 15, costPerUnit: 65, supplier: "Yamahachi" },
    { id: "MAT-006", name: "PMMA متعدد الألوان", type: "أكريليك", quantity: 18, unit: "قرص", minStock: 20, costPerUnit: 95, supplier: "Merz Dental" }
  ]);

  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([
    {
      id: "MAINT-001",
      machineId: "M-002",
      machineName: "Imes-icore 350i",
      date: "2024-01-25",
      type: "دورية",
      technician: "م. طارق عبد الله",
      description: "صيانة دورية شاملة - فحص المحاور والأدوات",
      cost: 2500,
      status: "مجدولة"
    },
    {
      id: "MAINT-002",
      machineId: "M-004",
      machineName: "Ceramill Motion 2",
      date: "2024-01-15",
      type: "طارئة",
      technician: "م. علي صلاح",
      description: "إصلاح محرك المحور Z",
      cost: 4200,
      status: "قيد التنفيذ"
    },
    {
      id: "MAINT-003",
      machineId: "M-001",
      machineName: "Roland DWX-52D",
      date: "2024-01-01",
      type: "دورية",
      technician: "م. طارق عبد الله",
      description: "تنظيف وتشحيم - تغيير الأدوات",
      cost: 1800,
      status: "مكتملة"
    }
  ]);

  const [qualityChecks, setQualityChecks] = useState<QualityCheck[]>([
    {
      id: "QC-001",
      caseId: "P-001",
      inspector: "د. ليلى عبد الرحمن",
      date: "2024-01-15",
      result: "ممتاز",
      notes: "دقة عالية - سطح ممتاز",
      measurements: { accuracy: 98, surfaceQuality: 97, fitQuality: 96 }
    },
    {
      id: "QC-002",
      caseId: "P-004",
      inspector: "د. ليلى عبد الرحمن",
      date: "2024-01-14",
      result: "جيد",
      notes: "جودة جيدة - بعض العيوب الطفيفة في السطح",
      measurements: { accuracy: 95, surfaceQuality: 92, fitQuality: 94 }
    }
  ]);

  const [activeTab, setActiveTab] = useState("overview");
  const [showNewCaseDialog, setShowNewCaseDialog] = useState(false);
  const [showMaterialDialog, setShowMaterialDialog] = useState(false);
  const [showMaintenanceDialog, setShowMaintenanceDialog] = useState(false);
  const [showQualityDialog, setShowQualityDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState("");
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [selectedCase, setSelectedCase] = useState<ProductionCase | null>(null);

  const [newCase, setNewCase] = useState<Partial<ProductionCase>>({
    status: "queued",
    priority: "normal",
    quality: "pending",
    millType: "5-axis"
  });

  const [newMaterial, setNewMaterial] = useState<Partial<Material>>({});
  const [newMaintenance, setNewMaintenance] = useState<Partial<MaintenanceRecord>>({
    status: "مجدولة",
    type: "دورية"
  });

  const [newQualityCheck, setNewQualityCheck] = useState<Partial<QualityCheck>>({
    measurements: { accuracy: 0, surfaceQuality: 0, fitQuality: 0 }
  });

  // إحصائيات الإنتاج
  const productionStats = {
    todayCases: cases.filter(c => c.status === "completed").length,
    activeCases: cases.filter(c => c.status === "milling").length,
    queuedCases: cases.filter(c => c.status === "queued").length,
    failedCases: cases.filter(c => c.status === "failed").length,
    avgEfficiency: Math.round(machines.reduce((sum, m) => sum + m.efficiency, 0) / machines.length),
    activeMachines: machines.filter(m => m.status === "قيد التشغيل").length,
    totalMachines: machines.length,
    lowStockMaterials: materials.filter(m => m.quantity <= m.minStock).length,
    totalProductionTime: cases.filter(c => c.status === "completed").reduce((sum, c) => sum + c.actualMinutes, 0),
    avgCompletionTime: Math.round(cases.filter(c => c.status === "completed").reduce((sum, c) => sum + c.actualMinutes, 0) / Math.max(cases.filter(c => c.status === "completed").length, 1))
  };

  const handleAddCase = () => {
    if (newCase.patient && newCase.restorationType && newCase.material) {
      const caseToAdd: ProductionCase = {
        id: `P-${String(cases.length + 1).padStart(3, '0')}`,
        patient: newCase.patient,
        restorationType: newCase.restorationType,
        toothNumbers: newCase.toothNumbers || "",
        material: newCase.material,
        equipment: newCase.equipment || "",
        operator: newCase.operator || "",
        estimatedMinutes: newCase.estimatedMinutes || 30,
        actualMinutes: 0,
        status: "queued",
        notes: newCase.notes || "",
        priority: newCase.priority || "normal",
        quality: "pending",
        millType: newCase.millType || "5-axis"
      };
      setCases([...cases, caseToAdd]);
      setShowNewCaseDialog(false);
      setNewCase({ status: "queued", priority: "normal", quality: "pending", millType: "5-axis" });
    }
  };

  const handleAddMaterial = () => {
    if (newMaterial.name && newMaterial.type && newMaterial.quantity !== undefined) {
      const materialToAdd: Material = {
        id: `MAT-${String(materials.length + 1).padStart(3, '0')}`,
        name: newMaterial.name,
        type: newMaterial.type,
        quantity: newMaterial.quantity,
        unit: newMaterial.unit || "قرص",
        minStock: newMaterial.minStock || 10,
        costPerUnit: newMaterial.costPerUnit || 0,
        supplier: newMaterial.supplier || ""
      };
      setMaterials([...materials, materialToAdd]);
      setShowMaterialDialog(false);
      setNewMaterial({});
    }
  };

  const handleAddMaintenance = () => {
    if (newMaintenance.machineId && newMaintenance.date && newMaintenance.technician) {
      const machine = machines.find(m => m.id === newMaintenance.machineId);
      const maintenanceToAdd: MaintenanceRecord = {
        id: `MAINT-${String(maintenanceRecords.length + 1).padStart(3, '0')}`,
        machineId: newMaintenance.machineId,
        machineName: machine?.name || "",
        date: newMaintenance.date,
        type: newMaintenance.type || "دورية",
        technician: newMaintenance.technician,
        description: newMaintenance.description || "",
        cost: newMaintenance.cost || 0,
        status: "مجدولة"
      };
      setMaintenanceRecords([...maintenanceRecords, maintenanceToAdd]);
      setShowMaintenanceDialog(false);
      setNewMaintenance({ status: "مجدولة", type: "دورية" });
    }
  };

  const handleAddQualityCheck = () => {
    if (newQualityCheck.caseId && newQualityCheck.inspector && newQualityCheck.result) {
      const checkToAdd: QualityCheck = {
        id: `QC-${String(qualityChecks.length + 1).padStart(3, '0')}`,
        caseId: newQualityCheck.caseId,
        inspector: newQualityCheck.inspector,
        date: new Date().toISOString().split('T')[0],
        result: newQualityCheck.result,
        notes: newQualityCheck.notes || "",
        measurements: newQualityCheck.measurements || { accuracy: 0, surfaceQuality: 0, fitQuality: 0 }
      };
      setQualityChecks([...qualityChecks, checkToAdd]);
      
      // تحديث حالة الجودة في الحالة
      setCases(cases.map(c => 
        c.id === newQualityCheck.caseId 
          ? { ...c, quality: newQualityCheck.result === "مرفوض" ? "failed" : "passed" }
          : c
      ));
      
      setShowQualityDialog(false);
      setNewQualityCheck({ measurements: { accuracy: 0, surfaceQuality: 0, fitQuality: 0 } });
    }
  };

  const updateCaseStatus = (caseId: string, newStatus: ProductionCase["status"]) => {
    setCases(cases.map(c => {
      if (c.id === caseId) {
        const updates: Partial<ProductionCase> = { status: newStatus };
        if (newStatus === "milling" && !c.startTime) {
          updates.startTime = new Date().toISOString();
        }
        if (newStatus === "completed") {
          updates.endTime = new Date().toISOString();
          if (c.startTime) {
            const start = new Date(c.startTime);
            const end = new Date();
            updates.actualMinutes = Math.floor((end.getTime() - start.getTime()) / 60000);
          }
        }
        return { ...c, ...updates };
      }
      return c;
    }));
  };

  const updateMaterialQuantity = (materialId: string, change: number) => {
    setMaterials(materials.map(m => 
      m.id === materialId 
        ? { ...m, quantity: Math.max(0, m.quantity + change) }
        : m
    ));
  };

  const getStatusColor = (status: ProductionCase["status"]) => {
    switch (status) {
      case "completed": return "text-green-600 bg-green-50";
      case "milling": return "text-blue-600 bg-blue-50";
      case "queued": return "text-gray-600 bg-gray-50";
      case "paused": return "text-yellow-600 bg-yellow-50";
      case "failed": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getPriorityColor = (priority: ProductionCase["priority"]) => {
    switch (priority) {
      case "emergency": return "bg-red-100 text-red-800 border-red-300";
      case "rush": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getMachineStatusColor = (status: Machine["status"]) => {
    switch (status) {
      case "متاح": return "text-green-600";
      case "قيد التشغيل": return "text-blue-600";
      case "صيانة": return "text-yellow-600";
      case "عطل": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getQualityColor = (quality: ProductionCase["quality"]) => {
    switch (quality) {
      case "passed": return "text-green-600";
      case "failed": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  return (
    <Layout>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">إدارة إنتاج CAM</h1>
            <p className="text-muted-foreground">نظام شامل لإدارة الطحن والإنتاج</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="production">قائمة الإنتاج</TabsTrigger>
            <TabsTrigger value="machines">الأجهزة</TabsTrigger>
            <TabsTrigger value="materials">المواد</TabsTrigger>
            <TabsTrigger value="maintenance">الصيانة</TabsTrigger>
            <TabsTrigger value="quality">الجودة</TabsTrigger>
          </TabsList>

          {/* نظرة عامة */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">حالات اليوم</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{productionStats.todayCases}</div>
                  <p className="text-xs text-muted-foreground">حالة مكتملة</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">قيد التشغيل</CardTitle>
                  <Activity className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{productionStats.activeCases}</div>
                  <p className="text-xs text-muted-foreground">حالة نشطة</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">في الانتظار</CardTitle>
                  <Clock className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{productionStats.queuedCases}</div>
                  <p className="text-xs text-muted-foreground">حالة منتظرة</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">كفاءة الأجهزة</CardTitle>
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{productionStats.avgEfficiency}%</div>
                  <p className="text-xs text-muted-foreground">متوسط الكفاءة</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5" />
                    حالة الأجهزة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {machines.map(machine => {
                    const utilizationPercent = (machine.hoursUsed / machine.totalCapacity) * 100;
                    return (
                      <div key={machine.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{machine.name}</span>
                            <Badge variant="outline" className={getMachineStatusColor(machine.status)}>
                              {machine.status}
                            </Badge>
                          </div>
                          <span className="text-sm text-muted-foreground">{machine.efficiency}%</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>الاستخدام</span>
                            <span>{machine.hoursUsed}/{machine.totalCapacity} ساعة</span>
                          </div>
                          <Progress value={utilizationPercent} />
                        </div>
                        {machine.currentCase && (
                          <p className="text-xs text-blue-600">
                            يعمل على: {cases.find(c => c.id === machine.currentCase)?.patient}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    حالة المواد
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {materials.slice(0, 6).map(material => {
                    const stockPercent = (material.quantity / (material.minStock * 2)) * 100;
                    const isLowStock = material.quantity <= material.minStock;
                    return (
                      <div key={material.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{material.name}</span>
                            {isLowStock && (
                              <AlertCircle className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {material.quantity} {material.unit}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <Progress 
                            value={Math.min(stockPercent, 100)} 
                            className={isLowStock ? "bg-red-100" : ""}
                          />
                          {isLowStock && (
                            <p className="text-xs text-red-600">مخزون منخفض - الحد الأدنى: {material.minStock}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">إجمالي وقت الإنتاج</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.floor(productionStats.totalProductionTime / 60)}:{productionStats.totalProductionTime % 60}</div>
                  <p className="text-xs text-muted-foreground">ساعة:دقيقة</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">متوسط وقت التشغيل</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{productionStats.avgCompletionTime} دقيقة</div>
                  <p className="text-xs text-muted-foreground">لكل حالة</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">تنبيهات المخزون</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{productionStats.lowStockMaterials}</div>
                  <p className="text-xs text-muted-foreground">مادة تحتاج إعادة طلب</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* قائمة الإنتاج */}
          <TabsContent value="production" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">قائمة الإنتاج</h2>
              <Button onClick={() => setShowNewCaseDialog(true)}>
                <Package className="h-4 w-4 mr-2" />
                حالة جديدة
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
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
                    <p className="text-sm text-muted-foreground">قيد الطحن</p>
                    <p className="text-3xl font-bold text-blue-600">{cases.filter(c => c.status === "milling").length}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-yellow-50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">متوقف</p>
                    <p className="text-3xl font-bold text-yellow-600">{cases.filter(c => c.status === "paused").length}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">مكتمل</p>
                    <p className="text-3xl font-bold text-green-600">{cases.filter(c => c.status === "completed").length}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-red-50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">فشل</p>
                    <p className="text-3xl font-bold text-red-600">{cases.filter(c => c.status === "failed").length}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3">
              {cases.map(productionCase => (
                <Card key={productionCase.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="font-mono">{productionCase.id}</Badge>
                          <h3 className="font-semibold text-lg">{productionCase.patient}</h3>
                          <Badge className={getPriorityColor(productionCase.priority)}>
                            {productionCase.priority === "emergency" ? "طارئ" : productionCase.priority === "rush" ? "سريع" : "عادي"}
                          </Badge>
                          <Badge variant="outline" className={getStatusColor(productionCase.status)}>
                            {productionCase.status === "queued" ? "في الانتظار" :
                             productionCase.status === "milling" ? "قيد الطحن" :
                             productionCase.status === "paused" ? "متوقف" :
                             productionCase.status === "completed" ? "مكتمل" : "فشل"}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">النوع</p>
                            <p className="font-medium">{productionCase.restorationType}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">الأسنان</p>
                            <p className="font-medium">{productionCase.toothNumbers}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">المادة</p>
                            <p className="font-medium">{productionCase.material}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">نوع الطحن</p>
                            <p className="font-medium">{productionCase.millType}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                          {productionCase.equipment && (
                            <div>
                              <p className="text-muted-foreground">الجهاز</p>
                              <p className="font-medium">{productionCase.equipment}</p>
                            </div>
                          )}
                          {productionCase.operator && (
                            <div>
                              <p className="text-muted-foreground">المشغل</p>
                              <p className="font-medium">{productionCase.operator}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-muted-foreground">الوقت المقدر</p>
                            <p className="font-medium">{productionCase.estimatedMinutes} دقيقة</p>
                          </div>
                        </div>

                        {productionCase.status === "milling" && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>التقدم</span>
                              <span>{Math.round((productionCase.actualMinutes / productionCase.estimatedMinutes) * 100)}%</span>
                            </div>
                            <Progress value={(productionCase.actualMinutes / productionCase.estimatedMinutes) * 100} />
                          </div>
                        )}

                        {productionCase.notes && (
                          <p className="text-sm text-muted-foreground italic">{productionCase.notes}</p>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        {productionCase.status === "queued" && (
                          <Button size="sm" onClick={() => updateCaseStatus(productionCase.id, "milling")}>
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        {productionCase.status === "milling" && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => updateCaseStatus(productionCase.id, "paused")}>
                              <Pause className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="default" onClick={() => updateCaseStatus(productionCase.id, "completed")}>
                              <Check className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {productionCase.status === "paused" && (
                          <Button size="sm" onClick={() => updateCaseStatus(productionCase.id, "milling")}>
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        {productionCase.status !== "completed" && productionCase.status !== "failed" && (
                          <Button size="sm" variant="destructive" onClick={() => updateCaseStatus(productionCase.id, "failed")}>
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* الأجهزة */}
          <TabsContent value="machines" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">إدارة الأجهزة</h2>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowReportDialog(true)}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  تقرير الأداء
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {machines.map(machine => {
                const utilizationPercent = (machine.hoursUsed / machine.totalCapacity) * 100;
                return (
                  <Card key={machine.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Wrench className="h-5 w-5" />
                            {machine.name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{machine.model} - {machine.type}</p>
                        </div>
                        <Badge variant="outline" className={getMachineStatusColor(machine.status)}>
                          {machine.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">الكفاءة</p>
                          <p className="text-2xl font-bold">{machine.efficiency}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">ساعات التشغيل</p>
                          <p className="text-2xl font-bold">{machine.hoursUsed}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>الاستخدام</span>
                          <span>{Math.round(utilizationPercent)}%</span>
                        </div>
                        <Progress value={utilizationPercent} />
                      </div>

                      {machine.currentCase && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-blue-900">قيد التشغيل</p>
                          <p className="text-sm text-blue-700">
                            {cases.find(c => c.id === machine.currentCase)?.patient} - 
                            {cases.find(c => c.id === machine.currentCase)?.restorationType}
                          </p>
                        </div>
                      )}

                      <Separator />

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">آخر صيانة</p>
                          <p className="font-medium">{machine.lastMaintenance}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">الصيانة القادمة</p>
                          <p className="font-medium">{machine.nextMaintenance}</p>
                        </div>
                      </div>

                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => {
                          setSelectedMachine(machine);
                          setShowMaintenanceDialog(true);
                          setNewMaintenance({ machineId: machine.id, status: "مجدولة", type: "دورية" });
                        }}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        جدولة صيانة
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* المواد */}
          <TabsContent value="materials" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">إدارة المواد والمخزون</h2>
              <Button onClick={() => setShowMaterialDialog(true)}>
                <Package className="h-4 w-4 mr-2" />
                إضافة مادة
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">إجمالي المواد</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{materials.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">مخزون منخفض</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">
                    {materials.filter(m => m.quantity <= m.minStock).length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">القيمة الإجمالية</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {materials.reduce((sum, m) => sum + (m.quantity * m.costPerUnit), 0).toLocaleString()} ج.م
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {materials.map(material => {
                    const stockPercent = (material.quantity / (material.minStock * 3)) * 100;
                    const isLowStock = material.quantity <= material.minStock;
                    const totalValue = material.quantity * material.costPerUnit;

                    return (
                      <div key={material.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{material.name}</h3>
                              <Badge variant="outline">{material.type}</Badge>
                              {isLowStock && (
                                <Badge variant="destructive" className="flex items-center gap-1">
                                  <AlertCircle className="h-3 w-3" />
                                  مخزون منخفض
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">المورد: {material.supplier}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold">{material.quantity}</p>
                            <p className="text-sm text-muted-foreground">{material.unit}</p>
                          </div>
                        </div>

                        <div className="space-y-2 mb-3">
                          <div className="flex justify-between text-sm">
                            <span>مستوى المخزون</span>
                            <span>{material.quantity} / {material.minStock * 3} (الحد الأدنى: {material.minStock})</span>
                          </div>
                          <Progress 
                            value={Math.min(stockPercent, 100)} 
                            className={isLowStock ? "bg-red-100" : ""}
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-3 text-sm mb-3">
                          <div>
                            <p className="text-muted-foreground">سعر الوحدة</p>
                            <p className="font-medium">{material.costPerUnit} ج.م</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">القيمة الإجمالية</p>
                            <p className="font-medium">{totalValue.toLocaleString()} ج.م</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">الحد الأدنى</p>
                            <p className="font-medium">{material.minStock} {material.unit}</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateMaterialQuantity(material.id, -1)}
                            disabled={material.quantity === 0}
                          >
                            استخدام
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateMaterialQuantity(material.id, 5)}
                          >
                            إضافة 5
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateMaterialQuantity(material.id, 10)}
                          >
                            إضافة 10
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* الصيانة */}
          <TabsContent value="maintenance" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">جدول الصيانة</h2>
              <Button onClick={() => setShowMaintenanceDialog(true)}>
                <Wrench className="h-4 w-4 mr-2" />
                صيانة جديدة
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">صيانة مجدولة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {maintenanceRecords.filter(m => m.status === "مجدولة").length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">قيد التنفيذ</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {maintenanceRecords.filter(m => m.status === "قيد التنفيذ").length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">إجمالي التكلفة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {maintenanceRecords.reduce((sum, m) => sum + m.cost, 0).toLocaleString()} ج.م
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3">
              {maintenanceRecords.map(record => (
                <Card key={record.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="font-mono">{record.id}</Badge>
                          <h3 className="font-semibold text-lg">{record.machineName}</h3>
                          <Badge variant="outline" className={
                            record.type === "دورية" ? "bg-blue-50 text-blue-700" :
                            record.type === "طارئة" ? "bg-red-50 text-red-700" :
                            "bg-green-50 text-green-700"
                          }>
                            {record.type}
                          </Badge>
                          <Badge variant="outline" className={
                            record.status === "مجدولة" ? "bg-gray-50 text-gray-700" :
                            record.status === "قيد التنفيذ" ? "bg-blue-50 text-blue-700" :
                            "bg-green-50 text-green-700"
                          }>
                            {record.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">التاريخ</p>
                            <p className="font-medium">{record.date}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">الفني</p>
                            <p className="font-medium">{record.technician}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">التكلفة</p>
                            <p className="font-medium text-lg">{record.cost.toLocaleString()} ج.م</p>
                          </div>
                        </div>

                        {record.description && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm font-medium text-gray-900">الوصف</p>
                            <p className="text-sm text-gray-700">{record.description}</p>
                          </div>
                        )}
                      </div>
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
                <CheckCircle className="h-4 w-4 mr-2" />
                فحص جديد
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">إجمالي الفحوصات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{qualityChecks.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">ممتاز</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {qualityChecks.filter(q => q.result === "ممتاز").length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">جيد</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {qualityChecks.filter(q => q.result === "جيد").length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">مرفوض</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">
                    {qualityChecks.filter(q => q.result === "مرفوض").length}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3">
              {qualityChecks.map(check => {
                const caseData = cases.find(c => c.id === check.caseId);
                const avgScore = (check.measurements.accuracy + check.measurements.surfaceQuality + check.measurements.fitQuality) / 3;

                return (
                  <Card key={check.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="font-mono">{check.id}</Badge>
                            <div>
                              <h3 className="font-semibold">{caseData?.patient}</h3>
                              <p className="text-sm text-muted-foreground">{caseData?.restorationType}</p>
                            </div>
                          </div>
                          <Badge className={
                            check.result === "ممتاز" ? "bg-green-100 text-green-800" :
                            check.result === "جيد" ? "bg-blue-100 text-blue-800" :
                            check.result === "مقبول" ? "bg-yellow-100 text-yellow-800" :
                            "bg-red-100 text-red-800"
                          }>
                            {check.result}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">المفتش</p>
                            <p className="font-medium">{check.inspector}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">التاريخ</p>
                            <p className="font-medium">{check.date}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">المتوسط</p>
                            <p className="font-medium text-lg">{Math.round(avgScore)}%</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>دقة القياسات</span>
                              <span>{check.measurements.accuracy}%</span>
                            </div>
                            <Progress value={check.measurements.accuracy} />
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>جودة السطح</span>
                              <span>{check.measurements.surfaceQuality}%</span>
                            </div>
                            <Progress value={check.measurements.surfaceQuality} />
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>جودة التركيب</span>
                              <span>{check.measurements.fitQuality}%</span>
                            </div>
                            <Progress value={check.measurements.fitQuality} />
                          </div>
                        </div>

                        {check.notes && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm font-medium text-gray-900">ملاحظات</p>
                            <p className="text-sm text-gray-700">{check.notes}</p>
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
              <DialogTitle>حالة إنتاج جديدة</DialogTitle>
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
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={newCase.material || ""}
                  onChange={(e) => setNewCase({ ...newCase, material: e.target.value })}
                >
                  <option value="">اختر المادة</option>
                  {materials.map(m => (
                    <option key={m.id} value={m.name}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>الجهاز</Label>
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={newCase.equipment || ""}
                  onChange={(e) => setNewCase({ ...newCase, equipment: e.target.value })}
                >
                  <option value="">اختر الجهاز</option>
                  {machines.filter(m => m.status === "متاح").map(m => (
                    <option key={m.id} value={m.name}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>المشغل</Label>
                <Input
                  value={newCase.operator || ""}
                  onChange={(e) => setNewCase({ ...newCase, operator: e.target.value })}
                  placeholder="محمد أحمد"
                />
              </div>
              <div className="space-y-2">
                <Label>نوع الطحن</Label>
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={newCase.millType || "5-axis"}
                  onChange={(e) => setNewCase({ ...newCase, millType: e.target.value as any })}
                >
                  <option value="5-axis">5 محاور</option>
                  <option value="4-axis">4 محاور</option>
                  <option value="3-axis">3 محاور</option>
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
                <Label>الوقت المقدر (دقيقة)</Label>
                <Input
                  type="number"
                  value={newCase.estimatedMinutes || 30}
                  onChange={(e) => setNewCase({ ...newCase, estimatedMinutes: parseInt(e.target.value) })}
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

        {/* حوار مادة جديدة */}
        <Dialog open={showMaterialDialog} onOpenChange={setShowMaterialDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة مادة جديدة</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>اسم المادة</Label>
                <Input
                  value={newMaterial.name || ""}
                  onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                  placeholder="زركونيا شفافة"
                />
              </div>
              <div className="space-y-2">
                <Label>النوع</Label>
                <Input
                  value={newMaterial.type || ""}
                  onChange={(e) => setNewMaterial({ ...newMaterial, type: e.target.value })}
                  placeholder="زركونيا"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الكمية</Label>
                  <Input
                    type="number"
                    value={newMaterial.quantity || ""}
                    onChange={(e) => setNewMaterial({ ...newMaterial, quantity: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>الوحدة</Label>
                  <Input
                    value={newMaterial.unit || "قرص"}
                    onChange={(e) => setNewMaterial({ ...newMaterial, unit: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الحد الأدنى</Label>
                  <Input
                    type="number"
                    value={newMaterial.minStock || ""}
                    onChange={(e) => setNewMaterial({ ...newMaterial, minStock: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>سعر الوحدة (ج.م)</Label>
                  <Input
                    type="number"
                    value={newMaterial.costPerUnit || ""}
                    onChange={(e) => setNewMaterial({ ...newMaterial, costPerUnit: parseFloat(e.target.value) })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>المورد</Label>
                <Input
                  value={newMaterial.supplier || ""}
                  onChange={(e) => setNewMaterial({ ...newMaterial, supplier: e.target.value })}
                  placeholder="Ivoclar Vivadent"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowMaterialDialog(false)}>إلغاء</Button>
              <Button onClick={handleAddMaterial}>إضافة</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* حوار صيانة جديدة */}
        <Dialog open={showMaintenanceDialog} onOpenChange={setShowMaintenanceDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>جدولة صيانة</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>الجهاز</Label>
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={newMaintenance.machineId || ""}
                  onChange={(e) => setNewMaintenance({ ...newMaintenance, machineId: e.target.value })}
                >
                  <option value="">اختر الجهاز</option>
                  {machines.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>التاريخ</Label>
                <Input
                  type="date"
                  value={newMaintenance.date || ""}
                  onChange={(e) => setNewMaintenance({ ...newMaintenance, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>النوع</Label>
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={newMaintenance.type || "دورية"}
                  onChange={(e) => setNewMaintenance({ ...newMaintenance, type: e.target.value as any })}
                >
                  <option value="دورية">دورية</option>
                  <option value="طارئة">طارئة</option>
                  <option value="وقائية">وقائية</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>الفني</Label>
                <Input
                  value={newMaintenance.technician || ""}
                  onChange={(e) => setNewMaintenance({ ...newMaintenance, technician: e.target.value })}
                  placeholder="م. طارق عبد الله"
                />
              </div>
              <div className="space-y-2">
                <Label>التكلفة (ج.م)</Label>
                <Input
                  type="number"
                  value={newMaintenance.cost || ""}
                  onChange={(e) => setNewMaintenance({ ...newMaintenance, cost: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>الوصف</Label>
                <Input
                  value={newMaintenance.description || ""}
                  onChange={(e) => setNewMaintenance({ ...newMaintenance, description: e.target.value })}
                  placeholder="وصف الصيانة"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowMaintenanceDialog(false)}>إلغاء</Button>
              <Button onClick={handleAddMaintenance}>جدولة</Button>
            </DialogFooter>
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
                  value={newQualityCheck.caseId || ""}
                  onChange={(e) => setNewQualityCheck({ ...newQualityCheck, caseId: e.target.value })}
                >
                  <option value="">اختر الحالة</option>
                  {cases.filter(c => c.status === "completed").map(c => (
                    <option key={c.id} value={c.id}>{c.patient} - {c.restorationType}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>المفتش</Label>
                <Input
                  value={newQualityCheck.inspector || ""}
                  onChange={(e) => setNewQualityCheck({ ...newQualityCheck, inspector: e.target.value })}
                  placeholder="د. ليلى عبد الرحمن"
                />
              </div>
              <div className="space-y-2">
                <Label>النتيجة</Label>
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={newQualityCheck.result || ""}
                  onChange={(e) => setNewQualityCheck({ ...newQualityCheck, result: e.target.value as any })}
                >
                  <option value="">اختر النتيجة</option>
                  <option value="ممتاز">ممتاز</option>
                  <option value="جيد">جيد</option>
                  <option value="مقبول">مقبول</option>
                  <option value="مرفوض">مرفوض</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>دقة القياسات (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={newQualityCheck.measurements?.accuracy || ""}
                  onChange={(e) => setNewQualityCheck({
                    ...newQualityCheck,
                    measurements: { ...newQualityCheck.measurements!, accuracy: parseInt(e.target.value) }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label>جودة السطح (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={newQualityCheck.measurements?.surfaceQuality || ""}
                  onChange={(e) => setNewQualityCheck({
                    ...newQualityCheck,
                    measurements: { ...newQualityCheck.measurements!, surfaceQuality: parseInt(e.target.value) }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label>جودة التركيب (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={newQualityCheck.measurements?.fitQuality || ""}
                  onChange={(e) => setNewQualityCheck({
                    ...newQualityCheck,
                    measurements: { ...newQualityCheck.measurements!, fitQuality: parseInt(e.target.value) }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label>ملاحظات</Label>
                <Input
                  value={newQualityCheck.notes || ""}
                  onChange={(e) => setNewQualityCheck({ ...newQualityCheck, notes: e.target.value })}
                  placeholder="ملاحظات الفحص"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowQualityDialog(false)}>إلغاء</Button>
              <Button onClick={handleAddQualityCheck}>حفظ</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
