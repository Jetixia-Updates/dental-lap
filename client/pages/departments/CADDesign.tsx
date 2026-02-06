import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Clock, Zap, Check, Users } from "lucide-react";

interface DesignCase {
  id: string;
  caseId: string;
  designer: string;
  status: "queue" | "designing" | "review" | "approved";
  complexity: "simple" | "moderate" | "complex";
  progress: number;
  datStarted?: string;
}

const mockCases: DesignCase[] = [
  {
    id: "1",
    caseId: "CASE-2024-001",
    designer: "Alex Morrison",
    status: "approved",
    complexity: "simple",
    progress: 100,
    datStarted: "2024-02-09",
  },
  {
    id: "2",
    caseId: "CASE-2024-002",
    designer: "Sophie Johnson",
    status: "review",
    complexity: "moderate",
    progress: 85,
    datStarted: "2024-02-09",
  },
  {
    id: "3",
    caseId: "CASE-2024-003",
    designer: "Tom Bradley",
    status: "designing",
    complexity: "complex",
    progress: 60,
    datStarted: "2024-02-10",
  },
];

const designSoftware = [
  "Exocad",
  "3Shape",
  "Dental Wings",
  "DSD (Digital Smile Design)",
];

export default function CADDesign() {
  const [cases, setCases] = useState<DesignCase[]>(mockCases);
  const [selectedCase, setSelectedCase] = useState<string | null>(null);

  const selectedCaseData = cases.find((c) => c.id === selectedCase);

  const handleSubmitDesign = (id: string) => {
    setCases(cases.map((c) => c.id === id ? { ...c, status: "approved" as const, progress: 100 } : c));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "review":
        return "bg-amber-100 text-amber-800";
      case "designing":
        return "bg-blue-100 text-blue-800";
      case "queue":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          CAD Design Department
        </h1>
        <p className="text-muted-foreground">
          Advanced digital design, modeling, and CAD optimization
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="dlos-card">
          <p className="text-sm text-muted-foreground mb-1">Active Cases</p>
          <p className="text-3xl font-bold text-primary">{cases.length}</p>
        </div>
        <div className="dlos-card">
          <p className="text-sm text-muted-foreground mb-1">Approved</p>
          <p className="text-3xl font-bold text-green-600">
            {cases.filter((c) => c.status === "approved").length}
          </p>
        </div>
        <div className="dlos-card">
          <p className="text-sm text-muted-foreground mb-1">In Design</p>
          <p className="text-3xl font-bold text-blue-600">
            {cases.filter((c) => c.status === "designing").length}
          </p>
        </div>
        <div className="dlos-card">
          <p className="text-sm text-muted-foreground mb-1">Avg Completion</p>
          <p className="text-3xl font-bold text-accent">
            {Math.round(cases.reduce((sum, c) => sum + c.progress, 0) / cases.length)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Case List */}
        <div className="dlos-card">
          <h2 className="text-lg font-bold text-foreground mb-4">Design Queue</h2>
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
                  {caseItem.designer}
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

        {/* Design Detail */}
        {selectedCaseData ? (
          <div className="lg:col-span-2 space-y-6">
            <div className="dlos-card">
              <h2 className="text-lg font-bold text-foreground mb-6">
                {selectedCaseData.caseId}
              </h2>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Designer</p>
                  <p className="font-semibold text-foreground">
                    {selectedCaseData.designer}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Complexity</p>
                  <span
                    className={`inline-block px-3 py-1 rounded text-xs font-semibold ${getComplexityColor(
                      selectedCaseData.complexity
                    )}`}
                  >
                    {selectedCaseData.complexity}
                  </span>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="font-semibold text-foreground mb-4">Design Progress</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        Overall Completion
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

                  <div className="pt-3">
                    <h4 className="text-sm font-semibold text-foreground mb-3">
                      Design Checklist
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2 text-foreground">
                        <Check className="w-4 h-4 text-green-600" />
                        Occlusal design
                      </li>
                      <li className="flex items-center gap-2 text-foreground">
                        <Check className="w-4 h-4 text-green-600" />
                        Wall thickness optimization
                      </li>
                      <li className="flex items-center gap-2 text-foreground">
                        <Check className="w-4 h-4 text-amber-600" />
                        Emergence profile
                      </li>
                      <li className="flex items-center gap-2 text-muted-foreground">
                        Margin verification
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-6 pt-6 border-t border-border">
                <Button variant="outline" className="flex-1">
                  View Design
                </Button>
                <Button className="flex-1" onClick={() => handleSubmitDesign(selectedCaseData.id)} disabled={selectedCaseData.status === "approved"}>
                  <Check className="w-4 h-4 mr-2" />
                  {selectedCaseData.status === "approved" ? "Approved" : "Submit"}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 dlos-card flex items-center justify-center">
            <p className="text-center text-muted-foreground">
              Select a case to view design details
            </p>
          </div>
        )}
      </div>

      {/* Design Standards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="dlos-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Design Standards
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ Minimum wall thickness 0.8mm</li>
            <li>✓ Proper occlusal anatomy</li>
            <li>✓ Smooth margins ≤ 30 microns</li>
            <li>✓ Natural emergence profile</li>
            <li>✓ Proper proximal contacts</li>
            <li>✓ Support structure verification</li>
          </ul>
        </div>

        <div className="dlos-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Design Team
          </h3>
          <div className="space-y-3">
            {["Alex Morrison", "Sophie Johnson", "Tom Bradley"].map((name) => (
              <div key={name} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{name}</span>
                <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                  Designer
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
