import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Users, ClipboardCheck, TrendingUp, FileText, 
  Plus, Edit, Trash2, Check, X, Search, AlertCircle,
  Calendar, Clock, Target, Award
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface Staff {
  id: string;
  name: string;
  role: string;
  status: "active" | "busy" | "offline";
  performance: number;
  tasksCompleted: number;
  experience: string;
  email: string;
  phone: string;
}

interface Task {
  id: string;
  title: string;
  assignedTo: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed";
  dueDate: string;
  progress: number;
}

interface QualityMetric {
  id: string;
  metric: string;
  target: number;
  actual: number;
  unit: string;
  status: "pass" | "warning" | "fail";
}

interface PerformanceData {
  period: string;
  casesHandled: number;
  avgTime: number;
  qualityScore: number;
  efficiency: number;
}

interface DepartmentManagementProps {
  departmentName: string;
  departmentIcon?: React.ReactNode;
  customTabs?: Array<{
    value: string;
    label: string;
    content: React.ReactNode;
  }>;
}

export default function DepartmentManagement({ 
  departmentName, 
  departmentIcon,
  customTabs = [] 
}: DepartmentManagementProps) {
  const { t } = useTranslation();
  
  // Staff Management State
  const [staff, setStaff] = useState<Staff[]>([
    { id: "1", name: "أحمد محمد", role: "Senior Technician", status: "active", performance: 95, tasksCompleted: 45, experience: "5 years", email: "ahmed@lab.com", phone: "+20 123 456 7890" },
    { id: "2", name: "سارة علي", role: "Technician", status: "busy", performance: 88, tasksCompleted: 38, experience: "3 years", email: "sara@lab.com", phone: "+20 123 456 7891" },
    { id: "3", name: "محمد حسن", role: "Junior Technician", status: "active", performance: 82, tasksCompleted: 28, experience: "1 year", email: "mohamed@lab.com", phone: "+20 123 456 7892" },
  ]);

  const [showStaffForm, setShowStaffForm] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [staffForm, setStaffForm] = useState({
    name: "", role: "", experience: "", email: "", phone: ""
  });

  // Tasks Management State
  const [tasks, setTasks] = useState<Task[]>([
    { id: "T-001", title: "معالجة الحالات الطارئة", assignedTo: "أحمد محمد", priority: "high", status: "in-progress", dueDate: "2026-02-08", progress: 60 },
    { id: "T-002", title: "فحص جودة المنتجات", assignedTo: "سارة علي", priority: "medium", status: "in-progress", dueDate: "2026-02-09", progress: 40 },
    { id: "T-003", title: "تحديث السجلات", assignedTo: "محمد حسن", priority: "low", status: "pending", dueDate: "2026-02-10", progress: 0 },
  ]);

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: "", assignedTo: "", priority: "medium" as Task["priority"], dueDate: ""
  });

  // Quality Metrics State
  const [qualityMetrics] = useState<QualityMetric[]>([
    { id: "Q1", metric: "معدل الدقة", target: 98, actual: 96.5, unit: "%", status: "pass" },
    { id: "Q2", metric: "الالتزام بالمواعيد", target: 95, actual: 92, unit: "%", status: "warning" },
    { id: "Q3", metric: "رضا العملاء", target: 90, actual: 94, unit: "%", status: "pass" },
    { id: "Q4", metric: "معدل الأخطاء", target: 2, actual: 3.5, unit: "%", status: "fail" },
  ]);

  // Performance Data State
  const [performanceData] = useState<PerformanceData[]>([
    { period: "الأسبوع الماضي", casesHandled: 45, avgTime: 2.5, qualityScore: 94, efficiency: 88 },
    { period: "هذا الأسبوع", casesHandled: 52, avgTime: 2.2, qualityScore: 96, efficiency: 92 },
    { period: "الشهر الحالي", casesHandled: 198, avgTime: 2.4, qualityScore: 95, efficiency: 90 },
  ]);

  // Staff Management Functions
  const handleStaffSubmit = () => {
    if (!staffForm.name || !staffForm.role) return;
    
    if (editingStaffId) {
      setStaff(prev => prev.map(s => 
        s.id === editingStaffId 
          ? { ...s, ...staffForm }
          : s
      ));
    } else {
      const newStaff: Staff = {
        id: String(staff.length + 1),
        ...staffForm,
        status: "active",
        performance: 0,
        tasksCompleted: 0
      };
      setStaff(prev => [...prev, newStaff]);
    }
    
    setStaffForm({ name: "", role: "", experience: "", email: "", phone: "" });
    setEditingStaffId(null);
    setShowStaffForm(false);
  };

  const editStaff = (s: Staff) => {
    setStaffForm({
      name: s.name,
      role: s.role,
      experience: s.experience,
      email: s.email,
      phone: s.phone
    });
    setEditingStaffId(s.id);
    setShowStaffForm(true);
  };

  const deleteStaff = (id: string) => {
    setStaff(prev => prev.filter(s => s.id !== id));
  };

  // Task Management Functions
  const handleTaskSubmit = () => {
    if (!taskForm.title || !taskForm.assignedTo) return;
    
    const newTask: Task = {
      id: `T-${String(tasks.length + 1).padStart(3, "0")}`,
      ...taskForm,
      status: "pending",
      progress: 0
    };
    setTasks(prev => [...prev, newTask]);
    
    setTaskForm({ title: "", assignedTo: "", priority: "medium", dueDate: "" });
    setShowTaskForm(false);
  };

  const updateTaskStatus = (id: string, status: Task["status"]) => {
    setTasks(prev => prev.map(t => 
      t.id === id 
        ? { ...t, status, progress: status === "completed" ? 100 : t.progress }
        : t
    ));
  };

  const statusColor = {
    active: "bg-green-100 text-green-800",
    busy: "bg-yellow-100 text-yellow-800",
    offline: "bg-gray-100 text-gray-800"
  };

  const priorityColor = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800"
  };

  const taskStatusColor = {
    pending: "bg-gray-100 text-gray-800",
    "in-progress": "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800"
  };

  const qualityStatusColor = {
    pass: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    fail: "bg-red-100 text-red-800"
  };

  return (
    <div className="space-y-6">
      {/* Department Header */}
      <div className="flex items-center gap-3">
        {departmentIcon}
        <div>
          <h1 className="text-3xl font-bold">{departmentName}</h1>
          <p className="text-muted-foreground mt-1">
            نظام إدارة شامل للقسم - الموظفين، المهام، الجودة، والأداء
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-600">
            <Users className="w-5 h-5" />
            <span className="text-sm text-muted-foreground">الموظفين</span>
          </div>
          <p className="text-2xl font-bold mt-2">{staff.length}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {staff.filter(s => s.status === "active").length} نشط
          </p>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 text-yellow-600">
            <ClipboardCheck className="w-5 h-5" />
            <span className="text-sm text-muted-foreground">المهام</span>
          </div>
          <p className="text-2xl font-bold mt-2">{tasks.length}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {tasks.filter(t => t.status === "in-progress").length} قيد التنفيذ
          </p>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-600">
            <Target className="w-5 h-5" />
            <span className="text-sm text-muted-foreground">الجودة</span>
          </div>
          <p className="text-2xl font-bold mt-2">
            {(qualityMetrics.reduce((sum, m) => sum + m.actual, 0) / qualityMetrics.length).toFixed(1)}%
          </p>
          <p className="text-xs text-muted-foreground mt-1">متوسط الأداء</p>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 text-purple-600">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm text-muted-foreground">الكفاءة</span>
          </div>
          <p className="text-2xl font-bold mt-2">
            {performanceData[performanceData.length - 1]?.efficiency}%
          </p>
          <p className="text-xs text-muted-foreground mt-1">هذا الأسبوع</p>
        </div>
      </div>

      {/* Tabs for Different Management Sections */}
      <Tabs defaultValue="staff" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-5">
          <TabsTrigger value="staff">
            <Users className="w-4 h-4 mr-2" />
            الموظفين
          </TabsTrigger>
          <TabsTrigger value="tasks">
            <ClipboardCheck className="w-4 h-4 mr-2" />
            المهام
          </TabsTrigger>
          <TabsTrigger value="quality">
            <Award className="w-4 h-4 mr-2" />
            الجودة
          </TabsTrigger>
          <TabsTrigger value="performance">
            <TrendingUp className="w-4 h-4 mr-2" />
            الأداء
          </TabsTrigger>
          {customTabs.length > 0 && customTabs.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Staff Management Tab */}
        <TabsContent value="staff" className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">إدارة الموظفين</h2>
            <Button onClick={() => {
              setStaffForm({ name: "", role: "", experience: "", email: "", phone: "" });
              setEditingStaffId(null);
              setShowStaffForm(true);
            }}>
              <Plus className="w-4 h-4 mr-2" />
              إضافة موظف
            </Button>
          </div>

          {showStaffForm && (
            <div className="bg-card border rounded-lg p-6 space-y-4">
              <h3 className="font-semibold">
                {editingStaffId ? "تعديل موظف" : "إضافة موظف جديد"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>الاسم *</Label>
                  <Input 
                    value={staffForm.name} 
                    onChange={e => setStaffForm({ ...staffForm, name: e.target.value })}
                    placeholder="الاسم الكامل"
                  />
                </div>
                <div>
                  <Label>الدور الوظيفي *</Label>
                  <Input 
                    value={staffForm.role} 
                    onChange={e => setStaffForm({ ...staffForm, role: e.target.value })}
                    placeholder="مثال: فني أول، مصمم"
                  />
                </div>
                <div>
                  <Label>الخبرة</Label>
                  <Input 
                    value={staffForm.experience} 
                    onChange={e => setStaffForm({ ...staffForm, experience: e.target.value })}
                    placeholder="مثال: 3 سنوات"
                  />
                </div>
                <div>
                  <Label>البريد الإلكتروني</Label>
                  <Input 
                    type="email"
                    value={staffForm.email} 
                    onChange={e => setStaffForm({ ...staffForm, email: e.target.value })}
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <Label>الهاتف</Label>
                  <Input 
                    value={staffForm.phone} 
                    onChange={e => setStaffForm({ ...staffForm, phone: e.target.value })}
                    placeholder="+20 123 456 7890"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => {
                  setShowStaffForm(false);
                  setEditingStaffId(null);
                }}>
                  <X className="w-4 h-4 mr-2" />
                  إلغاء
                </Button>
                <Button onClick={handleStaffSubmit} disabled={!staffForm.name || !staffForm.role}>
                  <Check className="w-4 h-4 mr-2" />
                  {editingStaffId ? "تحديث" : "إضافة"}
                </Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {staff.map(s => (
              <div key={s.id} className="bg-card border rounded-lg p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{s.name}</h3>
                    <p className="text-sm text-muted-foreground">{s.role}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[s.status]}`}>
                    {s.status === "active" ? "نشط" : s.status === "busy" ? "مشغول" : "غير متصل"}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">الأداء</span>
                    <span className="font-semibold">{s.performance}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div 
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${s.performance}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">المهام المكتملة</span>
                    <p className="font-semibold">{s.tasksCompleted}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">الخبرة</span>
                    <p className="font-semibold">{s.experience}</p>
                  </div>
                </div>

                {s.email && (
                  <p className="text-xs text-muted-foreground truncate">{s.email}</p>
                )}

                <div className="flex gap-2 pt-2 border-t">
                  <Button size="sm" variant="outline" onClick={() => editStaff(s)} className="flex-1">
                    <Edit className="w-4 h-4 mr-1" />
                    تعديل
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => deleteStaff(s.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Tasks Management Tab */}
        <TabsContent value="tasks" className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">إدارة المهام</h2>
            <Button onClick={() => setShowTaskForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              مهمة جديدة
            </Button>
          </div>

          {showTaskForm && (
            <div className="bg-card border rounded-lg p-6 space-y-4">
              <h3 className="font-semibold">إضافة مهمة جديدة</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label>عنوان المهمة *</Label>
                  <Input 
                    value={taskForm.title} 
                    onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
                    placeholder="وصف المهمة"
                  />
                </div>
                <div>
                  <Label>تعيين إلى *</Label>
                  <select 
                    value={taskForm.assignedTo}
                    onChange={e => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  >
                    <option value="">اختر موظف...</option>
                    {staff.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>الأولوية</Label>
                  <select 
                    value={taskForm.priority}
                    onChange={e => setTaskForm({ ...taskForm, priority: e.target.value as Task["priority"] })}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  >
                    <option value="low">منخفضة</option>
                    <option value="medium">متوسطة</option>
                    <option value="high">عالية</option>
                  </select>
                </div>
                <div>
                  <Label>تاريخ الاستحقاق</Label>
                  <Input 
                    type="date"
                    value={taskForm.dueDate} 
                    onChange={e => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowTaskForm(false)}>
                  <X className="w-4 h-4 mr-2" />
                  إلغاء
                </Button>
                <Button onClick={handleTaskSubmit} disabled={!taskForm.title || !taskForm.assignedTo}>
                  <Check className="w-4 h-4 mr-2" />
                  إضافة
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {tasks.map(task => (
              <div key={task.id} className="bg-card border rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs text-muted-foreground">{task.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColor[task.priority]}`}>
                        {task.priority === "high" ? "عالية" : task.priority === "medium" ? "متوسطة" : "منخفضة"}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${taskStatusColor[task.status]}`}>
                        {task.status === "completed" ? "مكتملة" : task.status === "in-progress" ? "قيد التنفيذ" : "معلقة"}
                      </span>
                    </div>
                    <h3 className="font-semibold">{task.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {task.assignedTo}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {task.dueDate}
                      </span>
                    </div>
                    {task.status !== "pending" && (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full max-w-xs">
                          <div 
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium">{task.progress}%</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {task.status === "pending" && (
                      <Button size="sm" onClick={() => updateTaskStatus(task.id, "in-progress")}>
                        بدء
                      </Button>
                    )}
                    {task.status === "in-progress" && (
                      <Button size="sm" onClick={() => updateTaskStatus(task.id, "completed")}>
                        <Check className="w-4 h-4 mr-1" />
                        إنهاء
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Quality Tab */}
        <TabsContent value="quality" className="space-y-4 mt-6">
          <h2 className="text-xl font-semibold">مؤشرات الجودة</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {qualityMetrics.map(metric => (
              <div key={metric.id} className="bg-card border rounded-lg p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold">{metric.metric}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${qualityStatusColor[metric.status]}`}>
                    {metric.status === "pass" ? "ممتاز" : metric.status === "warning" ? "تحذير" : "يحتاج تحسين"}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">المستهدف</span>
                    <span className="font-semibold">{metric.target}{metric.unit}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">الفعلي</span>
                    <span className={`font-semibold ${
                      metric.status === "pass" ? "text-green-600" :
                      metric.status === "warning" ? "text-yellow-600" :
                      "text-red-600"
                    }`}>
                      {metric.actual}{metric.unit}
                    </span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${
                        metric.status === "pass" ? "bg-green-500" :
                        metric.status === "warning" ? "bg-yellow-500" :
                        "bg-red-500"
                      }`}
                      style={{ 
                        width: `${Math.min((metric.actual / metric.target) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>

                {metric.status !== "pass" && (
                  <div className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 p-2 rounded">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      {metric.status === "warning" 
                        ? "قريب من المستهدف، يحتاج تحسين طفيف" 
                        : "يحتاج إلى تحسين فوري لتحقيق الهدف"}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4 mt-6">
          <h2 className="text-xl font-semibold">تقارير الأداء</h2>
          
          <div className="bg-card border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-right px-4 py-3 font-medium">الفترة</th>
                  <th className="text-right px-4 py-3 font-medium">الحالات المعالجة</th>
                  <th className="text-right px-4 py-3 font-medium">متوسط الوقت (ساعات)</th>
                  <th className="text-right px-4 py-3 font-medium">نقاط الجودة</th>
                  <th className="text-right px-4 py-3 font-medium">الكفاءة</th>
                </tr>
              </thead>
              <tbody>
                {performanceData.map((data, idx) => (
                  <tr key={idx} className="border-t hover:bg-muted/30">
                    <td className="px-4 py-3 font-semibold">{data.period}</td>
                    <td className="px-4 py-3">{data.casesHandled}</td>
                    <td className="px-4 py-3">{data.avgTime}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        data.qualityScore >= 95 ? "bg-green-100 text-green-800" :
                        data.qualityScore >= 90 ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {data.qualityScore}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full max-w-[100px]">
                          <div 
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${data.efficiency}%` }}
                          />
                        </div>
                        <span className="font-semibold">{data.efficiency}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card border rounded-lg p-5">
              <div className="flex items-center gap-2 text-blue-600 mb-3">
                <Clock className="w-5 h-5" />
                <h3 className="font-semibold">متوسط وقت الإنجاز</h3>
              </div>
              <p className="text-3xl font-bold">2.4 <span className="text-sm text-muted-foreground">ساعة</span></p>
              <p className="text-sm text-green-600 mt-1">↓ 8% تحسن عن الشهر الماضي</p>
            </div>

            <div className="bg-card border rounded-lg p-5">
              <div className="flex items-center gap-2 text-green-600 mb-3">
                <Target className="w-5 h-5" />
                <h3 className="font-semibold">معدل النجاح</h3>
              </div>
              <p className="text-3xl font-bold">96.5<span className="text-sm text-muted-foreground">%</span></p>
              <p className="text-sm text-green-600 mt-1">↑ 2% تحسن</p>
            </div>

            <div className="bg-card border rounded-lg p-5">
              <div className="flex items-center gap-2 text-purple-600 mb-3">
                <TrendingUp className="w-5 h-5" />
                <h3 className="font-semibold">معدل الإنتاجية</h3>
              </div>
              <p className="text-3xl font-bold">92<span className="text-sm text-muted-foreground">%</span></p>
              <p className="text-sm text-green-600 mt-1">↑ 4% تحسن</p>
            </div>
          </div>
        </TabsContent>

        {/* Custom Tabs */}
        {customTabs.map(tab => (
          <TabsContent key={tab.value} value={tab.value} className="mt-6">
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
