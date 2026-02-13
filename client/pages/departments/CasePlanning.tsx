import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import DepartmentManagement from "@/components/DepartmentManagement";
import { useLabContext } from "@/contexts/LabContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search, Eye, ClipboardList, Clock, CheckCircle, Package,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { FIXED_MATERIAL_NAMES, REMOVABLE_SUBTYPE_NAMES, ORTHODONTICS_TYPE_NAMES } from "@shared/api";

export default function CasePlanning() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cases: allCases } = useLabContext();
  
  const [search, setSearch] = useState("");

  // Get all active cases (not paused, not delivered)
  const activeCases = allCases.filter(c => !c.isPaused && c.finalStatus !== "delivery");
  const pausedCases = allCases.filter(c => c.isPaused);

  const filtered = activeCases.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.id.toLowerCase().includes(q) || 
      c.patientName.toLowerCase().includes(q) || 
      c.doctorName.toLowerCase().includes(q);
  });

  const getMaterialLabel = (c: typeof allCases[0]) => {
    if (c.category === "fixed" && c.fixedMaterial) return FIXED_MATERIAL_NAMES[c.fixedMaterial];
    if (c.category === "removable" && c.removableSubType) return REMOVABLE_SUBTYPE_NAMES[c.removableSubType];
    if (c.category === "orthodontics" && c.orthodonticsType) return ORTHODONTICS_TYPE_NAMES[c.orthodonticsType];
    return "-";
  };

  const casePlanningTab = (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "إجمالي الحالات", value: allCases.length, color: "text-foreground", icon: Package },
          { label: "نشطة", value: activeCases.length, color: "text-blue-600", icon: Clock },
          { label: "متوقفة", value: pausedCases.length, color: "text-amber-600", icon: Clock },
          { label: "مكتملة", value: allCases.filter(c => c.finalStatus === "delivery").length, color: "text-green-600", icon: CheckCircle },
        ].map(s => (
          <div key={s.label} className="bg-card border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <s.icon className={`w-4 h-4 ${s.color}`} />
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="بحث في الحالات..." 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          className="pr-9" 
        />
      </div>

      {/* Cases list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">لا توجد حالات</div>
        ) : filtered.map(c => {
          const currentStep = c.workflow[c.currentStageIndex];
          const progress = Math.round(
            (c.workflow.filter(s => s.status === "completed" || s.status === "skipped").length / c.workflow.length) * 100
          );

          return (
            <div key={c.id} className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-semibold">{c.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      c.category === "fixed" ? "bg-purple-100 text-purple-800" :
                      c.category === "removable" ? "bg-teal-100 text-teal-800" :
                      "bg-pink-100 text-pink-800"
                    }`}>
                      {c.category === "fixed" ? "ثابتة" : c.category === "removable" ? "متحركة" : "تقويم"}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      c.priority === "emergency" ? "bg-red-100 text-red-800" :
                      c.priority === "rush" ? "bg-amber-100 text-amber-800" :
                      "bg-green-100 text-green-800"
                    }`}>{c.priority}</span>
                  </div>
                  <p className="text-sm">
                    <strong>{c.patientName}</strong> — {c.doctorName} — {getMaterialLabel(c)}
                  </p>
                  {currentStep && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> المرحلة: {currentStep.stage} ({progress}%)
                    </p>
                  )}
                </div>
                <Button size="sm" variant="outline" onClick={() => navigate(`/cases/${c.id}`)}>
                  <Eye className="w-4 h-4 mr-1" /> عرض
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <Layout>
      <DepartmentManagement
        departmentName={t("deptPages.casePlanning.title")}
        departmentIcon={<ClipboardList className="w-8 h-8" />}
        customTabs={[
          { value: "planning", label: "تخطيط الحالات", content: casePlanningTab }
        ]}
      />
    </Layout>
  );
}
