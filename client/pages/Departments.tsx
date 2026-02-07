import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  ClipboardList,
  FileText,
  ScanLine,
  PenTool,
  Factory,
  Sparkles,
  Truck,
  Package,
  DollarSign,
  TrendingUp,
  Users,
  Briefcase,
  Search,
  Plus,
  ArrowRight,
  X,
} from "lucide-react";

interface DepartmentStaff {
  id: string;
  name: string;
  role: string;
  status: "available" | "busy" | "offline";
}

interface Department {
  id: number;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  staff: DepartmentStaff[];
  activeCases: number;
  path: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "available":
      return "bg-green-100 text-green-800";
    case "busy":
      return "bg-amber-100 text-amber-800";
    case "offline":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusDot = (status: string) => {
  switch (status) {
    case "available":
      return "w-2 h-2 bg-green-500 rounded-full";
    case "busy":
      return "w-2 h-2 bg-amber-500 rounded-full";
    case "offline":
      return "w-2 h-2 bg-gray-400 rounded-full";
    default:
      return "w-2 h-2 bg-gray-400 rounded-full";
  }
};

export default function Departments() {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const departmentsData: Department[] = [
    {
      id: 1,
      name: t("deptPages.reception.title"),
      description: t("deptPages.reception.subtitle"),
      icon: ClipboardList,
      color: "from-blue-500 to-blue-600",
      staff: [
        { id: "1", name: "Sarah Thompson", role: "Intake Coordinator", status: "available" },
        { id: "2", name: "Mike Chen", role: "Reception Manager", status: "available" },
        { id: "3", name: "Laura Kim", role: "Front Desk", status: "busy" },
      ],
      activeCases: 15,
      path: "/departments/reception",
    },
    {
      id: 2,
      name: t("deptPages.casePlanning.title"),
      description: t("deptPages.casePlanning.subtitle"),
      icon: FileText,
      color: "from-cyan-500 to-cyan-600",
      staff: [
        { id: "4", name: "Dr. Lisa Rodriguez", role: "Lab Director", status: "available" },
        { id: "5", name: "James Park", role: "Case Planner", status: "busy" },
      ],
      activeCases: 8,
      path: "/departments/case-planning",
    },
    {
      id: 3,
      name: t("deptPages.modelScan.title"),
      description: t("deptPages.modelScan.subtitle"),
      icon: ScanLine,
      color: "from-teal-500 to-teal-600",
      staff: [
        { id: "6", name: "Emily Watson", role: "Scanner Technician", status: "busy" },
        { id: "7", name: "David Lee", role: "Model Technician", status: "available" },
      ],
      activeCases: 12,
      path: "/departments/model-scan",
    },
    {
      id: 4,
      name: t("deptPages.cadDesign.title"),
      description: t("deptPages.cadDesign.subtitle"),
      icon: PenTool,
      color: "from-emerald-500 to-emerald-600",
      staff: [
        { id: "8", name: "Alex Morrison", role: "CAD Designer Lead", status: "busy" },
        { id: "9", name: "Sophie Johnson", role: "CAD Designer", status: "available" },
        { id: "10", name: "Tom Bradley", role: "CAD Designer", status: "available" },
      ],
      activeCases: 18,
      path: "/departments/cad-design",
    },
    {
      id: 5,
      name: t("deptPages.camProduction.title"),
      description: t("deptPages.camProduction.subtitle"),
      icon: Factory,
      color: "from-green-500 to-green-600",
      staff: [
        { id: "11", name: "Marcus Steel", role: "Milling Technician", status: "busy" },
        { id: "12", name: "Rachel Price", role: "3D Print Operator", status: "busy" },
      ],
      activeCases: 20,
      path: "/departments/cam-production",
    },
    {
      id: 6,
      name: t("deptPages.finishing.title"),
      description: t("deptPages.finishing.subtitle"),
      icon: Sparkles,
      color: "from-amber-500 to-amber-600",
      staff: [
        { id: "13", name: "Leonardo Rossi", role: "Master Ceramist", status: "busy" },
        { id: "14", name: "Nina Hassan", role: "Finishing Technician", status: "available" },
      ],
      activeCases: 10,
      path: "/departments/finishing",
    },
    {
      id: 7,
      name: t("deptPages.logistics.title"),
      description: t("deptPages.logistics.subtitle"),
      icon: Truck,
      color: "from-orange-500 to-orange-600",
      staff: [
        { id: "15", name: "Kevin Martin", role: "Logistics Manager", status: "available" },
        { id: "16", name: "Lisa Anderson", role: "Shipping Coordinator", status: "available" },
      ],
      activeCases: 5,
      path: "/departments/logistics",
    },
    {
      id: 8,
      name: t("deptPages.inventory.title"),
      description: t("deptPages.inventory.subtitle"),
      icon: Package,
      color: "from-pink-500 to-pink-600",
      staff: [
        { id: "17", name: "Carlos Garcia", role: "Inventory Manager", status: "available" },
        { id: "18", name: "Yuki Tanaka", role: "Supply Coordinator", status: "busy" },
      ],
      activeCases: 3,
      path: "/departments/inventory",
    },
    {
      id: 9,
      name: t("deptPages.financial.title"),
      description: t("deptPages.financial.subtitle"),
      icon: DollarSign,
      color: "from-purple-500 to-purple-600",
      staff: [
        { id: "19", name: "Michael Torres", role: "Finance Manager", status: "available" },
        { id: "20", name: "Angela White", role: "Billing Specialist", status: "available" },
      ],
      activeCases: 4,
      path: "/departments/financial",
    },
    {
      id: 10,
      name: t("deptPages.continuousImprovement.title"),
      description: t("deptPages.continuousImprovement.subtitle"),
      icon: TrendingUp,
      color: "from-indigo-500 to-indigo-600",
      staff: [
        { id: "21", name: "Dr. Amanda Foster", role: "Quality Director", status: "available" },
        { id: "22", name: "Ryan Patel", role: "Process Analyst", status: "busy" },
      ],
      activeCases: 2,
      path: "/departments/continuous-improvement",
    },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState<number | null>(null);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [departments, setDepartments] = useState<Department[]>(departmentsData);
  const [newStaff, setNewStaff] = useState({
    name: "",
    role: "",
    status: "available" as DepartmentStaff["status"],
  });

  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const selectedDepartment = departments.find((d) => d.id === selectedDept);

  const totalStaff = departments.reduce((sum, d) => sum + d.staff.length, 0);
  const totalActiveCases = departments.reduce((sum, d) => sum + d.activeCases, 0);
  const totalDepartments = departments.length;

  const handleAddStaff = () => {
    if (!selectedDept || !newStaff.name.trim() || !newStaff.role.trim()) return;
    setDepartments(
      departments.map((d) =>
        d.id === selectedDept
          ? {
              ...d,
              staff: [
                ...d.staff,
                {
                  id: Date.now().toString(),
                  name: newStaff.name,
                  role: newStaff.role,
                  status: newStaff.status,
                },
              ],
            }
          : d,
      ),
    );
    setNewStaff({ name: "", role: "", status: "available" });
    setShowAddStaff(false);
  };

  const handleRemoveStaff = (deptId: number, staffId: string) => {
    setDepartments(
      departments.map((d) =>
        d.id === deptId
          ? { ...d, staff: d.staff.filter((s) => s.id !== staffId) }
          : d,
      ),
    );
  };

  const handleToggleStatus = (deptId: number, staffId: string) => {
    const statusOrder: DepartmentStaff["status"][] = [
      "available",
      "busy",
      "offline",
    ];
    setDepartments(
      departments.map((d) =>
        d.id === deptId
          ? {
              ...d,
              staff: d.staff.map((s) =>
                s.id === staffId
                  ? {
                      ...s,
                      status:
                        statusOrder[
                          (statusOrder.indexOf(s.status) + 1) % 3
                        ],
                    }
                  : s,
              ),
            }
          : d,
      ),
    );
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {t("departments.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("departments.subtitle", { count: totalDepartments })}
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border rounded-lg p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t("departments.totalStaff")}</p>
            <p className="text-2xl font-bold text-foreground">{totalStaff}</p>
          </div>
        </div>
        <div className="bg-card border rounded-lg p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-accent" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t("departments.activeCases")}</p>
            <p className="text-2xl font-bold text-foreground">
              {totalActiveCases}
            </p>
          </div>
        </div>
        <div className="bg-card border rounded-lg p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
            <ClipboardList className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t("nav.departments")}</p>
            <p className="text-2xl font-bold text-foreground">
              {totalDepartments}
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder={t("departments.searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
        />
      </div>

      {/* Department Grid + Detail Panel */}
      <div className={`grid grid-cols-1 ${isMobile ? '' : 'lg:grid-cols-3'} gap-6 mb-8`}>
        <div className={`${isMobile ? (selectedDept ? 'hidden' : 'col-span-1') : 'lg:col-span-2'}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDepartments.map((dept) => {
              const IconComponent = dept.icon;
              const isSelected = selectedDept === dept.id;
              return (
                <div
                  key={dept.id}
                  className={`bg-card border rounded-lg p-4 sm:p-5 cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "ring-2 ring-primary border-primary shadow-lg"
                      : "hover:shadow-md hover:-translate-y-0.5"
                  }`}
                  onClick={() => setSelectedDept(dept.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`inline-flex p-2.5 rounded-lg bg-gradient-to-br ${dept.color}`}
                    >
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded">
                      {dept.staff.length} {t("common.staff")}
                    </span>
                  </div>

                  <h3 className="font-semibold text-foreground mb-1 text-sm">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                    {dept.description}
                  </p>

                  <div className="flex items-center justify-between text-xs mb-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="font-semibold text-foreground">
                          {dept.staff.length}
                        </span>
                        <p className="text-muted-foreground">{t("common.staff")}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-foreground">
                          {dept.activeCases}
                        </span>
                        <p className="text-muted-foreground">{t("common.active")}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border">
                    <Link
                      to={dept.path}
                      className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {t("departments.openDepartment")} <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}

            {filteredDepartments.length === 0 && (
              <div className="col-span-full bg-card border rounded-lg flex flex-col items-center justify-center py-12 text-center">
                <Search className="w-10 h-10 text-muted-foreground mb-3" />
                <p className="text-muted-foreground font-medium">
                  {t("departments.noMatch", { query: searchQuery })}
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-primary text-sm mt-2 hover:underline"
                >
                  {t("common.clearSearch")}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Department Detail Panel */}
        <div className={`${isMobile ? (selectedDept ? 'col-span-1' : 'hidden') : 'lg:col-span-1'}`}>
          {isMobile && selectedDepartment && (
            <Button 
              variant="outline" 
              onClick={() => setSelectedDept(null)}
              className="mb-4 w-full"
            >
              ← {t("common.back")}
            </Button>
          )}
          {selectedDepartment ? (
            <div className="bg-card border rounded-lg p-4 sm:p-6 sticky top-20">
              <div className="flex items-center gap-3 mb-6">
                <div
                  className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${selectedDepartment.color}`}
                >
                  <selectedDepartment.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-bold text-foreground truncate">
                    {selectedDepartment.name}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {selectedDepartment.description}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-secondary p-3 text-center">
                    <p className="text-xl font-bold text-primary">
                      {selectedDepartment.staff.length}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("departments.staffMembers")}
                    </p>
                  </div>
                  <div className="rounded-lg bg-secondary p-3 text-center">
                    <p className="text-xl font-bold text-accent">
                      {selectedDepartment.activeCases}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("departments.activeCases")}
                    </p>
                  </div>
                </div>

                {/* Team Members */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3 text-sm">
                    {t("departments.teamMembers", { count: selectedDepartment.staff.length })}
                  </h3>
                  <div className="space-y-2 max-h-56 overflow-y-auto">
                    {selectedDepartment.staff.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-start gap-3 p-2 rounded-md hover:bg-secondary/50 transition-colors group"
                      >
                        <button
                          onClick={() =>
                            handleToggleStatus(
                              selectedDepartment.id,
                              member.id,
                            )
                          }
                          className={`mt-1.5 ${getStatusDot(member.status)} cursor-pointer hover:ring-2 hover:ring-primary`}
                          title="Click to toggle status"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {member.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {member.role}
                          </p>
                        </div>
                        <span
                          className={`text-xs px-2 py-0.5 rounded whitespace-nowrap ${getStatusColor(member.status)}`}
                        >
                          {member.status === "available" ? t("common.available") : member.status === "busy" ? t("common.busy") : t("common.offline")}
                        </span>
                        <button
                          onClick={() =>
                            handleRemoveStaff(
                              selectedDepartment.id,
                              member.id,
                            )
                          }
                          className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-red-100 rounded transition-opacity"
                        >
                          <X className="w-3 h-3 text-red-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Button
                    className="w-full"
                    size="sm"
                    onClick={() => setShowAddStaff(true)}
                  >
                    <Plus className="w-3 h-3 mr-2" />
                    {t("departments.addStaffMember")}
                  </Button>

                  <Link to={selectedDepartment.path}>
                    <Button variant="outline" className="w-full" size="sm">
                      <ArrowRight className="w-3 h-3 mr-2" />
                      {t("departments.goToDeptPage")}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            !isMobile && (
              <div className="bg-card border rounded-lg h-64 flex items-center justify-center sticky top-20">
                <div className="text-center">
                  <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">
                    {t("departments.selectDept")}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Add Staff Dialog */}
      {showAddStaff && selectedDepartment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border border-border shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">
                {t("departments.addStaffTo", { name: selectedDepartment.name })}
              </h2>
              <button
                onClick={() => setShowAddStaff(false)}
                className="p-1 hover:bg-secondary rounded-md"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {t("common.name")} *
                </label>
                <input
                  type="text"
                  value={newStaff.name}
                  onChange={(e) =>
                    setNewStaff({ ...newStaff, name: e.target.value })
                  }
                  placeholder={t("departments.fullName")}
                  className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {t("common.role")} *
                </label>
                <input
                  type="text"
                  value={newStaff.role}
                  onChange={(e) =>
                    setNewStaff({ ...newStaff, role: e.target.value })
                  }
                  placeholder={t("departments.rolePlaceholder")}
                  className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {t("common.status")}
                </label>
                <select
                  value={newStaff.status}
                  onChange={(e) =>
                    setNewStaff({
                      ...newStaff,
                      status: e.target.value as DepartmentStaff["status"],
                    })
                  }
                  className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="available">{t("common.available")}</option>
                  <option value="busy">{t("common.busy")}</option>
                  <option value="offline">{t("common.offline")}</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-border justify-end">
              <Button
                variant="outline"
                onClick={() => setShowAddStaff(false)}
              >
                {t("common.cancel")}
              </Button>
              <Button
                onClick={handleAddStaff}
                disabled={
                  !newStaff.name.trim() || !newStaff.role.trim()
                }
              >
                <Plus className="w-4 h-4 mr-2" />
                {t("departments.addStaff")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
