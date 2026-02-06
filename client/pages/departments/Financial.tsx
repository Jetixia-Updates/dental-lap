import { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  TrendingUp,
  FileText,
  Download,
  Search,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  AlertTriangle,
  Clock,
  CreditCard,
  BarChart3,
  ChevronRight,
} from "lucide-react";

interface FinanceRecord {
  id: number;
  caseId: string;
  doctor: string;
  patient: string;
  restorationType: string;
  materialCost: number;
  laborCost: number;
  overheadCost: number;
  billableAmount: number;
  status: "pending" | "invoiced" | "paid" | "overdue";
  invoiceNumber: string;
  invoiceDate: string;
  paidDate: string | null;
  notes: string;
}

const initialRecords: FinanceRecord[] = [
  {
    id: 1,
    caseId: "CASE-1001",
    doctor: "Dr. Sarah Mitchell",
    patient: "John Adams",
    restorationType: "Zirconia Crown",
    materialCost: 85,
    laborCost: 120,
    overheadCost: 35,
    billableAmount: 380,
    status: "paid",
    invoiceNumber: "INV-2026-0041",
    invoiceDate: "2026-01-15",
    paidDate: "2026-01-22",
    notes: "Rush order surcharge applied.",
  },
  {
    id: 2,
    caseId: "CASE-1002",
    doctor: "Dr. Kevin Park",
    patient: "Maria Lopez",
    restorationType: "PFM Bridge (3-unit)",
    materialCost: 210,
    laborCost: 300,
    overheadCost: 70,
    billableAmount: 950,
    status: "invoiced",
    invoiceNumber: "INV-2026-0055",
    invoiceDate: "2026-01-28",
    paidDate: null,
    notes: "",
  },
  {
    id: 3,
    caseId: "CASE-1003",
    doctor: "Dr. Amy Chen",
    patient: "Robert Taylor",
    restorationType: "Implant Abutment + Crown",
    materialCost: 160,
    laborCost: 200,
    overheadCost: 55,
    billableAmount: 720,
    status: "pending",
    invoiceNumber: "",
    invoiceDate: "",
    paidDate: null,
    notes: "Awaiting final shade verification.",
  },
  {
    id: 4,
    caseId: "CASE-1004",
    doctor: "Dr. James Wright",
    patient: "Emily Davis",
    restorationType: "E-max Veneer (x4)",
    materialCost: 320,
    laborCost: 400,
    overheadCost: 95,
    billableAmount: 1400,
    status: "overdue",
    invoiceNumber: "INV-2026-0038",
    invoiceDate: "2026-01-10",
    paidDate: null,
    notes: "Payment reminder sent twice.",
  },
  {
    id: 5,
    caseId: "CASE-1005",
    doctor: "Dr. Sarah Mitchell",
    patient: "Lisa Nguyen",
    restorationType: "Full Denture (Upper)",
    materialCost: 140,
    laborCost: 250,
    overheadCost: 60,
    billableAmount: 680,
    status: "paid",
    invoiceNumber: "INV-2026-0049",
    invoiceDate: "2026-01-20",
    paidDate: "2026-01-30",
    notes: "",
  },
];

const statusColors: Record<FinanceRecord["status"], string> = {
  pending: "bg-yellow-100 text-yellow-800",
  invoiced: "bg-blue-100 text-blue-800",
  paid: "bg-green-100 text-green-800",
  overdue: "bg-red-100 text-red-800",
};

const statusIcons: Record<FinanceRecord["status"], React.ReactNode> = {
  pending: <Clock className="w-3 h-3" />,
  invoiced: <FileText className="w-3 h-3" />,
  paid: <Check className="w-3 h-3" />,
  overdue: <AlertTriangle className="w-3 h-3" />,
};

function generateInvoiceNumber(): string {
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `INV-2026-${num}`;
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function fmt(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function Financial() {
  const [records, setRecords] = useState<FinanceRecord[]>(initialRecords);
  const [selectedId, setSelectedId] = useState<number | null>(initialRecords[0]?.id ?? null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | FinanceRecord["status"]>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<FinanceRecord>>({});

  // --- new record form state ---
  const emptyForm: Omit<FinanceRecord, "id"> = {
    caseId: "",
    doctor: "",
    patient: "",
    restorationType: "",
    materialCost: 0,
    laborCost: 0,
    overheadCost: 0,
    billableAmount: 0,
    status: "pending",
    invoiceNumber: "",
    invoiceDate: "",
    paidDate: null,
    notes: "",
  };
  const [newRecord, setNewRecord] = useState(emptyForm);

  // --- derived ---
  const filtered = useMemo(() => {
    return records.filter((r) => {
      const matchesSearch =
        searchTerm === "" ||
        r.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.restorationType.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [records, searchTerm, statusFilter]);

  const selected = records.find((r) => r.id === selectedId) ?? null;

  const stats = useMemo(() => {
    const totalRevenue = records.reduce((s, r) => s + r.billableAmount, 0);
    const outstanding = records
      .filter((r) => r.status === "pending" || r.status === "invoiced" || r.status === "overdue")
      .reduce((s, r) => s + r.billableAmount, 0);
    const paid = records.filter((r) => r.status === "paid").reduce((s, r) => s + r.billableAmount, 0);
    const margins = records.map((r) => {
      const cost = r.materialCost + r.laborCost + r.overheadCost;
      return cost > 0 ? ((r.billableAmount - cost) / r.billableAmount) * 100 : 0;
    });
    const avgMargin = margins.length ? margins.reduce((a, b) => a + b, 0) / margins.length : 0;
    return { totalRevenue, outstanding, paid, avgMargin };
  }, [records]);

  const avgCosts = useMemo(() => {
    if (!records.length) return { material: 0, labor: 0, overhead: 0 };
    return {
      material: records.reduce((s, r) => s + r.materialCost, 0) / records.length,
      labor: records.reduce((s, r) => s + r.laborCost, 0) / records.length,
      overhead: records.reduce((s, r) => s + r.overheadCost, 0) / records.length,
    };
  }, [records]);

  // --- handlers ---
  function addRecord() {
    const id = records.length ? Math.max(...records.map((r) => r.id)) + 1 : 1;
    setRecords([...records, { ...newRecord, id }]);
    setNewRecord(emptyForm);
    setShowAddModal(false);
    setSelectedId(id);
  }

  function deleteRecord(id: number) {
    setRecords(records.filter((r) => r.id !== id));
    if (selectedId === id) setSelectedId(records.find((r) => r.id !== id)?.id ?? null);
  }

  function startEdit(r: FinanceRecord) {
    setEditingId(r.id);
    setEditDraft({ materialCost: r.materialCost, laborCost: r.laborCost, overheadCost: r.overheadCost, billableAmount: r.billableAmount, notes: r.notes });
  }

  function saveEdit() {
    if (editingId == null) return;
    setRecords(records.map((r) => (r.id === editingId ? { ...r, ...editDraft } : r)));
    setEditingId(null);
    setEditDraft({});
  }

  function cancelEdit() {
    setEditingId(null);
    setEditDraft({});
  }

  function generateInvoice(id: number) {
    setRecords(
      records.map((r) =>
        r.id === id && r.status === "pending"
          ? { ...r, status: "invoiced" as const, invoiceNumber: generateInvoiceNumber(), invoiceDate: todayStr() }
          : r
      )
    );
  }

  function markPaid(id: number) {
    setRecords(
      records.map((r) =>
        r.id === id && (r.status === "invoiced" || r.status === "overdue")
          ? { ...r, status: "paid" as const, paidDate: todayStr() }
          : r
      )
    );
  }

  function markOverdue(id: number) {
    setRecords(
      records.map((r) =>
        r.id === id && r.status === "invoiced" ? { ...r, status: "overdue" as const } : r
      )
    );
  }

  function exportCSV() {
    const header = "ID,Case ID,Doctor,Patient,Restoration,Material Cost,Labor Cost,Overhead,Billable,Status,Invoice #,Invoice Date,Paid Date,Notes";
    const rows = records.map(
      (r) =>
        `${r.id},"${r.caseId}","${r.doctor}","${r.patient}","${r.restorationType}",${r.materialCost},${r.laborCost},${r.overheadCost},${r.billableAmount},${r.status},"${r.invoiceNumber}","${r.invoiceDate}","${r.paidDate ?? ""}","${r.notes}"`
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "financial_records.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function costTotal(r: FinanceRecord) {
    return r.materialCost + r.laborCost + r.overheadCost;
  }
  function profit(r: FinanceRecord) {
    return r.billableAmount - costTotal(r);
  }
  function marginPct(r: FinanceRecord) {
    return r.billableAmount > 0 ? ((profit(r) / r.billableAmount) * 100).toFixed(1) : "0.0";
  }

  // --- bar helper ---
  function CostBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
    const pct = max > 0 ? (value / max) * 100 : 0;
    return (
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{label}</span>
          <span className="font-medium">{fmt(value)}</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <DollarSign className="w-7 h-7 text-emerald-600" />
              Financial Department
            </h1>
            <p className="text-gray-500 mt-1">Billing, invoicing &amp; profitability tracking</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportCSV}>
              <Download className="w-4 h-4 mr-1" /> Export CSV
            </Button>
            <Button size="sm" onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-1" /> Add Record
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="dlos-card p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Total Revenue</p>
                <p className="text-xl font-bold text-gray-900">{fmt(stats.totalRevenue)}</p>
              </div>
            </div>
          </div>
          <div className="dlos-card p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Outstanding</p>
                <p className="text-xl font-bold text-gray-900">{fmt(stats.outstanding)}</p>
              </div>
            </div>
          </div>
          <div className="dlos-card p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <CreditCard className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Paid</p>
                <p className="text-xl font-bold text-gray-900">{fmt(stats.paid)}</p>
              </div>
            </div>
          </div>
          <div className="dlos-card p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Profit Margin</p>
                <p className="text-xl font-bold text-gray-900">{stats.avgMargin.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content: list + detail */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: record list (1/3) */}
          <div className="lg:col-span-1 space-y-3">
            {/* Search & Filter */}
            <div className="dlos-card p-3 rounded-lg border space-y-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="flex flex-wrap gap-1">
                {(["all", "pending", "invoiced", "paid", "overdue"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize transition ${
                      statusFilter === s ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filtered.length === 0 && (
                <div className="text-center text-sm text-gray-400 py-8">No records found.</div>
              )}
              {filtered.map((r) => (
                <div
                  key={r.id}
                  onClick={() => setSelectedId(r.id)}
                  className={`dlos-card p-3 rounded-lg border cursor-pointer transition hover:shadow-md ${
                    selectedId === r.id ? "ring-2 ring-emerald-500 border-emerald-300" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{r.caseId}</p>
                      <p className="text-xs text-gray-500 truncate">{r.patient} &middot; {r.doctor}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{r.restorationType}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[r.status]}`}>
                        {statusIcons[r.status]} {r.status}
                      </span>
                      <span className="text-sm font-bold text-gray-900">{fmt(r.billableAmount)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: detail panel (2/3) */}
          <div className="lg:col-span-2 space-y-4">
            {selected ? (
              <>
                {/* Detail header */}
                <div className="dlos-card p-5 rounded-lg border">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        {selected.caseId}
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                        <span className="text-gray-600 font-medium">{selected.restorationType}</span>
                      </h2>
                      <p className="text-sm text-gray-500">
                        {selected.patient} &bull; {selected.doctor}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {editingId === selected.id ? (
                        <>
                          <Button size="sm" variant="outline" onClick={cancelEdit}>
                            <X className="w-4 h-4 mr-1" /> Cancel
                          </Button>
                          <Button size="sm" onClick={saveEdit}>
                            <Check className="w-4 h-4 mr-1" /> Save
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" variant="outline" onClick={() => startEdit(selected)}>
                            <Edit className="w-4 h-4 mr-1" /> Edit
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteRecord(selected.id)}>
                            <Trash2 className="w-4 h-4 mr-1" /> Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Status & actions */}
                  <div className="flex flex-wrap items-center gap-2 mb-5">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusColors[selected.status]}`}>
                      {statusIcons[selected.status]} {selected.status}
                    </span>
                    {selected.invoiceNumber && (
                      <span className="text-sm text-gray-500">Invoice: {selected.invoiceNumber}</span>
                    )}
                    {selected.invoiceDate && (
                      <span className="text-sm text-gray-400">({selected.invoiceDate})</span>
                    )}
                    {selected.paidDate && (
                      <span className="text-sm text-green-600 font-medium">Paid: {selected.paidDate}</span>
                    )}
                  </div>

                  {/* Action buttons based on status */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {selected.status === "pending" && (
                      <Button size="sm" onClick={() => generateInvoice(selected.id)}>
                        <FileText className="w-4 h-4 mr-1" /> Generate Invoice
                      </Button>
                    )}
                    {(selected.status === "invoiced" || selected.status === "overdue") && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => markPaid(selected.id)}>
                        <CreditCard className="w-4 h-4 mr-1" /> Mark as Paid
                      </Button>
                    )}
                    {selected.status === "invoiced" && (
                      <Button size="sm" variant="destructive" onClick={() => markOverdue(selected.id)}>
                        <AlertTriangle className="w-4 h-4 mr-1" /> Mark Overdue
                      </Button>
                    )}
                  </div>

                  {/* Cost breakdown */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {editingId === selected.id ? (
                      <>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Material Cost</label>
                          <input
                            type="number"
                            value={editDraft.materialCost ?? 0}
                            onChange={(e) => setEditDraft({ ...editDraft, materialCost: +e.target.value })}
                            className="w-full border rounded px-2 py-1 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Labor Cost</label>
                          <input
                            type="number"
                            value={editDraft.laborCost ?? 0}
                            onChange={(e) => setEditDraft({ ...editDraft, laborCost: +e.target.value })}
                            className="w-full border rounded px-2 py-1 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Overhead</label>
                          <input
                            type="number"
                            value={editDraft.overheadCost ?? 0}
                            onChange={(e) => setEditDraft({ ...editDraft, overheadCost: +e.target.value })}
                            className="w-full border rounded px-2 py-1 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Billable Amount</label>
                          <input
                            type="number"
                            value={editDraft.billableAmount ?? 0}
                            onChange={(e) => setEditDraft({ ...editDraft, billableAmount: +e.target.value })}
                            className="w-full border rounded px-2 py-1 text-sm"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <p className="text-xs text-gray-500">Material</p>
                          <p className="text-lg font-semibold">{fmt(selected.materialCost)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Labor</p>
                          <p className="text-lg font-semibold">{fmt(selected.laborCost)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Overhead</p>
                          <p className="text-lg font-semibold">{fmt(selected.overheadCost)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Total Cost</p>
                          <p className="text-lg font-semibold text-red-600">{fmt(costTotal(selected))}</p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Profit row */}
                  {editingId !== selected.id && (
                    <div className="mt-4 flex items-center gap-6 pt-4 border-t">
                      <div>
                        <p className="text-xs text-gray-500">Billable Amount</p>
                        <p className="text-lg font-bold text-emerald-600">{fmt(selected.billableAmount)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Profit</p>
                        <p className={`text-lg font-bold ${profit(selected) >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                          {fmt(profit(selected))}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Margin</p>
                        <p className="text-lg font-bold text-blue-600">{marginPct(selected)}%</p>
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-gray-500 mb-1">Notes</p>
                    {editingId === selected.id ? (
                      <textarea
                        value={editDraft.notes ?? ""}
                        onChange={(e) => setEditDraft({ ...editDraft, notes: e.target.value })}
                        className="w-full border rounded px-2 py-1 text-sm h-20"
                      />
                    ) : (
                      <p className="text-sm text-gray-700">{selected.notes || "—"}</p>
                    )}
                  </div>
                </div>

                {/* Cost Breakdown Chart */}
                <div className="dlos-card p-5 rounded-lg border">
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-4">
                    <BarChart3 className="w-4 h-4 text-emerald-600" /> Average Cost Breakdown
                  </h3>
                  <div className="space-y-3">
                    <CostBar label="Material" value={avgCosts.material} max={Math.max(avgCosts.material, avgCosts.labor, avgCosts.overhead)} color="bg-blue-500" />
                    <CostBar label="Labor" value={avgCosts.labor} max={Math.max(avgCosts.material, avgCosts.labor, avgCosts.overhead)} color="bg-emerald-500" />
                    <CostBar label="Overhead" value={avgCosts.overhead} max={Math.max(avgCosts.material, avgCosts.labor, avgCosts.overhead)} color="bg-amber-500" />
                  </div>
                </div>
              </>
            ) : (
              <div className="dlos-card p-10 rounded-lg border text-center text-gray-400">
                Select a record to view details.
              </div>
            )}
          </div>
        </div>

        {/* Profitability Analysis */}
        <div className="dlos-card p-5 rounded-lg border">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-emerald-600" /> Profitability Analysis
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-2 font-medium">Case</th>
                  <th className="pb-2 font-medium">Restoration</th>
                  <th className="pb-2 font-medium text-right">Total Cost</th>
                  <th className="pb-2 font-medium text-right">Billable</th>
                  <th className="pb-2 font-medium text-right">Profit</th>
                  <th className="pb-2 font-medium text-right">Margin</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-2 font-medium text-gray-900">{r.caseId}</td>
                    <td className="py-2 text-gray-600">{r.restorationType}</td>
                    <td className="py-2 text-right text-gray-700">{fmt(costTotal(r))}</td>
                    <td className="py-2 text-right text-gray-700">{fmt(r.billableAmount)}</td>
                    <td className={`py-2 text-right font-medium ${profit(r) >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                      {fmt(profit(r))}
                    </td>
                    <td className="py-2 text-right">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                        parseFloat(marginPct(r)) >= 50
                          ? "bg-green-100 text-green-700"
                          : parseFloat(marginPct(r)) >= 30
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {marginPct(r)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Record Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Add Finance Record</h2>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs text-gray-500 mb-1">Case ID</label>
                  <input
                    type="text"
                    value={newRecord.caseId}
                    onChange={(e) => setNewRecord({ ...newRecord, caseId: e.target.value })}
                    className="w-full border rounded px-2 py-1.5 text-sm"
                    placeholder="CASE-XXXX"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs text-gray-500 mb-1">Doctor</label>
                  <input
                    type="text"
                    value={newRecord.doctor}
                    onChange={(e) => setNewRecord({ ...newRecord, doctor: e.target.value })}
                    className="w-full border rounded px-2 py-1.5 text-sm"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs text-gray-500 mb-1">Patient</label>
                  <input
                    type="text"
                    value={newRecord.patient}
                    onChange={(e) => setNewRecord({ ...newRecord, patient: e.target.value })}
                    className="w-full border rounded px-2 py-1.5 text-sm"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs text-gray-500 mb-1">Restoration Type</label>
                  <input
                    type="text"
                    value={newRecord.restorationType}
                    onChange={(e) => setNewRecord({ ...newRecord, restorationType: e.target.value })}
                    className="w-full border rounded px-2 py-1.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Material Cost</label>
                  <input
                    type="number"
                    value={newRecord.materialCost}
                    onChange={(e) => setNewRecord({ ...newRecord, materialCost: +e.target.value })}
                    className="w-full border rounded px-2 py-1.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Labor Cost</label>
                  <input
                    type="number"
                    value={newRecord.laborCost}
                    onChange={(e) => setNewRecord({ ...newRecord, laborCost: +e.target.value })}
                    className="w-full border rounded px-2 py-1.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Overhead</label>
                  <input
                    type="number"
                    value={newRecord.overheadCost}
                    onChange={(e) => setNewRecord({ ...newRecord, overheadCost: +e.target.value })}
                    className="w-full border rounded px-2 py-1.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Billable Amount</label>
                  <input
                    type="number"
                    value={newRecord.billableAmount}
                    onChange={(e) => setNewRecord({ ...newRecord, billableAmount: +e.target.value })}
                    className="w-full border rounded px-2 py-1.5 text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-gray-500 mb-1">Notes</label>
                  <textarea
                    value={newRecord.notes}
                    onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                    className="w-full border rounded px-2 py-1.5 text-sm h-16"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button onClick={addRecord} disabled={!newRecord.caseId || !newRecord.doctor || !newRecord.patient}>
                  <Plus className="w-4 h-4 mr-1" /> Add Record
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
