import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Check, Clock, AlertCircle } from "lucide-react";

interface FinishingCase {
  id: string;
  caseId: string;
  restorationType: string;
  material: string;
  status: "incoming" | "in-progress" | "completed";
  technician: string;
  shadeAdjustment: boolean;
  surfacePolish: boolean;
}

const mockCases: FinishingCase[] = [
  {
    id: "1",
    caseId: "CASE-2024-001",
    restorationType: "Crown",
    material: "Zirconia",
    status: "completed",
    technician: "Leonardo Rossi",
    shadeAdjustment: false,
    surfacePolish: true,
  },
  {
    id: "2",
    caseId: "CASE-2024-002",
    restorationType: "Bridge",
    material: "E.max",
    status: "in-progress",
    technician: "Nina Hassan",
    shadeAdjustment: true,
    surfacePolish: false,
  },
  {
    id: "3",
    caseId: "CASE-2024-003",
    restorationType: "Crown",
    material: "Zirconia",
    status: "incoming",
    technician: "Unassigned",
    shadeAdjustment: false,
    surfacePolish: false,
  },
];

export default function Finishing() {
  const [cases, setCases] = useState<FinishingCase[]>(mockCases);
  const [selectedCase, setSelectedCase] = useState<string | null>(null);

  const selectedCaseData = cases.find((c) => c.id === selectedCase);

  const handleToggleCheck = (id: string, field: "shadeAdjustment" | "surfacePolish") => {
    setCases(cases.map((c) => c.id === id ? { ...c, [field]: !c[field] } : c));
  };

  const handleComplete = (id: string) => {
    setCases(cases.map((c) => c.id === id ? { ...c, status: "completed" as const } : c));
  };

  const handleSendToQC = (id: string) => {
    setCases(cases.filter((c) => c.id !== id));
    setSelectedCase(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "incoming":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Ceramic & Finishing Department
        </h1>
        <p className="text-muted-foreground">
          Material finishing, customization, and final surface preparation
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="dlos-card">
          <p className="text-sm text-muted-foreground mb-1">Total Cases</p>
          <p className="text-3xl font-bold text-primary">{cases.length}</p>
        </div>
        <div className="dlos-card">
          <p className="text-sm text-muted-foreground mb-1">Completed</p>
          <p className="text-3xl font-bold text-green-600">
            {cases.filter((c) => c.status === "completed").length}
          </p>
        </div>
        <div className="dlos-card">
          <p className="text-sm text-muted-foreground mb-1">In Progress</p>
          <p className="text-3xl font-bold text-blue-600">
            {cases.filter((c) => c.status === "in-progress").length}
          </p>
        </div>
        <div className="dlos-card">
          <p className="text-sm text-muted-foreground mb-1">Efficiency</p>
          <p className="text-3xl font-bold text-accent">95%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Case List */}
        <div className="dlos-card">
          <h2 className="text-lg font-bold text-foreground mb-4">Work Queue</h2>
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
                  {caseItem.restorationType} • {caseItem.material}
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

        {/* Finishing Detail */}
        {selectedCaseData ? (
          <div className="lg:col-span-2 space-y-6">
            <div className="dlos-card">
              <h2 className="text-lg font-bold text-foreground mb-6">
                {selectedCaseData.caseId}
              </h2>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Restoration Type
                  </p>
                  <p className="font-semibold text-foreground">
                    {selectedCaseData.restorationType}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Material</p>
                  <p className="font-semibold text-foreground">
                    {selectedCaseData.material}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Assigned To
                  </p>
                  <p className="font-semibold text-foreground">
                    {selectedCaseData.technician}
                  </p>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="font-semibold text-foreground mb-4">
                  Finishing Checklist
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-2 rounded hover:bg-secondary/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCaseData.surfacePolish}
                      onChange={() => handleToggleCheck(selectedCaseData.id, "surfacePolish")}
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="text-sm text-foreground">
                      Surface polish and smoothing
                    </span>
                  </label>

                  <label className="flex items-center gap-3 p-2 rounded hover:bg-secondary/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCaseData.shadeAdjustment}
                      onChange={() => handleToggleCheck(selectedCaseData.id, "shadeAdjustment")}
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="text-sm text-foreground">
                      Shade refinement (if needed)
                    </span>
                  </label>

                  <label className="flex items-center gap-3 p-2 rounded hover:bg-secondary/50 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="text-sm text-foreground">
                      Gloss adjustment
                    </span>
                  </label>

                  <label className="flex items-center gap-3 p-2 rounded hover:bg-secondary/50 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="text-sm text-foreground">
                      Final cleaning and inspection
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex gap-2 mt-6 pt-6 border-t border-border">
                {selectedCaseData.status !== "completed" && (
                  <Button className="flex-1" onClick={() => handleComplete(selectedCaseData.id)}>
                    <Check className="w-4 h-4 mr-2" />
                    Complete
                  </Button>
                )}
                {selectedCaseData.status === "completed" && (
                  <Button className="flex-1" onClick={() => handleSendToQC(selectedCaseData.id)}>
                    <Check className="w-4 h-4 mr-2" />
                    Send to QC
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

      {/* Standards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="dlos-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Finishing Standards
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ Smooth surface finish (Ra 0.8 microns)</li>
            <li>✓ No visible scratches or defects</li>
            <li>✓ Proper shade if adjusted</li>
            <li>✓ Gloss matches specifications</li>
            <li>✓ Proper anatomy maintained</li>
            <li>✓ Ready for QC verification</li>
          </ul>
        </div>

        <div className="dlos-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Department Team
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Leonardo Rossi
              </span>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                Master Ceramist
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Nina Hassan</span>
              <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                Finishing Tech
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
