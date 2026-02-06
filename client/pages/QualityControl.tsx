import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  AlertCircle,
  Eye,
  Filter,
  TrendingDown,
  BarChart3,
  Clock,
  AlertTriangle,
} from "lucide-react";

interface QCCase {
  id: string;
  caseId: string;
  doctor: string;
  caseType: string;
  status: "pending" | "passed" | "failed" | "needs-review";
  dateReceived: string;
}

interface QCChecklist {
  id: string;
  category: string;
  items: QCCheckItem[];
}

interface QCCheckItem {
  id: string;
  name: string;
  standard: string;
  completed: boolean;
}

const mockQCCases: QCCase[] = [
  {
    id: "1",
    caseId: "CASE-2024-003",
    doctor: "Dr. James Wilson",
    caseType: "Implant Crown",
    status: "passed",
    dateReceived: "2024-02-09",
  },
  {
    id: "2",
    caseId: "CASE-2024-005",
    doctor: "Dr. Michael Brown",
    caseType: "Zirconia Crown",
    status: "passed",
    dateReceived: "2024-02-09",
  },
  {
    id: "3",
    caseId: "CASE-2024-006",
    doctor: "Dr. Patricia Lee",
    caseType: "E.max Bridge",
    status: "needs-review",
    dateReceived: "2024-02-10",
  },
  {
    id: "4",
    caseId: "CASE-2024-007",
    doctor: "Dr. John Smith",
    caseType: "Veneer Set",
    status: "pending",
    dateReceived: "2024-02-10",
  },
  {
    id: "5",
    caseId: "CASE-2024-008",
    doctor: "Dr. Sarah Johnson",
    caseType: "Full Arch",
    status: "passed",
    dateReceived: "2024-02-08",
  },
];

const defaultChecklist: QCChecklist[] = [
  {
    id: "1",
    category: "Marginal Fit & Adaptation",
    items: [
      {
        id: "1-1",
        name: "Marginal gaps ≤ 100μm",
        standard: "ISO 13485 / FDA Guidelines",
        completed: false,
      },
      {
        id: "1-2",
        name: "Internal fit verified",
        standard: "Fit verification protocol",
        completed: false,
      },
      {
        id: "1-3",
        name: "Margin integrity intact",
        standard: "Visual inspection",
        completed: false,
      },
    ],
  },
  {
    id: "2",
    category: "Occlusion & Contacts",
    items: [
      {
        id: "2-1",
        name: "Centric relation contact",
        standard: "Occlusal verification",
        completed: false,
      },
      {
        id: "2-2",
        name: "Eccentric movements smooth",
        standard: "Functional analysis",
        completed: false,
      },
      {
        id: "2-3",
        name: "Contact points verified",
        standard: "Articulation test",
        completed: false,
      },
    ],
  },
  {
    id: "3",
    category: "Shade & Aesthetics",
    items: [
      {
        id: "3-1",
        name: "Shade matches prescription",
        standard: "Shade guide verification",
        completed: false,
      },
      {
        id: "3-2",
        name: "Surface gloss appropriate",
        standard: "Visual assessment",
        completed: false,
      },
      {
        id: "3-3",
        name: "Anatomy and contours correct",
        standard: "Design specification",
        completed: false,
      },
    ],
  },
  {
    id: "4",
    category: "Material & Structure",
    items: [
      {
        id: "4-1",
        name: "Material integrity intact",
        standard: "Material inspection",
        completed: false,
      },
      {
        id: "4-2",
        name: "No cracks or defects",
        standard: "Visual inspection",
        completed: false,
      },
      {
        id: "4-3",
        name: "Thickness within spec",
        standard: "Measurement verification",
        completed: false,
      },
    ],
  },
  {
    id: "5",
    category: "Surface Finishing",
    items: [
      {
        id: "5-1",
        name: "Surface smooth and polished",
        standard: "Finishing protocol",
        completed: false,
      },
      {
        id: "5-2",
        name: "No scratches or marks",
        standard: "Visual inspection",
        completed: false,
      },
      {
        id: "5-3",
        name: "Cementation surface prepared",
        standard: "Prep verification",
        completed: false,
      },
    ],
  },
];

export default function QualityControl() {
  const [qcCases, setQcCases] = useState<QCCase[]>(mockQCCases);
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [checklist, setChecklist] = useState<QCChecklist[]>(defaultChecklist);
  const [filterStatus, setFilterStatus] = useState<string>("");

  const filteredCases = qcCases.filter(
    (c) => !filterStatus || c.status === filterStatus
  );

  const selectedCaseData = qcCases.find((c) => c.id === selectedCase);

  const passedCount = qcCases.filter((c) => c.status === "passed").length;
  const pendingCount = qcCases.filter((c) => c.status === "pending").length;
  const needsReviewCount = qcCases.filter((c) => c.status === "needs-review").length;
  const failedCount = qcCases.filter((c) => c.status === "failed").length;

  const completedItems = checklist.reduce(
    (sum, cat) => sum + cat.items.filter((i) => i.completed).length,
    0
  );
  const totalItems = checklist.reduce((sum, cat) => sum + cat.items.length, 0);

  const handleToggleItem = (categoryId: string, itemId: string) => {
    setChecklist(
      checklist.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              items: cat.items.map((item) =>
                item.id === itemId ? { ...item, completed: !item.completed } : item
              ),
            }
          : cat
      )
    );
  };

  const handlePassCase = () => {
    if (selectedCase) {
      setQcCases(
        qcCases.map((c) => (c.id === selectedCase ? { ...c, status: "passed" } : c))
      );
      setSelectedCase(null);
    }
  };

  const handleFailCase = () => {
    if (selectedCase) {
      setQcCases(
        qcCases.map((c) =>
          c.id === selectedCase ? { ...c, status: "needs-review" } : c
        )
      );
      setSelectedCase(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "failed":
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case "needs-review":
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      default:
        return <Clock className="w-5 h-5 text-blue-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "passed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "needs-review":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Quality Control System
        </h1>
        <p className="text-muted-foreground">
          Comprehensive pre-delivery verification and quality assurance
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 animate-slideUp">
        <div className="dlos-card">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm text-muted-foreground">Passed</span>
          </div>
          <p className="text-3xl font-bold text-green-600">{passedCount}</p>
        </div>
        <div className="dlos-card">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-muted-foreground">Pending</span>
          </div>
          <p className="text-3xl font-bold text-blue-600">{pendingCount}</p>
        </div>
        <div className="dlos-card">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <span className="text-sm text-muted-foreground">Needs Review</span>
          </div>
          <p className="text-3xl font-bold text-amber-600">{needsReviewCount}</p>
        </div>
        <div className="dlos-card">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-sm text-muted-foreground">Failed</span>
          </div>
          <p className="text-3xl font-bold text-red-600">{failedCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cases List */}
        <div className="lg:col-span-1">
          <div className="dlos-card">
            <h2 className="text-lg font-bold text-foreground mb-4">Cases for QC</h2>

            <div className="mb-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="passed">Passed</option>
                <option value="failed">Failed</option>
                <option value="needs-review">Needs Review</option>
              </select>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredCases.length > 0 ? (
                filteredCases.map((qcCase) => (
                  <button
                    key={qcCase.id}
                    onClick={() => setSelectedCase(qcCase.id)}
                    className={`w-full text-left p-3 rounded-md border transition-all ${
                      selectedCase === qcCase.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 hover:bg-secondary/50"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {getStatusIcon(qcCase.status)}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-foreground truncate">
                          {qcCase.caseId}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {qcCase.caseType}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {qcCase.doctor}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No cases found
                </p>
              )}
            </div>
          </div>
        </div>

        {/* QC Checklist */}
        <div className="lg:col-span-2">
          {selectedCaseData ? (
            <div className="dlos-card">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-foreground mb-2">
                  QC Verification Checklist
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  {selectedCaseData.caseId} - {selectedCaseData.caseType}
                </p>

                {/* Progress */}
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent transition-all"
                        style={{ width: `${(completedItems / totalItems) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {completedItems}/{totalItems}
                  </span>
                </div>
              </div>

              {/* Checklist Categories */}
              <div className="space-y-6 max-h-96 overflow-y-auto">
                {checklist.map((category) => (
                  <div key={category.id}>
                    <h3 className="font-semibold text-foreground mb-3 text-sm">
                      {category.category}
                    </h3>
                    <div className="space-y-2">
                      {category.items.map((item) => (
                        <label
                          key={item.id}
                          className="flex items-start gap-3 p-2 rounded-md hover:bg-secondary/50 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={() => handleToggleItem(category.id, item.id)}
                            className="w-4 h-4 mt-1 accent-primary"
                          />
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-medium ${
                                item.completed
                                  ? "text-muted-foreground line-through"
                                  : "text-foreground"
                              }`}
                            >
                              {item.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {item.standard}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-6 pt-6 border-t border-border">
                <Button
                  onClick={handlePassCase}
                  className="flex-1"
                  disabled={completedItems < totalItems}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Pass Case
                </Button>
                <Button
                  onClick={handleFailCase}
                  variant="outline"
                  className="flex-1"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Needs Review
                </Button>
              </div>
            </div>
          ) : (
            <div className="dlos-card h-full flex items-center justify-center">
              <p className="text-center text-muted-foreground">
                Select a case to view QC checklist
              </p>
            </div>
          )}
        </div>
      </div>

      {/* QC Standards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="dlos-card">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            Pre-Delivery Standards
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ Marginal fit ≤ 100μm (ISO 13485)</li>
            <li>✓ Occlusion verified and balanced</li>
            <li>✓ Contact points appropriate</li>
            <li>✓ Shade accuracy within ΔE2</li>
            <li>✓ Surface finish polished</li>
            <li>✓ No structural defects</li>
          </ul>
        </div>

        <div className="dlos-card">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-accent" />
            Error Management Protocol
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ Identify root cause immediately</li>
            <li>✓ Classify error category</li>
            <li>✓ Assign responsible department</li>
            <li>✓ Document in system</li>
            <li>✓ Notify doctor professionally</li>
            <li>✓ Track for trend analysis</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
