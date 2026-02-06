import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Search, Check, X, Truck, Package, Printer,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface Shipment {
  id: string;
  caseId: string;
  patient: string;
  doctor: string;
  clinic: string;
  address: string;
  deliveryMethod: "courier" | "pickup" | "mail";
  trackingNumber: string;
  status: "preparing" | "ready" | "shipped" | "delivered";
  checklist: { qualityVerified: boolean; packaged: boolean; labelPrinted: boolean; documentationIncluded: boolean };
  scheduledDate: string;
  notes: string;
}

const INITIAL: Shipment[] = [
  { id: "SHP-001", caseId: "CASE-001", patient: "Ahmed M.", doctor: "Dr. Smith", clinic: "Smile Clinic", address: "123 Main St", deliveryMethod: "courier", trackingNumber: "TRK-90001", status: "delivered", checklist: { qualityVerified: true, packaged: true, labelPrinted: true, documentationIncluded: true }, scheduledDate: "2026-02-05", notes: "" },
  { id: "SHP-002", caseId: "CASE-003", patient: "Omar R.", doctor: "Dr. Lee", clinic: "Dental Care Plus", address: "456 Oak Ave", deliveryMethod: "pickup", trackingNumber: "", status: "preparing", checklist: { qualityVerified: false, packaged: false, labelPrinted: false, documentationIncluded: false }, scheduledDate: "2026-02-07", notes: "Call when ready" },
];

export default function Logistics() {
  const { t } = useTranslation();
  const [shipments, setShipments] = useState<Shipment[]>(INITIAL);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ deliveryMethod: "courier" as Shipment["deliveryMethod"], trackingNumber: "", scheduledDate: "", notes: "", checklist: { qualityVerified: false, packaged: false, labelPrinted: false, documentationIncluded: false } });

  const filtered = shipments.filter(s => {
    const match = `${s.id} ${s.caseId} ${s.patient} ${s.doctor} ${s.clinic}`.toLowerCase().includes(search.toLowerCase());
    const status = filterStatus === "all" || s.status === filterStatus;
    return match && status;
  });

  const startEdit = (s: Shipment) => {
    setForm({ deliveryMethod: s.deliveryMethod, trackingNumber: s.trackingNumber, scheduledDate: s.scheduledDate, notes: s.notes, checklist: { ...s.checklist } });
    setEditingId(s.id);
  };

  const saveEdit = () => {
    if (!editingId) return;
    const allDone = Object.values(form.checklist).every(Boolean);
    setShipments(prev => prev.map(s => s.id === editingId
      ? { ...s, ...form, status: allDone ? "ready" : "preparing" }
      : s
    ));
    setEditingId(null);
  };

  const markShipped = (id: string) => setShipments(prev => prev.map(s => s.id === id ? { ...s, status: "shipped" } : s));
  const markDelivered = (id: string) => setShipments(prev => prev.map(s => s.id === id ? { ...s, status: "delivered" } : s));
  const deleteShipment = (id: string) => setShipments(prev => prev.filter(s => s.id !== id));

  const statusColor: Record<string, string> = {
    preparing: "bg-gray-100 text-gray-700",
    ready: "bg-blue-100 text-blue-800",
    shipped: "bg-yellow-100 text-yellow-800",
    delivered: "bg-green-100 text-green-800",
  };

  const checklistLabels: Record<string, string> = {
    qualityVerified: "Quality Verified", packaged: "Packaged", labelPrinted: "Label Printed", documentationIncluded: "Documentation Included",
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><Truck className="w-8 h-8" /> {t("deptPages.logistics.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("deptPages.logistics.subtitle")}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["preparing", "ready", "shipped", "delivered"].map(s => (
            <div key={s} className="bg-card border rounded-lg p-4">
              <p className="text-sm text-muted-foreground capitalize">{s}</p>
              <p className="text-2xl font-bold">{shipments.filter(sh => sh.status === s).length}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search shipments..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border rounded-md px-3 py-2 text-sm">
            <option value="all">All</option>
            {["preparing", "ready", "shipped", "delivered"].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No shipments found</div>
          ) : filtered.map(s => (
            <div key={s.id} className="bg-card border rounded-lg p-5">
              {editingId === s.id ? (
                <div className="space-y-4">
                  <h3 className="font-semibold">{s.id} — {s.caseId} — {s.patient}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Delivery Method</Label>
                      <select value={form.deliveryMethod} onChange={e => setForm({ ...form, deliveryMethod: e.target.value as Shipment["deliveryMethod"] })} className="w-full border rounded-md px-3 py-2 text-sm">
                        <option value="courier">Courier</option>
                        <option value="pickup">Pickup</option>
                        <option value="mail">Mail</option>
                      </select>
                    </div>
                    <div>
                      <Label>Tracking Number</Label>
                      <Input value={form.trackingNumber} onChange={e => setForm({ ...form, trackingNumber: e.target.value })} />
                    </div>
                    <div>
                      <Label>Scheduled Date</Label>
                      <Input type="date" value={form.scheduledDate} onChange={e => setForm({ ...form, scheduledDate: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <Label>Prep Checklist</Label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {Object.entries(form.checklist).map(([key, val]) => (
                        <label key={key} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer ${val ? "bg-green-50 border-green-300" : ""}`}>
                          <input type="checkbox" checked={val} onChange={() => setForm({ ...form, checklist: { ...form.checklist, [key]: !val } })} className="rounded" />
                          <span className="text-sm">{checklistLabels[key]}</span>
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
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold">{s.id}</span>
                      <span className="text-xs text-muted-foreground">{s.caseId}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[s.status]}`}>{s.status}</span>
                    </div>
                    <p className="text-sm"><strong>{s.patient}</strong> → {s.doctor} — {s.clinic}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span><Package className="w-3 h-3 inline mr-1" />{s.deliveryMethod}</span>
                      {s.trackingNumber && <span>#{s.trackingNumber}</span>}
                      <span>{s.scheduledDate}</span>
                      <span>✓ {Object.values(s.checklist).filter(Boolean).length}/4</span>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button size="sm" variant="outline" onClick={() => startEdit(s)}><Package className="w-4 h-4" /></Button>
                    <Button size="sm" variant="outline" onClick={() => window.alert(`Label printed for ${s.id}`)}><Printer className="w-4 h-4 mr-1" /> Label</Button>
                    {s.status === "ready" && <Button size="sm" onClick={() => markShipped(s.id)}><Truck className="w-4 h-4 mr-1" /> Ship</Button>}
                    {s.status === "shipped" && <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => markDelivered(s.id)}><Check className="w-4 h-4 mr-1" /> Delivered</Button>}
                    <Button size="sm" variant="ghost" className="text-red-500" onClick={() => deleteShipment(s.id)}>×</Button>
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
