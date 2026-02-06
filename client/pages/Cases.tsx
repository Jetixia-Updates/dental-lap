import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  X,
  ArrowUpDown,
  Download,
} from "lucide-react";

interface Case {
  id: string;
  caseId: string;
  doctor: string;
  patientName: string;
  caseType: string;
  material: string;
  shade: string;
  tooth: string;
  status: "intake" | "planning" | "design" | "production" | "qc" | "delivery";
  priority: "low" | "medium" | "high";
  dueDate: string;
  dateCreated: string;
  notes: string;
}

const statusConfig = {
  intake: { label: "Intake", color: "bg-blue-100 text-blue-800", icon: AlertCircle },
  planning: { label: "Planning", color: "bg-cyan-100 text-cyan-800", icon: Clock },
  design: { label: "Design", color: "bg-purple-100 text-purple-800", icon: Clock },
  production: { label: "Production", color: "bg-amber-100 text-amber-800", icon: TrendingUp },
  qc: { label: "QC", color: "bg-orange-100 text-orange-800", icon: Eye },
  delivery: { label: "Ready for Delivery", color: "bg-green-100 text-green-800", icon: CheckCircle },
};

const priorityConfig = {
  low: { label: "Low", color: "bg-green-100 text-green-800" },
  medium: { label: "Medium", color: "bg-amber-100 text-amber-800" },
  high: { label: "High", color: "bg-red-100 text-red-800" },
};

const caseTypes = [
  "Zirconia Crown",
  "E.max Crown",
  "PFM Crown",
  "E.max Bridge",
  "Zirconia Bridge",
  "Implant Crown",
  "Veneer Set",
  "Inlay/Onlay",
  "Full Arch",
  "Removable Partial",
  "Complete Denture",
];

const materials = ["Zirconia", "E.max", "PFM", "Composite", "Acrylic", "Gold", "Titanium"];
const shades = ["A1", "A2", "A3", "A3.5", "A4", "B1", "B2", "B3", "B4", "C1", "C2", "C3", "C4", "D2", "D3", "D4", "BL1", "BL2", "BL3", "BL4"];

const initialCases: Case[] = [
  {
    id: "1",
    caseId: "CASE-2024-001",
    doctor: "Dr. John Smith",
    patientName: "Jane Doe",
    caseType: "Zirconia Crown",
    material: "Zirconia",
    shade: "A2",
    tooth: "#14",
    status: "design",
    priority: "high",
    dueDate: "2024-02-15",
    dateCreated: "2024-02-08",
    notes: "Patient has high smile line. Ensure natural emergence profile.",
  },
  {
    id: "2",
    caseId: "CASE-2024-002",
    doctor: "Dr. Sarah Johnson",
    patientName: "Michael Brown",
    caseType: "E.max Bridge",
    material: "E.max",
    shade: "A3",
    tooth: "#35-37",
    status: "production",
    priority: "medium",
    dueDate: "2024-02-20",
    dateCreated: "2024-02-06",
    notes: "Bridge replacing #36. Check pontic design for hygiene access.",
  },
  {
    id: "3",
    caseId: "CASE-2024-003",
    doctor: "Dr. James Wilson",
    patientName: "Emily Garcia",
    caseType: "Implant Crown",
    material: "Zirconia",
    shade: "B1",
    tooth: "#11",
    status: "qc",
    priority: "high",
    dueDate: "2024-02-12",
    dateCreated: "2024-02-05",
    notes: "Implant-supported. Ti-base abutment. Screw-retained design preferred.",
  },
  {
    id: "4",
    caseId: "CASE-2024-004",
    doctor: "Dr. Patricia Lee",
    patientName: "David Martinez",
    caseType: "Veneer Set",
    material: "E.max",
    shade: "BL2",
    tooth: "#13-23",
    status: "intake",
    priority: "low",
    dueDate: "2024-02-28",
    dateCreated: "2024-02-09",
    notes: "6 upper anterior veneers. Patient wants brighter smile.",
  },
  {
    id: "5",
    caseId: "CASE-2024-005",
    doctor: "Dr. Michael Brown",
    patientName: "Sarah Kim",
    caseType: "Zirconia Crown",
    material: "Zirconia",
    shade: "A2",
    tooth: "#46",
    status: "delivery",
    priority: "medium",
    dueDate: "2024-02-11",
    dateCreated: "2024-02-03",
    notes: "Full contour zirconia. High strength needed for molar.",
  },
  {
    id: "6",
    caseId: "CASE-2024-006",
    doctor: "Dr. Sarah Johnson",
    patientName: "Robert Taylor",
    caseType: "Full Arch",
    material: "Zirconia",
    shade: "A1",
    tooth: "Upper Arch",
    status: "planning",
    priority: "high",
    dueDate: "2024-03-01",
    dateCreated: "2024-02-10",
    notes: "All-on-4 upper restoration. Digital smile design required.",
  },
];

const emptyForm: Omit<Case, "id" | "caseId" | "dateCreated"> = {
  doctor: "",
  patientName: "",
  caseType: "",
  material: "",
  shade: "A2",
  tooth: "",
  status: "intake",
  priority: "medium",
  dueDate: "",
  notes: "",
};

export default function Cases() {
  const [cases, setCases] = useState<Case[]>(initialCases);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/cases");
        if (res.ok) {
          const data = await res.json();
          setCases(data);
        }
      } catch (e) {
        console.warn("Could not load cases from API", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterPriority, setFilterPriority] = useState<string>("");
  const [sortField, setSortField] = useState<string>("dateCreated");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [editingCase, setEditingCase] = useState<Case | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const nextCaseNumber = cases.length > 0
    ? Math.max(...cases.map((c) => parseInt(c.caseId.split("-").pop() || "0"))) + 1
    : 1;

  // Filtering & sorting
  const filteredCases = cases
    .filter((caseItem) => {
      const matchesSearch =
        caseItem.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.caseType.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !filterStatus || caseItem.status === filterStatus;
      const matchesPriority = !filterPriority || caseItem.priority === filterPriority;
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      const aVal = a[sortField as keyof Case] || "";
      const bVal = b[sortField as keyof Case] || "";
      if (sortDir === "asc") return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.doctor.trim()) errors.doctor = "Doctor name is required";
    if (!formData.patientName.trim()) errors.patientName = "Patient name is required";
    if (!formData.caseType) errors.caseType = "Case type is required";
    if (!formData.material) errors.material = "Material is required";
    if (!formData.tooth.trim()) errors.tooth = "Tooth/area is required";
    if (!formData.dueDate) errors.dueDate = "Due date is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;
    try {
      const res = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const created = await res.json();
        setCases([created, ...cases]);
      }
    } catch (e) {
      console.warn("Create API failed, falling back to local add", e);
      const newCase: Case = {
        id: Date.now().toString(),
        caseId: `CASE-2024-${String(nextCaseNumber).padStart(3, "0")}`,
        dateCreated: new Date().toISOString().split("T")[0],
        ...formData,
      };
      setCases([newCase, ...cases]);
    } finally {
      setFormData(emptyForm);
      setShowCreateDialog(false);
      setFormErrors({});
    }
  };

  const handleEdit = () => {
    if (!editingCase || !validateForm()) return;
    (async () => {
      try {
        const res = await fetch(`/api/cases/${editingCase.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          const updated = await res.json();
          setCases(cases.map((c) => (c.id === editingCase.id ? updated : c)));
        }
      } catch (e) {
        setCases(cases.map((c) => (c.id === editingCase.id ? { ...c, ...formData } : c)));
      } finally {
        setEditingCase(null);
        setShowEditDialog(false);
        setFormData(emptyForm);
        setFormErrors({});
      }
    })();
  };

  const handleDelete = (id: string) => {
    (async () => {
      try {
        await fetch(`/api/cases/${id}`, { method: "DELETE" });
      } catch {}
      setCases(cases.filter((c) => c.id !== id));
      setShowDeleteConfirm(null);
    })();
  };

  const handleStatusChange = (id: string, newStatus: Case["status"]) => {
    setCases(cases.map((c) => (c.id === id ? { ...c, status: newStatus } : c)));
  };

  const openEditDialog = (caseItem: Case) => {
    setEditingCase(caseItem);
    setFormData({
      doctor: caseItem.doctor,
      patientName: caseItem.patientName,
      caseType: caseItem.caseType,
      material: caseItem.material,
      shade: caseItem.shade,
      tooth: caseItem.tooth,
      status: caseItem.status,
      priority: caseItem.priority,
      dueDate: caseItem.dueDate,
      notes: caseItem.notes,
    });
    setShowEditDialog(true);
    setFormErrors({});
  };

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const handleExport = () => {
    const headers = ["Case ID", "Doctor", "Patient", "Type", "Material", "Status", "Priority", "Due Date", "Created"];
    const rows = cases.map((c) => [c.caseId, c.doctor, c.patientName, c.caseType, c.material, c.status, c.priority, c.dueDate, c.dateCreated]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cases-export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Form component reused for create & edit
  const renderForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Doctor Name *</label>
          <input
            type="text"
            value={formData.doctor}
            onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
            placeholder="Dr. John Smith"
            className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {formErrors.doctor && <p className="text-xs text-red-600 mt-1">{formErrors.doctor}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Patient Name *</label>
          <input
            type="text"
            value={formData.patientName}
            onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
            placeholder="Jane Doe"
            className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {formErrors.patientName && <p className="text-xs text-red-600 mt-1">{formErrors.patientName}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Case Type *</label>
          <select
            value={formData.caseType}
            onChange={(e) => setFormData({ ...formData, caseType: e.target.value })}
            className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select case type...</option>
            {caseTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {formErrors.caseType && <p className="text-xs text-red-600 mt-1">{formErrors.caseType}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Material *</label>
          <select
            value={formData.material}
            onChange={(e) => setFormData({ ...formData, material: e.target.value })}
            className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select material...</option>
            {materials.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          {formErrors.material && <p className="text-xs text-red-600 mt-1">{formErrors.material}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Tooth / Area *</label>
          <input
            type="text"
            value={formData.tooth}
            onChange={(e) => setFormData({ ...formData, tooth: e.target.value })}
            placeholder="#14 or #13-23"
            className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {formErrors.tooth && <p className="text-xs text-red-600 mt-1">{formErrors.tooth}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Shade</label>
          <select
            value={formData.shade}
            onChange={(e) => setFormData({ ...formData, shade: e.target.value })}
            className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {shades.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Priority</label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as Case["priority"] })}
            className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Due Date *</label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {formErrors.dueDate && <p className="text-xs text-red-600 mt-1">{formErrors.dueDate}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as Case["status"] })}
            className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="intake">Intake</option>
            <option value="planning">Planning</option>
            <option value="design">Design</option>
            <option value="production">Production</option>
            <option value="qc">QC</option>
            <option value="delivery">Ready for Delivery</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Special instructions, clinical notes..."
          rows={3}
          className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
      </div>
    </div>
  );

  return (
    <Layout>
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Case Management</h1>
        <p className="text-muted-foreground">
          Manage all cases throughout their lifecycle with full traceability
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8 animate-slideUp">
        <div className="dlos-card">
          <div className="text-3xl font-bold text-primary">{cases.length}</div>
          <p className="text-sm text-muted-foreground">Total</p>
        </div>
        <div className="dlos-card">
          <div className="text-3xl font-bold text-red-600">
            {cases.filter((c) => c.priority === "high").length}
          </div>
          <p className="text-sm text-muted-foreground">High Priority</p>
        </div>
        <div className="dlos-card">
          <div className="text-3xl font-bold text-blue-600">
            {cases.filter((c) => c.status === "intake" || c.status === "planning").length}
          </div>
          <p className="text-sm text-muted-foreground">Planning</p>
        </div>
        <div className="dlos-card">
          <div className="text-3xl font-bold text-purple-600">
            {cases.filter((c) => c.status === "design").length}
          </div>
          <p className="text-sm text-muted-foreground">In Design</p>
        </div>
        <div className="dlos-card">
          <div className="text-3xl font-bold text-amber-600">
            {cases.filter((c) => c.status === "production").length}
          </div>
          <p className="text-sm text-muted-foreground">Production</p>
        </div>
        <div className="dlos-card">
          <div className="text-3xl font-bold text-green-600">
            {cases.filter((c) => c.status === "delivery").length}
          </div>
          <p className="text-sm text-muted-foreground">Ready</p>
        </div>
      </div>

      {/* Controls Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by case ID, doctor, patient, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Statuses</option>
          <option value="intake">Intake</option>
          <option value="planning">Planning</option>
          <option value="design">Design</option>
          <option value="production">Production</option>
          <option value="qc">QC</option>
          <option value="delivery">Ready for Delivery</option>
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="px-4 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <Button variant="outline" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        <Button
          onClick={() => {
            setFormData(emptyForm);
            setFormErrors({});
            setShowCreateDialog(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Case
        </Button>
      </div>

      {/* Cases Table */}
      <div className="dlos-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left px-6 py-4 font-semibold text-foreground cursor-pointer hover:text-primary" onClick={() => toggleSort("caseId")}>
                  <div className="flex items-center gap-1">Case ID <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="text-left px-6 py-4 font-semibold text-foreground cursor-pointer hover:text-primary" onClick={() => toggleSort("doctor")}>
                  <div className="flex items-center gap-1">Doctor <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="text-left px-6 py-4 font-semibold text-foreground">Patient</th>
                <th className="text-left px-6 py-4 font-semibold text-foreground">Type</th>
                <th className="text-left px-6 py-4 font-semibold text-foreground">Status</th>
                <th className="text-left px-6 py-4 font-semibold text-foreground">Priority</th>
                <th className="text-left px-6 py-4 font-semibold text-foreground cursor-pointer hover:text-primary" onClick={() => toggleSort("dueDate")}>
                  <div className="flex items-center gap-1">Due Date <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="text-left px-6 py-4 font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCases.length > 0 ? (
                filteredCases.map((caseItem) => {
                  const StatusIcon = statusConfig[caseItem.status].icon;
                  const statusColor = statusConfig[caseItem.status].color;
                  const statusLabel = statusConfig[caseItem.status].label;
                  const priorityColor = priorityConfig[caseItem.priority].color;
                  const priorityLabel = priorityConfig[caseItem.priority].label;

                  return (
                    <tr key={caseItem.id} className="hover:bg-secondary/50 transition-colors">
                      <td className="px-6 py-4">
                        <Link
                          to={`/cases/${caseItem.caseId}`}
                          className="font-semibold text-primary hover:underline"
                        >
                          {caseItem.caseId}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-foreground">{caseItem.doctor}</td>
                      <td className="px-6 py-4 text-foreground">{caseItem.patientName}</td>
                      <td className="px-6 py-4 text-foreground">{caseItem.caseType}</td>
                      <td className="px-6 py-4">
                        <select
                          value={caseItem.status}
                          onChange={(e) => handleStatusChange(caseItem.id, e.target.value as Case["status"])}
                          className={`px-2 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer ${statusColor}`}
                        >
                          <option value="intake">Intake</option>
                          <option value="planning">Planning</option>
                          <option value="design">Design</option>
                          <option value="production">Production</option>
                          <option value="qc">QC</option>
                          <option value="delivery">Ready for Delivery</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${priorityColor}`}>
                          {priorityLabel}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-foreground">
                        {new Date(caseItem.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/cases/${caseItem.caseId}`}
                            className="p-1 hover:bg-secondary rounded transition-colors"
                          >
                            <Eye className="w-4 h-4 text-muted-foreground hover:text-primary" />
                          </Link>
                          <button
                            onClick={() => openEditDialog(caseItem)}
                            className="p-1 hover:bg-secondary rounded transition-colors"
                          >
                            <Edit className="w-4 h-4 text-muted-foreground hover:text-primary" />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(caseItem.id)}
                            className="p-1 hover:bg-secondary rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center">
                    <p className="text-muted-foreground">
                      No cases found. Create your first case to get started.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-border bg-secondary/30 text-sm text-muted-foreground">
          Showing {filteredCases.length} of {cases.length} cases
        </div>
      </div>

      {/* Create Case Dialog */}
      {showCreateDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border border-border shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">Create New Case</h2>
              <button
                onClick={() => setShowCreateDialog(false)}
                className="p-1 hover:bg-secondary rounded-md transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-6">{renderForm()}</div>
            <div className="flex gap-3 p-6 border-t border-border justify-end">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>
                <Plus className="w-4 h-4 mr-2" />
                Create Case
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Case Dialog */}
      {showEditDialog && editingCase && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border border-border shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">Edit Case - {editingCase.caseId}</h2>
              <button
                onClick={() => { setShowEditDialog(false); setEditingCase(null); }}
                className="p-1 hover:bg-secondary rounded-md transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-6">{renderForm()}</div>
            <div className="flex gap-3 p-6 border-t border-border justify-end">
              <Button variant="outline" onClick={() => { setShowEditDialog(false); setEditingCase(null); }}>
                Cancel
              </Button>
              <Button onClick={handleEdit}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border border-border shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-lg font-bold text-foreground mb-2">Delete Case</h2>
              <p className="text-muted-foreground text-sm">
                Are you sure you want to delete this case? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 p-6 border-t border-border justify-end">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(showDeleteConfirm)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="dlos-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Case Intake Protocol
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-accent" /> Validate doctor prescription completeness</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-accent" /> Identify missing clinical data</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-accent" /> Request clarifications professionally</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-accent" /> Assign internal case ID</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-accent" /> Define priority and turnaround time</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-accent" /> Log case with full traceability</li>
          </ul>
        </div>
        <div className="dlos-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Status Workflow
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500" /> 1. Intake - Case registration and validation</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-500" /> 2. Planning - Prescription analysis</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500" /> 3. Design - CAD design phase</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500" /> 4. Production - Milling and manufacturing</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-500" /> 5. QC - Quality control verification</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500" /> 6. Delivery - Ready for shipment</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
