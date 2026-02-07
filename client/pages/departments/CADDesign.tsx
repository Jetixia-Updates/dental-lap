import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Search, Check, X, Pencil, RotateCcw, Monitor,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface DesignCase {
  id: string;
  patient: string;
  restorationType: string;
  toothNumbers: string;
  material: string;
  designer: string;
  software: string;
  progress: number; // 0-100
  status: "queued" | "designing" | "review" | "approved" | "revision";
  checklist: { margins: boolean; contacts: boolean; occlusion: boolean; anatomy: boolean; thickness: boolean };
  revisionCount: number;
  notes: string;
}

const INITIAL: DesignCase[] = [
  { id: "CASE-001", patient: "Ahmed M.", restorationType: "Crown", toothNumbers: "14, 15", material: "Zirconia", designer: "Tech. Karim", software: "exocad", progress: 100, status: "approved", checklist: { margins: true, contacts: true, occlusion: true, anatomy: true, thickness: true }, revisionCount: 0, notes: "" },
  { id: "CASE-002", patient: "Sara K.", restorationType: "Veneer", toothNumbers: "21", material: "E-max", designer: "", software: "", progress: 0, status: "queued", checklist: { margins: false, contacts: false, occlusion: false, anatomy: false, thickness: false }, revisionCount: 0, notes: "" },
  { id: "CASE-003", patient: "Omar R.", restorationType: "Bridge", toothNumbers: "35-37", material: "PFM", designer: "Tech. Layla", software: "3Shape", progress: 65, status: "designing", checklist: { margins: true, contacts: true, occlusion: false, anatomy: false, thickness: false }, revisionCount: 1, notes: "Re-check pontic design" },
];

const DESIGNERS = ["Tech. Karim", "Tech. Layla", "Tech. Yousef", "Tech. Dina"];
const SOFTWARE = ["exocad", "3Shape", "DentalCAD", "Medit Design"];

export default function CADDesign() {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [cases, setCases] = useState<DesignCase[]>(INITIAL);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ designer: "", software: "", progress: 0, notes: "", checklist: { margins: false, contacts: false, occlusion: false, anatomy: false, thickness: false } });

  const filtered = cases.filter(c => {
    const match = `${c.id} ${c.patient} ${c.designer}`.toLowerCase().includes(search.toLowerCase());
    const status = filterStatus === "all" || c.status === filterStatus;
    return match && status;
  });

  const startEdit = (c: DesignCase) => {
    setForm({ designer: c.designer, software: c.software, progress: c.progress, notes: c.notes, checklist: { ...c.checklist } });
    setEditingId(c.id);
  };

  const saveEdit = () => {
    if (!editingId) return;
    const allChecked = Object.values(form.checklist).every(Boolean);
    setCases(prev => prev.map(c => c.id === editingId
      ? { ...c, ...form, status: allChecked && form.progress === 100 ? "review" : form.designer ? "designing" : c.status }
      : c
    ));
    setEditingId(null);
  };

  const approve = (id: string) => setCases(prev => prev.map(c => c.id === id ? { ...c, status: "approved" } : c));
  const revision = (id: string) => setCases(prev => prev.map(c => c.id === id ? { ...c, status: "revision", revisionCount: c.revisionCount + 1 } : c));
  const restart = (id: string) => setCases(prev => prev.map(c => c.id === id ? { ...c, status: "designing" } : c));

  const statusColor: Record<string, string> = {
    queued: "bg-gray-100 text-gray-700",
    designing: "bg-blue-100 text-blue-800",
    review: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    revision: "bg-red-100 text-red-800",
  };

  const checklistLabels: Record<string, string> = {
    margins: "Margin Fit", contacts: "Proximal Contacts", occlusion: "Occlusion", anatomy: "Anatomy", thickness: "Min. Thickness",
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><Monitor className="w-8 h-8" /> {t("deptPages.cadDesign.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("deptPages.cadDesign.subtitle")}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {["queued", "designing", "review", "approved", "revision"].map(s => (
            <div key={s} className="bg-card border rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-muted-foreground capitalize">{s}</p>
              <p className="text-xl sm:text-2xl font-bold">{cases.filter(c => c.status === s).length}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border rounded-md px-3 py-2 text-sm">
            <option value="all">All</option>
            {["queued", "designing", "review", "approved", "revision"].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No cases found</div>
          ) : filtered.map(c => (
            <div key={c.id} className="bg-card border rounded-lg p-5">
              {editingId === c.id ? (
                <div className="space-y-4">
                  <h3 className="font-semibold">{c.id} — {c.patient} — {c.restorationType}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Designer</Label>
                      <select value={form.designer} onChange={e => setForm({ ...form, designer: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm">
                        <option value="">Unassigned</option>
                        {DESIGNERS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <Label>Software</Label>
                      <select value={form.software} onChange={e => setForm({ ...form, software: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm">
                        <option value="">Select</option>
                        {SOFTWARE.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <Label>Progress: {form.progress}%</Label>
                      <input type="range" min={0} max={100} step={5} value={form.progress} onChange={e => setForm({ ...form, progress: +e.target.value })} className="w-full mt-1" />
                    </div>
                  </div>
                  <div>
                    <Label>Design Checklist</Label>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {Object.entries(form.checklist).map(([key, val]) => (
                        <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
                          <input type="checkbox" checked={val} onChange={() => setForm({ ...form, checklist: { ...form.checklist, [key]: !val } })} className="rounded" />
                          {checklistLabels[key]}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div><Label>Notes</Label><Input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setEditingId(null)}><X className="w-4 h-4 mr-1" /> Cancel</Button>
                    <Button onClick={saveEdit}><Check className="w-4 h-4 mr-1" /> Save</Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-sm">{c.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[c.status]}`}>{c.status}</span>
                      {c.revisionCount > 0 && <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded">Rev #{c.revisionCount}</span>}
                    </div>
                    <p className="text-sm"><strong>{c.patient}</strong> — {c.restorationType} ({c.toothNumbers}) — {c.material}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span><Pencil className="w-3 h-3 inline mr-1" />{c.designer || "Unassigned"}</span>
                      {c.software && <span className="hidden sm:inline">{c.software}</span>}
                    </div>
                    {c.status !== "queued" && (
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-2 bg-muted rounded-full max-w-xs">
                          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${c.progress}%` }} />
                        </div>
                        <span className="text-xs font-medium">{c.progress}%</span>
                        <span className="text-xs text-muted-foreground">
                          ✓ {Object.values(c.checklist).filter(Boolean).length}/5
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1 flex-shrink-0 self-start sm:self-center">
                    <Button size="sm" variant="outline" onClick={() => startEdit(c)}><Pencil className="w-4 h-4" /></Button>
                    {c.status === "review" && (
                      <>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 hidden sm:inline-flex" onClick={() => approve(c.id)}><Check className="w-4 h-4 mr-1" /> Approve</Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 sm:hidden" onClick={() => approve(c.id)}><Check className="w-4 h-4" /></Button>
                        <Button size="sm" variant="outline" className="text-red-600 hidden sm:inline-flex" onClick={() => revision(c.id)}><RotateCcw className="w-4 h-4 mr-1" /> Revise</Button>
                        <Button size="sm" variant="outline" className="text-red-600 sm:hidden" onClick={() => revision(c.id)}><RotateCcw className="w-4 h-4" /></Button>
                      </>
                    )}
                    {c.status === "revision" && <Button size="sm" onClick={() => restart(c.id)} className="text-xs">Resume</Button>}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
