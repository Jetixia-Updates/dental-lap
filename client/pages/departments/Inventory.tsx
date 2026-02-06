import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Plus, AlertCircle, CheckCircle, X } from "lucide-react";

interface Material {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minQuantity: number;
  cost: number;
  status: "adequate" | "low" | "critical";
}

const mockMaterials: Material[] = [
  {
    id: "1",
    name: "Zirconia Discs (95mm)",
    category: "Milling Blanks",
    quantity: 45,
    minQuantity: 20,
    cost: 8500,
    status: "adequate",
  },
  {
    id: "2",
    name: "E.max Blocks",
    category: "Milling Blanks",
    quantity: 12,
    minQuantity: 15,
    cost: 4200,
    status: "low",
  },
  {
    id: "3",
    name: "Ceramic Stains",
    category: "Finishing",
    quantity: 8,
    minQuantity: 5,
    cost: 450,
    status: "adequate",
  },
  {
    id: "4",
    name: "3D Printer Resin",
    category: "3D Materials",
    quantity: 3,
    minQuantity: 5,
    cost: 1200,
    status: "critical",
  },
];

export default function Inventory() {
  const [materials, setMaterials] = useState<Material[]>(mockMaterials);
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [newMaterial, setNewMaterial] = useState({ name: "", category: "", quantity: 0, minQuantity: 0, cost: 0 });

  const handleAddMaterial = () => {
    if (!newMaterial.name.trim() || !newMaterial.category.trim()) return;
    const mat: Material = {
      id: Date.now().toString(),
      name: newMaterial.name,
      category: newMaterial.category,
      quantity: newMaterial.quantity,
      minQuantity: newMaterial.minQuantity,
      cost: newMaterial.cost,
      status: newMaterial.quantity <= 0 ? "critical" : newMaterial.quantity < newMaterial.minQuantity ? "low" : "adequate",
    };
    setMaterials([...materials, mat]);
    setNewMaterial({ name: "", category: "", quantity: 0, minQuantity: 0, cost: 0 });
    setShowAddMaterial(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "adequate":
        return "bg-green-100 text-green-800";
      case "low":
        return "bg-amber-100 text-amber-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTotalInventoryValue = () => {
    return materials.reduce((sum, m) => sum + m.cost, 0);
  };

  const getLowStockCount = () => {
    return materials.filter((m) => m.status !== "adequate").length;
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Inventory & Material Management
        </h1>
        <p className="text-muted-foreground">
          Track materials, manage stock levels, and control inventory
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="dlos-card">
          <p className="text-sm text-muted-foreground mb-1">Total Items</p>
          <p className="text-3xl font-bold text-primary">
            {materials.length}
          </p>
        </div>
        <div className="dlos-card">
          <p className="text-sm text-muted-foreground mb-1">Total Value</p>
          <p className="text-3xl font-bold text-accent">
            ${getTotalInventoryValue().toLocaleString()}
          </p>
        </div>
        <div className="dlos-card">
          <p className="text-sm text-muted-foreground mb-1">Low Stock Alerts</p>
          <p className="text-3xl font-bold text-amber-600">
            {getLowStockCount()}
          </p>
        </div>
        <div className="dlos-card">
          <p className="text-sm text-muted-foreground mb-1">Stock Health</p>
          <p className="text-3xl font-bold text-green-600">
            {(
              ((materials.length - getLowStockCount()) /
                materials.length) *
              100
            ).toFixed(0)}
            %
          </p>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="dlos-card mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-foreground">Materials Inventory</h2>
          <Button size="sm" onClick={() => setShowAddMaterial(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Material
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left px-4 py-3 font-semibold">Material</th>
                <th className="text-left px-4 py-3 font-semibold">Category</th>
                <th className="text-right px-4 py-3 font-semibold">Quantity</th>
                <th className="text-right px-4 py-3 font-semibold">Min Qty</th>
                <th className="text-right px-4 py-3 font-semibold">Cost</th>
                <th className="text-center px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {materials.map((material) => (
                <tr key={material.id} className="hover:bg-secondary/50">
                  <td className="px-4 py-3 font-medium text-foreground">
                    {material.name}
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {material.category}
                  </td>
                  <td className="px-4 py-3 text-right text-foreground">
                    {material.quantity}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {material.minQuantity}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-foreground">
                    ${material.cost.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded text-xs font-semibold ${getStatusColor(
                        material.status
                      )}`}
                    >
                      {material.status === "adequate"
                        ? "OK"
                        : material.status === "low"
                        ? "Low"
                        : "Critical"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reorder Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="dlos-card">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            Reorder Alerts
          </h3>
          <div className="space-y-3">
            {materials
              .filter((m) => m.status !== "adequate")
              .map((material) => (
                <div
                  key={material.id}
                  className={`p-3 rounded-md border ${
                    material.status === "critical"
                      ? "bg-red-50 border-red-200"
                      : "bg-amber-50 border-amber-200"
                  }`}
                >
                  <p className="text-sm font-semibold text-foreground">
                    {material.name}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      material.status === "critical"
                        ? "text-red-800"
                        : "text-amber-800"
                    }`}
                  >
                    {material.quantity} units (min: {material.minQuantity})
                  </p>
                  <Button
                    size="sm"
                    className="mt-2 w-full"
                    variant={
                      material.status === "critical" ? "default" : "outline"
                    }
                  >
                    Order Now
                  </Button>
                </div>
              ))}
          </div>
        </div>

        <div className="dlos-card">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Inventory Management
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ Real-time stock tracking</li>
            <li>✓ Automatic reorder alerts</li>
            <li>✓ Supplier management</li>
            <li>✓ Usage analytics</li>
            <li>✓ Cost tracking per item</li>
            <li>✓ Expired material tracking</li>
          </ul>
        </div>
      </div>

      {/* Suppliers */}
      <div className="mt-8 dlos-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Key Suppliers
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["Schütz", "3M ESPE", "Ivoclar Vivadent"].map((supplier) => (
            <div key={supplier} className="p-4 rounded-lg border border-border">
              <p className="font-semibold text-foreground">{supplier}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Authorized supplier
              </p>
              <Button size="sm" variant="outline" className="mt-3 w-full">
                Contact
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Material Dialog */}
      {showAddMaterial && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border border-border shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">Add Material</h2>
              <button onClick={() => setShowAddMaterial(false)} className="p-1 hover:bg-secondary rounded-md">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Material Name *</label>
                <input type="text" value={newMaterial.name} onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })} placeholder="e.g. Zirconia Discs" className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Category *</label>
                <input type="text" value={newMaterial.category} onChange={(e) => setNewMaterial({ ...newMaterial, category: e.target.value })} placeholder="e.g. Milling Blanks" className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Quantity</label>
                  <input type="number" value={newMaterial.quantity} onChange={(e) => setNewMaterial({ ...newMaterial, quantity: Number(e.target.value) })} className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Min Qty</label>
                  <input type="number" value={newMaterial.minQuantity} onChange={(e) => setNewMaterial({ ...newMaterial, minQuantity: Number(e.target.value) })} className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Cost ($)</label>
                  <input type="number" value={newMaterial.cost} onChange={(e) => setNewMaterial({ ...newMaterial, cost: Number(e.target.value) })} className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-border justify-end">
              <Button variant="outline" onClick={() => setShowAddMaterial(false)}>Cancel</Button>
              <Button onClick={handleAddMaterial} disabled={!newMaterial.name.trim() || !newMaterial.category.trim()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Material
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
