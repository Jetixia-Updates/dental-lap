import { useState } from "react";
import Layout from "@/components/Layout";
import DepartmentManagement from "@/components/DepartmentManagement";
import { useLabContext } from "@/contexts/LabContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Search, Edit, Check, X, ClipboardList, User,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export default function CasePlanning() {
  const { t } = useTranslation();
  const { cases: allCases, staff, updateCase, assignStaffToCase, addCaseNote } = useLabContext();
  
  // Filter cases for this department
  const cases = allCases.filter(c => c.currentDepartment === "case-planning");
  
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ assignedPlanner: "", complexity: "moderate", notes: "" });
  
  // Get planners from staff
  const planners = staff.filter(s => s.department === "case-planning").map(s => s.name);

  const filtered = cases.filter(c => {
    const match = `${c.id} ${c.patient} ${c.doctor}`.toLowerCase().includes(search.toLowerCase());
    const statusMatch = filterStatus === "all" || 
      (filterStatus === "pending" && Object.keys(c.assignedStaff).length === 0) ||
      (filterStatus === "planning" && Object.keys(c.assignedStaff).length > 0 && c.status !== "completed") ||
      (filterStatus === "planned" && c.status === "completed");
    return match && statusMatch;
  });

  const startEdit = (c: typeof cases[0]) => {
    setForm({ 
      assignedPlanner: c.assignedStaff["case-planning"] || "", 
      complexity: "moderate", 
      notes: c.notes.length > 0 ? c.notes[c.notes.length - 1].note : "" 
    });
    setEditingId(c.id);
  };

  const saveEdit = () => {
    if (!editingId) return;
    if (form.assignedPlanner) {
      assignStaffToCase(editingId, "case-planning", form.assignedPlanner);
    }
    if (form.notes) {
      addCaseNote(editingId, "case-planning", form.assignedPlanner || "System", form.notes, "update");
    }
    setEditingId(null);
  };

  const advanceStatus = (id: string) => {
    updateCase(id, { status: "completed" });
  };

  const statusColor: Record<string, string> = {
    pending: "bg-gray-100 text-gray-700",
    planning: "bg-blue-100 text-blue-800",
    planned: "bg-green-100 text-green-800",
    completed: "bg-green-100 text-green-800",
  };

  const casePlanningTab = (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "Pending", value: cases.filter(c => Object.keys(c.assignedStaff).length === 0).length, color: "text-gray-600" },
          { label: "In Planning", value: cases.filter(c => Object.keys(c.assignedStaff).length > 0 && c.status !== "completed").length, color: "text-blue-600" },
          { label: "Planned", value: cases.filter(c => c.status === "completed").length, color: "text-green-600" },
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
          <Input placeholder="Search cases..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border rounded-md px-3 py-2 text-sm">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="planning">In Planning</option>
          <option value="planned">Planned</option>
        </select>
      </div>

      {/* Cases list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No cases found</div>
        ) : filtered.map(c => (
          <div key={c.id} className="bg-card border rounded-lg p-5">
            {editingId === c.id ? (
              <div className="space-y-4">
                <h3 className="font-semibold">{c.id} — {c.patient}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Assign Planner</Label>
                    <select value={form.assignedPlanner} onChange={e => setForm({ ...form, assignedPlanner: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm">
                      <option value="">Unassigned</option>
                      {planners.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label>Notes</Label>
                    <Input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setEditingId(null)}><X className="w-4 h-4 mr-1" /> Cancel</Button>
                  <Button onClick={saveEdit}><Check className="w-4 h-4 mr-1" /> Save</Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold">{c.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[c.status]}`}>{c.status}</span>
                  </div>
                  <p className="text-sm"><strong>{c.patient}</strong> — {c.doctor} — {c.restorationType}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <User className="w-3 h-3" /> {c.assignedStaff["case-planning"] || "Unassigned"}
                    {c.notes.length > 0 && <span className="ml-2">• {c.notes[c.notes.length - 1].note}</span>}
                  </p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button size="sm" variant="outline" onClick={() => startEdit(c)}><Edit className="w-4 h-4" /></Button>
                  {c.status !== "completed" && (
                    <Button size="sm" onClick={() => advanceStatus(c.id)}>
                      Mark Planned
                    </Button>
                  )}
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
        departmentName={t("deptPages.casePlanning.title")}
        departmentIcon={<ClipboardList className="w-8 h-8" />}
        customTabs={[
          { value: "planning", label: "Case Planning", content: casePlanningTab }
        ]}
      />
    </Layout>
  );
}
