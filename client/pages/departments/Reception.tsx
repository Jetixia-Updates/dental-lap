import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Check,
  X,
  AlertCircle,
  Clock,
  Users,
  TrendingUp,
} from "lucide-react";

interface IntakeCase {
  id: string;
  caseId: string;
  doctor: string;
  datReceived: string;
  prescriptionStatus: "complete" | "incomplete" | "review";
  dataValidation: string[];
  missingData: string[];
}

const mockCases: IntakeCase[] = [
  {
    id: "1",
    caseId: "CASE-2024-010",
    doctor: "Dr. John Smith",
    datReceived: "2024-02-10",
    prescriptionStatus: "complete",
    dataValidation: [
      "Doctor info",
      "Patient demographics",
      "Tooth selection",
      "Shade selected",
      "Material specified",
    ],
    missingData: [],
  },
  {
    id: "2",
    caseId: "CASE-2024-011",
    doctor: "Dr. Sarah Johnson",
    datReceived: "2024-02-10",
    prescriptionStatus: "incomplete",
    dataValidation: ["Doctor info", "Patient demographics", "Tooth selection"],
    missingData: ["Shade", "Material", "Special instructions"],
  },
  {
    id: "3",
    caseId: "CASE-2024-012",
    doctor: "Dr. Michael Brown",
    datReceived: "2024-02-09",
    prescriptionStatus: "review",
    dataValidation: [
      "Doctor info",
      "Patient demographics",
      "Tooth selection",
      "Shade selected",
    ],
    missingData: ["Margin type"],
  },
];

export default function Reception() {
  const [cases, setCases] = useState<IntakeCase[]>(mockCases);
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [showAddCase, setShowAddCase] = useState(false);
  const [newCase, setNewCase] = useState({ caseId: "", doctor: "" });

  const handleAddCase = () => {
    if (!newCase.caseId.trim() || !newCase.doctor.trim()) return;
    const c: IntakeCase = {
      id: Date.now().toString(),
      caseId: newCase.caseId,
      doctor: newCase.doctor,
      datReceived: new Date().toISOString().split("T")[0],
      prescriptionStatus: "incomplete",
      dataValidation: ["Doctor info"],
      missingData: ["Patient demographics", "Tooth selection", "Shade", "Material"],
    };
    setCases([...cases, c]);
    setNewCase({ caseId: "", doctor: "" });
    setShowAddCase(false);
  };

  const selectedCaseData = cases.find((c) => c.id === selectedCase);
  const completedCount = cases.filter((c) => c.prescriptionStatus === "complete")
    .length;
  const incompleteCount = cases.filter((c) => c.prescriptionStatus === "incomplete")
    .length;

  const handleApprove = (id: string) => {
    setCases(
      cases.map((c) =>
        c.id === id ? { ...c, prescriptionStatus: "complete" } : c
      )
    );
    setSelectedCase(null);
  };

  const handleRequestInfo = (id: string) => {
    setCases(
      cases.map((c) =>
        c.id === id ? { ...c, prescriptionStatus: "review" } : c
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "complete":
        return "bg-green-100 text-green-800";
      case "incomplete":
        return "bg-red-100 text-red-800";
      case "review":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Reception & Case Intake
        </h1>
        <p className="text-muted-foreground">
          Validate prescriptions, process case intake, and ensure data completeness
        </p>
      </div>

      {/* Department Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="dlos-card">
          <div className="flex items-center gap-3 mb-3">
            <Clock className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Cases Today</span>
          </div>
          <p className="text-3xl font-bold text-primary">{cases.length}</p>
        </div>
        <div className="dlos-card">
          <div className="flex items-center gap-3 mb-3">
            <Check className="w-5 h-5 text-green-600" />
            <span className="text-sm text-muted-foreground">Approved</span>
          </div>
          <p className="text-3xl font-bold text-green-600">{completedCount}</p>
        </div>
        <div className="dlos-card">
          <div className="flex items-center gap-3 mb-3">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <span className="text-sm text-muted-foreground">Need Review</span>
          </div>
          <p className="text-3xl font-bold text-amber-600">
            {incompleteCount + (cases.filter((c) => c.prescriptionStatus === "review").length)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Case List */}
        <div className="lg:col-span-1">
          <div className="dlos-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">Cases to Process</h2>
              <Button size="sm" onClick={() => setShowAddCase(true)}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>

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
                  <p className="text-xs text-muted-foreground">
                    {caseItem.doctor}
                  </p>
                  <div className="mt-2">
                    <span
                      className={`text-xs px-2 py-1 rounded inline-block ${getStatusColor(
                        caseItem.prescriptionStatus
                      )}`}
                    >
                      {caseItem.prescriptionStatus.replace("_", " ")}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Case Detail */}
        <div className="lg:col-span-2">
          {selectedCaseData ? (
            <div className="space-y-6">
              <div className="dlos-card">
                <h2 className="text-xl font-bold text-foreground mb-4">
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
                      Date Received
                    </p>
                    <p className="font-semibold text-foreground">
                      {new Date(selectedCaseData.datReceived).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="font-semibold text-foreground mb-4">
                    Prescription Validation
                  </h3>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-green-600 mb-3">
                      ✓ Data Validated
                    </h4>
                    <ul className="space-y-2">
                      {selectedCaseData.dataValidation.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-2 text-sm text-foreground"
                        >
                          <Check className="w-4 h-4 text-green-600" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {selectedCaseData.missingData.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-red-600 mb-3">
                        ✗ Missing Data
                      </h4>
                      <ul className="space-y-2">
                        {selectedCaseData.missingData.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-center gap-2 text-sm text-foreground"
                          >
                            <X className="w-4 h-4 text-red-600" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-6 pt-6 border-t border-border">
                  {selectedCaseData.prescriptionStatus === "complete" ? (
                    <div className="flex-1 flex items-center justify-center text-green-600 font-semibold">
                      ✓ Approved
                    </div>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleRequestInfo(selectedCaseData.id)}
                      >
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Request Info
                      </Button>
                      <Button
                        className="flex-1"
                        disabled={selectedCaseData.missingData.length > 0}
                        onClick={() => handleApprove(selectedCaseData.id)}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="dlos-card h-full flex items-center justify-center">
              <p className="text-center text-muted-foreground">
                Select a case to review prescription
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Intake Protocol */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="dlos-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Standard Data Required
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ Doctor contact and credentials</li>
            <li>✓ Patient demographics</li>
            <li>✓ Tooth number and type</li>
            <li>✓ Restoration type (crown, bridge, etc.)</li>
            <li>✓ Desired shade</li>
            <li>✓ Material specification</li>
            <li>✓ Margin design</li>
            <li>✓ Special instructions</li>
          </ul>
        </div>

        <div className="dlos-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Intake Responsibilities
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ Validate all prescription data</li>
            <li>✓ Identify and request missing information</li>
            <li>✓ Assign internal case ID</li>
            <li>✓ Define case priority</li>
            <li>✓ Set turnaround time</li>
            <li>✓ Route to planning department</li>
            <li>✓ Document all communications</li>
            <li>✓ Archive prescription files</li>
          </ul>
        </div>
      </div>

      {/* Add Case Dialog */}
      {showAddCase && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border border-border shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">Add Intake Case</h2>
              <button onClick={() => setShowAddCase(false)} className="p-1 hover:bg-secondary rounded-md">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Case ID *</label>
                <input type="text" value={newCase.caseId} onChange={(e) => setNewCase({ ...newCase, caseId: e.target.value })} placeholder="CASE-2024-013" className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Doctor *</label>
                <input type="text" value={newCase.doctor} onChange={(e) => setNewCase({ ...newCase, doctor: e.target.value })} placeholder="Dr. Jane Smith" className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-border justify-end">
              <Button variant="outline" onClick={() => setShowAddCase(false)}>Cancel</Button>
              <Button onClick={handleAddCase} disabled={!newCase.caseId.trim() || !newCase.doctor.trim()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Case
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
