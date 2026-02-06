import { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus, Search, Trash2, Edit, Check, X, AlertTriangle, Package,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface Material {
  id: string;
  name: string;
  category: string;
  supplier: string;
  currentStock: number;
  minStock: number;
  unit: string;
  costPerUnit: number;
  lastRestocked: string;
}

const INITIAL: Material[] = [
  { id: "MAT-001", name: "Zirconia Disc (98mm)", category: "Milling", supplier: "Kuraray Noritake", currentStock: 12, minStock: 5, unit: "disc", costPerUnit: 85, lastRestocked: "2026-01-28" },
  { id: "MAT-002", name: "E-max Ingot HT A2", category: "Press", supplier: "Ivoclar", currentStock: 3, minStock: 10, unit: "ingot", costPerUnit: 42, lastRestocked: "2026-01-15" },
  { id: "MAT-003", name: "PMMA Disc (98mm)", category: "Milling", supplier: "Ivoclar", currentStock: 20, minStock: 8, unit: "disc", costPerUnit: 25, lastRestocked: "2026-02-01" },
  { id: "MAT-004", name: "Investment Powder", category: "Casting", supplier: "Bego", currentStock: 2, minStock: 5, unit: "kg", costPerUnit: 15, lastRestocked: "2026-01-20" },
  { id: "MAT-005", name: "Diamond Bur Set", category: "Tools", supplier: "Komet", currentStock: 8, minStock: 3, unit: "set", costPerUnit: 35, lastRestocked: "2026-02-03" },
  { id: "MAT-006", name: "Alginate Impression", category: "Impression", supplier: "GC America", currentStock: 15, minStock: 10, unit: "box", costPerUnit: 18, lastRestocked: "2026-02-04" },
];

const CATEGORIES = ["All", "Milling", "Press", "Casting", "Tools", "Impression", "Consumable"];

export default function Inventory() {
  const { t } = useTranslation();
  const [materials, setMaterials] = useState<Material[]>(INITIAL);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [showLowOnly, setShowLowOnly] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", category: "Milling", supplier: "", currentStock: 0, minStock: 5, unit: "disc", costPerUnit: 0 });

  const lowStockCount = useMemo(() => materials.filter(m => m.currentStock <= m.minStock).length, [materials]);

  const filtered = materials.filter(m => {
    const matchSearch = `${m.id} ${m.name} ${m.supplier}`.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === "All" || m.category === filterCategory;
    const matchLow = !showLowOnly || m.currentStock <= m.minStock;
    return matchSearch && matchCat && matchLow;
  });

  const resetForm = () => {
    setForm({ name: "", category: "Milling", supplier: "", currentStock: 0, minStock: 5, unit: "disc", costPerUnit: 0 });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = () => {
    if (!form.name || !form.supplier) return;
    if (editingId) {
      setMaterials(prev => prev.map(m => m.id === editingId ? { ...m, ...form } : m));
    } else {
      const nextId = `MAT-${String(materials.length + 1).padStart(3, "0")}`;
      setMaterials(prev => [...prev, { ...form, id: nextId, lastRestocked: new Date().toISOString().split("T")[0] }]);
    }
    resetForm();
  };

  const startEdit = (m: Material) => {
    setForm({ name: m.name, category: m.category, supplier: m.supplier, currentStock: m.currentStock, minStock: m.minStock, unit: m.unit, costPerUnit: m.costPerUnit });
    setEditingId(m.id);
    setShowForm(true);
  };

  const restock = (id: string, qty: number) => {
    setMaterials(prev => prev.map(m => m.id === id
      ? { ...m, currentStock: m.currentStock + qty, lastRestocked: new Date().toISOString().split("T")[0] }
      : m
    ));
  };

  const totalValue = useMemo(() => materials.reduce((sum, m) => sum + m.currentStock * m.costPerUnit, 0), [materials]);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2"><Package className="w-8 h-8" /> {t("deptPages.inventory.title")}</h1>
            <p className="text-muted-foreground mt-1">{t("deptPages.inventory.subtitle")}</p>
          </div>
          <Button onClick={() => { resetForm(); setShowForm(true); }}><Plus className="w-4 h-4 mr-2" /> Add Material</Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Items</p>
            <p className="text-2xl font-bold">{materials.length}</p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Low Stock</p>
            <p className="text-2xl font-bold text-red-600">{lowStockCount}</p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="text-2xl font-bold text-green-600">${totalValue.toLocaleString()}</p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Categories</p>
            <p className="text-2xl font-bold">{new Set(materials.map(m => m.category)).size}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search materials..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="border rounded-md px-3 py-2 text-sm">
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <Button variant={showLowOnly ? "default" : "outline"} size="sm" onClick={() => setShowLowOnly(!showLowOnly)} className="flex items-center gap-1">
            <AlertTriangle className="w-4 h-4" /> Low Stock ({lowStockCount})
          </Button>
        </div>

        {showForm && (
          <div className="bg-card border rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold">{editingId ? "Edit Material" : "Add New Material"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><Label>Name *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Material name" /></div>
              <div>
                <Label>Category</Label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm">
                  {CATEGORIES.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div><Label>Supplier *</Label><Input value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })} placeholder="Supplier name" /></div>
              <div><Label>Current Stock</Label><Input type="number" value={form.currentStock} onChange={e => setForm({ ...form, currentStock: +e.target.value })} /></div>
              <div><Label>Min Stock Level</Label><Input type="number" value={form.minStock} onChange={e => setForm({ ...form, minStock: +e.target.value })} /></div>
              <div><Label>Unit</Label><Input value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} placeholder="disc, kg, box..." /></div>
              <div><Label>Cost Per Unit ($)</Label><Input type="number" value={form.costPerUnit} onChange={e => setForm({ ...form, costPerUnit: +e.target.value })} /></div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={resetForm}><X className="w-4 h-4 mr-1" /> Cancel</Button>
              <Button onClick={handleSubmit} disabled={!form.name || !form.supplier}><Check className="w-4 h-4 mr-1" /> {editingId ? "Update" : "Add"}</Button>
            </div>
          </div>
        )}

        <div className="bg-card border rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                {["ID", "Name", "Category", "Supplier", "Stock", "Min", "Unit Cost", "Value", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-8 text-muted-foreground">No materials found</td></tr>
              ) : filtered.map(m => (
                <tr key={m.id} className={`border-t hover:bg-muted/30 ${m.currentStock <= m.minStock ? "bg-red-50" : ""}`}>
                  <td className="px-4 py-3 font-mono text-xs">{m.id}</td>
                  <td className="px-4 py-3 font-medium">
                    {m.name}
                    {m.currentStock <= m.minStock && <AlertTriangle className="w-3 h-3 text-red-500 inline ml-1" />}
                  </td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded bg-muted text-xs">{m.category}</span></td>
                  <td className="px-4 py-3">{m.supplier}</td>
                  <td className="px-4 py-3 font-semibold">{m.currentStock} {m.unit}</td>
                  <td className="px-4 py-3">{m.minStock}</td>
                  <td className="px-4 py-3">${m.costPerUnit}</td>
                  <td className="px-4 py-3">${(m.currentStock * m.costPerUnit).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => startEdit(m)}><Edit className="w-4 h-4" /></Button>
                      <Button size="sm" variant="outline" onClick={() => restock(m.id, 10)} className="text-xs">+10</Button>
                      <Button size="sm" variant="ghost" className="text-red-500" onClick={() => setMaterials(prev => prev.filter(x => x.id !== m.id))}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
