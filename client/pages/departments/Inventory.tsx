import { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Package,
  Search,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  ShoppingCart,
  ArrowUpDown,
  X,
  Check,
  RotateCcw,
  Boxes,
  DollarSign,
  Tags,
  Truck,
} from "lucide-react";

interface Material {
  id: number;
  name: string;
  category: string;
  sku: string;
  currentStock: number;
  minStock: number;
  unit: string;
  supplier: string;
  costPerUnit: number;
  lastRestocked: string;
  location: string;
}

const initialMaterials: Material[] = [
  {
    id: 1,
    name: "Zirconia Blocks",
    category: "Ceramic",
    sku: "ZRC-BLK-001",
    currentStock: 45,
    minStock: 20,
    unit: "blocks",
    supplier: "Ivoclar Vivadent",
    costPerUnit: 85.0,
    lastRestocked: "2026-01-28",
    location: "Shelf A1",
  },
  {
    id: 2,
    name: "E.max Ingots",
    category: "Ceramic",
    sku: "EMX-ING-002",
    currentStock: 8,
    minStock: 15,
    unit: "pcs",
    supplier: "Ivoclar Vivadent",
    costPerUnit: 42.5,
    lastRestocked: "2026-01-15",
    location: "Shelf A2",
  },
  {
    id: 3,
    name: "Cobalt-Chrome Powder",
    category: "Metal",
    sku: "CCR-PWD-003",
    currentStock: 2500,
    minStock: 1000,
    unit: "grams",
    supplier: "EOS GmbH",
    costPerUnit: 0.35,
    lastRestocked: "2026-02-01",
    location: "Cabinet B1",
  },
  {
    id: 4,
    name: "PMMA Discs",
    category: "Polymer",
    sku: "PMM-DSC-004",
    currentStock: 5,
    minStock: 10,
    unit: "blocks",
    supplier: "Yamahachi Dental",
    costPerUnit: 28.0,
    lastRestocked: "2026-01-10",
    location: "Shelf C1",
  },
  {
    id: 5,
    name: "Bonding Agent",
    category: "Consumable",
    sku: "BND-AGT-005",
    currentStock: 120,
    minStock: 50,
    unit: "ml",
    supplier: "3M Dental",
    costPerUnit: 0.95,
    lastRestocked: "2026-01-22",
    location: "Cabinet D1",
  },
  {
    id: 6,
    name: "Polishing Paste",
    category: "Consumable",
    sku: "POL-PST-006",
    currentStock: 3,
    minStock: 10,
    unit: "pcs",
    supplier: "3M Dental",
    costPerUnit: 18.5,
    lastRestocked: "2026-01-05",
    location: "Cabinet D2",
  },
];

const emptyMaterial: Omit<Material, "id"> = {
  name: "",
  category: "Ceramic",
  sku: "",
  currentStock: 0,
  minStock: 0,
  unit: "pcs",
  supplier: "",
  costPerUnit: 0,
  lastRestocked: new Date().toISOString().split("T")[0],
  location: "",
};

const categories = ["Ceramic", "Metal", "Polymer", "Consumable"];

export default function Inventory() {
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"name" | "stock">("name");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Material | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState<Omit<Material, "id">>(emptyMaterial);
  const [restockId, setRestockId] = useState<number | null>(null);
  const [restockQty, setRestockQty] = useState("");

  // --- Derived data ---
  const filtered = useMemo(() => {
    let list = materials.filter((m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.sku.toLowerCase().includes(search.toLowerCase())
    );
    if (filterCategory !== "All") {
      list = list.filter((m) => m.category === filterCategory);
    }
    list.sort((a, b) =>
      sortBy === "name"
        ? a.name.localeCompare(b.name)
        : a.currentStock - b.currentStock
    );
    return list;
  }, [materials, search, filterCategory, sortBy]);

  const lowStockItems = materials.filter((m) => m.currentStock <= m.minStock);
  const totalValue = materials.reduce(
    (sum, m) => sum + m.currentStock * m.costPerUnit,
    0
  );
  const uniqueCategories = [...new Set(materials.map((m) => m.category))];
  const uniqueSuppliers = [...new Set(materials.map((m) => m.supplier))];
  const selectedMaterial = materials.find((m) => m.id === selectedId) ?? null;

  // --- Handlers ---
  function handleAdd() {
    const newId = Math.max(0, ...materials.map((m) => m.id)) + 1;
    setMaterials((prev) => [...prev, { ...addForm, id: newId }]);
    setAddForm(emptyMaterial);
    setShowAddModal(false);
  }

  function handleDelete(id: number) {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
    if (selectedId === id) setSelectedId(null);
    if (editingId === id) {
      setEditingId(null);
      setEditForm(null);
    }
  }

  function startEdit(mat: Material) {
    setEditingId(mat.id);
    setEditForm({ ...mat });
  }

  function saveEdit() {
    if (!editForm) return;
    setMaterials((prev) =>
      prev.map((m) => (m.id === editForm.id ? editForm : m))
    );
    setEditingId(null);
    setEditForm(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm(null);
  }

  function handleRestock(id: number) {
    const qty = parseInt(restockQty, 10);
    if (isNaN(qty) || qty <= 0) return;
    setMaterials((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              currentStock: m.currentStock + qty,
              lastRestocked: new Date().toISOString().split("T")[0],
            }
          : m
      )
    );
    setRestockId(null);
    setRestockQty("");
  }

  function handleOrderNow(id: number) {
    setMaterials((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              currentStock: m.minStock * 2,
              lastRestocked: new Date().toISOString().split("T")[0],
            }
          : m
      )
    );
  }

  const isLow = (m: Material) => m.currentStock <= m.minStock;

  return (
    <Layout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Package className="h-7 w-7 text-primary" />
              Inventory &amp; Materials
            </h1>
            <p className="text-muted-foreground mt-1">
              Track stock levels, manage materials, and handle reordering
            </p>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Add Material
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="dlos-card p-5 flex items-center gap-4">
            <div className="rounded-full bg-blue-100 p-3 text-blue-600">
              <Boxes className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Materials</p>
              <p className="text-2xl font-bold">{materials.length}</p>
            </div>
          </div>
          <div className="dlos-card p-5 flex items-center gap-4">
            <div className="rounded-full bg-red-100 p-3 text-red-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Low Stock Alerts</p>
              <p className="text-2xl font-bold text-red-600">
                {lowStockItems.length}
              </p>
            </div>
          </div>
          <div className="dlos-card p-5 flex items-center gap-4">
            <div className="rounded-full bg-purple-100 p-3 text-purple-600">
              <Tags className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Categories</p>
              <p className="text-2xl font-bold">{uniqueCategories.length}</p>
            </div>
          </div>
          <div className="dlos-card p-5 flex items-center gap-4">
            <div className="rounded-full bg-green-100 p-3 text-green-600">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-2xl font-bold">
                ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        {/* Search / Filter / Sort */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-input bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setSortBy(sortBy === "name" ? "stock" : "name")}
          >
            <ArrowUpDown className="h-4 w-4" />
            Sort: {sortBy === "name" ? "Name" : "Stock"}
          </Button>
        </div>

        {/* Main content: list + detail */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Material list */}
          <div className="lg:col-span-2 space-y-3">
            {filtered.length === 0 && (
              <div className="dlos-card p-8 text-center text-muted-foreground">
                No materials found.
              </div>
            )}
            {filtered.map((mat) => {
              const low = isLow(mat);
              const editing = editingId === mat.id;
              return (
                <div
                  key={mat.id}
                  className={`dlos-card p-4 cursor-pointer transition-all ${
                    low ? "border-red-400 bg-red-50/60" : ""
                  } ${selectedId === mat.id ? "ring-2 ring-primary" : ""}`}
                  onClick={() => {
                    if (!editing) setSelectedId(mat.id);
                  }}
                >
                  {editing && editForm ? (
                    /* ---- Inline edit mode ---- */
                    <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">Name</label>
                          <input
                            className="w-full rounded border border-input bg-background px-2 py-1 text-sm"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">SKU</label>
                          <input
                            className="w-full rounded border border-input bg-background px-2 py-1 text-sm"
                            value={editForm.sku}
                            onChange={(e) => setEditForm({ ...editForm, sku: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">Category</label>
                          <select
                            className="w-full rounded border border-input bg-background px-2 py-1 text-sm"
                            value={editForm.category}
                            onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                          >
                            {categories.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">Unit</label>
                          <input
                            className="w-full rounded border border-input bg-background px-2 py-1 text-sm"
                            value={editForm.unit}
                            onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">Current Stock</label>
                          <input
                            type="number"
                            className="w-full rounded border border-input bg-background px-2 py-1 text-sm"
                            value={editForm.currentStock}
                            onChange={(e) => setEditForm({ ...editForm, currentStock: Number(e.target.value) })}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">Min Stock</label>
                          <input
                            type="number"
                            className="w-full rounded border border-input bg-background px-2 py-1 text-sm"
                            value={editForm.minStock}
                            onChange={(e) => setEditForm({ ...editForm, minStock: Number(e.target.value) })}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">Supplier</label>
                          <input
                            className="w-full rounded border border-input bg-background px-2 py-1 text-sm"
                            value={editForm.supplier}
                            onChange={(e) => setEditForm({ ...editForm, supplier: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">Cost/Unit ($)</label>
                          <input
                            type="number"
                            step="0.01"
                            className="w-full rounded border border-input bg-background px-2 py-1 text-sm"
                            value={editForm.costPerUnit}
                            onChange={(e) => setEditForm({ ...editForm, costPerUnit: Number(e.target.value) })}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">Location</label>
                          <input
                            className="w-full rounded border border-input bg-background px-2 py-1 text-sm"
                            value={editForm.location}
                            onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="ghost" onClick={cancelEdit}>
                          <X className="h-4 w-4 mr-1" /> Cancel
                        </Button>
                        <Button size="sm" onClick={saveEdit}>
                          <Check className="h-4 w-4 mr-1" /> Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    /* ---- Display mode ---- */
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold truncate">{mat.name}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                            {mat.category}
                          </span>
                          {low && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" /> Low
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          SKU: {mat.sku} &bull; {mat.currentStock} / {mat.minStock} {mat.unit}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        {/* Restock */}
                        {restockId === mat.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="1"
                              placeholder="Qty"
                              value={restockQty}
                              onChange={(e) => setRestockQty(e.target.value)}
                              className="w-16 rounded border border-input bg-background px-2 py-1 text-sm"
                            />
                            <Button size="sm" variant="ghost" onClick={() => handleRestock(mat.id)}>
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => { setRestockId(null); setRestockQty(""); }}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            title="Restock"
                            onClick={() => setRestockId(mat.id)}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        )}
                        {low && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-300 gap-1"
                            onClick={() => handleOrderNow(mat.id)}
                          >
                            <ShoppingCart className="h-3 w-3" /> Order Now
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => startEdit(mat)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(mat.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Detail panel */}
          <div className="space-y-4">
            <div className="dlos-card p-5">
              <h2 className="font-semibold mb-3">Material Details</h2>
              {selectedMaterial ? (
                <dl className="space-y-2 text-sm">
                  {([
                    ["Name", selectedMaterial.name],
                    ["SKU", selectedMaterial.sku],
                    ["Category", selectedMaterial.category],
                    ["Current Stock", `${selectedMaterial.currentStock} ${selectedMaterial.unit}`],
                    ["Min Stock", `${selectedMaterial.minStock} ${selectedMaterial.unit}`],
                    ["Supplier", selectedMaterial.supplier],
                    ["Cost / Unit", `$${selectedMaterial.costPerUnit.toFixed(2)}`],
                    ["Location", selectedMaterial.location],
                    ["Last Restocked", selectedMaterial.lastRestocked],
                    [
                      "Inventory Value",
                      `$${(selectedMaterial.currentStock * selectedMaterial.costPerUnit).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`,
                    ],
                  ] as [string, string][]).map(([label, value]) => (
                    <div key={label} className="flex justify-between">
                      <dt className="text-muted-foreground">{label}</dt>
                      <dd className="font-medium text-right">{value}</dd>
                    </div>
                  ))}
                  {isLow(selectedMaterial) && (
                    <div className="mt-3 rounded-md bg-red-50 border border-red-200 p-3 text-red-700 text-xs flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Stock is at or below minimum level. Reorder recommended.
                    </div>
                  )}
                </dl>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Select a material to view details.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Supplier directory */}
        <div className="dlos-card p-5">
          <h2 className="font-semibold flex items-center gap-2 mb-4">
            <Truck className="h-5 w-5 text-primary" /> Supplier Directory
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {uniqueSuppliers.map((supplier) => {
              const supplierMats = materials.filter((m) => m.supplier === supplier);
              return (
                <div key={supplier} className="rounded-lg border p-4">
                  <p className="font-medium">{supplier}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {supplierMats.length} material{supplierMats.length !== 1 ? "s" : ""}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {supplierMats.map((m) => (
                      <span
                        key={m.id}
                        className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                      >
                        {m.name}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add Material Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-background rounded-lg shadow-xl w-full max-w-lg p-6 space-y-4 mx-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Add New Material</h2>
                <Button size="sm" variant="ghost" onClick={() => setShowAddModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Name *</label>
                  <input
                    className="w-full rounded border border-input bg-background px-2 py-1 text-sm"
                    value={addForm.name}
                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">SKU *</label>
                  <input
                    className="w-full rounded border border-input bg-background px-2 py-1 text-sm"
                    value={addForm.sku}
                    onChange={(e) => setAddForm({ ...addForm, sku: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Category</label>
                  <select
                    className="w-full rounded border border-input bg-background px-2 py-1 text-sm"
                    value={addForm.category}
                    onChange={(e) => setAddForm({ ...addForm, category: e.target.value })}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Unit</label>
                  <input
                    className="w-full rounded border border-input bg-background px-2 py-1 text-sm"
                    value={addForm.unit}
                    onChange={(e) => setAddForm({ ...addForm, unit: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Current Stock</label>
                  <input
                    type="number"
                    className="w-full rounded border border-input bg-background px-2 py-1 text-sm"
                    value={addForm.currentStock}
                    onChange={(e) => setAddForm({ ...addForm, currentStock: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Min Stock</label>
                  <input
                    type="number"
                    className="w-full rounded border border-input bg-background px-2 py-1 text-sm"
                    value={addForm.minStock}
                    onChange={(e) => setAddForm({ ...addForm, minStock: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Supplier</label>
                  <input
                    className="w-full rounded border border-input bg-background px-2 py-1 text-sm"
                    value={addForm.supplier}
                    onChange={(e) => setAddForm({ ...addForm, supplier: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Cost/Unit ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full rounded border border-input bg-background px-2 py-1 text-sm"
                    value={addForm.costPerUnit}
                    onChange={(e) => setAddForm({ ...addForm, costPerUnit: Number(e.target.value) })}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium text-muted-foreground">Location</label>
                  <input
                    className="w-full rounded border border-input bg-background px-2 py-1 text-sm"
                    value={addForm.location}
                    onChange={(e) => setAddForm({ ...addForm, location: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAdd} disabled={!addForm.name || !addForm.sku}>
                  <Plus className="h-4 w-4 mr-1" /> Add Material
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
