import { useState } from "react";
import Layout from "@/components/Layout";
import { BarChart3, DollarSign, TrendingUp } from "lucide-react";

interface CaseFinance {
  id: string;
  caseId: string;
  doctor: string;
  materialCost: number;
  laborCost: number;
  overhead: number;
  totalCost: number;
  billableAmount: number;
  margin: number;
  status: "pending" | "completed" | "paid";
}

const mockCases: CaseFinance[] = [
  {
    id: "1",
    caseId: "CASE-2024-001",
    doctor: "Dr. John Smith",
    materialCost: 45,
    laborCost: 120,
    overhead: 30,
    totalCost: 195,
    billableAmount: 450,
    margin: 57,
    status: "paid",
  },
  {
    id: "2",
    caseId: "CASE-2024-002",
    doctor: "Dr. Sarah Johnson",
    materialCost: 75,
    laborCost: 180,
    overhead: 45,
    totalCost: 300,
    billableAmount: 650,
    margin: 54,
    status: "completed",
  },
  {
    id: "3",
    caseId: "CASE-2024-003",
    doctor: "Dr. James Wilson",
    materialCost: 50,
    laborCost: 140,
    overhead: 35,
    totalCost: 225,
    billableAmount: 500,
    margin: 55,
    status: "pending",
  },
];

export default function Financial() {
  const [cases, setCases] = useState<CaseFinance[]>(mockCases);
  const [selectedCase, setSelectedCase] = useState<string | null>(null);

  const selectedCaseData = cases.find((c) => c.id === selectedCase);

  const totalBilled = cases.reduce((sum, c) => sum + c.billableAmount, 0);
  const totalCost = cases.reduce((sum, c) => sum + c.totalCost, 0);
  const totalProfit = totalBilled - totalCost;
  const avgMargin =
    cases.reduce((sum, c) => sum + c.margin, 0) / cases.length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Financial Tracking & Case Costing
        </h1>
        <p className="text-muted-foreground">
          Case profitability, cost analysis, and financial reporting
        </p>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="dlos-card">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-primary" />
            <p className="text-sm text-muted-foreground">Total Billed</p>
          </div>
          <p className="text-3xl font-bold text-primary">
            ${totalBilled.toLocaleString()}
          </p>
        </div>
        <div className="dlos-card">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-accent" />
            <p className="text-sm text-muted-foreground">Total Cost</p>
          </div>
          <p className="text-3xl font-bold text-accent">
            ${totalCost.toLocaleString()}
          </p>
        </div>
        <div className="dlos-card">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <p className="text-sm text-muted-foreground">Total Profit</p>
          </div>
          <p className="text-3xl font-bold text-green-600">
            ${totalProfit.toLocaleString()}
          </p>
        </div>
        <div className="dlos-card">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-amber-600" />
            <p className="text-sm text-muted-foreground">Avg Margin</p>
          </div>
          <p className="text-3xl font-bold text-amber-600">
            {avgMargin.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Case List */}
        <div className="dlos-card">
          <h2 className="text-lg font-bold text-foreground mb-4">Cases</h2>
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
                  ${caseItem.billableAmount}
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

        {/* Cost Breakdown */}
        {selectedCaseData ? (
          <div className="lg:col-span-2 space-y-6">
            <div className="dlos-card">
              <h2 className="text-lg font-bold text-foreground mb-6">
                {selectedCaseData.caseId} - Cost Analysis
              </h2>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Doctor</p>
                  <p className="font-semibold text-foreground">
                    {selectedCaseData.doctor}
                  </p>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="font-semibold text-foreground mb-4">Cost Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <span className="text-sm text-muted-foreground">
                      Material Cost
                    </span>
                    <span className="font-semibold text-foreground">
                      ${selectedCaseData.materialCost}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <span className="text-sm text-muted-foreground">
                      Labor Cost
                    </span>
                    <span className="font-semibold text-foreground">
                      ${selectedCaseData.laborCost}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <span className="text-sm text-muted-foreground">
                      Overhead
                    </span>
                    <span className="font-semibold text-foreground">
                      ${selectedCaseData.overhead}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary">
                    <span className="text-sm font-semibold text-foreground">
                      Total Cost
                    </span>
                    <span className="font-bold text-primary">
                      ${selectedCaseData.totalCost}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-6 mt-6">
                <h3 className="font-semibold text-foreground mb-4">Profitability</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <span className="text-sm text-muted-foreground">
                      Billable Amount
                    </span>
                    <span className="font-semibold text-foreground">
                      ${selectedCaseData.billableAmount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <span className="text-sm font-semibold text-foreground">
                      Profit
                    </span>
                    <span className="font-bold text-green-600">
                      ${
                        selectedCaseData.billableAmount -
                        selectedCaseData.totalCost
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg border border-accent">
                    <span className="text-sm font-semibold text-foreground">
                      Profit Margin
                    </span>
                    <span className="font-bold text-accent">
                      {selectedCaseData.margin}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 dlos-card flex items-center justify-center">
            <p className="text-center text-muted-foreground">
              Select a case to view cost analysis
            </p>
          </div>
        )}
      </div>

      {/* Cost Guidelines */}
      <div className="mt-8 dlos-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Financial Standards
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold text-foreground mb-3">Target Margins</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Simple cases: 50-55%</li>
              <li>✓ Moderate cases: 45-50%</li>
              <li>✓ Complex cases: 40-45%</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">Cost Allocation</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Materials: 20-30%</li>
              <li>✓ Labor: 40-50%</li>
              <li>✓ Overhead: 15-25%</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">Payment Terms</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Invoice upon completion</li>
              <li>✓ Net 30 payment terms</li>
              <li>✓ Rush fees: 20% upcharge</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
