import { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Search, Check, X, DollarSign, Download, FileText, Edit,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface CaseFinance {
  id: string;
  patient: string;
  doctor: string;
  restorationType: string;
  materialCost: number;
  laborCost: number;
  overheadCost: number;
  price: number;
  invoiceStatus: "draft" | "sent" | "paid" | "overdue";
  paymentDate: string;
  notes: string;
}

const INITIAL: CaseFinance[] = [
  { id: "CASE-001", patient: "Ahmed M.", doctor: "Dr. Smith", restorationType: "Crown x2", materialCost: 170, laborCost: 200, overheadCost: 50, price: 600, invoiceStatus: "paid", paymentDate: "2026-02-05", notes: "" },
  { id: "CASE-002", patient: "Sara K.", doctor: "Dr. Johnson", restorationType: "Veneer", materialCost: 42, laborCost: 150, overheadCost: 30, price: 350, invoiceStatus: "sent", paymentDate: "", notes: "" },
  { id: "CASE-003", patient: "Omar R.", doctor: "Dr. Lee", restorationType: "Bridge 3-unit", materialCost: 250, laborCost: 400, overheadCost: 80, price: 1200, invoiceStatus: "draft", paymentDate: "", notes: "Complex case" },
  { id: "CASE-004", patient: "Layla T.", doctor: "Dr. Smith", restorationType: "Night Guard", materialCost: 25, laborCost: 60, overheadCost: 15, price: 180, invoiceStatus: "overdue", paymentDate: "", notes: "Follow up needed" },
];

export default function Financial() {
  const { t } = useTranslation();
  const [cases, setCases] = useState<CaseFinance[]>(INITIAL);
  const [search, setSearch] = useState("");
  const [filterInvoice, setFilterInvoice] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ materialCost: 0, laborCost: 0, overheadCost: 0, price: 0, notes: "" });

  const filtered = cases.filter(c => {
    const match = `${c.id} ${c.patient} ${c.doctor}`.toLowerCase().includes(search.toLowerCase());
    const invoice = filterInvoice === "all" || c.invoiceStatus === filterInvoice;
    return match && invoice;
  });

  const totals = useMemo(() => ({
    revenue: cases.filter(c => c.invoiceStatus === "paid").reduce((s, c) => s + c.price, 0),
    outstanding: cases.filter(c => c.invoiceStatus === "sent" || c.invoiceStatus === "overdue").reduce((s, c) => s + c.price, 0),
    costs: cases.reduce((s, c) => s + c.materialCost + c.laborCost + c.overheadCost, 0),
    profit: cases.filter(c => c.invoiceStatus === "paid").reduce((s, c) => s + c.price - c.materialCost - c.laborCost - c.overheadCost, 0),
  }), [cases]);

  const startEdit = (c: CaseFinance) => {
    setForm({ materialCost: c.materialCost, laborCost: c.laborCost, overheadCost: c.overheadCost, price: c.price, notes: c.notes });
    setEditingId(c.id);
  };

  const saveEdit = () => {
    if (!editingId) return;
    setCases(prev => prev.map(c => c.id === editingId ? { ...c, ...form } : c));
    setEditingId(null);
  };

  const sendInvoice = (id: string) => setCases(prev => prev.map(c => c.id === id ? { ...c, invoiceStatus: "sent" } : c));
  const markPaid = (id: string) => setCases(prev => prev.map(c => c.id === id ? { ...c, invoiceStatus: "paid", paymentDate: new Date().toISOString().split("T")[0] } : c));

  const exportCSV = () => {
    const header = "Case ID,Patient,Doctor,Type,Material Cost,Labor Cost,Overhead,Price,Profit,Invoice Status\n";
    const rows = cases.map(c => `${c.id},${c.patient},${c.doctor},${c.restorationType},${c.materialCost},${c.laborCost},${c.overheadCost},${c.price},${c.price - c.materialCost - c.laborCost - c.overheadCost},${c.invoiceStatus}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "financial-report.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const statusColor: Record<string, string> = {
    draft: "bg-gray-100 text-gray-700",
    sent: "bg-blue-100 text-blue-800",
    paid: "bg-green-100 text-green-800",
    overdue: "bg-red-100 text-red-800",
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2"><DollarSign className="w-8 h-8" /> {t("deptPages.financial.title")}</h1>
            <p className="text-muted-foreground mt-1">{t("deptPages.financial.subtitle")}</p>
          </div>
          <Button variant="outline" onClick={exportCSV}><Download className="w-4 h-4 mr-2" /> Export CSV</Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Revenue (Paid)</p>
            <p className="text-2xl font-bold text-green-600">${totals.revenue.toLocaleString()}</p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Outstanding</p>
            <p className="text-2xl font-bold text-yellow-600">${totals.outstanding.toLocaleString()}</p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Costs</p>
            <p className="text-2xl font-bold text-red-600">${totals.costs.toLocaleString()}</p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Net Profit (Paid)</p>
            <p className="text-2xl font-bold text-blue-600">${totals.profit.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <select value={filterInvoice} onChange={e => setFilterInvoice(e.target.value)} className="border rounded-md px-3 py-2 text-sm">
            <option value="all">All Invoices</option>
            {["draft", "sent", "paid", "overdue"].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="bg-card border rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                {["Case", "Patient", "Doctor", "Type", "Material", "Labor", "Overhead", "Total Cost", "Price", "Profit", "Invoice", "Actions"].map(h => (
                  <th key={h} className="text-left px-3 py-3 font-medium text-muted-foreground text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={12} className="text-center py-8 text-muted-foreground">No cases found</td></tr>
              ) : filtered.map(c => {
                const totalCost = c.materialCost + c.laborCost + c.overheadCost;
                const profit = c.price - totalCost;
                return editingId === c.id ? (
                  <tr key={c.id} className="border-t bg-muted/20">
                    <td colSpan={12} className="px-4 py-4">
                      <div className="space-y-3">
                        <h3 className="font-semibold">{c.id} — {c.patient}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                          <div><Label>Material $</Label><Input type="number" value={form.materialCost} onChange={e => setForm({ ...form, materialCost: +e.target.value })} /></div>
                          <div><Label>Labor $</Label><Input type="number" value={form.laborCost} onChange={e => setForm({ ...form, laborCost: +e.target.value })} /></div>
                          <div><Label>Overhead $</Label><Input type="number" value={form.overheadCost} onChange={e => setForm({ ...form, overheadCost: +e.target.value })} /></div>
                          <div><Label>Price $</Label><Input type="number" value={form.price} onChange={e => setForm({ ...form, price: +e.target.value })} /></div>
                          <div><Label>Notes</Label><Input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button size="sm" variant="outline" onClick={() => setEditingId(null)}><X className="w-4 h-4 mr-1" /> Cancel</Button>
                          <Button size="sm" onClick={saveEdit}><Check className="w-4 h-4 mr-1" /> Save</Button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={c.id} className="border-t hover:bg-muted/30">
                    <td className="px-3 py-3 font-mono text-xs">{c.id}</td>
                    <td className="px-3 py-3">{c.patient}</td>
                    <td className="px-3 py-3">{c.doctor}</td>
                    <td className="px-3 py-3">{c.restorationType}</td>
                    <td className="px-3 py-3">${c.materialCost}</td>
                    <td className="px-3 py-3">${c.laborCost}</td>
                    <td className="px-3 py-3">${c.overheadCost}</td>
                    <td className="px-3 py-3 font-semibold">${totalCost}</td>
                    <td className="px-3 py-3 font-semibold">${c.price}</td>
                    <td className={`px-3 py-3 font-semibold ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>${profit}</td>
                    <td className="px-3 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[c.invoiceStatus]}`}>{c.invoiceStatus}</span></td>
                    <td className="px-3 py-3">
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => startEdit(c)}><Edit className="w-4 h-4" /></Button>
                        {c.invoiceStatus === "draft" && <Button size="sm" variant="outline" className="text-xs" onClick={() => sendInvoice(c.id)}><FileText className="w-3 h-3 mr-1" /> Send</Button>}
                        {(c.invoiceStatus === "sent" || c.invoiceStatus === "overdue") && <Button size="sm" className="text-xs bg-green-600 hover:bg-green-700" onClick={() => markPaid(c.id)}>Paid</Button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
