import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Clock, Check, Truck } from "lucide-react";

interface LogisticsCase {
  id: string;
  caseId: string;
  doctor: string;
  status: "ready" | "shipped" | "delivered";
  preparedDate: string;
  estimatedDelivery: string;
  trackingNumber?: string;
}

const mockCases: LogisticsCase[] = [
  {
    id: "1",
    caseId: "CASE-2024-001",
    doctor: "Dr. John Smith",
    status: "delivered",
    preparedDate: "2024-02-10",
    estimatedDelivery: "2024-02-12",
    trackingNumber: "TRK-2024-001",
  },
  {
    id: "2",
    caseId: "CASE-2024-002",
    doctor: "Dr. Sarah Johnson",
    status: "shipped",
    preparedDate: "2024-02-10",
    estimatedDelivery: "2024-02-13",
    trackingNumber: "TRK-2024-002",
  },
  {
    id: "3",
    caseId: "CASE-2024-003",
    doctor: "Dr. James Wilson",
    status: "ready",
    preparedDate: "2024-02-10",
    estimatedDelivery: "2024-02-12",
  },
];

export default function Logistics() {
  const [cases, setCases] = useState<LogisticsCase[]>(mockCases);
  const [selectedCase, setSelectedCase] = useState<string | null>(null);

  const selectedCaseData = cases.find((c) => c.id === selectedCase);

  const handleShipCase = (id: string) => {
    setCases(cases.map((c) => c.id === id ? { ...c, status: "shipped" as const, trackingNumber: `TRK-${Date.now()}` } : c));
  };

  const handleMarkDelivered = (id: string) => {
    setCases(cases.map((c) => c.id === id ? { ...c, status: "delivered" as const } : c));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "ready":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Logistics, Delivery & Documentation
        </h1>
        <p className="text-muted-foreground">
          Case packaging, shipping, delivery tracking, and documentation
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="dlos-card">
          <p className="text-sm text-muted-foreground mb-1">Total Cases</p>
          <p className="text-3xl font-bold text-primary">{cases.length}</p>
        </div>
        <div className="dlos-card">
          <p className="text-sm text-muted-foreground mb-1">Delivered</p>
          <p className="text-3xl font-bold text-green-600">
            {cases.filter((c) => c.status === "delivered").length}
          </p>
        </div>
        <div className="dlos-card">
          <p className="text-sm text-muted-foreground mb-1">In Transit</p>
          <p className="text-3xl font-bold text-blue-600">
            {cases.filter((c) => c.status === "shipped").length}
          </p>
        </div>
        <div className="dlos-card">
          <p className="text-sm text-muted-foreground mb-1">Ready to Ship</p>
          <p className="text-3xl font-bold text-amber-600">
            {cases.filter((c) => c.status === "ready").length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Case List */}
        <div className="dlos-card">
          <h2 className="text-lg font-bold text-foreground mb-4">
            Delivery Queue
          </h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {cases.map((caseItem) => (
              <button
                key={caseItem.id}
                onClick={() => setSelectedCase(caseItem.id)}
                className={`w-full text-left p-3 rounded-md border transition-all ${
                  selectedCase === caseItem.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <p className="font-semibold text-sm text-foreground">
                  {caseItem.caseId}
                </p>
                <p className="text-xs text-muted-foreground mb-2">
                  {caseItem.doctor}
                </p>
                <span
                  className={`text-xs px-2 py-1 rounded inline-block ${getStatusColor(
                    caseItem.status
                  )}`}
                >
                  {caseItem.status}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Logistics Detail */}
        {selectedCaseData ? (
          <div className="lg:col-span-2 space-y-6">
            <div className="dlos-card">
              <h2 className="text-lg font-bold text-foreground mb-6">
                {selectedCaseData.caseId}
              </h2>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Doctor</p>
                  <p className="font-semibold text-foreground">
                    {selectedCaseData.doctor}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Prepared Date
                  </p>
                  <p className="font-semibold text-foreground">
                    {new Date(selectedCaseData.preparedDate).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Est. Delivery
                  </p>
                  <p className="font-semibold text-foreground">
                    {new Date(
                      selectedCaseData.estimatedDelivery
                    ).toLocaleDateString()}
                  </p>
                </div>

                {selectedCaseData.trackingNumber && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Tracking
                    </p>
                    <p className="font-semibold text-foreground">
                      {selectedCaseData.trackingNumber}
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="font-semibold text-foreground mb-4">
                  Shipment Checklist
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-2 rounded hover:bg-secondary/50 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="text-sm text-foreground">
                      Case properly packaged
                    </span>
                  </label>

                  <label className="flex items-center gap-3 p-2 rounded hover:bg-secondary/50 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="text-sm text-foreground">
                      Documentation included
                    </span>
                  </label>

                  <label className="flex items-center gap-3 p-2 rounded hover:bg-secondary/50 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="text-sm text-foreground">
                      QC report attached
                    </span>
                  </label>

                  <label className="flex items-center gap-3 p-2 rounded hover:bg-secondary/50 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="text-sm text-foreground">
                      Shipping label attached
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex gap-2 mt-6 pt-6 border-t border-border">
                {selectedCaseData.status === "ready" && (
                  <Button className="flex-1" onClick={() => handleShipCase(selectedCaseData.id)}>
                    <Truck className="w-4 h-4 mr-2" />
                    Ship Case
                  </Button>
                )}
                {selectedCaseData.status === "shipped" && (
                  <Button className="flex-1" onClick={() => handleMarkDelivered(selectedCaseData.id)}>
                    <Check className="w-4 h-4 mr-2" />
                    Mark Delivered
                  </Button>
                )}
                {selectedCaseData.status === "delivered" && (
                  <Button disabled variant="outline" className="flex-1">
                    <Check className="w-4 h-4 mr-2" />
                    Delivered
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 dlos-card flex items-center justify-center">
            <p className="text-center text-muted-foreground">
              Select a case to view details
            </p>
          </div>
        )}
      </div>

      {/* Logistics Standards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="dlos-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Documentation Requirements
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ Completed QC report</li>
            <li>✓ Case specifications sheet</li>
            <li>✓ Doctor communication log</li>
            <li>✓ Shade documentation</li>
            <li>✓ Special instructions</li>
            <li>✓ Digital case backup</li>
          </ul>
        </div>

        <div className="dlos-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Department Team
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Kevin Martin
              </span>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                Logistics Manager
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Lisa Anderson
              </span>
              <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                Shipping Coordinator
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
