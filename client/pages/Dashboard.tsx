import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
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

  const kpis: KPI[] = [
    { label: "Total Cases This Month", value: "156", change: 12, icon: BarChart3, color: "from-blue-500 to-blue-600" },
    { label: "On-Time Delivery Rate", value: "94%", change: 3, icon: CheckCircle, color: "from-green-500 to-green-600" },
    { label: "Average Turnaround", value: "3.2 days", change: -5, icon: Clock, color: "from-amber-500 to-amber-600" },
    { label: "Lab Utilization", value: "87%", change: 8, icon: Zap, color: "from-purple-500 to-purple-600" },
    { label: "Staff Efficiency", value: "91%", change: 2, icon: Users, color: "from-pink-500 to-pink-600" },
    { label: "QC Pass Rate", value: "97%", change: 1, icon: Target, color: "from-teal-500 to-teal-600" },
  ];

  const departmentStats = [
    { name: "Reception & Intake", cases: 15, efficiency: 94, team: 2, path: "/departments/reception" },
    { name: "CAD Design", cases: 18, efficiency: 88, team: 3, path: "/departments/cad-design" },
    { name: "CAM / Milling", cases: 20, efficiency: 92, team: 2, path: "/departments/cam-production" },
    { name: "Ceramic & Finishing", cases: 10, efficiency: 95, team: 2, path: "/departments/finishing" },
    { name: "Quality Control", cases: 6, efficiency: 97, team: 2, path: "/quality-control" },
    { name: "Logistics & Delivery", cases: 5, efficiency: 90, team: 2, path: "/departments/logistics" },
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Lab Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time overview of lab operations, KPIs, and performance metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/cases")}>
            <Eye className="w-4 h-4 mr-2" />
            View All Cases
          </Button>
          <Button onClick={() => setShowReport(true)}>
            <BarChart3 className="w-4 h-4 mr-2" />
            Daily Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {kpis.map((kpi, idx) => {
          const IconComponent = kpi.icon;
          const isPositive = kpi.change >= 0;

          return (
            <div key={idx} className="dlos-card hover:shadow-md transition-shadow cursor-default">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${kpi.color}`}>
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-semibold ${
                    isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {Math.abs(kpi.change)}%
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{kpi.label}</p>
              <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Department Performance */}
        <div className="lg:col-span-2">
          <div className="dlos-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground">Department Performance</h2>
              <Link to="/departments" className="text-sm text-primary hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3 h-3" />
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
                        {dept.cases} active &bull; {dept.team} staff
                      </p>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <p className="font-semibold text-primary text-sm">{dept.efficiency}%</p>
                        <p className="text-xs text-muted-foreground">Efficiency</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
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
        <div className="dlos-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-foreground">
              Alerts
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
              >
                Clear All
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
                <p className="text-sm text-muted-foreground">All caught up!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Cases & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Cases */}
        <div className="dlos-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-foreground">Recent Cases</h2>
            <Link to="/cases" className="text-sm text-primary hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
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
                <p className="text-xs text-muted-foreground mt-1">{caseItem.progress}% Complete</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <div className="dlos-card">
            <h3 className="text-lg font-bold text-foreground mb-4">Today's Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/cases" className="p-3 rounded-md hover:bg-secondary/50 transition-colors">
                <p className="text-3xl font-bold text-primary">18</p>
                <p className="text-sm text-muted-foreground">Cases Started</p>
              </Link>
              <Link to="/cases" className="p-3 rounded-md hover:bg-secondary/50 transition-colors">
                <p className="text-3xl font-bold text-accent">24</p>
                <p className="text-sm text-muted-foreground">Cases Completed</p>
              </Link>
              <Link to="/departments/logistics" className="p-3 rounded-md hover:bg-secondary/50 transition-colors">
                <p className="text-3xl font-bold text-green-600">8</p>
                <p className="text-sm text-muted-foreground">Delivered</p>
              </Link>
              <Link to="/quality-control" className="p-3 rounded-md hover:bg-secondary/50 transition-colors">
                <p className="text-3xl font-bold text-amber-600">2</p>
                <p className="text-sm text-muted-foreground">Needs Review</p>
              </Link>
            </div>
          </div>

          <div className="dlos-card">
            <h3 className="text-lg font-bold text-foreground mb-4">This Week</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Average TAT</span>
                <span className="font-semibold text-foreground">3.2 days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">On-Time Rate</span>
                <span className="font-semibold text-green-600">96%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">QC Pass Rate</span>
                <span className="font-semibold text-green-600">98%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Lab Utilization</span>
                <span className="font-semibold text-primary">89%</span>
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="dlos-card">
            <h3 className="text-lg font-bold text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link to="/cases">
                <Button variant="outline" className="w-full justify-start mb-2">
                  <FileText className="w-4 h-4 mr-2" />
                  Create New Case
                </Button>
              </Link>
              <Link to="/quality-control">
                <Button variant="outline" className="w-full justify-start mb-2">
                  <Target className="w-4 h-4 mr-2" />
                  QC Dashboard
                </Button>
              </Link>
              <Link to="/communication">
                <Button variant="outline" className="w-full justify-start mb-2">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Doctor Messages
                </Button>
              </Link>
              <Link to="/departments">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Departments
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
              <h2 className="text-xl font-bold text-foreground">Daily Lab Report</h2>
              <button onClick={() => setShowReport(false)} className="p-1 hover:bg-secondary rounded-md">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-3">Production Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-secondary/50 rounded-md">
                    <p className="text-2xl font-bold text-primary">18</p>
                    <p className="text-sm text-muted-foreground">Cases Started</p>
                  </div>
                  <div className="p-3 bg-secondary/50 rounded-md">
                    <p className="text-2xl font-bold text-green-600">24</p>
                    <p className="text-sm text-muted-foreground">Cases Completed</p>
                  </div>
                  <div className="p-3 bg-secondary/50 rounded-md">
                    <p className="text-2xl font-bold text-accent">8</p>
                    <p className="text-sm text-muted-foreground">Delivered</p>
                  </div>
                  <div className="p-3 bg-secondary/50 rounded-md">
                    <p className="text-2xl font-bold text-amber-600">2</p>
                    <p className="text-sm text-muted-foreground">Pending Review</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-3">Department Efficiency</h3>
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
                <h3 className="font-semibold text-foreground mb-3">Key Metrics</h3>
                <div className="space-y-2">
                  <div className="flex justify-between"><span className="text-sm text-muted-foreground">Average Turnaround Time</span><span className="font-semibold">3.2 days</span></div>
                  <div className="flex justify-between"><span className="text-sm text-muted-foreground">On-Time Delivery Rate</span><span className="font-semibold text-green-600">96%</span></div>
                  <div className="flex justify-between"><span className="text-sm text-muted-foreground">QC Pass Rate</span><span className="font-semibold text-green-600">98%</span></div>
                  <div className="flex justify-between"><span className="text-sm text-muted-foreground">Staff Utilization</span><span className="font-semibold">89%</span></div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-border justify-end">
              <Button variant="outline" onClick={() => setShowReport(false)}>Close</Button>
              <Button onClick={() => {
                // Simple print functionality
                window.print();
              }}>
                <BarChart3 className="w-4 h-4 mr-2" />
                Print Report
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
