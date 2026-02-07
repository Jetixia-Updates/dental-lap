import { useState } from "react";
import Layout from "@/components/Layout";
import DepartmentManagement from "@/components/DepartmentManagement";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Plus, Search, Trash2, Edit, Check, X, AlertCircle, Inbox,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface IntakeCase {
  id: string;
  doctor: string;
  patient: string;
  toothNumbers: string;
  restorationType: string;
  shade: string;
  material: string;
  specialInstructions: string;
  dateReceived: string;
  priority: "normal" | "rush" | "emergency";
  status: "received" | "validated" | "incomplete";
}

const INITIAL_CASES: IntakeCase[] = [
  {
    id: "CASE-001", doctor: "Dr. Smith", patient: "Ahmed M.",
    toothNumbers: "14, 15", restorationType: "Crown", shade: "A2",
    material: "Zirconia", specialInstructions: "Implant-supported",
    dateReceived: "2026-02-05", priority: "normal", status: "validated",
  },
  {
    id: "CASE-002", doctor: "Dr. Johnson", patient: "Sara K.",
    toothNumbers: "21", restorationType: "Veneer", shade: "B1",
    material: "E-max", specialInstructions: "Match adjacent teeth",
    dateReceived: "2026-02-06", priority: "rush", status: "incomplete",
  },
];

export default function Reception() {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [cases, setCases] = useState<IntakeCase[]>(INITIAL_CASES);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    doctor: "", patient: "", toothNumbers: "", restorationType: "Crown",
    shade: "", material: "Zirconia", specialInstructions: "",
    priority: "normal" as IntakeCase["priority"],
  });

  const nextId = `CASE-${String(cases.length + 1).padStart(3, "0")}`;

  const resetForm = () => {
    setForm({ doctor: "", patient: "", toothNumbers: "", restorationType: "Crown", shade: "", material: "Zirconia", specialInstructions: "", priority: "normal" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = () => {
    if (!form.doctor || !form.patient || !form.toothNumbers) return;
    const missing = !form.shade || !form.material;
    if (editingId) {
      setCases(prev => prev.map(c => c.id === editingId ? { ...c, ...form, status: missing ? "incomplete" : "validated" } : c));
    } else {
      setCases(prev => [...prev, { ...form, id: nextId, dateReceived: new Date().toISOString().split("T")[0], status: missing ? "incomplete" : "validated" }]);
    }
    resetForm();
  };

  const startEdit = (c: IntakeCase) => {
    setForm({ doctor: c.doctor, patient: c.patient, toothNumbers: c.toothNumbers, restorationType: c.restorationType, shade: c.shade, material: c.material, specialInstructions: c.specialInstructions, priority: c.priority });
    setEditingId(c.id);
    setShowForm(true);
  };

  const filtered = cases.filter(c => {
    const matchSearch = `${c.id} ${c.doctor} ${c.patient}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const statusColor: Record<string, string> = {
    validated: "bg-green-100 text-green-800",
    received: "bg-blue-100 text-blue-800",
    incomplete: "bg-red-100 text-red-800",
  };

  const priorityColor: Record<string, string> = {
    normal: "bg-gray-100 text-gray-700",
    rush: "bg-yellow-100 text-yellow-800",
    emergency: "bg-red-100 text-red-800",
  };

  return (
    <Layout>
      <DepartmentManagement
        departmentName={t("deptPages.reception.title")}
        departmentIcon={<Inbox className="w-10 h-10 text-primary" />}
        customTabs={[
          {
            value: "cases",
            label: "إدارة الحالات",
            content: (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">إدارة حالات الاستقبال</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      استلام الحالات والتحقق من الوصفات وتسجيل البيانات
                    </p>
                  </div>
                  <Button onClick={() => { resetForm(); setShowForm(true); }}>
                    <Plus className="w-4 h-4 mr-2" /> حالة جديدة
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "إجمالي الحالات", value: cases.length, color: "text-blue-600" },
                    { label: "محققة", value: cases.filter(c => c.status === "validated").length, color: "text-green-600" },
                    { label: "ناقصة", value: cases.filter(c => c.status === "incomplete").length, color: "text-red-600" },
                    { label: "طارئة/عاجلة", value: cases.filter(c => c.priority !== "normal").length, color: "text-yellow-600" },
                  ].map(s => (
                    <div key={s.label} className="bg-card border rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">{s.label}</p>
                      <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="بحث في الحالات..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
                  </div>
                  <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border rounded-md px-3 py-2 text-sm">
                    <option value="all">جميع الحالات</option>
                    <option value="validated">محققة</option>
                    <option value="received">مستلمة</option>
                    <option value="incomplete">ناقصة</option>
                  </select>
                </div>

                {/* Form */}
                {showForm && (
                  <div className="bg-card border rounded-lg p-6 space-y-4">
                    <h2 className="text-lg font-semibold">{editingId ? `تعديل ${editingId}` : `حالة جديدة — ${nextId}`}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><Label>الطبيب *</Label><Input value={form.doctor} onChange={e => setForm({ ...form, doctor: e.target.value })} placeholder="اسم الطبيب" /></div>
                      <div><Label>المريض *</Label><Input value={form.patient} onChange={e => setForm({ ...form, patient: e.target.value })} placeholder="اسم المريض" /></div>
                      <div><Label>أرقام الأسنان *</Label><Input value={form.toothNumbers} onChange={e => setForm({ ...form, toothNumbers: e.target.value })} placeholder="مثال: 14، 15" /></div>
                      <div>
                        <Label>نوع الترميم</Label>
                        <select value={form.restorationType} onChange={e => setForm({ ...form, restorationType: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm">
                          {["Crown", "Bridge", "Veneer", "Inlay", "Onlay", "Implant Abutment", "Denture", "Night Guard"].map(t => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                      <div><Label>اللون</Label><Input value={form.shade} onChange={e => setForm({ ...form, shade: e.target.value })} placeholder="مثال: A2، B1" /></div>
                      <div>
                        <Label>المادة</Label>
                        <select value={form.material} onChange={e => setForm({ ...form, material: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm">
                          {["Zirconia", "E-max", "PFM", "Full Gold", "PMMA", "Composite", "Acrylic"].map(m => <option key={m}>{m}</option>)}
                        </select>
                      </div>
                      <div>
                        <Label>الأولوية</Label>
                        <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value as IntakeCase["priority"] })} className="w-full border rounded-md px-3 py-2 text-sm">
                          <option value="normal">عادية</option>
                          <option value="rush">عاجلة</option>
                          <option value="emergency">طارئة</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <Label>تعليمات خاصة</Label>
                        <textarea value={form.specialInstructions} onChange={e => setForm({ ...form, specialInstructions: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm min-h-[80px]" placeholder="أي ملاحظات خاصة..." />
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={resetForm}><X className="w-4 h-4 mr-1" /> إلغاء</Button>
                      <Button onClick={handleSubmit} disabled={!form.doctor || !form.patient || !form.toothNumbers}>
                        <Check className="w-4 h-4 mr-1" /> {editingId ? "تحديث" : "تسجيل الحالة"}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Table */}
                <div className="bg-card border rounded-lg overflow-hidden">
                  {isMobile ? (
                    /* Mobile Card Layout */
                    <div className="divide-y divide-border">
                      {filtered.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">لا توجد حالات</div>
                      ) : filtered.map(c => (
                        <div key={c.id} className="p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="font-mono font-semibold text-sm">{c.id}</span>
                              <div className="flex gap-2 mt-1">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColor[c.priority]}`}>
                                  {c.priority === "normal" ? "عادية" : c.priority === "rush" ? "عاجلة" : "طارئة"}
                                </span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[c.status]}`}>
                                  {c.status === "validated" ? "محققة" : c.status === "received" ? "مستلمة" : "ناقصة"}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost" onClick={() => startEdit(c)}><Edit className="w-4 h-4" /></Button>
                              <Button size="sm" variant="ghost" className="text-red-500" onClick={() => setCases(prev => prev.filter(x => x.id !== c.id))}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">الطبيب:</span>
                              <div className="font-medium">{c.doctor}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">المريض:</span>
                              <div className="font-medium">{c.patient}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">الأسنان:</span>
                              <div className="font-medium">{c.toothNumbers}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">النوع:</span>
                              <div className="font-medium">{c.restorationType}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">اللون:</span>
                              <div className="font-medium">
                                {c.shade || <span className="flex items-center gap-1 text-red-500"><AlertCircle className="w-3 h-3" /> ناقص</span>}
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">المادة:</span>
                              <div className="font-medium">{c.material}</div>
                            </div>
                          </div>

                          {c.specialInstructions && (
                            <div className="text-sm">
                              <span className="text-muted-foreground">ملاحظات:</span>
                              <div className="font-medium">{c.specialInstructions}</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Desktop Table Layout */
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                          <tr>
                            {["رقم الحالة", "الطبيب", "المريض", "الأسنان", "النوع", "اللون", "المادة", "الأولوية", "الحالة", "الإجراءات"].map(h => (
                              <th key={h} className="text-right px-4 py-3 font-medium text-muted-foreground">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {filtered.length === 0 ? (
                            <tr><td colSpan={10} className="text-center py-8 text-muted-foreground">لا توجد حالات</td></tr>
                          ) : filtered.map(c => (
                            <tr key={c.id} className="border-t hover:bg-muted/30 transition-colors">
                              <td className="px-4 py-3 font-mono font-semibold">{c.id}</td>
                              <td className="px-4 py-3">{c.doctor}</td>
                              <td className="px-4 py-3">{c.patient}</td>
                              <td className="px-4 py-3">{c.toothNumbers}</td>
                              <td className="px-4 py-3">{c.restorationType}</td>
                              <td className="px-4 py-3">{c.shade || <span className="flex items-center gap-1 text-red-500"><AlertCircle className="w-3 h-3" /> ناقص</span>}</td>
                              <td className="px-4 py-3">{c.material}</td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColor[c.priority]}`}>
                                  {c.priority === "normal" ? "عادية" : c.priority === "rush" ? "عاجلة" : "طارئة"}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[c.status]}`}>
                                  {c.status === "validated" ? "محققة" : c.status === "received" ? "مستلمة" : "ناقصة"}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex gap-1">
                                  <Button size="sm" variant="ghost" onClick={() => startEdit(c)}><Edit className="w-4 h-4" /></Button>
                                  <Button size="sm" variant="ghost" className="text-red-500" onClick={() => setCases(prev => prev.filter(x => x.id !== c.id))}><Trash2 className="w-4 h-4" /></Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )
          }
        ]}
      />
    </Layout>
  );
}
