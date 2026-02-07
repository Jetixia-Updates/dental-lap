import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Zap,
  BarChart3,
  Calendar,
  Target,
  ArrowRight,
  Eye,
  X,
  FileText,
} from "lucide-react";

interface KPI {
  label: string;
  value: string | number;
  change: number;
  icon: any;
  color: string;
}

interface RecentCase {
  id: string;
  caseId: string;
  doctor: string;
  type: string;
  status: string;
  progress: number;
}

interface Alert {
  id: number;
  type: "urgent" | "warning" | "info";
  message: string;
  dismissed: boolean;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const kpis: KPI[] = [
    { label: t("dashboard.totalCasesMonth"), value: "156", change: 12, icon: BarChart3, color: "from-blue-500 to-blue-600" },
    { label: t("dashboard.onTimeDelivery"), value: "94%", change: 3, icon: CheckCircle, color: "from-green-500 to-green-600" },
    { label: t("dashboard.avgTurnaround"), value: `3.2 ${t("dashboard.days")}`, change: -5, icon: Clock, color: "from-amber-500 to-amber-600" },
    { label: t("dashboard.labUtilization"), value: "87%", change: 8, icon: Zap, color: "from-purple-500 to-purple-600" },
    { label: t("dashboard.staffEfficiency"), value: "91%", change: 2, icon: Users, color: "from-pink-500 to-pink-600" },
    { label: t("dashboard.qcPassRate"), value: "97%", change: 1, icon: Target, color: "from-teal-500 to-teal-600" },
  ];

  const departmentStats = [
    { name: t("deptNames.receptionIntake"), cases: 15, efficiency: 94, team: 2, path: "/departments/reception" },
    { name: t("deptNames.cadDesign"), cases: 18, efficiency: 88, team: 3, path: "/departments/cad-design" },
    { name: t("deptNames.camMilling"), cases: 20, efficiency: 92, team: 2, path: "/departments/cam-production" },
    { name: t("deptNames.ceramicFinishing"), cases: 10, efficiency: 95, team: 2, path: "/departments/finishing" },
    { name: t("deptNames.qualityControl"), cases: 6, efficiency: 97, team: 2, path: "/quality-control" },
    { name: t("deptNames.logisticsDelivery"), cases: 5, efficiency: 90, team: 2, path: "/departments/logistics" },
  ];

  const [recentCases, setRecentCases] = useState<RecentCase[]>([
    { id: "1", caseId: "CASE-2024-001", doctor: "Dr. John Smith", type: "Zirconia Crown", status: "Design", progress: 60 },
    { id: "2", caseId: "CASE-2024-002", doctor: "Dr. Sarah Johnson", type: "E.max Bridge", status: "Production", progress: 75 },
    { id: "3", caseId: "CASE-2024-003", doctor: "Dr. James Wilson", type: "Implant Crown", status: "QC", progress: 90 },
    { id: "4", caseId: "CASE-2024-004", doctor: "Dr. Patricia Lee", type: "Veneer Set", status: "Intake", progress: 15 },
    { id: "5", caseId: "CASE-2024-005", doctor: "Dr. Michael Brown", type: "Zirconia Crown", status: "Delivery", progress: 100 },
    { id: "6", caseId: "CASE-2024-006", doctor: "Dr. Sarah Johnson", type: "Full Arch", status: "Planning", progress: 25 },
  ]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/cases");
        if (res.ok) {
          const data = await res.json();
          const mapped: RecentCase[] = data.slice(0, 6).map((c: any, idx: number) => ({
            id: c.id || String(idx),
            caseId: c.caseId || c.id,
            doctor: c.doctor || "Unknown",
            type: c.caseType || "Crown",
            status: (c.status || "intake").charAt(0).toUpperCase() + (c.status || "intake").slice(1),
            progress: c.progress ?? 50,
          }));
          if (mapped.length > 0) setRecentCases(mapped);
        }
      } catch (e) {
        // keep hardcoded
      }
    };
    load();
  }, []);

  const [alerts, setAlerts] = useState<Alert[]>([
    { id: 1, type: "urgent", message: "CASE-2024-007 needs approval - shade adjustment requested", dismissed: false },
    { id: 2, type: "warning", message: "Staff: James Park - Busy for 2+ hours", dismissed: false },
    { id: 3, type: "info", message: "Inventory alert: Zirconia discs low (3 remaining)", dismissed: false },
    { id: 4, type: "urgent", message: "CASE-2024-003 due tomorrow - still in QC", dismissed: false },
    { id: 5, type: "info", message: "Monthly report ready for download", dismissed: false },
  ]);

  const [showReport, setShowReport] = useState(false);

  const dismissAlert = (id: number) => {
    setAlerts(alerts.map((a) => (a.id === id ? { ...a, dismissed: true } : a)));
  };

  const activeAlerts = alerts.filter((a) => !a.dismissed);

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return "bg-green-500";
    if (progress >= 60) return "bg-blue-500";
    if (progress >= 30) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <Layout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{t("dashboard.title")}</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            {t("dashboard.subtitle")}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => navigate("/cases")} className="w-full sm:w-auto">
            <Eye className="w-4 h-4 mr-2" />
            {t("dashboard.viewAllCases")}
          </Button>
          <Button onClick={() => setShowReport(true)} className="w-full sm:w-auto">
            <BarChart3 className="w-4 h-4 mr-2" />
            {t("dashboard.dailyReport")}
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {kpis.map((kpi, idx) => {
          const IconComponent = kpi.icon;
          const isPositive = kpi.change >= 0;

          return (
            <div key={idx} className="bg-card border rounded-lg p-4 sm:p-5 hover:shadow-md transition-shadow cursor-default">
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className={`p-2 sm:p-3 rounded-lg bg-gradient-to-br ${kpi.color}`}>
                  <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div
                  className={`flex items-center gap-1 text-xs sm:text-sm font-semibold ${
                    isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isPositive ? <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" /> : <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />}
                  {Math.abs(kpi.change)}%
                </div>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">{kpi.label}</p>
              <p className="text-xl sm:text-2xl font-bold text-foreground">{kpi.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Department Performance */}
        <div className="lg:col-span-2">
          <div className="bg-card border rounded-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-lg font-bold text-foreground">{t("dashboard.departmentPerformance")}</h2>
              <Link to="/departments" className="text-sm text-primary hover:underline flex items-center gap-1">
                {t("common.viewAllLink")} <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-4">
              {departmentStats.map((dept, idx) => (
                <Link
                  key={idx}
                  to={dept.path}
                  className="block pb-4 border-b border-border last:border-b-0 last:pb-0 hover:bg-secondary/30 -mx-2 px-2 py-2 rounded-md transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-foreground text-sm">{dept.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {dept.cases} {t("common.active")} &bull; {dept.team} {t("common.staff")}
                      </p>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <p className="font-semibold text-primary text-sm">{dept.efficiency}%</p>
                        <p className="text-xs text-muted-foreground">{t("common.efficiency")}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground hidden sm:block" />
                    </div>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-accent transition-all" style={{ width: `${dept.efficiency}%` }} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="bg-card border rounded-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-lg font-bold text-foreground">
              {t("dashboard.alerts")}
              {activeAlerts.length > 0 && (
                <span className="ml-2 w-5 h-5 bg-red-600 text-white rounded-full text-xs inline-flex items-center justify-center">
                  {activeAlerts.length}
                </span>
              )}
            </h2>
            {activeAlerts.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setAlerts(alerts.map((a) => ({ ...a, dismissed: true })))}
                className="w-full sm:w-auto"
              >
                {t("common.clearAll")}
              </Button>
            )}
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {activeAlerts.length > 0 ? (
              activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-md border ${
                    alert.type === "urgent"
                      ? "bg-red-50 border-red-200"
                      : alert.type === "warning"
                      ? "bg-amber-50 border-amber-200"
                      : "bg-blue-50 border-blue-200"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {alert.type === "urgent" ? (
                      <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    ) : alert.type === "warning" ? (
                      <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    )}
                    <p
                      className={`text-sm flex-1 ${
                        alert.type === "urgent"
                          ? "text-red-800"
                          : alert.type === "warning"
                          ? "text-amber-800"
                          : "text-blue-800"
                      }`}
                    >
                      {alert.message}
                    </p>
                    <button
                      onClick={() => dismissAlert(alert.id)}
                      className="flex-shrink-0 p-0.5 hover:bg-black/10 rounded"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">{t("dashboard.allCaughtUp")}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Cases & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Cases */}
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-foreground">{t("dashboard.recentCases")}</h2>
            <Link to="/cases" className="text-sm text-primary hover:underline flex items-center gap-1">
              {t("common.viewAllLink")} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentCases.map((caseItem) => (
              <Link
                key={caseItem.id}
                to={`/cases/${caseItem.caseId}`}
                className="block pb-4 border-b border-border last:border-b-0 last:pb-0 hover:bg-secondary/30 -mx-2 px-2 py-2 rounded-md transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-foreground text-sm">{caseItem.caseId}</p>
                    <p className="text-xs text-muted-foreground">
                      {caseItem.doctor} &bull; {caseItem.type}
                    </p>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    {caseItem.status}
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getProgressColor(caseItem.progress)} transition-all`}
                    style={{ width: `${caseItem.progress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{caseItem.progress}% {t("common.complete")}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">{t("dashboard.todaySummary")}</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/cases" className="p-3 rounded-md hover:bg-secondary/50 transition-colors">
                <p className="text-3xl font-bold text-primary">18</p>
                <p className="text-sm text-muted-foreground">{t("dashboard.casesStarted")}</p>
              </Link>
              <Link to="/cases" className="p-3 rounded-md hover:bg-secondary/50 transition-colors">
                <p className="text-3xl font-bold text-accent">24</p>
                <p className="text-sm text-muted-foreground">{t("dashboard.casesCompleted")}</p>
              </Link>
              <Link to="/departments/logistics" className="p-3 rounded-md hover:bg-secondary/50 transition-colors">
                <p className="text-3xl font-bold text-green-600">8</p>
                <p className="text-sm text-muted-foreground">{t("dashboard.delivered")}</p>
              </Link>
              <Link to="/quality-control" className="p-3 rounded-md hover:bg-secondary/50 transition-colors">
                <p className="text-3xl font-bold text-amber-600">2</p>
                <p className="text-sm text-muted-foreground">{t("dashboard.needsReview")}</p>
              </Link>
            </div>
          </div>

          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">{t("dashboard.thisWeek")}</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t("dashboard.averageTAT")}</span>
                <span className="font-semibold text-foreground">3.2 {t("dashboard.days")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t("dashboard.onTimeRate")}</span>
                <span className="font-semibold text-green-600">96%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t("dashboard.qcPassRate")}</span>
                <span className="font-semibold text-green-600">98%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t("dashboard.labUtil")}</span>
                <span className="font-semibold text-primary">89%</span>
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">{t("dashboard.quickActions")}</h3>
            <div className="space-y-2">
              <Link to="/cases">
                <Button variant="outline" className="w-full justify-start mb-2">
                  <FileText className="w-4 h-4 mr-2" />
                  {t("dashboard.createNewCase")}
                </Button>
              </Link>
              <Link to="/quality-control">
                <Button variant="outline" className="w-full justify-start mb-2">
                  <Target className="w-4 h-4 mr-2" />
                  {t("dashboard.qcDashboard")}
                </Button>
              </Link>
              <Link to="/communication">
                <Button variant="outline" className="w-full justify-start mb-2">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {t("dashboard.doctorMessages")}
                </Button>
              </Link>
              <Link to="/departments">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  {t("nav.departments")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Report Dialog */}
      {showReport && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border border-border shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">{t("dashboard.dailyLabReport")}</h2>
              <button onClick={() => setShowReport(false)} className="p-1 hover:bg-secondary rounded-md">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-3">{t("dashboard.productionSummary")}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-secondary/50 rounded-md">
                    <p className="text-2xl font-bold text-primary">18</p>
                    <p className="text-sm text-muted-foreground">{t("dashboard.casesStarted")}</p>
                  </div>
                  <div className="p-3 bg-secondary/50 rounded-md">
                    <p className="text-2xl font-bold text-green-600">24</p>
                    <p className="text-sm text-muted-foreground">{t("dashboard.casesCompleted")}</p>
                  </div>
                  <div className="p-3 bg-secondary/50 rounded-md">
                    <p className="text-2xl font-bold text-accent">8</p>
                    <p className="text-sm text-muted-foreground">{t("dashboard.delivered")}</p>
                  </div>
                  <div className="p-3 bg-secondary/50 rounded-md">
                    <p className="text-2xl font-bold text-amber-600">2</p>
                    <p className="text-sm text-muted-foreground">{t("dashboard.pendingReview")}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-3">{t("dashboard.departmentEfficiency")}</h3>
                <div className="space-y-3">
                  {departmentStats.map((dept, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm text-foreground">{dept.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-accent" style={{ width: `${dept.efficiency}%` }} />
                        </div>
                        <span className="text-sm font-semibold text-foreground w-10 text-right">{dept.efficiency}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-3">{t("dashboard.keyMetrics")}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between"><span className="text-sm text-muted-foreground">{t("dashboard.avgTurnaroundTime")}</span><span className="font-semibold">3.2 {t("dashboard.days")}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-muted-foreground">{t("dashboard.onTimeDeliveryRate")}</span><span className="font-semibold text-green-600">96%</span></div>
                  <div className="flex justify-between"><span className="text-sm text-muted-foreground">{t("dashboard.qcPassRate")}</span><span className="font-semibold text-green-600">98%</span></div>
                  <div className="flex justify-between"><span className="text-sm text-muted-foreground">{t("dashboard.staffUtilization")}</span><span className="font-semibold">89%</span></div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-border justify-end">
              <Button variant="outline" onClick={() => setShowReport(false)}>{t("common.close")}</Button>
              <Button onClick={() => {
                // Simple print functionality
                window.print();
              }}>
                <BarChart3 className="w-4 h-4 mr-2" />
                {t("dashboard.printReport")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
