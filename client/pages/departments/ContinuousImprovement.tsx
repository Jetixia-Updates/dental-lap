import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { TrendingUp, AlertCircle, CheckCircle, BarChart3 } from "lucide-react";

interface ErrorReport {
  id: string;
  caseId: string;
  errorType: string;
  department: string;
  severity: "minor" | "major" | "critical";
  rootCause: string;
  status: "open" | "investigating" | "resolved";
  dateReported: string;
  correctionMeasure?: string;
}

const mockErrors: ErrorReport[] = [
  {
    id: "1",
    caseId: "CASE-2024-001",
    errorType: "Marginal gap exceeds spec",
    department: "CAM Production",
    severity: "major",
    rootCause: "Equipment calibration drift",
    status: "resolved",
    dateReported: "2024-02-08",
    correctionMeasure: "Recalibrated milling machine",
  },
  {
    id: "2",
    caseId: "CASE-2024-002",
    errorType: "Shade mismatch",
    department: "Ceramic & Finishing",
    severity: "minor",
    rootCause: "Lighting condition variation",
    status: "investigating",
    dateReported: "2024-02-09",
  },
  {
    id: "3",
    caseId: "CASE-2024-003",
    errorType: "Incomplete prescription data",
    department: "Reception",
    severity: "critical",
    rootCause: "Doctor communication gap",
    status: "open",
    dateReported: "2024-02-10",
  },
];

const improvementMetrics = [
  { metric: "Defect Rate", current: "2.3%", target: "< 1%", trend: "↑" },
  {
    metric: "On-Time Delivery",
    current: "94%",
    target: "> 95%",
    trend: "↑",
  },
  { metric: "Customer Satisfaction", current: "4.6/5", target: "4.8/5", trend: "→" },
  { metric: "Equipment Uptime", current: "99.2%", target: "99.5%", trend: "↑" },
];

export default function ContinuousImprovement() {
  const [errors, setErrors] = useState<ErrorReport[]>(mockErrors);
  const [selectedError, setSelectedError] = useState<string | null>(null);

  const selectedErrorData = errors.find((e) => e.id === selectedError);

  const handleStartInvestigation = (id: string) => {
    setErrors(errors.map((e) => e.id === id ? { ...e, status: "investigating" as const } : e));
  };

  const handleMarkResolved = (id: string) => {
    setErrors(errors.map((e) => e.id === id ? { ...e, status: "resolved" as const, correctionMeasure: e.correctionMeasure || "Corrective action applied." } : e));
  };

  const handleCloseError = (id: string) => {
    setErrors(errors.map((e) => e.id === id ? { ...e, status: "resolved" as const } : e));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "major":
        return "bg-amber-100 text-amber-800";
      case "minor":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800";
      case "investigating":
        return "bg-blue-100 text-blue-800";
      case "open":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Continuous Improvement & Error Analysis
        </h1>
        <p className="text-muted-foreground">
          Track errors, analyze root causes, and drive continuous improvement
        </p>
      </div>

      {/* KPI Summary */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-foreground mb-4">Improvement Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {improvementMetrics.map((metric, idx) => (
            <div key={idx} className="dlos-card">
              <p className="text-sm text-muted-foreground mb-2">{metric.metric}</p>
              <div className="flex items-baseline gap-2 mb-2">
                <p className="text-2xl font-bold text-primary">
                  {metric.current}
                </p>
                <span className="text-sm text-amber-600">{metric.trend}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Target: {metric.target}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Error Reports */}
        <div className="dlos-card">
          <h2 className="text-lg font-bold text-foreground mb-4">Error Reports</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {errors.map((error) => (
              <button
                key={error.id}
                onClick={() => setSelectedError(error.id)}
                className={`w-full text-left p-3 rounded-md border transition-all ${
                  selectedError === error.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <p className="font-semibold text-sm text-foreground">
                  {error.caseId}
                </p>
                <p className="text-xs text-muted-foreground mb-2">
                  {error.errorType}
                </p>
                <div className="flex gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded ${getSeverityColor(
                      error.severity
                    )}`}
                  >
                    {error.severity}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${getStatusColor(
                      error.status
                    )}`}
                  >
                    {error.status}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Error Detail */}
        {selectedErrorData ? (
          <div className="lg:col-span-2 space-y-6">
            <div className="dlos-card">
              <h2 className="text-lg font-bold text-foreground mb-6">
                {selectedErrorData.caseId} - Error Analysis
              </h2>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Error Type</p>
                  <p className="font-semibold text-foreground">
                    {selectedErrorData.errorType}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Department</p>
                  <p className="font-semibold text-foreground">
                    {selectedErrorData.department}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Severity</p>
                  <span
                    className={`inline-block px-3 py-1 rounded text-xs font-semibold ${getSeverityColor(
                      selectedErrorData.severity
                    )}`}
                  >
                    {selectedErrorData.severity}
                  </span>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Date Reported
                  </p>
                  <p className="font-semibold text-foreground">
                    {new Date(
                      selectedErrorData.dateReported
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="font-semibold text-foreground mb-4">
                  Root Cause Analysis
                </h3>
                <div className="bg-secondary/30 p-4 rounded-lg mb-6">
                  <p className="text-sm text-foreground">
                    {selectedErrorData.rootCause}
                  </p>
                </div>

                {selectedErrorData.correctionMeasure && (
                  <>
                    <h3 className="font-semibold text-foreground mb-4">
                      Correction Measure
                    </h3>
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                      <p className="text-sm text-foreground">
                        {selectedErrorData.correctionMeasure}
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-2 mt-6 pt-6 border-t border-border">
                {selectedErrorData.status === "open" && (
                  <>
                    <Button variant="outline" className="flex-1" onClick={() => handleStartInvestigation(selectedErrorData.id)}>
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Start Investigation
                    </Button>
                    <Button className="flex-1" onClick={() => handleCloseError(selectedErrorData.id)}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Close
                    </Button>
                  </>
                )}
                {selectedErrorData.status === "investigating" && (
                  <Button className="flex-1" onClick={() => handleMarkResolved(selectedErrorData.id)}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark Resolved
                  </Button>
                )}
                {selectedErrorData.status === "resolved" && (
                  <div className="flex-1 flex items-center justify-center text-green-600 font-semibold">
                    ✓ Resolved
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 dlos-card flex items-center justify-center">
            <p className="text-center text-muted-foreground">
              Select an error report to view details
            </p>
          </div>
        )}
      </div>

      {/* Improvement Initiatives */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="dlos-card">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            Recent Improvements
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2 text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              Equipment recalibration program (20% defect reduction)
            </li>
            <li className="flex items-start gap-2 text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              Staff training on new design standards
            </li>
            <li className="flex items-start gap-2 text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              Standardized QC checklist implementation
            </li>
            <li className="flex items-start gap-2 text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              Doctor communication protocol refinement
            </li>
          </ul>
        </div>

        <div className="dlos-card">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Continuous Improvement Process
          </h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>✓ Monthly error analysis review</li>
            <li>✓ Root cause identification</li>
            <li>✓ Corrective action planning</li>
            <li>✓ Staff training & communication</li>
            <li>✓ Implementation verification</li>
            <li>✓ Effectiveness measurement</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
