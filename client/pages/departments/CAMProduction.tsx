import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Zap,
  Check,
  AlertCircle,
} from "lucide-react";

interface ProductionCase {
  id: string;
  caseId: string;
  processType: "milling" | "3d-printing";
  status: "queued" | "running" | "completed";
  equipment: string;
  estimatedTime: number;
  progress: number;
  started?: string;
}

const mockCases: ProductionCase[] = [
  {
    id: "1",
    caseId: "CASE-2024-001",
    processType: "milling",
    status: "completed",
    equipment: "Roland DWX-52",
    estimatedTime: 45,
    progress: 100,
    started: "2024-02-09",
  },
  {
    id: "2",
    caseId: "CASE-2024-002",
    processType: "3d-printing",
    status: "running",
    equipment: "Formlabs Form 3",
    estimatedTime: 180,
    progress: 65,
    started: "2024-02-10",
  },
  {
    id: "3",
    caseId: "CASE-2024-003",
    processType: "milling",
    status: "queued",
    equipment: "DentMill",
    estimatedTime: 50,
    progress: 0,
  },
];

export default function CAMProduction() {
  const [cases, setCases] = useState<ProductionCase[]>(mockCases);
  const [selectedCase, setSelectedCase] = useState<string | null>(null);

  const selectedCaseData = cases.find((c) => c.id === selectedCase);

  const handleStartProduction = (id: string) => {
    setCases(cases.map((c) => c.id === id ? { ...c, status: "running" as const, progress: 10, started: new Date().toISOString().split("T")[0] } : c));
  };

  const handleCompleteProduction = (id: string) => {
    setCases(cases.map((c) => c.id === id ? { ...c, status: "completed" as const, progress: 100 } : c));
  };

  const handleSendToFinishing = (id: string) => {
    setCases(cases.filter((c) => c.id !== id));
    setSelectedCase(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "running":
        return "bg-blue-100 text-blue-800";
      case "queued":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          CAM / Milling / 3D Printing
        </h1>
        <p className="text-muted-foreground">
          Production scheduling, equipment management, and manufacturing control
        </p>
      </div>

      {/* Equipment Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="dlos-card">
          <p className="text-sm text-muted-foreground mb-1">Total Cases</p>
          <p className="text-3xl font-bold text-primary">{cases.length}</p>
        </div>
        <div className="dlos-card">
          <p className="text-sm text-muted-foreground mb-1">Running</p>
          <p className="text-3xl font-bold text-blue-600">
            {cases.filter((c) => c.status === "running").length}
          </p>
        </div>
        <div className="dlos-card">
          <p className="text-sm text-muted-foreground mb-1">Completed</p>
          <p className="text-3xl font-bold text-green-600">
            {cases.filter((c) => c.status === "completed").length}
          </p>
        </div>
        <div className="dlos-card">
          <p className="text-sm text-muted-foreground mb-1">Queue Depth</p>
          <p className="text-3xl font-bold text-amber-600">
            {cases.filter((c) => c.status === "queued").length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Production Queue */}
        <div className="dlos-card">
          <h2 className="text-lg font-bold text-foreground mb-4">Production Queue</h2>
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
                  {caseItem.processType.replace("-", " ")}
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

        {/* Production Detail */}
        {selectedCaseData ? (
          <div className="lg:col-span-2 space-y-6">
            <div className="dlos-card">
              <h2 className="text-lg font-bold text-foreground mb-6">
                {selectedCaseData.caseId}
              </h2>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Process Type</p>
                  <p className="font-semibold text-foreground">
                    {selectedCaseData.processType === "milling"
                      ? "CNC Milling"
                      : "3D Printing"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Equipment</p>
                  <p className="font-semibold text-foreground">
                    {selectedCaseData.equipment}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Estimated Time
                  </p>
                  <p className="font-semibold text-foreground">
                    {selectedCaseData.estimatedTime} minutes
                  </p>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="font-semibold text-foreground mb-4">
                  Production Progress
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        Completion
                      </span>
                      <span className="text-sm font-bold text-primary">
                        {selectedCaseData.progress}%
                      </span>
                    </div>
                    <div className="h-3 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent"
                        style={{ width: `${selectedCaseData.progress}%` }}
                      />
                    </div>
                  </div>

                  {selectedCaseData.status === "running" && (
                    <div className="pt-3">
                      <h4 className="text-sm font-semibold text-foreground mb-2">
                        Current Status
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Running on {selectedCaseData.equipment}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Estimated completion: {selectedCaseData.estimatedTime} min
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mt-6 pt-6 border-t border-border">
                {selectedCaseData.status === "queued" && (
                  <Button className="flex-1" onClick={() => handleStartProduction(selectedCaseData.id)}>
                    <Zap className="w-4 h-4 mr-2" />
                    Start Production
                  </Button>
                )}
                {selectedCaseData.status === "running" && (
                  <Button className="flex-1" onClick={() => handleCompleteProduction(selectedCaseData.id)}>
                    <Check className="w-4 h-4 mr-2" />
                    Mark Complete
                  </Button>
                )}
                {selectedCaseData.status === "completed" && (
                  <Button className="flex-1" onClick={() => handleSendToFinishing(selectedCaseData.id)}>
                    <Check className="w-4 h-4 mr-2" />
                    Send to Finishing
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 dlos-card flex items-center justify-center">
            <p className="text-center text-muted-foreground">
              Select a case to view production details
            </p>
          </div>
        )}
      </div>

      {/* Production Standards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="dlos-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Equipment Specs
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ Roland DWX-52: Zirconia, Composite</li>
            <li>✓ DentMill: Ceramic blocks</li>
            <li>✓ Formlabs Form 3: Resins, surgical guides</li>
            <li>✓ 3D printers for temporary restorations</li>
            <li>✓ Maintenance schedules per manufacturer</li>
            <li>✓ Quality checks after each run</li>
          </ul>
        </div>

        <div className="dlos-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Production Team
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Marcus Steel
              </span>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                Milling Technician
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Rachel Price
              </span>
              <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                3D Print Operator
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
