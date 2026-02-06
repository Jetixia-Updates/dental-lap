import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, Zap, Users } from "lucide-react";

interface ScanCase {
  id: string;
  caseId: string;
  type: "physical-scan" | "digital-only" | "hybrid";
  status: "pending" | "in-progress" | "completed";
  datReceived: string;
  scanMethod: string;
  dataQuality: "excellent" | "good" | "review-needed";
}

const mockCases: ScanCase[] = [
  {
    id: "1",
    caseId: "CASE-2024-001",
    type: "hybrid",
    status: "completed",
    datReceived: "2024-02-08",
    scanMethod: "Intraoral scan + physical model",
    dataQuality: "excellent",
  },
  {
    id: "2",
    caseId: "CASE-2024-002",
    type: "digital-only",
    status: "in-progress",
    datReceived: "2024-02-09",
    scanMethod: "Desktop scanner",
    dataQuality: "good",
  },
  {
    id: "3",
    caseId: "CASE-2024-003",
    type: "physical-scan",
    status: "pending",
    datReceived: "2024-02-10",
    scanMethod: "3D volumetric scan",
    dataQuality: "excellent",
  },
];

export default function ModelScan() {
  const [cases, setCases] = useState<ScanCase[]>(mockCases);
  const [selectedCase, setSelectedCase] = useState<string | null>(null);

  const selectedCaseData = cases.find((c) => c.id === selectedCase);

  const handleApproveScan = (id: string) => {
    setCases(cases.map((c) => c.id === id ? { ...c, status: "completed" as const } : c));
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "excellent":
        return "bg-green-100 text-green-800";
      case "good":
        return "bg-blue-100 text-blue-800";
      case "review-needed":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Model & Scan Department
        </h1>
        <p className="text-muted-foreground">
          Manage physical models, digital scans, and data quality verification
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
          <p className="text-sm text-muted-foreground mb-1">Data Quality</p>
          <p className="text-3xl font-bold text-accent">
            {(
              (cases.filter((c) => c.dataQuality === "excellent").length /
                cases.length) *
              100
            ).toFixed(0)}
            %
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Case List */}
        <div className="dlos-card">
          <h2 className="text-lg font-bold text-foreground mb-4">Cases Queue</h2>
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
                <div className="flex gap-2 mt-2">
                  <span
                    className={`text-xs px-2 py-1 rounded ${getStatusColor(
                      caseItem.status
                    )}`}
                  >
                    {caseItem.status}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${getQualityColor(
                      caseItem.dataQuality
                    )}`}
                  >
                    {caseItem.dataQuality.replace("-", " ")}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Case Detail */}
        {selectedCaseData ? (
          <div className="lg:col-span-2 space-y-6">
            <div className="dlos-card">
              <h2 className="text-lg font-bold text-foreground mb-6">
                {selectedCaseData.caseId}
              </h2>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Scan Type</p>
                  <p className="font-semibold text-foreground">
                    {selectedCaseData.type.replace("-", " ")}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Scan Method</p>
                  <p className="font-semibold text-foreground">
                    {selectedCaseData.scanMethod}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Date Received</p>
                  <p className="font-semibold text-foreground">
                    {new Date(selectedCaseData.datReceived).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="font-semibold text-foreground mb-4">Data Quality Assessment</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Scan Resolution
                    </span>
                    <span className="font-semibold text-foreground">
                      {selectedCaseData.dataQuality === "excellent"
                        ? "High-res"
                        : "Standard"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Data Completeness
                    </span>
                    <span className="font-semibold text-green-600">100%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Ready for CAD
                    </span>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-6 pt-6 border-t border-border">
                <Button variant="outline" className="flex-1">
                  View 3D Data
                </Button>
                <Button className="flex-1" onClick={() => handleApproveScan(selectedCaseData.id)} disabled={selectedCaseData.status === "completed"}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {selectedCaseData.status === "completed" ? "Approved" : "Approve"}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 dlos-card flex items-center justify-center">
            <p className="text-center text-muted-foreground">
              Select a case to view scan details
            </p>
          </div>
        )}
      </div>

      {/* Standards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="dlos-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Scanning Standards
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ Minimum 50 micron accuracy</li>
            <li>✓ Full arch coverage required</li>
            <li>✓ Antagonist scan recommended</li>
            <li>✓ Shaded model for reference</li>
            <li>✓ STL file format with backup</li>
            <li>✓ Quality assurance check</li>
          </ul>
        </div>

        <div className="dlos-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Department Team
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Emily Watson</span>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                Scanner Tech
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">David Lee</span>
              <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                Model Tech
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
