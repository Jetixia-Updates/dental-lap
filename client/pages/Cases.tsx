import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useLabContext } from "@/contexts/LabContext";
import { useTranslation } from "react-i18next";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Pause,
  Play,
  AlertCircle,
  CheckCircle,
  Clock,
  Package,
  Wrench,
  Smile,
} from "lucide-react";
import {
  CaseCategory,
  FIXED_MATERIAL_NAMES,
  REMOVABLE_SUBTYPE_NAMES,
  ORTHODONTICS_TYPE_NAMES,
  DentalCase,
} from "@shared/api";

export default function Cases() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { cases } = useLabContext();

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CaseCategory | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "paused" | "completed">("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | "normal" | "rush" | "emergency">("all");

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          c.id.toLowerCase().includes(q) ||
          c.doctorName.toLowerCase().includes(q) ||
          c.patientName.toLowerCase().includes(q) ||
          c.toothNumbers.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }

      // Category
      if (categoryFilter !== "all" && c.category !== categoryFilter) return false;

      // Status
      if (statusFilter === "active" && (c.isPaused || c.finalStatus === "delivery")) return false;
      if (statusFilter === "paused" && !c.isPaused) return false;
      if (statusFilter === "completed" && c.finalStatus !== "delivery") return false;

      // Priority
      if (priorityFilter !== "all" && c.priority !== priorityFilter) return false;

      return true;
    });
  }, [cases, searchQuery, categoryFilter, statusFilter, priorityFilter]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: cases.length,
      active: cases.filter((c) => !c.isPaused && c.finalStatus !== "delivery").length,
      paused: cases.filter((c) => c.isPaused).length,
      completed: cases.filter((c) => c.finalStatus === "delivery").length,
      fixed: cases.filter((c) => c.category === "fixed").length,
      removable: cases.filter((c) => c.category === "removable").length,
      orthodontics: cases.filter((c) => c.category === "orthodontics").length,
    };
  }, [cases]);

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{t("casesPage.title")}</h1>
          <p className="text-muted-foreground text-sm">{t("casesPage.subtitle")}</p>
        </div>
        <Button onClick={() => navigate("/cases/new")}>
          <Plus className="w-4 h-4 mr-2" />
          {t("casesPage.newCase")}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
        <StatsCard
          label={t("casesPage.total")}
          value={stats.total}
          color="text-foreground"
          active={categoryFilter === "all" && statusFilter === "all"}
          onClick={() => {
            setCategoryFilter("all");
            setStatusFilter("all");
          }}
        />
        <StatsCard
          label={t("casesPage.activeLabel")}
          value={stats.active}
          color="text-blue-600"
          active={statusFilter === "active"}
          onClick={() => setStatusFilter(statusFilter === "active" ? "all" : "active")}
        />
        <StatsCard
          label={t("casesPage.pausedLabel")}
          value={stats.paused}
          color="text-amber-600"
          active={statusFilter === "paused"}
          onClick={() => setStatusFilter(statusFilter === "paused" ? "all" : "paused")}
        />
        <StatsCard
          label={t("casesPage.completedLabel")}
          value={stats.completed}
          color="text-green-600"
          active={statusFilter === "completed"}
          onClick={() => setStatusFilter(statusFilter === "completed" ? "all" : "completed")}
        />
        <StatsCard
          label={t("casesPage.fixedLabel")}
          value={stats.fixed}
          color="text-purple-600"
          icon={<Wrench className="w-3.5 h-3.5" />}
          active={categoryFilter === "fixed"}
          onClick={() => setCategoryFilter(categoryFilter === "fixed" ? "all" : "fixed")}
        />
        <StatsCard
          label={t("casesPage.removableLabel")}
          value={stats.removable}
          color="text-teal-600"
          icon={<Package className="w-3.5 h-3.5" />}
          active={categoryFilter === "removable"}
          onClick={() => setCategoryFilter(categoryFilter === "removable" ? "all" : "removable")}
        />
        <StatsCard
          label={t("casesPage.orthoLabel")}
          value={stats.orthodontics}
          color="text-pink-600"
          icon={<Smile className="w-3.5 h-3.5" />}
          active={categoryFilter === "orthodontics"}
          onClick={() => setCategoryFilter(categoryFilter === "orthodontics" ? "all" : "orthodontics")}
        />
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("casesPage.searchPlaceholder")}
            className="w-full pr-10 pl-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as any)}
          className="px-3 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">{t("casesPage.allPriorities")}</option>
          <option value="normal">{t("newCase.priorityNormal")}</option>
          <option value="rush">{t("newCase.priorityRush")}</option>
          <option value="emergency">{t("newCase.priorityEmergency")}</option>
        </select>
      </div>

      {/* Cases List */}
      <div className="space-y-3">
        {filteredCases.length === 0 ? (
          <div className="text-center py-16 bg-card border rounded-lg">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground mb-2">{t("casesPage.noCases")}</p>
            <p className="text-sm text-muted-foreground mb-4">{t("casesPage.noCasesDesc")}</p>
            <Button onClick={() => navigate("/cases/new")}>
              <Plus className="w-4 h-4 mr-2" />
              {t("casesPage.newCase")}
            </Button>
          </div>
        ) : (
          filteredCases.map((caseItem) => (
            <CaseCard key={caseItem.id} caseItem={caseItem} />
          ))
        )}
      </div>

      {/* Results count */}
      {filteredCases.length > 0 && (
        <p className="text-sm text-muted-foreground mt-4 text-center">
          {t("casesPage.showing", {
            shown: filteredCases.length,
            total: cases.length,
          })}
        </p>
      )}
    </Layout>
  );
}

// ==================== Sub-components ====================

function StatsCard({
  label,
  value,
  color,
  icon,
  active,
  onClick,
}: {
  label: string;
  value: number;
  color: string;
  icon?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-lg border text-center transition-all ${
        active ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:border-primary/50"
      }`}
    >
      <div className="flex items-center justify-center gap-1 mb-1">
        {icon}
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
    </button>
  );
}

function CaseCard({ caseItem }: { caseItem: DentalCase }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const progress = useMemo(() => {
    const completed = caseItem.workflow.filter(
      (s) => s.status === "completed" || s.status === "skipped"
    ).length;
    return Math.round((completed / caseItem.workflow.length) * 100);
  }, [caseItem.workflow]);

  const currentStage = caseItem.workflow[caseItem.currentStageIndex];

  const getCategoryLabel = () => {
    switch (caseItem.category) {
      case "fixed":
        return t("casesPage.fixedLabel");
      case "removable":
        return t("casesPage.removableLabel");
      case "orthodontics":
        return t("casesPage.orthoLabel");
    }
  };

  const getCategoryColor = () => {
    switch (caseItem.category) {
      case "fixed":
        return "bg-purple-100 text-purple-800";
      case "removable":
        return "bg-teal-100 text-teal-800";
      case "orthodontics":
        return "bg-pink-100 text-pink-800";
    }
  };

  const getMaterialLabel = () => {
    if (caseItem.category === "fixed" && caseItem.fixedMaterial) {
      return FIXED_MATERIAL_NAMES[caseItem.fixedMaterial];
    }
    if (caseItem.category === "removable" && caseItem.removableSubType) {
      return REMOVABLE_SUBTYPE_NAMES[caseItem.removableSubType];
    }
    if (caseItem.category === "orthodontics" && caseItem.orthodonticsType) {
      return ORTHODONTICS_TYPE_NAMES[caseItem.orthodonticsType];
    }
    return "";
  };

  const getPriorityColor = () => {
    switch (caseItem.priority) {
      case "emergency":
        return "bg-red-100 text-red-800";
      case "rush":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  const getProgressColor = () => {
    if (progress >= 90) return "bg-green-500";
    if (progress >= 60) return "bg-blue-500";
    if (progress >= 30) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div
      onClick={() => navigate(`/cases/${caseItem.id}`)}
      className={`bg-card border rounded-lg p-4 sm:p-5 cursor-pointer hover:shadow-md transition-all ${
        caseItem.isPaused ? "border-amber-300 bg-amber-50/30" : "border-border"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-foreground">{caseItem.id}</h3>
              <span className={`text-xs px-2 py-0.5 rounded font-medium ${getCategoryColor()}`}>
                {getCategoryLabel()}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded font-medium ${getPriorityColor()}`}>
                {caseItem.priority}
              </span>
              {caseItem.isPaused && (
                <span className="text-xs px-2 py-0.5 rounded font-medium bg-amber-100 text-amber-800 flex items-center gap-1">
                  <Pause className="w-3 h-3" />
                  {t("casesPage.paused")}
                </span>
              )}
              {caseItem.classification === "implant" && (
                <span className="text-xs px-2 py-0.5 rounded font-medium bg-blue-100 text-blue-800">
                  Implant
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {caseItem.doctorName} &bull; {caseItem.patientName}
              {caseItem.toothNumbers && caseItem.toothNumbers !== "-" && (
                <> &bull; {t("casesPage.tooth")}: {caseItem.toothNumbers}</>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {t("casesPage.due")}: {new Date(caseItem.dueDate).toLocaleDateString("ar-EG")}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/cases/${caseItem.id}`);
            }}
          >
            <Eye className="w-3.5 h-3.5 mr-1" />
            {t("casesPage.view")}
          </Button>
        </div>
      </div>

      {/* Material & Current Stage */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {getMaterialLabel() && (
          <span className="text-xs px-2 py-1 rounded bg-secondary text-foreground font-medium">
            {getMaterialLabel()}
          </span>
        )}
        {currentStage && (
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {t("casesPage.currentStage")}: {currentStage.stage}
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className={`h-full ${getProgressColor()} transition-all`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs font-semibold text-muted-foreground w-10 text-left">
          {progress}%
        </span>
      </div>
    </div>
  );
}
