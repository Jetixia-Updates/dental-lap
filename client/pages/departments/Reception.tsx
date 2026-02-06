import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Plus, Check, X, AlertCircle, Clock, Trash2, Edit, Send, Search,
  ChevronUp, ChevronDown,
} from "lucide-react";

interface IntakeCase {
  id: string;
  caseId: string;
  doctor: string;
  patient: string;
  toothNumbers: string;
  restorationType: string;
  shade: string;
  material: string;
  specialInstructions: string;
  datReceived: string;
  priority: "normal" | "rush" | "emergency";
  prescriptionStatus: "complete" | "incomplete" | "review";
  dataValidation: string[];
  missingData: string[];
}

const requiredFields = [
  "Doctor info", "Patient demographics", "Tooth selection",
  "Restoration type", "Shade selected", "Material specified",
  "Special instructions",
];

function computeValidation(c: Partial<IntakeCase>) {
  const validated: string[] = [];
  const missing: string[] = [];
  if (c.doctor?.trim()) validated.push("Doctor info"); else missing.push("Doctor info");
  if (c.patient?.trim()) validated.push("Patient demographics"); else missing.push("Patient demographics");
  if (c.toothNumbers?.trim()) validated.push("Tooth selection"); else missing.push("Tooth selection");
  if (c.restorationType?.trim()) validated.push("Restoration type"); else missing.push("Restoration type");
  if (c.shade?.trim()) validated.push("Shade selected"); else missing.push("Shade selected");
  if (c.material?.trim()) validated.push("Material specified"); else missing.push("Material specified");
  if (c.specialInstructions?.trim()) validated.push("Special instructions"); else missing.push("Special instructions");
  return { validated, missing };
}

const shadeOptions = ["A1","A2","A3","A3.5","A4","B1","B2","B3","B4","C1","C2","C3","C4","D2","D3","D4"];
const materialOptions = ["Zirconia","E.max","PFM","Composite","PMMA","Titanium"];
const restorationOptions = ["Crown","Bridge","Veneer","Inlay/Onlay","Implant Crown","Full Arch"];

const mockCases: IntakeCase[] = [
  {
    id: "1", caseId: "CASE-2024-010", doctor: "Dr. John Smith", patient: "Jane Doe",
    toothNumbers: "#14", restorationType: "Crown", shade: "A2", material: "Zirconia",
    specialInstructions: "Natural emergence profile", datReceived: "2024-02-10",
    priority: "normal", prescriptionStatus: "complete",
    dataValidation: [...requiredFields], missingData: [],
  },
  {
    id: "2", caseId: "CASE-2024-011", doctor: "Dr. Sarah Johnson", patient: "Michael Brown",
    toothNumbers: "#21, #22", restorationType: "Bridge", shade: "", material: "",
    specialInstructions: "", datReceived: "2024-02-10", priority: "rush",
    prescriptionStatus: "incomplete",
    dataValidation: ["Doctor info", "Patient demographics", "Tooth selection", "Restoration type"],
    missingData: ["Shade selected", "Material specified", "Special instructions"],
  },
  {
    id: "3", caseId: "CASE-2024-012", doctor: "Dr. Michael Brown", patient: "Emily Garcia",
    toothNumbers: "#36", restorationType: "Crown", shade: "B1", material: "E.max",
    specialInstructions: "", datReceived: "2024-02-09", priority: "normal",
    prescriptionStatus: "review",
    dataValidation: ["Doctor info", "Patient demographics", "Tooth selection", "Restoration type", "Shade selected", "Material specified"],
    missingData: ["Special instructions"],
  },
];

let nextId = 13;

export default function Reception() {
  const [cases, setCases] = useState<IntakeCase[]>(mockCases);
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [showAddCase, setShowAddCase] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  const [newCase, setNewCase] = useState({
    doctor: "", patient: "", toothNumbers: "", restorationType: "",
    shade: "", material: "", specialInstructions: "",
    priority: "normal" as IntakeCase["priority"],
  });
  const [editData, setEditData] = useState<Partial<IntakeCase>>({});

  const sel = cases.find((c) => c.id === selectedCase);

  const filtered = cases
    .filter((c) => {
      const s = searchTerm.toLowerCase();
      const matchSearch = !s || c.caseId.toLowerCase().includes(s) || c.doctor.toLowerCase().includes(s) || c.patient.toLowerCase().includes(s);
      const matchFilter = !filterStatus || c.prescriptionStatus === filterStatus;
      return matchSearch && matchFilter;
    })
    .sort((a, b) => {
      const d = new Date(a.datReceived).getTime() - new Date(b.datReceived).getTime();
      return sortAsc ? d : -d;
    });

  const counts = {
    total: cases.length,
    complete: cases.filter((c) => c.prescriptionStatus === "complete").length,
    incomplete: cases.filter((c) => c.prescriptionStatus === "incomplete").length,
    review: cases.filter((c) => c.prescriptionStatus === "review").length,
  };

  const handleAdd = () => {
    if (!newCase.doctor.trim() || !newCase.patient.trim()) return;
    const { validated, missing } = computeValidation(newCase as any);
    const c: IntakeCase = {
      id: Date.now().toString(), caseId: `CASE-2024-${String(nextId++).padStart(3, "0")}`,
      ...newCase, datReceived: new Date().toISOString().split("T")[0],
      prescriptionStatus: missing.length === 0 ? "complete" : "incomplete",
      dataValidation: validated, missingData: missing,
    };
    setCases((prev) => [...prev, c]);
    setNewCase({ doctor: "", patient: "", toothNumbers: "", restorationType: "", shade: "", material: "", specialInstructions: "", priority: "normal" });
    setShowAddCase(false);
    setSelectedCase(c.id);
  };

  const handleApprove = (id: string) =>
    setCases((prev) => prev.map((c) => (c.id === id ? { ...c, prescriptionStatus: "complete" as const } : c)));

  const handleRequestInfo = (id: string) =>
    setCases((prev) => prev.map((c) => (c.id === id ? { ...c, prescriptionStatus: "review" as const } : c)));

  const handleDelete = (id: string) => {
    setCases((prev) => prev.filter((c) => c.id !== id));
    if (selectedCase === id) setSelectedCase(null);
  };

  const startEdit = () => { if (sel) { setEditData({ ...sel }); setEditMode(true); } };

  const saveEdit = () => {
    if (!sel || !editData) return;
    const { validated, missing } = computeValidation(editData as any);
    setCases((prev) =>
      prev.map((c) =>
        c.id === sel.id
          ? {
              ...c, doctor: editData.doctor || c.doctor, patient: editData.patient || c.patient,
              toothNumbers: editData.toothNumbers ?? "", restorationType: editData.restorationType ?? "",
              shade: editData.shade ?? "", material: editData.material ?? "",
              specialInstructions: editData.specialInstructions ?? "",
              priority: editData.priority || c.priority,
              dataValidation: validated, missingData: missing,
              prescriptionStatus: missing.length === 0 ? "complete" as const : c.prescriptionStatus === "complete" ? "incomplete" as const : c.prescriptionStatus,
            }
          : c,
      ),
    );
    setEditMode(false);
  };

  const resolveMissing = (caseId: string, field: string) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id !== caseId) return c;
        const ms = c.missingData.filter((m) => m !== field);
        return { ...c, dataValidation: [...c.dataValidation, field], missingData: ms, prescriptionStatus: ms.length === 0 ? ("complete" as const) : c.prescriptionStatus };
      }),
    );
  };

  const statusColor = (s: string) => {
    if (s === "complete") return "bg-green-100 text-green-800";
    if (s === "incomplete") return "bg-red-100 text-red-800";
    if (s === "review") return "bg-amber-100 text-amber-800";
    return "bg-gray-100 text-gray-800";
  };
  const prioColor = (p: string) => {
    if (p === "emergency") return "bg-red-100 text-red-800";
    if (p === "rush") return "bg-amber-100 text-amber-800";
    return "bg-gray-100 text-gray-600";
  };

  const inp = "w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Reception & Case Intake</h1>
        <p className="text-muted-foreground">Validate prescriptions, process case intake, and ensure data completeness</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Cases Today", value: counts.total, icon: Clock, color: "text-primary" },
          { label: "Approved", value: counts.complete, icon: Check, color: "text-green-600" },
          { label: "Incomplete", value: counts.incomplete, icon: AlertCircle, color: "text-red-600" },
          { label: "In Review", value: counts.review, icon: AlertCircle, color: "text-amber-600" },
        ].map((s) => (
          <div key={s.label} className="dlos-card">
            <div className="flex items-center gap-3 mb-3">
              <s.icon className={`w-5 h-5 ${s.color}`} />
              <span className="text-sm text-muted-foreground">{s.label}</span>
            </div>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: case list */}
        <div className="lg:col-span-1">
          <div className="dlos-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">Cases to Process</h2>
              <Button size="sm" onClick={() => setShowAddCase(true)}><Plus className="w-4 h-4 mr-2" />New</Button>
            </div>
            <div className="space-y-2 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" placeholder="Search cases..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`${inp} pl-10`} />
              </div>
              <div className="flex gap-2">
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={`flex-1 ${inp} text-xs py-1.5`}>
                  <option value="">All Status</option>
                  <option value="complete">Complete</option>
                  <option value="incomplete">Incomplete</option>
                  <option value="review">Review</option>
                </select>
                <button onClick={() => setSortAsc(!sortAsc)} className="px-2 py-1.5 rounded-md border border-border hover:bg-secondary text-xs flex items-center gap-1">
                  Date {sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>
            </div>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {filtered.map((c) => (
                <button key={c.id} onClick={() => { setSelectedCase(c.id); setEditMode(false); }}
                  className={`w-full text-left p-3 rounded-md border transition-all ${selectedCase === c.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-semibold text-sm text-foreground">{c.caseId}</p>
                    {c.priority !== "normal" && <span className={`text-xs px-1.5 py-0.5 rounded ${prioColor(c.priority)}`}>{c.priority}</span>}
                  </div>
                  <p className="text-xs text-muted-foreground">{c.doctor} &bull; {c.patient}</p>
                  <div className="mt-2">
                    <span className={`text-xs px-2 py-1 rounded inline-block ${statusColor(c.prescriptionStatus)}`}>{c.prescriptionStatus}</span>
                  </div>
                </button>
              ))}
              {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No cases found</p>}
            </div>
          </div>
        </div>

        {/* Right: detail */}
        <div className="lg:col-span-2">
          {sel ? (
            <div className="dlos-card">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">{sel.caseId}</h2>
                <div className="flex gap-2">
                  {!editMode && <Button size="sm" variant="outline" onClick={startEdit}><Edit className="w-4 h-4 mr-1" />Edit</Button>}
                  <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => handleDelete(sel.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>

              {editMode ? (
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-xs text-muted-foreground mb-1">Doctor *</label><input type="text" value={editData.doctor ?? ""} onChange={(e) => setEditData({ ...editData, doctor: e.target.value })} className={inp} /></div>
                    <div><label className="block text-xs text-muted-foreground mb-1">Patient *</label><input type="text" value={editData.patient ?? ""} onChange={(e) => setEditData({ ...editData, patient: e.target.value })} className={inp} /></div>
                    <div><label className="block text-xs text-muted-foreground mb-1">Tooth Numbers</label><input type="text" value={editData.toothNumbers ?? ""} onChange={(e) => setEditData({ ...editData, toothNumbers: e.target.value })} className={inp} /></div>
                    <div><label className="block text-xs text-muted-foreground mb-1">Restoration Type</label><select value={editData.restorationType ?? ""} onChange={(e) => setEditData({ ...editData, restorationType: e.target.value })} className={inp}><option value="">Select...</option>{restorationOptions.map((r) => <option key={r} value={r}>{r}</option>)}</select></div>
                    <div><label className="block text-xs text-muted-foreground mb-1">Shade</label><select value={editData.shade ?? ""} onChange={(e) => setEditData({ ...editData, shade: e.target.value })} className={inp}><option value="">Select...</option>{shadeOptions.map((s) => <option key={s} value={s}>{s}</option>)}</select></div>
                    <div><label className="block text-xs text-muted-foreground mb-1">Material</label><select value={editData.material ?? ""} onChange={(e) => setEditData({ ...editData, material: e.target.value })} className={inp}><option value="">Select...</option>{materialOptions.map((m) => <option key={m} value={m}>{m}</option>)}</select></div>
                    <div><label className="block text-xs text-muted-foreground mb-1">Priority</label><select value={editData.priority ?? "normal"} onChange={(e) => setEditData({ ...editData, priority: e.target.value as IntakeCase["priority"] })} className={inp}><option value="normal">Normal</option><option value="rush">Rush</option><option value="emergency">Emergency</option></select></div>
                  </div>
                  <div><label className="block text-xs text-muted-foreground mb-1">Special Instructions</label><textarea value={editData.specialInstructions ?? ""} onChange={(e) => setEditData({ ...editData, specialInstructions: e.target.value })} rows={3} className={`${inp} resize-none`} /></div>
                  <div className="flex gap-2"><Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button><Button onClick={saveEdit}><Check className="w-4 h-4 mr-2" />Save</Button></div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {[
                      ["Doctor", sel.doctor], ["Patient", sel.patient],
                      ["Tooth Numbers", sel.toothNumbers], ["Restoration", sel.restorationType],
                      ["Shade", sel.shade], ["Material", sel.material],
                      ["Received", new Date(sel.datReceived).toLocaleDateString()],
                    ].map(([label, val]) => (
                      <div key={label as string}><p className="text-xs text-muted-foreground mb-1">{label}</p><p className="font-semibold text-foreground">{(val as string) || "\u2014"}</p></div>
                    ))}
                    <div><p className="text-xs text-muted-foreground mb-1">Priority</p><span className={`text-xs px-2 py-1 rounded font-semibold ${prioColor(sel.priority)}`}>{sel.priority}</span></div>
                  </div>
                  {sel.specialInstructions && (
                    <div className="mb-6"><p className="text-xs text-muted-foreground mb-1">Special Instructions</p><p className="text-sm bg-secondary/30 p-3 rounded-md">{sel.specialInstructions}</p></div>
                  )}
                  <div className="border-t border-border pt-6">
                    <h3 className="font-semibold text-foreground mb-4">Prescription Validation</h3>
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-muted-foreground">Completion</span>
                        <span className="text-sm font-semibold">{sel.dataValidation.length}/{requiredFields.length}</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-accent transition-all" style={{ width: `${(sel.dataValidation.length / requiredFields.length) * 100}%` }} />
                      </div>
                    </div>
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-green-600 mb-2">Validated</h4>
                      <ul className="space-y-1">
                        {sel.dataValidation.map((item) => (
                          <li key={item} className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-green-600" />{item}</li>
                        ))}
                      </ul>
                    </div>
                    {sel.missingData.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-red-600 mb-2">Missing</h4>
                        <ul className="space-y-1">
                          {sel.missingData.map((item) => (
                            <li key={item} className="flex items-center gap-2 text-sm">
                              <X className="w-4 h-4 text-red-600" /><span className="flex-1">{item}</span>
                              <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => resolveMissing(sel.id, item)}><Check className="w-3 h-3 mr-1" />Resolve</Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 mt-6 pt-6 border-t border-border">
                    {sel.prescriptionStatus === "complete" ? (
                      <div className="flex-1 flex items-center justify-center gap-2 text-green-600 font-semibold"><Check className="w-5 h-5" />Approved — Ready for Planning</div>
                    ) : (
                      <>
                        <Button variant="outline" className="flex-1" onClick={() => handleRequestInfo(sel.id)} disabled={sel.prescriptionStatus === "review"}><AlertCircle className="w-4 h-4 mr-2" />Request Info</Button>
                        <Button className="flex-1" disabled={sel.missingData.length > 0} onClick={() => handleApprove(sel.id)}><Send className="w-4 h-4 mr-2" />Approve & Route</Button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="dlos-card flex items-center justify-center min-h-[300px]">
              <p className="text-muted-foreground">Select a case to review prescription</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom info cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="dlos-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Standard Data Required</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {requiredFields.map((f) => <li key={f}>&bull; {f}</li>)}
            <li>&bull; Margin design</li>
          </ul>
        </div>
        <div className="dlos-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Intake Responsibilities</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>&bull; Validate all prescription data</li>
            <li>&bull; Identify and request missing information</li>
            <li>&bull; Assign internal case ID</li>
            <li>&bull; Define case priority</li>
            <li>&bull; Set turnaround time</li>
            <li>&bull; Route to planning department</li>
            <li>&bull; Document all communications</li>
          </ul>
        </div>
      </div>

      {/* Add Case Modal */}
      {showAddCase && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border border-border shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">New Case Intake</h2>
              <button onClick={() => setShowAddCase(false)} className="p-1 hover:bg-secondary rounded-md"><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Doctor *</label><input type="text" value={newCase.doctor} onChange={(e) => setNewCase({ ...newCase, doctor: e.target.value })} placeholder="Dr. Jane Smith" className={inp} /></div>
                <div><label className="block text-sm font-medium mb-1">Patient *</label><input type="text" value={newCase.patient} onChange={(e) => setNewCase({ ...newCase, patient: e.target.value })} placeholder="Patient name" className={inp} /></div>
                <div><label className="block text-sm font-medium mb-1">Tooth Numbers</label><input type="text" value={newCase.toothNumbers} onChange={(e) => setNewCase({ ...newCase, toothNumbers: e.target.value })} placeholder="#14, #15" className={inp} /></div>
                <div><label className="block text-sm font-medium mb-1">Restoration Type</label><select value={newCase.restorationType} onChange={(e) => setNewCase({ ...newCase, restorationType: e.target.value })} className={inp}><option value="">Select...</option>{restorationOptions.map((r) => <option key={r} value={r}>{r}</option>)}</select></div>
                <div><label className="block text-sm font-medium mb-1">Shade</label><select value={newCase.shade} onChange={(e) => setNewCase({ ...newCase, shade: e.target.value })} className={inp}><option value="">Select...</option>{shadeOptions.map((s) => <option key={s} value={s}>{s}</option>)}</select></div>
                <div><label className="block text-sm font-medium mb-1">Material</label><select value={newCase.material} onChange={(e) => setNewCase({ ...newCase, material: e.target.value })} className={inp}><option value="">Select...</option>{materialOptions.map((m) => <option key={m} value={m}>{m}</option>)}</select></div>
                <div><label className="block text-sm font-medium mb-1">Priority</label><select value={newCase.priority} onChange={(e) => setNewCase({ ...newCase, priority: e.target.value as IntakeCase["priority"] })} className={inp}><option value="normal">Normal</option><option value="rush">Rush</option><option value="emergency">Emergency</option></select></div>
              </div>
              <div><label className="block text-sm font-medium mb-1">Special Instructions</label><textarea value={newCase.specialInstructions} onChange={(e) => setNewCase({ ...newCase, specialInstructions: e.target.value })} rows={3} placeholder="Any special requirements..." className={`${inp} resize-none`} /></div>
            </div>
            <div className="flex gap-3 p-6 border-t border-border justify-end">
              <Button variant="outline" onClick={() => setShowAddCase(false)}>Cancel</Button>
              <Button onClick={handleAdd} disabled={!newCase.doctor.trim() || !newCase.patient.trim()}><Plus className="w-4 h-4 mr-2" />Create Case</Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
