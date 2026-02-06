import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Plus, Check, X, Truck, Package, Search, Edit, Trash2,
  MapPin, Printer, Clock, CheckCircle, Send, Ban,
  ChevronUp, ChevronDown,
} from "lucide-react";

interface Shipment {
  id: string;
  caseId: string;
  doctor: string;
  patient: string;
  clinic: string;
  deliveryMethod: "courier" | "pickup" | "mail";
  trackingNumber: string;
  status: "preparing" | "ready" | "shipped" | "delivered" | "cancelled";
  checklist: {
    qualityVerified: boolean;
    packaged: boolean;
    labeled: boolean;
    documented: boolean;
  };
  scheduledDate: string;
  shippedDate: string | null;
  deliveredDate: string | null;
  notes: string;
  address: string;
}

const mockShipments: Shipment[] = [
  {
    id: "1",
    caseId: "CASE-2024-010",
    doctor: "Dr. John Smith",
    patient: "Jane Doe",
    clinic: "Smile Dental Clinic",
    deliveryMethod: "courier",
    trackingNumber: "TRK-20240210-001",
    status: "preparing",
    checklist: { qualityVerified: true, packaged: false, labeled: false, documented: false },
    scheduledDate: "2024-02-14",
    shippedDate: null,
    deliveredDate: null,
    notes: "Handle with care — porcelain veneers",
    address: "123 Main St, Suite 200, Springfield, IL 62704",
  },
  {
    id: "2",
    caseId: "CASE-2024-008",
    doctor: "Dr. Sarah Johnson",
    patient: "Michael Brown",
    clinic: "Downtown Dental",
    deliveryMethod: "mail",
    trackingNumber: "TRK-20240209-004",
    status: "shipped",
    checklist: { qualityVerified: true, packaged: true, labeled: true, documented: true },
    scheduledDate: "2024-02-12",
    shippedDate: "2024-02-12",
    deliveredDate: null,
    notes: "",
    address: "456 Oak Ave, Floor 3, Chicago, IL 60601",
  },
  {
    id: "3",
    caseId: "CASE-2024-006",
    doctor: "Dr. Michael Brown",
    patient: "Emily Garcia",
    clinic: "Family Dental Care",
    deliveryMethod: "pickup",
    trackingNumber: "",
    status: "delivered",
    checklist: { qualityVerified: true, packaged: true, labeled: true, documented: true },
    scheduledDate: "2024-02-10",
    shippedDate: "2024-02-10",
    deliveredDate: "2024-02-10",
    notes: "Picked up by clinic assistant",
    address: "789 Elm Blvd, Naperville, IL 60540",
  },
  {
    id: "4",
    caseId: "CASE-2024-011",
    doctor: "Dr. Lisa Chen",
    patient: "Robert Wilson",
    clinic: "Premier Orthodontics",
    deliveryMethod: "courier",
    trackingNumber: "",
    status: "ready",
    checklist: { qualityVerified: true, packaged: true, labeled: true, documented: true },
    scheduledDate: "2024-02-15",
    shippedDate: null,
    deliveredDate: null,
    notes: "Rush case — confirm delivery time with clinic",
    address: "321 Pine Rd, Suite 100, Evanston, IL 60201",
  },
];

let nextId = 15;

function generateTracking(): string {
  const d = new Date();
  const ds = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return `TRK-${ds}-${String(Math.floor(Math.random() * 900) + 100)}`;
}

export default function Logistics() {
  const [shipments, setShipments] = useState<Shipment[]>(mockShipments);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  const [newShipment, setNewShipment] = useState({
    caseId: "",
    doctor: "",
    patient: "",
    clinic: "",
    deliveryMethod: "courier" as Shipment["deliveryMethod"],
    trackingNumber: "",
    scheduledDate: "",
    notes: "",
    address: "",
  });

  const [editData, setEditData] = useState<Partial<Shipment>>({});

  const sel = shipments.find((s) => s.id === selectedId);

  const filtered = shipments
    .filter((s) => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        !q ||
        s.caseId.toLowerCase().includes(q) ||
        s.doctor.toLowerCase().includes(q) ||
        s.patient.toLowerCase().includes(q) ||
        s.clinic.toLowerCase().includes(q);
      const matchFilter = !filterStatus || s.status === filterStatus;
      return matchSearch && matchFilter;
    })
    .sort((a, b) => {
      const d = new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime();
      return sortAsc ? d : -d;
    });

  const counts = {
    total: shipments.length,
    delivered: shipments.filter((s) => s.status === "delivered").length,
    shipped: shipments.filter((s) => s.status === "shipped").length,
    preparing: shipments.filter((s) => s.status === "preparing").length,
  };

  /* ---- CRUD ---- */

  const handleAdd = () => {
    if (!newShipment.caseId.trim() || !newShipment.doctor.trim() || !newShipment.patient.trim()) return;
    const s: Shipment = {
      id: Date.now().toString(),
      caseId: newShipment.caseId || `CASE-2024-${String(nextId++).padStart(3, "0")}`,
      doctor: newShipment.doctor,
      patient: newShipment.patient,
      clinic: newShipment.clinic,
      deliveryMethod: newShipment.deliveryMethod,
      trackingNumber: newShipment.trackingNumber,
      status: "preparing",
      checklist: { qualityVerified: false, packaged: false, labeled: false, documented: false },
      scheduledDate: newShipment.scheduledDate || new Date().toISOString().split("T")[0],
      shippedDate: null,
      deliveredDate: null,
      notes: newShipment.notes,
      address: newShipment.address,
    };
    setShipments((prev) => [...prev, s]);
    setNewShipment({ caseId: "", doctor: "", patient: "", clinic: "", deliveryMethod: "courier", trackingNumber: "", scheduledDate: "", notes: "", address: "" });
    setShowAddModal(false);
    setSelectedId(s.id);
  };

  const handleDelete = (id: string) => {
    setShipments((prev) => prev.filter((s) => s.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const startEdit = () => {
    if (sel) {
      setEditData({ ...sel });
      setEditMode(true);
    }
  };

  const saveEdit = () => {
    if (!sel || !editData) return;
    setShipments((prev) =>
      prev.map((s) =>
        s.id === sel.id
          ? {
              ...s,
              deliveryMethod: (editData.deliveryMethod as Shipment["deliveryMethod"]) || s.deliveryMethod,
              trackingNumber: editData.trackingNumber ?? s.trackingNumber,
              address: editData.address ?? s.address,
              scheduledDate: editData.scheduledDate ?? s.scheduledDate,
              notes: editData.notes ?? s.notes,
            }
          : s,
      ),
    );
    setEditMode(false);
  };

  /* ---- Checklist ---- */

  const toggleChecklist = (id: string, key: keyof Shipment["checklist"]) => {
    setShipments((prev) =>
      prev.map((s) =>
        s.id === id && s.status === "preparing"
          ? { ...s, checklist: { ...s.checklist, [key]: !s.checklist[key] } }
          : s,
      ),
    );
  };

  const allChecked = (s: Shipment) =>
    s.checklist.qualityVerified && s.checklist.packaged && s.checklist.labeled && s.checklist.documented;

  /* ---- Actions ---- */

  const markReady = (id: string) => {
    const s = shipments.find((x) => x.id === id);
    if (!s || s.status !== "preparing" || !allChecked(s)) return;
    setShipments((prev) => prev.map((x) => (x.id === id ? { ...x, status: "ready" as const } : x)));
  };

  const shipIt = (id: string) => {
    const s = shipments.find((x) => x.id === id);
    if (!s || s.status !== "ready") return;
    const tracking = s.trackingNumber || generateTracking();
    setShipments((prev) =>
      prev.map((x) =>
        x.id === id
          ? { ...x, status: "shipped" as const, trackingNumber: tracking, shippedDate: new Date().toISOString().split("T")[0] }
          : x,
      ),
    );
  };

  const markDelivered = (id: string) => {
    const s = shipments.find((x) => x.id === id);
    if (!s || s.status !== "shipped") return;
    setShipments((prev) =>
      prev.map((x) =>
        x.id === id
          ? { ...x, status: "delivered" as const, deliveredDate: new Date().toISOString().split("T")[0] }
          : x,
      ),
    );
  };

  const cancelShipment = (id: string) => {
    setShipments((prev) => prev.map((x) => (x.id === id ? { ...x, status: "cancelled" as const } : x)));
  };

  const printLabel = () => {
    alert("Shipping label sent to printer.");
  };

  /* ---- Helpers ---- */

  const statusColor = (st: string) => {
    if (st === "preparing") return "bg-amber-100 text-amber-800";
    if (st === "ready") return "bg-blue-100 text-blue-800";
    if (st === "shipped") return "bg-indigo-100 text-indigo-800";
    if (st === "delivered") return "bg-green-100 text-green-800";
    if (st === "cancelled") return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  const methodLabel = (m: string) => {
    if (m === "courier") return "Courier";
    if (m === "pickup") return "Pickup";
    if (m === "mail") return "Mail";
    return m;
  };

  const inp =
    "w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Logistics & Shipping</h1>
        <p className="text-muted-foreground">
          Manage shipments, track deliveries, and coordinate pickups for completed cases
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Shipments", value: counts.total, icon: Package, color: "text-primary" },
          { label: "Delivered", value: counts.delivered, icon: CheckCircle, color: "text-green-600" },
          { label: "In Transit", value: counts.shipped, icon: Truck, color: "text-indigo-600" },
          { label: "Preparing", value: counts.preparing, icon: Clock, color: "text-amber-600" },
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
        {/* ---- Left: shipment list ---- */}
        <div className="lg:col-span-1">
          <div className="dlos-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">Shipments</h2>
              <Button size="sm" onClick={() => setShowAddModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New
              </Button>
            </div>

            <div className="space-y-2 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search shipments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`${inp} pl-10`}
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className={`flex-1 ${inp} text-xs py-1.5`}
                >
                  <option value="">All Status</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button
                  onClick={() => setSortAsc(!sortAsc)}
                  className="px-2 py-1.5 rounded-md border border-border hover:bg-secondary text-xs flex items-center gap-1"
                >
                  Date {sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {filtered.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSelectedId(s.id);
                    setEditMode(false);
                  }}
                  className={`w-full text-left p-3 rounded-md border transition-all ${
                    selectedId === s.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-semibold text-sm text-foreground">{s.caseId}</p>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${statusColor(s.status)}`}>
                      {s.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {s.doctor} &bull; {s.patient}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.clinic}</p>
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No shipments found</p>
              )}
            </div>
          </div>
        </div>

        {/* ---- Right: detail panel ---- */}
        <div className="lg:col-span-2">
          {sel ? (
            <div className="dlos-card">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-foreground">{sel.caseId}</h2>
                  <span className={`text-xs px-2 py-1 rounded mt-1 inline-block ${statusColor(sel.status)}`}>
                    {sel.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  {!editMode && (
                    <Button size="sm" variant="outline" onClick={startEdit}>
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(sel.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {editMode ? (
                /* ---- Edit form ---- */
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Delivery Method</label>
                      <select
                        value={editData.deliveryMethod ?? "courier"}
                        onChange={(e) =>
                          setEditData({ ...editData, deliveryMethod: e.target.value as Shipment["deliveryMethod"] })
                        }
                        className={inp}
                      >
                        <option value="courier">Courier</option>
                        <option value="pickup">Pickup</option>
                        <option value="mail">Mail</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Tracking Number</label>
                      <input
                        type="text"
                        value={editData.trackingNumber ?? ""}
                        onChange={(e) => setEditData({ ...editData, trackingNumber: e.target.value })}
                        className={inp}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs text-muted-foreground mb-1">Address</label>
                      <input
                        type="text"
                        value={editData.address ?? ""}
                        onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                        className={inp}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Scheduled Date</label>
                      <input
                        type="date"
                        value={editData.scheduledDate ?? ""}
                        onChange={(e) => setEditData({ ...editData, scheduledDate: e.target.value })}
                        className={inp}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Notes</label>
                    <textarea
                      value={editData.notes ?? ""}
                      onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                      rows={3}
                      className={`${inp} resize-none`}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setEditMode(false)}>
                      Cancel
                    </Button>
                    <Button onClick={saveEdit}>
                      <Check className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Details grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {(
                      [
                        ["Doctor", sel.doctor],
                        ["Patient", sel.patient],
                        ["Clinic", sel.clinic],
                        ["Delivery Method", methodLabel(sel.deliveryMethod)],
                        ["Tracking #", sel.trackingNumber || "\u2014"],
                        ["Address", sel.address || "\u2014"],
                        ["Scheduled", new Date(sel.scheduledDate).toLocaleDateString()],
                        ["Shipped", sel.shippedDate ? new Date(sel.shippedDate).toLocaleDateString() : "\u2014"],
                        ["Delivered", sel.deliveredDate ? new Date(sel.deliveredDate).toLocaleDateString() : "\u2014"],
                      ] as [string, string][]
                    ).map(([label, val]) => (
                      <div key={label}>
                        <p className="text-xs text-muted-foreground mb-1">{label}</p>
                        <p className="font-semibold text-foreground">{val}</p>
                      </div>
                    ))}
                  </div>

                  {sel.notes && (
                    <div className="mb-6">
                      <p className="text-xs text-muted-foreground mb-1">Notes</p>
                      <p className="text-sm bg-secondary/30 p-3 rounded-md">{sel.notes}</p>
                    </div>
                  )}

                  {/* ---- Checklist ---- */}
                  <div className="border-t border-border pt-6 mb-6">
                    <h3 className="font-semibold text-foreground mb-4">Shipment Checklist</h3>
                    <div className="space-y-2">
                      {(
                        [
                          ["qualityVerified", "Quality Verified"],
                          ["packaged", "Packaged"],
                          ["labeled", "Labeled"],
                          ["documented", "Documented"],
                        ] as [keyof Shipment["checklist"], string][]
                      ).map(([key, label]) => (
                        <button
                          key={key}
                          disabled={sel.status !== "preparing"}
                          onClick={() => toggleChecklist(sel.id, key)}
                          className={`w-full flex items-center gap-3 p-3 rounded-md border transition-all text-left ${
                            sel.checklist[key]
                              ? "border-green-300 bg-green-50"
                              : "border-border hover:border-primary/50"
                          } ${sel.status !== "preparing" ? "opacity-70 cursor-default" : "cursor-pointer"}`}
                        >
                          <div
                            className={`w-5 h-5 rounded flex items-center justify-center ${
                              sel.checklist[key] ? "bg-green-600 text-white" : "border border-border bg-background"
                            }`}
                          >
                            {sel.checklist[key] && <Check className="w-3 h-3" />}
                          </div>
                          <span className="text-sm font-medium text-foreground">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ---- Action buttons ---- */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                    {sel.status === "preparing" && (
                      <Button
                        onClick={() => markReady(sel.id)}
                        disabled={!allChecked(sel)}
                        className="flex-1"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark Ready
                      </Button>
                    )}
                    {sel.status === "ready" && (
                      <Button onClick={() => shipIt(sel.id)} className="flex-1">
                        <Send className="w-4 h-4 mr-2" />
                        Ship
                      </Button>
                    )}
                    {sel.status === "shipped" && (
                      <Button onClick={() => markDelivered(sel.id)} className="flex-1">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark Delivered
                      </Button>
                    )}
                    {sel.status !== "delivered" && sel.status !== "cancelled" && (
                      <Button
                        variant="outline"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => cancelShipment(sel.id)}
                      >
                        <Ban className="w-4 h-4 mr-2" />
                        Cancel Shipment
                      </Button>
                    )}
                    <Button variant="outline" onClick={printLabel}>
                      <Printer className="w-4 h-4 mr-2" />
                      Print Label
                    </Button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="dlos-card flex items-center justify-center min-h-[300px]">
              <p className="text-muted-foreground">Select a shipment to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* ---- Bottom reference cards ---- */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="dlos-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Shipment Checklist Reference</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-600" />Quality Verified — final QC sign-off before packaging</li>
            <li className="flex items-center gap-2"><Package className="w-4 h-4 text-blue-600" />Packaged — case securely packed with protective material</li>
            <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-indigo-600" />Labeled — shipping label affixed with correct address</li>
            <li className="flex items-center gap-2"><Truck className="w-4 h-4 text-amber-600" />Documented — packing slip, invoice, and instructions included</li>
          </ul>
        </div>
        <div className="dlos-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Logistics Responsibilities</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>&bull; Verify all QC checks before shipping</li>
            <li>&bull; Generate and attach shipping labels</li>
            <li>&bull; Coordinate courier / mail pickups</li>
            <li>&bull; Track shipments until delivery confirmation</li>
            <li>&bull; Document delivery status and timestamps</li>
            <li>&bull; Handle returns and re-shipments</li>
            <li>&bull; Maintain packaging supply inventory</li>
          </ul>
        </div>
      </div>

      {/* ---- Add Shipment Modal ---- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border border-border shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">New Shipment</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-secondary rounded-md"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Case ID *</label>
                  <input
                    type="text"
                    value={newShipment.caseId}
                    onChange={(e) => setNewShipment({ ...newShipment, caseId: e.target.value })}
                    placeholder="CASE-2024-XXX"
                    className={inp}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Doctor *</label>
                  <input
                    type="text"
                    value={newShipment.doctor}
                    onChange={(e) => setNewShipment({ ...newShipment, doctor: e.target.value })}
                    placeholder="Dr. Jane Smith"
                    className={inp}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Patient *</label>
                  <input
                    type="text"
                    value={newShipment.patient}
                    onChange={(e) => setNewShipment({ ...newShipment, patient: e.target.value })}
                    placeholder="Patient name"
                    className={inp}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Clinic</label>
                  <input
                    type="text"
                    value={newShipment.clinic}
                    onChange={(e) => setNewShipment({ ...newShipment, clinic: e.target.value })}
                    placeholder="Clinic name"
                    className={inp}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Delivery Method</label>
                  <select
                    value={newShipment.deliveryMethod}
                    onChange={(e) =>
                      setNewShipment({
                        ...newShipment,
                        deliveryMethod: e.target.value as Shipment["deliveryMethod"],
                      })
                    }
                    className={inp}
                  >
                    <option value="courier">Courier</option>
                    <option value="pickup">Pickup</option>
                    <option value="mail">Mail</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Scheduled Date</label>
                  <input
                    type="date"
                    value={newShipment.scheduledDate}
                    onChange={(e) => setNewShipment({ ...newShipment, scheduledDate: e.target.value })}
                    className={inp}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <input
                    type="text"
                    value={newShipment.address}
                    onChange={(e) => setNewShipment({ ...newShipment, address: e.target.value })}
                    placeholder="Full delivery address"
                    className={inp}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tracking Number</label>
                  <input
                    type="text"
                    value={newShipment.trackingNumber}
                    onChange={(e) => setNewShipment({ ...newShipment, trackingNumber: e.target.value })}
                    placeholder="Optional"
                    className={inp}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={newShipment.notes}
                  onChange={(e) => setNewShipment({ ...newShipment, notes: e.target.value })}
                  rows={3}
                  placeholder="Special handling instructions..."
                  className={`${inp} resize-none`}
                />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-border justify-end">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAdd}
                disabled={!newShipment.caseId.trim() || !newShipment.doctor.trim() || !newShipment.patient.trim()}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Shipment
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
