import { useState } from "react";
import Layout from "@/components/Layout";
import DepartmentManagement from "@/components/DepartmentManagement";
import { Button } from "@/components/ui/button";
import { Cog } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Search, Check, X, Pause, Play, Cog, Clock,
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
}

const INITIAL: ProductionCase[] = [
  { id: "CASE-001", patient: "Ahmed M.", restorationType: "Crown", toothNumbers: "14, 15", material: "Zirconia", equipment: "Roland DWX-52D", operator: "Tech. Mahmoud", estimatedMinutes: 90, actualMinutes: 85, status: "completed", notes: "" },
  { id: "CASE-002", patient: "Sara K.", restorationType: "Veneer", toothNumbers: "21", material: "E-max", equipment: "", operator: "", estimatedMinutes: 45, actualMinutes: 0, status: "queued", notes: "" },
  { id: "CASE-003", patient: "Omar R.", restorationType: "Bridge", toothNumbers: "35-37", material: "PFM", equipment: "Imes-icore 350i", operator: "Tech. Amira", estimatedMinutes: 120, actualMinutes: 50, status: "milling", notes: "Using new bur set" },
];

const EQUIPMENT = ["Roland DWX-52D", "Imes-icore 350i", "VHF K5+", "Amann Girrbach Ceramill Motion 2"];
const OPERATORS = ["Tech. Mahmoud", "Tech. Amira", "Tech. Rami", "Tech. Huda"];

export default function CAMProduction() {
  const { t } = useTranslation();
  const [cases, setCases] = useState<ProductionCase[]>(INITIAL);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ equipment: "", operator: "", estimatedMinutes: 60, notes: "" });

  const filtered = cases.filter(c => {
    const match = `${c.id} ${c.patient} ${c.operator}`.toLowerCase().includes(search.toLowerCase());
    const status = filterStatus === "all" || c.status === filterStatus;
    return match && status;
  });

  const startEdit = (c: ProductionCase) => {
    setForm({ equipment: c.equipment, operator: c.operator, estimatedMinutes: c.estimatedMinutes, notes: c.notes });
    setEditingId(c.id);
  };

  const saveEdit = () => {
    if (!editingId) return;
    setCases(prev => prev.map(c => c.id === editingId
      ? { ...c, ...form, status: form.equipment && form.operator ? "milling" : c.status }
      : c
    ));
    setEditingId(null);
  };

  const updateStatus = (id: string, newStatus: ProductionCase["status"]) => {
    setCases(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const statusColor: Record<string, string> = {
    queued: "bg-gray-100 text-gray-700",
    milling: "bg-blue-100 text-blue-800",
    paused: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
  };

  const productionTab = (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {["queued", "milling", "paused", "completed", "failed"].map(s => (
          <div key={s} className="bg-card border rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-muted-foreground capitalize">
              {s === "queued" ? "قيد الانتظار" : s === "milling" ? "قيد التفريز" : s === "paused" ? "متوقف" : s === "completed" ? "مكتمل" : "فشل"}
            </p>
            <p className="text-xl sm:text-2xl font-bold">{cases.filter(c => c.status === s).length}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input placeholder="بحث..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border rounded-md px-3 py-2 text-sm">
          <option value="all">الكل</option>
          {["queued", "milling", "paused", "completed", "failed"].map(s => (
            <option key={s} value={s}>
              {s === "queued" ? "قيد الانتظار" : s === "milling" ? "قيد التفريز" : s === "paused" ? "متوقف" : s === "completed" ? "مكتمل" : "فشل"}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">لا توجد حالات</div>
        ) : filtered.map(c => (
          <div key={c.id} className="bg-card border rounded-lg p-5">
            {editingId === c.id ? (
              <div className="space-y-4">
                <h3 className="font-semibold">{c.id} — {c.patient} — {c.restorationType}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>المعدة</Label>
                    <select value={form.equipment} onChange={e => setForm({ ...form, equipment: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm">
                      <option value="">غير معين</option>
                      {EQUIPMENT.map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label>المشغل</Label>
                    <select value={form.operator} onChange={e => setForm({ ...form, operator: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm">
                      <option value="">غير معين</option>
                      {OPERATORS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label>الوقت المقدر (دقائق)</Label>
                    <Input type="number" value={form.estimatedMinutes} onChange={e => setForm({ ...form, estimatedMinutes: +e.target.value })} />
                  </div>
                </div>
                <div><Label>ملاحظات</Label><Input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setEditingId(null)}><X className="w-4 h-4 mr-1" /> إلغاء</Button>
                  <Button onClick={saveEdit}><Check className="w-4 h-4 mr-1" /> حفظ</Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-sm">{c.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[c.status]}`}>
                      {c.status === "queued" ? "قيد الانتظار" : c.status === "milling" ? "قيد التفريز" : c.status === "paused" ? "متوقف" : c.status === "completed" ? "مكتمل" : "فشل"}
                    </span>
                  </div>
                  <p className="text-sm"><strong>{c.patient}</strong> — {c.restorationType} ({c.toothNumbers}) — {c.material}</p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span><Cog className="w-3 h-3 inline mr-1" />{c.equipment || "غير معين"}</span>
                    {c.operator && <span className="hidden sm:inline">{c.operator}</span>}
                  </div>
                  {c.status !== "queued" && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>المقدر: {c.estimatedMinutes} دقيقة</span>
                      {c.actualMinutes > 0 && <span>| الفعلي: {c.actualMinutes} دقيقة</span>}
                    </div>
                  )}
                </div>
                <div className="flex gap-1 flex-shrink-0 self-start sm:self-center">
                  <Button size="sm" variant="outline" onClick={() => startEdit(c)}>تعديل</Button>
                  {c.status === "queued" && <Button size="sm" onClick={() => updateStatus(c.id, "milling")}><Play className="w-4 h-4 mr-1" /> بدء</Button>}
                  {c.status === "milling" && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => updateStatus(c.id, "paused")}><Pause className="w-4 h-4" /></Button>
                      <Button size="sm" className="bg-green-600" onClick={() => updateStatus(c.id, "completed")}><Check className="w-4 h-4" /></Button>
                    </>
                  )}
                  {c.status === "paused" && <Button size="sm" onClick={() => updateStatus(c.id, "milling")}>استئناف</Button>}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Layout>
      <DepartmentManagement
        departmentName={t("deptPages.camProduction.title")}
        departmentIcon={<Cog className="w-10 h-10 text-primary" />}
        customTabs={[
          {
            value: "production",
            label: "إدارة الإنتاج",
            content: productionTab
          }
        ]}
      />
    </Layout>
  );
}
