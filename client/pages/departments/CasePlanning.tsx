import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Check,
  AlertCircle,
  Zap,
  Eye,
  Users,
} from "lucide-react";

interface PlanningCase {
  id: string;
  caseId: string;
  patient: string;
  caseType: string;
  material: string;
  complexity: "simple" | "moderate" | "complex";
  status: "not-started" | "in-progress" | "ready";
  assignedTo: string;
}

const mockCases: PlanningCase[] = [
  {
    id: "1",
    caseId: "CASE-2024-001",
    patient: "Jane Doe",
    caseType: "Zirconia Crown",
    material: "Zirconia",
    complexity: "simple",
    status: "ready",
    assignedTo: "James Park",
  },
  {
    id: "2",
    caseId: "CASE-2024-002",
    patient: "Michael Brown",
    caseType: "E.max Bridge",
    material: "E.max",
    complexity: "complex",
    status: "in-progress",
    assignedTo: "Dr. Lisa Rodriguez",
  },
  {
    id: "3",
    caseId: "CASE-2024-003",
    patient: "Emily Garcia",
    caseType: "Implant Crown",
    material: "Zirconia",
    complexity: "moderate",
    status: "not-started",
    assignedTo: "Unassigned",
  },
];

const decisionMatrix = [
  {
    indication: "Single tooth, anterior",
    recommendation: "E.max or Zirconia",
    reasons: ["Excellent esthetics", "Natural light transmission"],
  },
  {
    indication: "Single tooth, posterior",
    recommendation: "Zirconia",
    reasons: ["Superior strength", "High durability"],
  },
  {
    indication: "Bridge (span > 2 units)",
    recommendation: "Zirconia",
    reasons: ["High strength", "Excellent longevity"],
  },
  {
    indication: "Implant crown, single",
    recommendation: "Zirconia or E.max",
    reasons: ["No metal allergies", "Better esthetics"],
  },
];

export default function CasePlanning() {
  const [cases, setCases] = useState<PlanningCase[]>(mockCases);
  const [selectedCase, setSelectedCase] = useState<string | null>(null);

  const selectedCaseData = cases.find((c) => c.id === selectedCase);

  const handleApprovePlan = (id: string) => {
    setCases(cases.map((c) => c.id === id ? { ...c, status: "ready" as const } : c));
  };

  const handleFlagIssue = (id: string) => {
    setCases(cases.map((c) => c.id === id ? { ...c, status: "not-started" as const, complexity: "complex" as const } : c));
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "simple":
        return "bg-green-100 text-green-800";
      case "moderate":
        return "bg-amber-100 text-amber-800";
      case "complex":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "not-started":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Case Planning & Prescription Analysis
        </h1>
        <p className="text-muted-foreground">
          Analyze prescriptions, determine optimal materials, and plan case strategy
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="dlos-card">
          <p className="text-sm text-muted-foreground mb-1">Cases in Queue</p>
          <p className="text-3xl font-bold text-primary">{cases.length}</p>
        </div>
        <div className="dlos-card">
          <p className="text-sm text-muted-foreground mb-1">Completed Today</p>
          <p className="text-3xl font-bold text-green-600">
            {cases.filter((c) => c.status === "ready").length}
          </p>
        </div>
        <div className="dlos-card">
          <p className="text-sm text-muted-foreground mb-1">In Progress</p>
          <p className="text-3xl font-bold text-blue-600">
            {cases.filter((c) => c.status === "in-progress").length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Case List */}
        <div className="dlos-card">
          <h2 className="text-lg font-bold text-foreground mb-4">Cases to Plan</h2>
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
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-sm text-foreground">
                      {caseItem.caseId}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {caseItem.patient}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${getComplexityColor(
                      caseItem.complexity
                    )}`}
                  >
                    {caseItem.complexity}
                  </span>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded inline-block ${getStatusColor(
                    caseItem.status
                  )}`}
                >
                  {caseItem.status.replace("-", " ")}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Technical Decision Engine */}
        <div className="dlos-card">
          <h2 className="text-lg font-bold text-foreground mb-4">
            Material Selection Guide
          </h2>
          <div className="space-y-4">
            {decisionMatrix.map((item, idx) => (
              <div key={idx} className="pb-4 border-b border-border last:border-b-0 last:pb-0">
                <p className="font-semibold text-sm text-foreground mb-2">
                  {item.indication}
                </p>
                <p className="text-sm font-medium text-primary mb-2">
                  → {item.recommendation}
                </p>
                <ul className="space-y-1">
                  {item.reasons.map((reason, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                      <Check className="w-3 h-3 text-accent" />
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Case Detail */}
      {selectedCaseData && (
        <div className="dlos-card">
          <h2 className="text-lg font-bold text-foreground mb-6">
            Planning Analysis: {selectedCaseData.caseId}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Patient</p>
              <p className="font-semibold text-foreground mb-4">
                {selectedCaseData.patient}
              </p>

              <p className="text-xs text-muted-foreground mb-1">Case Type</p>
              <p className="font-semibold text-foreground mb-4">
                {selectedCaseData.caseType}
              </p>

              <p className="text-xs text-muted-foreground mb-1">Material</p>
              <p className="font-semibold text-foreground mb-4">
                {selectedCaseData.material}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-1">Complexity</p>
              <span
                className={`inline-block px-3 py-1 rounded mb-4 text-xs font-semibold ${getComplexityColor(
                  selectedCaseData.complexity
                )}`}
              >
                {selectedCaseData.complexity}
              </span>

              <p className="text-xs text-muted-foreground mb-1 block">Assigned To</p>
              <p className="font-semibold text-foreground">
                {selectedCaseData.assignedTo}
              </p>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="font-semibold text-foreground mb-4">Planning Details</h3>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">
                  Preparation Design
                </h4>
                <p className="text-sm text-muted-foreground">
                  Full coverage crown with subgingival margins, 0.5mm depth. Ensure
                  natural emergence profile.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">
                  Cementation Protocol
                </h4>
                <p className="text-sm text-muted-foreground">
                  Adhesive resin cementation for optimal esthetics and longevity
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">
                  Clinical Risks
                </h4>
                <p className="text-sm text-muted-foreground">
                  Monitor for proximal contact integrity and margin adaptation
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-6 pt-6 border-t border-border">
            <Button variant="outline" className="flex-1" onClick={() => handleFlagIssue(selectedCaseData.id)}>
              <AlertCircle className="w-4 h-4 mr-2" />
              Flag Issue
            </Button>
            <Button className="flex-1" onClick={() => handleApprovePlan(selectedCaseData.id)} disabled={selectedCaseData.status === "ready"}>
              <Check className="w-4 h-4 mr-2" />
              {selectedCaseData.status === "ready" ? "Approved" : "Approve Plan"}
            </Button>
          </div>
        </div>
      )}

      {/* Planning Protocol */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="dlos-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Analysis Checklist
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ Review doctor prescription</li>
            <li>✓ Assess clinical indication</li>
            <li>✓ Recommend optimal material</li>
            <li>✓ Define preparation design</li>
            <li>✓ Specify cementation protocol</li>
            <li>✓ Identify clinical risks</li>
            <li>✓ Set production timeline</li>
            <li>✓ Route to appropriate department</li>
          </ul>
        </div>

        <div className="dlos-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Department Team
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Dr. Lisa Rodriguez</span>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                Lab Director
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">James Park</span>
              <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                Case Planner
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
