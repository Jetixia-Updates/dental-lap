import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  ClipboardList,
  Microscope,
  Printer,
  Shield,
  PhoneCall,
  DollarSign,
  Boxes,
  ArrowRight,
  Beaker,
  Gauge,
  FileText,
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
  icon: any;
  color: string;
  staff: DepartmentStaff[];
  activeCases: number;
  completedToday: number;
  efficiency: number;
  path: string;
}

const departmentsData: Department[] = [
  {
    id: 1,
    name: "Reception & Case Intake",
    description: "Validate prescriptions and register cases",
    icon: ClipboardList,
    color: "from-blue-500 to-blue-600",
    staff: [
      { id: "1", name: "Sarah Thompson", role: "Intake Coordinator", status: "available" },
      { id: "2", name: "Mike Chen", role: "Reception Manager", status: "available" },
    ],
    activeCases: 15,
    completedToday: 12,
    efficiency: 94,
    path: "/departments/reception",
  },
  {
    id: 2,
    name: "Case Planning & Prescription",
    description: "Prescription analysis and case strategy",
    icon: FileText,
    color: "from-cyan-500 to-cyan-600",
    staff: [
      { id: "3", name: "Dr. Lisa Rodriguez", role: "Lab Director", status: "available" },
      { id: "4", name: "James Park", role: "Case Planner", status: "busy" },
    ],
    activeCases: 8,
    completedToday: 6,
    efficiency: 89,
    path: "/departments/case-planning",
  },
  {
    id: 3,
    name: "Model & Scan Department",
    description: "Physical and digital scanning",
    icon: Microscope,
    color: "from-teal-500 to-teal-600",
    staff: [
      { id: "5", name: "Emily Watson", role: "Scanner Technician", status: "busy" },
      { id: "6", name: "David Lee", role: "Model Technician", status: "available" },
    ],
    activeCases: 12,
    completedToday: 10,
    efficiency: 91,
    path: "/departments/model-scan",
  },
  {
    id: 4,
    name: "CAD Design Department",
    description: "Advanced digital design workflows",
    icon: Beaker,
    color: "from-emerald-500 to-emerald-600",
    staff: [
      { id: "7", name: "Alex Morrison", role: "CAD Designer Lead", status: "busy" },
      { id: "8", name: "Sophie Johnson", role: "CAD Designer", status: "available" },
      { id: "9", name: "Tom Bradley", role: "CAD Designer", status: "available" },
    ],
    activeCases: 18,
    completedToday: 14,
    efficiency: 88,
    path: "/departments/cad-design",
  },
  {
    id: 5,
    name: "CAM / Milling / 3D Printing",
    description: "Milling and 3D printing production",
    icon: Printer,
    color: "from-green-500 to-green-600",
    staff: [
      { id: "10", name: "Marcus Steel", role: "Milling Technician", status: "busy" },
      { id: "11", name: "Rachel Price", role: "3D Print Operator", status: "busy" },
    ],
    activeCases: 20,
    completedToday: 16,
    efficiency: 92,
    path: "/departments/cam-production",
  },
  {
    id: 6,
    name: "Ceramic & Finishing",
    description: "Material finishing and customization",
    icon: Gauge,
    color: "from-lime-500 to-lime-600",
    staff: [
      { id: "12", name: "Leonardo Rossi", role: "Master Ceramist", status: "busy" },
      { id: "13", name: "Nina Hassan", role: "Finishing Tech", status: "available" },
    ],
    activeCases: 10,
    completedToday: 9,
    efficiency: 95,
    path: "/departments/finishing",
  },
  {
    id: 7,
    name: "Quality Control & Verification",
    description: "Fit verification and inspection",
    icon: Shield,
    color: "from-amber-500 to-amber-600",
    staff: [
      { id: "14", name: "Dr. Robert Hammond", role: "QC Director", status: "available" },
      { id: "15", name: "Jennifer Cross", role: "QC Technician", status: "busy" },
    ],
    activeCases: 6,
    completedToday: 11,
    efficiency: 97,
    path: "/quality-control",
  },
  {
    id: 8,
    name: "Logistics & Delivery",
    description: "Documentation and case shipping",
    icon: Boxes,
    color: "from-orange-500 to-orange-600",
    staff: [
      { id: "16", name: "Kevin Martin", role: "Logistics Manager", status: "available" },
      { id: "17", name: "Lisa Anderson", role: "Shipping Coordinator", status: "available" },
    ],
    activeCases: 5,
    completedToday: 12,
    efficiency: 90,
    path: "/departments/logistics",
  },
  {
    id: 9,
    name: "Doctor Communication",
    description: "Feedback and relationship management",
    icon: PhoneCall,
    color: "from-red-500 to-red-600",
    staff: [
      { id: "18", name: "Patricia Moore", role: "Communication Manager", status: "available" },
    ],
    activeCases: 8,
    completedToday: 7,
    efficiency: 88,
    path: "/communication",
  },
  {
    id: 10,
    name: "Inventory & Materials",
    description: "Material and supply tracking",
    icon: Boxes,
    color: "from-pink-500 to-pink-600",
    staff: [
      { id: "19", name: "Carlos Garcia", role: "Inventory Manager", status: "available" },
      { id: "20", name: "Yuki Tanaka", role: "Supply Coordinator", status: "busy" },
    ],
    activeCases: 0,
    completedToday: 0,
    efficiency: 87,
    path: "/departments/inventory",
  },
  {
    id: 11,
    name: "Financial & Costing",
    description: "Case costing and analytics",
    icon: DollarSign,
    color: "from-purple-500 to-purple-600",
    staff: [
      { id: "21", name: "Michael Torres", role: "Finance Manager", status: "available" },
    ],
    activeCases: 0,
    completedToday: 0,
    efficiency: 92,
    path: "/departments/financial",
  },
  {
    id: 12,
    name: "Continuous Improvement",
    description: "Error analysis and optimization",
    icon: TrendingUp,
    color: "from-indigo-500 to-indigo-600",
    staff: [
      { id: "22", name: "Dr. Amanda Foster", role: "Quality Director", status: "available" },
    ],
    activeCases: 0,
    completedToday: 0,
    efficiency: 91,
    path: "/departments/continuous-improvement",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "available": return "bg-green-100 text-green-800";
    case "busy": return "bg-amber-100 text-amber-800";
    case "offline": return "bg-gray-100 text-gray-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getStatusDot = (status: string) => {
  switch (status) {
    case "available": return "w-2 h-2 bg-green-500 rounded-full";
    case "busy": return "w-2 h-2 bg-amber-500 rounded-full";
    case "offline": return "w-2 h-2 bg-gray-500 rounded-full";
    default: return "w-2 h-2 bg-gray-500 rounded-full";
  }
};

export default function Departments() {
  const [selectedDept, setSelectedDept] = useState<number | null>(null);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [departments, setDepartments] = useState(departmentsData);
  const [newStaff, setNewStaff] = useState({ name: "", role: "", status: "available" as DepartmentStaff["status"] });

  const selectedDepartment = departments.find((d) => d.id === selectedDept);

  const handleAddStaff = () => {
    if (!selectedDept || !newStaff.name.trim() || !newStaff.role.trim()) return;
    setDepartments(
      departments.map((d) =>
        d.id === selectedDept
          ? {
              ...d,
              staff: [
                ...d.staff,
                { id: Date.now().toString(), name: newStaff.name, role: newStaff.role, status: newStaff.status },
              ],
            }
          : d
      )
    );
    setNewStaff({ name: "", role: "", status: "available" });
    setShowAddStaff(false);
  };

  const handleRemoveStaff = (deptId: number, staffId: string) => {
    setDepartments(
      departments.map((d) =>
        d.id === deptId
          ? { ...d, staff: d.staff.filter((s) => s.id !== staffId) }
          : d
      )
    );
  };

  const handleToggleStatus = (deptId: number, staffId: string) => {
    const statusOrder: DepartmentStaff["status"][] = ["available", "busy", "offline"];
    setDepartments(
      departments.map((d) =>
        d.id === deptId
          ? {
              ...d,
              staff: d.staff.map((s) =>
                s.id === staffId
                  ? { ...s, status: statusOrder[(statusOrder.indexOf(s.status) + 1) % 3] }
                  : s
              ),
            }
          : d
      )
    );
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Departments Management</h1>
        <p className="text-muted-foreground">
          Manage all 12 departments, team assignments, and department-level performance
        </p>
      </div>

      {/* Department Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {departments.map((dept) => {
              const IconComponent = dept.icon;
              const isSelected = selectedDept === dept.id;
              return (
                <div
                  key={dept.id}
                  className={`dlos-card transition-all duration-300 ${
                    isSelected ? "ring-2 ring-primary border-primary shadow-lg" : "hover:shadow-md"
                  }`}
                >
                  <button
                    onClick={() => setSelectedDept(dept.id)}
                    className="text-left w-full"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${dept.color}`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded">
                        Dept {dept.id}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground mb-1 text-sm">{dept.name}</h3>
                    <p className="text-xs text-muted-foreground mb-4">{dept.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-4">
                        <div>
                          <span className="font-semibold text-foreground">{dept.activeCases}</span>
                          <p className="text-muted-foreground">Active</p>
                        </div>
                        <div>
                          <span className="font-semibold text-foreground">{dept.efficiency}%</span>
                          <p className="text-muted-foreground">Efficiency</p>
                        </div>
                        <div>
                          <span className="font-semibold text-foreground">{dept.staff.length}</span>
                          <p className="text-muted-foreground">Staff</p>
                        </div>
                      </div>
                    </div>
                  </button>
                  <div className="mt-3 pt-3 border-t border-border">
                    <Link
                      to={dept.path}
                      className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
                    >
                      Open Department <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Department Detail Panel */}
        <div className="lg:col-span-1">
          {selectedDepartment ? (
            <div className="dlos-card h-full sticky top-4">
              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-lg font-bold text-foreground flex-1">{selectedDepartment.name}</h2>
              </div>

              <div className="space-y-6">
                {/* Stats */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Active Cases</span>
                    <span className="font-semibold text-primary">{selectedDepartment.activeCases}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Completed Today</span>
                    <span className="font-semibold text-accent">{selectedDepartment.completedToday}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Efficiency</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-accent" style={{ width: `${selectedDepartment.efficiency}%` }} />
                      </div>
                      <span className="font-semibold text-foreground text-sm">{selectedDepartment.efficiency}%</span>
                    </div>
                  </div>
                </div>

                {/* Team */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3 text-sm">
                    Team Members ({selectedDepartment.staff.length})
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {selectedDepartment.staff.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-start gap-3 p-2 rounded-md hover:bg-secondary/50 transition-colors group"
                      >
                        <button
                          onClick={() => handleToggleStatus(selectedDepartment.id, member.id)}
                          className={`mt-1 ${getStatusDot(member.status)} cursor-pointer hover:ring-2 hover:ring-primary`}
                          title="Click to toggle status"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{member.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{member.role}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${getStatusColor(member.status)}`}>
                          {member.status}
                        </span>
                        <button
                          onClick={() => handleRemoveStaff(selectedDepartment.id, member.id)}
                          className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-red-100 rounded transition-opacity"
                        >
                          <X className="w-3 h-3 text-red-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full" size="sm" onClick={() => setShowAddStaff(true)}>
                  <Plus className="w-3 h-3 mr-2" />
                  Add Staff Member
                </Button>

                <Link to={selectedDepartment.path}>
                  <Button variant="outline" className="w-full" size="sm">
                    <ArrowRight className="w-3 h-3 mr-2" />
                    Go to Department Page
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="dlos-card h-64 flex items-center justify-center sticky top-4">
              <div className="text-center">
                <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Select a department to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="dlos-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Total Staff</h3>
          </div>
          <p className="text-3xl font-bold text-primary">
            {departments.reduce((sum, d) => sum + d.staff.length, 0)}
          </p>
          <p className="text-sm text-muted-foreground mt-2">Across all departments</p>
        </div>

        <div className="dlos-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-semibold text-foreground">Avg Efficiency</h3>
          </div>
          <p className="text-3xl font-bold text-accent">
            {(departments.reduce((sum, d) => sum + d.efficiency, 0) / departments.length).toFixed(0)}%
          </p>
          <p className="text-sm text-muted-foreground mt-2">Lab-wide performance</p>
        </div>

        <div className="dlos-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-foreground">Total Active Cases</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">
            {departments.reduce((sum, d) => sum + d.activeCases, 0)}
          </p>
          <p className="text-sm text-muted-foreground mt-2">Across all departments</p>
        </div>
      </div>

      {/* Add Staff Dialog */}
      {showAddStaff && selectedDepartment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border border-border shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">Add Staff to {selectedDepartment.name}</h2>
              <button onClick={() => setShowAddStaff(false)} className="p-1 hover:bg-secondary rounded-md">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Name *</label>
                <input
                  type="text"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  placeholder="Full name"
                  className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Role *</label>
                <input
                  type="text"
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                  placeholder="e.g. CAD Designer, Technician"
                  className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Status</label>
                <select
                  value={newStaff.status}
                  onChange={(e) => setNewStaff({ ...newStaff, status: e.target.value as DepartmentStaff["status"] })}
                  className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="available">Available</option>
                  <option value="busy">Busy</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-border justify-end">
              <Button variant="outline" onClick={() => setShowAddStaff(false)}>Cancel</Button>
              <Button onClick={handleAddStaff} disabled={!newStaff.name.trim() || !newStaff.role.trim()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Staff
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
