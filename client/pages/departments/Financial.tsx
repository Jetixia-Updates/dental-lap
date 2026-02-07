import { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Search, Check, X, DollarSign, Download, FileText, Edit,
  TrendingUp, TrendingDown, Calculator, CreditCard, Wallet,
  BarChart3, PieChart, Receipt, ArrowUpRight, ArrowDownRight,
  AlertCircle, CheckCircle, Clock, Users, Building2, FileSpreadsheet,
  Banknote, ShoppingCart, Percent, Calendar
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface CaseFinance {
  id: string;
  patient: string;
  doctor: string;
  restorationType: string;
  materialCost: number;
  laborCost: number;
  overheadCost: number;
  price: number;
  invoiceStatus: "draft" | "sent" | "paid" | "overdue" | "cancelled" | "partial";
  paymentDate: string;
  notes: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  dueDate?: string;
  discount?: number;
  tax?: number;
  paidAmount?: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  caseId: string;
  doctorName: string;
  doctorClinic: string;
  patientName: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  paidAmount: number;
  remainingAmount: number;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled" | "partial";
  paymentMethod?: string;
  notes: string;
  termsAndConditions: string;
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Payment {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  reference: string;
  notes: string;
}

interface Client {
  id: string;
  name: string;
  clinic: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  totalInvoices: number;
  totalPaid: number;
  totalOutstanding: number;
}

interface Expense {
  id: string;
  date: string;
  category: string;
  vendor: string;
  amount: number;
  status: "pending" | "approved" | "paid";
  paymentMethod: string;
  description: string;
}

interface Budget {
  department: string;
  allocated: number;
  spent: number;
  remaining: number;
}

interface TaxRecord {
  id: string;
  period: string;
  type: string;
  amount: number;
  status: "pending" | "filed" | "paid";
  dueDate: string;
}

const INITIAL: CaseFinance[] = [
  { id: "CASE-001", patient: "أحمد محمود", doctor: "د. محمد عبد الله", restorationType: "تاج زيركون × 2", materialCost: 3400, laborCost: 4000, overheadCost: 1000, price: 12000, invoiceStatus: "paid", paymentDate: "2026-02-05", notes: "" },
  { id: "CASE-002", patient: "سارة خالد", doctor: "د. أحمد حسن", restorationType: "عدسات فينير", materialCost: 840, laborCost: 3000, overheadCost: 600, price: 7000, invoiceStatus: "sent", paymentDate: "", notes: "" },
  { id: "CASE-003", patient: "عمر رمضان", doctor: "د. ليلى إبراهيم", restorationType: "جسر 3 وحدات", materialCost: 5000, laborCost: 8000, overheadCost: 1600, price: 24000, invoiceStatus: "draft", paymentDate: "", notes: "حالة معقدة تحتاج عناية" },
  { id: "CASE-004", patient: "ليلى طارق", doctor: "د. محمد عبد الله", restorationType: "واقي ليلي", materialCost: 500, laborCost: 1200, overheadCost: 300, price: 3600, invoiceStatus: "overdue", paymentDate: "", notes: "متابعة مطلوبة" },
];

const EXPENSES: Expense[] = [
  { id: "EXP-001", date: "2026-02-01", category: "خامات ومواد", vendor: "شركة المواد الطبية المصرية", amount: 70000, status: "paid", paymentMethod: "تحويل بنكي", description: "بلوكات زيركونيا مستوردة" },
  { id: "EXP-002", date: "2026-02-03", category: "معدات وصيانة", vendor: "الحلول التقنية المتقدمة", amount: 24000, status: "approved", paymentMethod: "بطاقة ائتمان", description: "صيانة أجهزة CAD/CAM" },
  { id: "EXP-003", date: "2026-02-05", category: "مرافق وخدمات", vendor: "شركة الكهرباء", amount: 9000, status: "pending", paymentMethod: "خصم تلقائي", description: "فاتورة كهرباء شهر فبراير" },
  { id: "EXP-004", date: "2026-02-06", category: "رواتب ومكافآت", vendor: "الموارد البشرية", amount: 300000, status: "approved", paymentMethod: "تحويل بنكي", description: "رواتب شهر فبراير" },
  { id: "EXP-005", date: "2026-02-04", category: "ضرائب ورسوم", vendor: "مصلحة الضرائب المصرية", amount: 18500, status: "paid", paymentMethod: "تحويل بنكي", description: "ضريبة القيمة المضافة - يناير 2026" },
];

const BUDGETS: Budget[] = [
  { department: "خامات ومستلزمات طبية", allocated: 1000000, spent: 648000, remaining: 352000 },
  { department: "معدات وصيانة", allocated: 400000, spent: 178000, remaining: 222000 },
  { department: "رواتب وأجور", allocated: 1200000, spent: 900000, remaining: 300000 },
  { department: "تسويق ومبيعات", allocated: 200000, spent: 84000, remaining: 116000 },
  { department: "تشغيل ومرافق", allocated: 160000, spent: 102000, remaining: 58000 },
];

const TAX_RECORDS: TaxRecord[] = [
  { id: "TAX-001", period: "الربع الرابع 2025", type: "ضريبة القيمة المضافة (14%)", amount: 90000, status: "paid", dueDate: "2026-01-31" },
  { id: "TAX-002", period: "يناير 2026", type: "ضريبة الدخل", amount: 164000, status: "filed", dueDate: "2026-02-15" },
  { id: "TAX-003", period: "فبراير 2026", type: "ضريبة القيمة المضافة (14%)", amount: 76000, status: "pending", dueDate: "2026-03-10" },
  { id: "TAX-004", period: "فبراير 2026", type: "ضريبة الأرباح التجارية", amount: 125000, status: "pending", dueDate: "2026-03-31" },
  { id: "TAX-005", period: "يناير 2026", type: "تأمينات اجتماعية", amount: 42000, status: "paid", dueDate: "2026-02-15" },
];

const INVOICES: Invoice[] = [
  {
    id: "INV-001",
    invoiceNumber: "INV-2026-001",
    caseId: "CASE-001",
    doctorName: "د. محمد عبد الله",
    doctorClinic: "عيادة النور لطب الأسنان",
    patientName: "أحمد محمود",
    issueDate: "2026-02-01",
    dueDate: "2026-02-15",
    items: [
      { id: "1", description: "تاج زيركون - السن 14", quantity: 1, unitPrice: 6000, total: 6000 },
      { id: "2", description: "تاج زيركون - السن 15", quantity: 1, unitPrice: 6000, total: 6000 },
    ],
    subtotal: 12000,
    discount: 0,
    taxRate: 0,
    taxAmount: 0,
    total: 12000,
    paidAmount: 12000,
    remainingAmount: 0,
    status: "paid",
    paymentMethod: "تحويل بنكي",
    notes: "",
    termsAndConditions: "الدفع خلال 15 يوم من تاريخ الفاتورة. لا يتم استرجاع المبالغ المدفوعة."
  },
  {
    id: "INV-002",
    invoiceNumber: "INV-2026-002",
    caseId: "CASE-002",
    doctorName: "د. أحمد حسن",
    doctorClinic: "مركز الابتسامة الطبي",
    patientName: "سارة خالد",
    issueDate: "2026-02-03",
    dueDate: "2026-02-17",
    items: [
      { id: "1", description: "عدسات فينير", quantity: 1, unitPrice: 7000, total: 7000 },
    ],
    subtotal: 7000,
    discount: 0,
    taxRate: 0,
    taxAmount: 0,
    total: 7000,
    paidAmount: 0,
    remainingAmount: 7000,
    status: "sent",
    notes: "",
    termsAndConditions: "الدفع خلال 15 يوم من تاريخ الفاتورة."
  },
  {
    id: "INV-003",
    invoiceNumber: "INV-2026-003",
    caseId: "CASE-003",
    doctorName: "د. ليلى إبراهيم",
    doctorClinic: "عيادة الرعاية المتقدمة",
    patientName: "عمر رمضان",
    issueDate: "2026-01-28",
    dueDate: "2026-02-11",
    items: [
      { id: "1", description: "جسر 3 وحدات", quantity: 1, unitPrice: 24000, total: 24000 },
    ],
    subtotal: 24000,
    discount: 2000,
    taxRate: 0,
    taxAmount: 0,
    total: 22000,
    paidAmount: 0,
    remainingAmount: 22000,
    status: "overdue",
    notes: "عميل مميز - خصم 2000 ج.م",
    termsAndConditions: "الدفع خلال 15 يوم من تاريخ الفاتورة."
  },
];

const PAYMENTS: Payment[] = [
  {
    id: "PAY-001",
    invoiceId: "INV-001",
    invoiceNumber: "INV-2026-001",
    amount: 12000,
    paymentDate: "2026-02-05",
    paymentMethod: "تحويل بنكي",
    reference: "TRX-20260205-001",
    notes: "تم الدفع بالكامل"
  },
];

const CLIENTS: Client[] = [
  {
    id: "CLI-001",
    name: "د. محمد عبد الله",
    clinic: "عيادة النور لطب الأسنان",
    email: "dr.mohamed@alnoor.com",
    phone: "01012345678",
    address: "شارع الجمهورية، المعادي، القاهرة",
    taxId: "123-456-789",
    totalInvoices: 5,
    totalPaid: 48000,
    totalOutstanding: 0
  },
  {
    id: "CLI-002",
    name: "د. أحمد حسن",
    clinic: "مركز الابتسامة الطبي",
    email: "dr.ahmed@smile.com",
    phone: "01098765432",
    address: "شارع التحرير، الدقي، الجيزة",
    taxId: "987-654-321",
    totalInvoices: 3,
    totalPaid: 15000,
    totalOutstanding: 7000
  },
  {
    id: "CLI-003",
    name: "د. ليلى إبراهيم",
    clinic: "عيادة الرعاية المتقدمة",
    email: "dr.layla@care.com",
    phone: "01155556666",
    address: "ميدان الحجاز، مصر الجديدة، القاهرة",
    taxId: "456-789-123",
    totalInvoices: 2,
    totalPaid: 18000,
    totalOutstanding: 22000
  },
];

export default function Financial() {
  const { t } = useTranslation();
  const [cases, setCases] = useState<CaseFinance[]>(INITIAL);
  const [expenses, setExpenses] = useState<Expense[]>(EXPENSES);
  const [budgets] = useState<Budget[]>(BUDGETS);
  const [taxRecords] = useState<TaxRecord[]>(TAX_RECORDS);
  const [invoices, setInvoices] = useState<Invoice[]>(INVOICES);
  const [payments, setPayments] = useState<Payment[]>(PAYMENTS);
  const [clients, setClients] = useState<Client[]>(CLIENTS);
  const [search, setSearch] = useState("");
  const [filterInvoice, setFilterInvoice] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ materialCost: 0, laborCost: 0, overheadCost: 0, price: 0, notes: "" });
  const [activeTab, setActiveTab] = useState("overview");
  const [showNewInvoice, setShowNewInvoice] = useState(false);
  const [showNewPayment, setShowNewPayment] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [invoiceFilter, setInvoiceFilter] = useState("all");
  const [showNewExpense, setShowNewExpense] = useState(false);
  const [showEditBudget, setShowEditBudget] = useState(false);
  const [showTaxCalculator, setShowTaxCalculator] = useState(false);
  const [showProfitLossReport, setShowProfitLossReport] = useState(false);
  const [showCashFlowReport, setShowCashFlowReport] = useState(false);
  const [showExpenseAnalysis, setShowExpenseAnalysis] = useState(false);
  const [showDoctorPerformance, setShowDoctorPerformance] = useState(false);
  const [showInvoiceReport, setShowInvoiceReport] = useState(false);
  const [showBudgetReport, setShowBudgetReport] = useState(false);
  const [newExpenseForm, setNewExpenseForm] = useState({
    date: new Date().toISOString().split('T')[0],
    category: "",
    vendor: "",
    amount: 0,
    paymentMethod: "",
    description: ""
  });
  const [taxCalculatorForm, setTaxCalculatorForm] = useState({
    revenue: 0,
    taxType: "vat",
    customRate: 14
  });
  const [newInvoiceForm, setNewInvoiceForm] = useState({
    doctorName: "",
    doctorClinic: "",
    patientName: "",
    items: [{ description: "", quantity: 1, unitPrice: 0 }],
    discount: 0,
    notes: ""
  });

  const filtered = cases.filter(c => {
    const match = `${c.id} ${c.patient} ${c.doctor}`.toLowerCase().includes(search.toLowerCase());
    const invoice = filterInvoice === "all" || c.invoiceStatus === filterInvoice;
    return match && invoice;
  });

  const totals = useMemo(() => {
    const revenue = cases.filter(c => c.invoiceStatus === "paid").reduce((s, c) => s + c.price, 0);
    const outstanding = cases.filter(c => c.invoiceStatus === "sent" || c.invoiceStatus === "overdue").reduce((s, c) => s + c.price, 0);
    const costs = cases.reduce((s, c) => s + c.materialCost + c.laborCost + c.overheadCost, 0);
    const profit = revenue - costs;
    const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
    const netProfit = revenue - totalExpenses;
    const profitMargin = revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : "0";
    
    return { revenue, outstanding, costs, profit, totalExpenses, netProfit, profitMargin };
  }, [cases, expenses]);

  const startEdit = (c: CaseFinance) => {
    setForm({ materialCost: c.materialCost, laborCost: c.laborCost, overheadCost: c.overheadCost, price: c.price, notes: c.notes });
    setEditingId(c.id);
  };

  const saveEdit = () => {
    if (!editingId) return;
    setCases(prev => prev.map(c => c.id === editingId ? { ...c, ...form } : c));
    setEditingId(null);
  };

  const sendInvoice = (id: string) => setCases(prev => prev.map(c => c.id === id ? { ...c, invoiceStatus: "sent" } : c));
  const markPaid = (id: string) => setCases(prev => prev.map(c => c.id === id ? { ...c, invoiceStatus: "paid", paymentDate: new Date().toISOString().split("T")[0] } : c));

  const exportCSV = () => {
    const header = "Case ID,Patient,Doctor,Type,Material Cost,Labor Cost,Overhead,Price,Profit,Invoice Status\n";
    const rows = cases.map(c => `${c.id},${c.patient},${c.doctor},${c.restorationType},${c.materialCost},${c.laborCost},${c.overheadCost},${c.price},${c.price - c.materialCost - c.laborCost - c.overheadCost},${c.invoiceStatus}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "financial-report.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    alert("سيتم تصدير التقرير بصيغة PDF");
    // يمكن استخدام مكتبة مثل jsPDF لتصدير PDF حقيقي
  };

  const exportExcel = () => {
    alert("سيتم تصدير التقرير بصيغة Excel");
    // يمكن استخدام مكتبة مثل xlsx لتصدير Excel حقيقي
  };

  const addExpense = () => {
    const newExpense: Expense = {
      id: `EXP-${String(expenses.length + 1).padStart(3, '0')}`,
      date: newExpenseForm.date,
      category: newExpenseForm.category,
      vendor: newExpenseForm.vendor,
      amount: newExpenseForm.amount,
      status: "pending",
      paymentMethod: newExpenseForm.paymentMethod,
      description: newExpenseForm.description
    };
    setExpenses([...expenses, newExpense]);
    setShowNewExpense(false);
    setNewExpenseForm({
      date: new Date().toISOString().split('T')[0],
      category: "",
      vendor: "",
      amount: 0,
      paymentMethod: "",
      description: ""
    });
  };

  const calculateTax = () => {
    const { revenue, taxType, customRate } = taxCalculatorForm;
    let rate = customRate;
    let taxName = "ضريبة مخصصة";
    
    if (taxType === "vat") {
      rate = 14;
      taxName = "ضريبة القيمة المضافة (14%)";
    } else if (taxType === "income") {
      rate = 22.5;
      taxName = "ضريبة الدخل (22.5%)";
    } else if (taxType === "corporate") {
      rate = 22.5;
      taxName = "ضريبة الأرباح التجارية (22.5%)";
    }
    
    const taxAmount = (revenue * rate) / 100;
    alert(`${taxName}\n\nالإيراد: ${revenue.toLocaleString()} ج.م\nالنسبة: ${rate}%\nقيمة الضريبة: ${taxAmount.toLocaleString()} ج.م\nالصافي: ${(revenue - taxAmount).toLocaleString()} ج.م`);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <DollarSign className="w-8 h-8" /> الإدارة المالية المتكاملة
            </h1>
            <p className="text-muted-foreground mt-1">
              نظام مالي شامل - المحاسبة، الفواتير، التكاليف، الميزانيات، والتقارير
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportCSV}>
              <Download className="w-4 h-4 mr-2" /> تصدير
            </Button>
            <Button variant="outline">
              <FileSpreadsheet className="w-4 h-4 mr-2" /> تقرير شامل
            </Button>
          </div>
        </div>

        {/* Financial Dashboard Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                الإيرادات المحصلة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{totals.revenue.toLocaleString()} ج.م</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <ArrowUpRight className="w-3 h-3" /> +12.5% من الشهر الماضي
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-600" />
                المستحقات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{totals.outstanding.toLocaleString()} ج.م</div>
              <p className="text-xs text-muted-foreground mt-1">
                {cases.filter(c => c.invoiceStatus === "overdue").length} متأخرة
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-red-600" />
                المصروفات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{totals.totalExpenses.toLocaleString()} ج.م</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <ArrowDownRight className="w-3 h-3" /> -3.2% من الشهر الماضي
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Wallet className="w-4 h-4 text-blue-600" />
                صافي الربح
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{totals.netProfit.toLocaleString()} ج.م</div>
              <p className="text-xs text-muted-foreground mt-1">
                هامش ربح {totals.profitMargin}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different financial sections */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">نظرة عامة</span>
            </TabsTrigger>
            <TabsTrigger value="invoicing" className="flex items-center gap-2">
              <Receipt className="w-4 h-4" />
              <span className="hidden sm:inline">الفواتير</span>
            </TabsTrigger>
            <TabsTrigger value="expenses" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">المصروفات</span>
            </TabsTrigger>
            <TabsTrigger value="budgets" className="flex items-center gap-2">
              <PieChart className="w-4 h-4" />
              <span className="hidden sm:inline">الميزانيات</span>
            </TabsTrigger>
            <TabsTrigger value="taxes" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              <span className="hidden sm:inline">الضرائب</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">التقارير</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">توزيع التكاليف</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">تكاليف المواد</span>
                      <span className="font-semibold">{cases.reduce((s, c) => s + c.materialCost, 0).toLocaleString()} ج.م</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">تكاليف العمالة</span>
                      <span className="font-semibold">{cases.reduce((s, c) => s + c.laborCost, 0).toLocaleString()} ج.م</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">التكاليف العامة</span>
                      <span className="font-semibold">{cases.reduce((s, c) => s + c.overheadCost, 0).toLocaleString()} ج.م</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">مؤشرات الأداء المالي</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">متوسط قيمة الحالة</span>
                      <span className="font-semibold">{(totals.revenue / cases.filter(c => c.invoiceStatus === "paid").length || 0).toFixed(0)} ج.م</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">معدل التحصيل</span>
                      <span className="font-semibold text-green-600">
                        {((cases.filter(c => c.invoiceStatus === "paid").length / cases.length) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">نسبة التكلفة للإيراد</span>
                      <span className="font-semibold">{((totals.costs / totals.revenue) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">الإيرادات والمصروفات الشهرية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center text-muted-foreground">
                  <BarChart3 className="w-12 h-12 mr-3" />
                  <span>رسم بياني تفاعلي للإيرادات والمصروفات</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invoicing Tab */}
          <TabsContent value="invoicing" className="space-y-4">
            {/* Header Section */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">إدارة الفواتير الشاملة</h3>
                <p className="text-sm text-muted-foreground">إنشاء وتتبع وإدارة جميع فواتير المعمل</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setShowNewInvoice(true)}>
                  <FileText className="w-4 h-4 ml-2" /> فاتورة جديدة
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 ml-2" /> تصدير
                </Button>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">إجمالي الفواتير</p>
                  <p className="text-2xl font-bold">{invoices.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">مدفوعة</p>
                  <p className="text-2xl font-bold text-green-600">
                    {invoices.filter(inv => inv.status === "paid").length}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">معلقة</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {invoices.filter(inv => inv.status === "sent").length}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">متأخرة</p>
                  <p className="text-2xl font-bold text-red-600">
                    {invoices.filter(inv => inv.status === "overdue").length}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">مسودات</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {invoices.filter(inv => inv.status === "draft").length}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <Input placeholder="بحث برقم الفاتورة، الطبيب، المريض..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
              </div>
              <select value={invoiceFilter} onChange={e => setInvoiceFilter(e.target.value)} className="border rounded-md px-3 py-2 text-sm">
                <option value="all">جميع الفواتير</option>
                <option value="draft">مسودة</option>
                <option value="sent">مرسلة</option>
                <option value="paid">مدفوعة</option>
                <option value="overdue">متأخرة</option>
                <option value="partial">مدفوع جزئياً</option>
                <option value="cancelled">ملغاة</option>
              </select>
            </div>

            {/* Invoices Table */}
            <div className="bg-card border rounded-lg overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    {["رقم الفاتورة", "التاريخ", "الطبيب", "المريض", "المبلغ الكلي", "المدفوع", "المتبقي", "الحالة", "تاريخ الاستحقاق", "الإجراءات"].map(h => (
                      <th key={h} className="text-right px-3 py-3 font-medium text-muted-foreground text-xs">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {invoices.filter(inv => {
                    const matchSearch = `${inv.invoiceNumber} ${inv.doctorName} ${inv.patientName}`.toLowerCase().includes(search.toLowerCase());
                    const matchStatus = invoiceFilter === "all" || inv.status === invoiceFilter;
                    return matchSearch && matchStatus;
                  }).map(inv => {
                    const statusColors: Record<string, string> = {
                      draft: "bg-gray-100 text-gray-700",
                      sent: "bg-blue-100 text-blue-800",
                      paid: "bg-green-100 text-green-800",
                      overdue: "bg-red-100 text-red-800",
                      partial: "bg-yellow-100 text-yellow-800",
                      cancelled: "bg-gray-200 text-gray-600",
                    };
                    
                    const isOverdue = inv.status === "sent" && new Date(inv.dueDate) < new Date();
                    
                    return (
                      <tr key={inv.id} className="border-t hover:bg-muted/30">
                        <td className="px-3 py-3 font-mono text-xs font-semibold">{inv.invoiceNumber}</td>
                        <td className="px-3 py-3">{inv.issueDate}</td>
                        <td className="px-3 py-3">
                          <div>
                            <p className="font-medium">{inv.doctorName}</p>
                            <p className="text-xs text-muted-foreground">{inv.doctorClinic}</p>
                          </div>
                        </td>
                        <td className="px-3 py-3">{inv.patientName}</td>
                        <td className="px-3 py-3 font-semibold">{inv.total.toLocaleString()} ج.م</td>
                        <td className="px-3 py-3 text-green-600">{inv.paidAmount.toLocaleString()} ج.م</td>
                        <td className="px-3 py-3 text-red-600 font-medium">{inv.remainingAmount.toLocaleString()} ج.م</td>
                        <td className="px-3 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[isOverdue ? 'overdue' : inv.status]}`}>
                            {isOverdue ? 'متأخرة' : inv.status === 'draft' ? 'مسودة' : inv.status === 'sent' ? 'مرسلة' : inv.status === 'paid' ? 'مدفوعة' : inv.status === 'partial' ? 'جزئي' : 'ملغاة'}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <span className={isOverdue ? "text-red-600 font-medium" : ""}>{inv.dueDate}</span>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => setSelectedInvoice(inv)} title="عرض">
                              <FileText className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" title="طباعة">
                              <Download className="w-4 h-4" />
                            </Button>
                            {inv.status !== "paid" && inv.status !== "cancelled" && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-xs"
                                onClick={() => {
                                  setSelectedInvoice(inv);
                                  setShowNewPayment(true);
                                }}
                              >
                                دفع
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    العملاء (الأطباء)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {clients.slice(0, 3).map(client => (
                      <div key={client.id} className="flex justify-between items-center p-2 bg-muted/30 rounded">
                        <div>
                          <p className="font-medium text-sm">{client.name}</p>
                          <p className="text-xs text-muted-foreground">{client.clinic}</p>
                        </div>
                        <div className="text-left">
                          <p className="text-xs text-muted-foreground">مستحق</p>
                          <p className="font-semibold text-sm">{client.totalOutstanding.toLocaleString()} ج.م</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    آخر الدفعات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {payments.slice(-3).reverse().map(payment => (
                      <div key={payment.id} className="flex justify-between items-center p-2 bg-muted/30 rounded">
                        <div>
                          <p className="font-medium text-sm">{payment.invoiceNumber}</p>
                          <p className="text-xs text-muted-foreground">{payment.paymentDate}</p>
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-sm text-green-600">{payment.amount.toLocaleString()} ج.م</p>
                          <p className="text-xs text-muted-foreground">{payment.paymentMethod}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    تذكيرات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {invoices.filter(inv => inv.status === "overdue" || (inv.status === "sent" && new Date(inv.dueDate) < new Date())).slice(0, 3).map(inv => (
                      <div key={inv.id} className="flex justify-between items-center p-2 bg-red-50 rounded border border-red-200">
                        <div>
                          <p className="font-medium text-sm text-red-800">{inv.invoiceNumber}</p>
                          <p className="text-xs text-red-600">{inv.doctorName}</p>
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-sm text-red-800">{inv.remainingAmount.toLocaleString()} ج.م</p>
                          <p className="text-xs text-red-600">متأخر</p>
                        </div>
                      </div>
                    ))}
                    {invoices.filter(inv => inv.status === "overdue").length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">لا توجد فواتير متأخرة</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Expenses Tab */}
          <TabsContent value="expenses" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">إدارة المصروفات</h3>
              <Button onClick={() => setShowNewExpense(true)}><ShoppingCart className="w-4 h-4 ml-2" /> إضافة مصروف</Button>
            </div>

            <div className="bg-card border rounded-lg overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    {["رقم المصروف", "التاريخ", "الفئة", "المورد", "المبلغ (ج.م)", "الحالة", "طريقة الدفع", "الوصف"].map(h => (
                      <th key={h} className="text-right px-3 py-3 font-medium text-muted-foreground text-xs">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {expenses.map(exp => {
                    const statusColors = {
                      pending: "bg-yellow-100 text-yellow-800",
                      approved: "bg-blue-100 text-blue-800",
                      paid: "bg-green-100 text-green-800",
                    };
                    
                    return (
                      <tr key={exp.id} className="border-t hover:bg-muted/30">
                        <td className="px-3 py-3 font-mono text-xs">{exp.id}</td>
                        <td className="px-3 py-3">{exp.date}</td>
                        <td className="px-3 py-3">{exp.category}</td>
                        <td className="px-3 py-3">{exp.vendor}</td>
                        <td className="px-3 py-3 font-semibold">{exp.amount.toLocaleString()} ج.م</td>
                        <td className="px-3 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[exp.status]}`}>
                            {exp.status}
                          </span>
                        </td>
                        <td className="px-3 py-3">{exp.paymentMethod}</td>
                        <td className="px-3 py-3 text-muted-foreground">{exp.description}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">معلق</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{expenses.filter(e => e.status === "pending").reduce((s, e) => s + e.amount, 0).toLocaleString()} ج.م</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">معتمد</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{expenses.filter(e => e.status === "approved").reduce((s, e) => s + e.amount, 0).toLocaleString()} ج.م</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">مدفوع</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{expenses.filter(e => e.status === "paid").reduce((s, e) => s + e.amount, 0).toLocaleString()} ج.م</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Budgets Tab */}
          <TabsContent value="budgets" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">الميزانيات والتخطيط المالي</h3>
              <Button onClick={() => setShowEditBudget(true)}><Percent className="w-4 h-4 ml-2" /> تعديل الميزانيات</Button>
            </div>

            <div className="space-y-4">
              {budgets.map((budget, idx) => {
                const percentUsed = (budget.spent / budget.allocated) * 100;
                const isOverBudget = percentUsed > 100;
                const isNearLimit = percentUsed > 80 && percentUsed <= 100;
                
                return (
                  <Card key={idx}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{budget.department}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            تم إنفاق {budget.spent.toLocaleString()} ج.م من {budget.allocated.toLocaleString()} ج.م
                          </p>
                        </div>
                        <div className="text-left">
                          <div className={`text-2xl font-bold ${isOverBudget ? "text-red-600" : isNearLimit ? "text-yellow-600" : "text-green-600"}`}>
                            {percentUsed.toFixed(1)}%
                          </div>
                          <p className="text-xs text-muted-foreground">مستخدم</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full ${isOverBudget ? "bg-red-600" : isNearLimit ? "bg-yellow-600" : "bg-green-600"}`}
                            style={{ width: `${Math.min(percentUsed, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-green-600 font-medium">متبقي: {budget.remaining.toLocaleString()} ج.م</span>
                          {isOverBudget && (
                            <span className="text-red-600 font-medium flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              تجاوز الميزانية!
                            </span>
                          )}
                          {isNearLimit && !isOverBudget && (
                            <span className="text-yellow-600 font-medium flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              قريب من الحد
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>ملخص الميزانية الإجمالية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">إجمالي المخصص</p>
                    <p className="text-2xl font-bold">{budgets.reduce((s, b) => s + b.allocated, 0).toLocaleString()} ج.م</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">إجمالي المنفق</p>
                    <p className="text-2xl font-bold text-blue-600">{budgets.reduce((s, b) => s + b.spent, 0).toLocaleString()} ج.م</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">إجمالي المتبقي</p>
                    <p className="text-2xl font-bold text-green-600">{budgets.reduce((s, b) => s + b.remaining, 0).toLocaleString()} ج.م</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Taxes Tab */}
          <TabsContent value="taxes" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">إدارة الضرائب والامتثال</h3>
              <Button onClick={() => setShowTaxCalculator(true)}><Calculator className="w-4 h-4 ml-2" /> حساب الضريبة</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    معلقة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    {taxRecords.filter(t => t.status === "pending").reduce((s, t) => s + t.amount, 0).toLocaleString()} ج.م
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {taxRecords.filter(t => t.status === "pending").length} سجلات
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    مقدمة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {taxRecords.filter(t => t.status === "filed").reduce((s, t) => s + t.amount, 0).toLocaleString()} ج.م
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {taxRecords.filter(t => t.status === "filed").length} سجلات
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    مدفوعة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {taxRecords.filter(t => t.status === "paid").reduce((s, t) => s + t.amount, 0).toLocaleString()} ج.م
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {taxRecords.filter(t => t.status === "paid").length} سجلات
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-card border rounded-lg overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    {["رقم السجل", "الفترة", "نوع الضريبة", "المبلغ (ج.م)", "الحالة", "تاريخ الاستحقاق", "الإجراءات"].map(h => (
                      <th key={h} className="text-right px-3 py-3 font-medium text-muted-foreground text-xs">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {taxRecords.map(tax => {
                    const statusColors = {
                      pending: "bg-yellow-100 text-yellow-800",
                      filed: "bg-blue-100 text-blue-800",
                      paid: "bg-green-100 text-green-800",
                    };
                    
                    return (
                      <tr key={tax.id} className="border-t hover:bg-muted/30">
                        <td className="px-3 py-3 font-mono text-xs">{tax.id}</td>
                        <td className="px-3 py-3">{tax.period}</td>
                        <td className="px-3 py-3">{tax.type}</td>
                        <td className="px-3 py-3 font-semibold">{tax.amount.toLocaleString()} ج.م</td>
                        <td className="px-3 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[tax.status]}`}>
                            {tax.status}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {tax.dueDate}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex gap-1">
                            {tax.status === "pending" && <Button size="sm" variant="outline" className="text-xs">تقديم</Button>}
                            {tax.status === "filed" && <Button size="sm" variant="outline" className="text-xs bg-green-50">دفع</Button>}
                            <Button size="sm" variant="ghost"><FileText className="w-3 h-3" /></Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">التقارير المالية والتحليلات</h3>
              <div className="flex gap-2">
                <Button variant="outline" onClick={exportPDF}><Download className="w-4 h-4 ml-2" /> تصدير PDF</Button>
                <Button variant="outline" onClick={exportExcel}><FileSpreadsheet className="w-4 h-4 ml-2" /> تصدير Excel</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowProfitLossReport(true)}>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    تقرير الأرباح والخسائر
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    تقرير شامل للإيرادات والمصروفات والأرباح
                  </p>
                  <Button variant="link" className="p-0 mt-2">عرض التقرير →</Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowCashFlowReport(true)}>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    تقرير التدفق النقدي
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    تحليل التدفقات النقدية الداخلة والخارجة
                  </p>
                  <Button variant="link" className="p-0 mt-2">عرض التقرير →</Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowExpenseAnalysis(true)}>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-purple-600" />
                    تحليل المصروفات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    توزيع المصروفات حسب الفئات والأقسام
                  </p>
                  <Button variant="link" className="p-0 mt-2">عرض التقرير →</Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowDoctorPerformance(true)}>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="w-5 h-5 text-orange-600" />
                    تحليل الأداء حسب الطبيب
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    الإيرادات والربحية لكل طبيب
                  </p>
                  <Button variant="link" className="p-0 mt-2">عرض التقرير →</Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowInvoiceReport(true)}>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-cyan-600" />
                    تقرير الفواتير
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    تحليل حالة الفواتير والمستحقات
                  </p>
                  <Button variant="link" className="p-0 mt-2">عرض التقرير →</Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowBudgetReport(true)}>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-indigo-600" />
                    تقرير الميزانية
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    مقارنة المخطط بالفعلي لكل قسم
                  </p>
                  <Button variant="link" className="p-0 mt-2">عرض التقرير →</Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>المؤشرات المالية الرئيسية (KPIs)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">العائد على الاستثمار</p>
                    <p className="text-2xl font-bold text-green-600">24.5%</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">نقطة التعادل</p>
                    <p className="text-2xl font-bold text-blue-600">78%</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">معدل دوران الأصول</p>
                    <p className="text-2xl font-bold text-purple-600">1.8x</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">نسبة السيولة</p>
                    <p className="text-2xl font-bold text-cyan-600">2.3</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialog: New Invoice */}
        <Dialog open={showNewInvoice} onOpenChange={setShowNewInvoice}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">إنشاء فاتورة جديدة</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>اسم الطبيب</Label>
                  <Input 
                    value={newInvoiceForm.doctorName} 
                    onChange={e => setNewInvoiceForm({...newInvoiceForm, doctorName: e.target.value})}
                    placeholder="د. محمد أحمد"
                  />
                </div>
                <div>
                  <Label>العيادة</Label>
                  <Input 
                    value={newInvoiceForm.doctorClinic} 
                    onChange={e => setNewInvoiceForm({...newInvoiceForm, doctorClinic: e.target.value})}
                    placeholder="عيادة النور لطب الأسنان"
                  />
                </div>
              </div>
              
              <div>
                <Label>اسم المريض</Label>
                <Input 
                  value={newInvoiceForm.patientName} 
                  onChange={e => setNewInvoiceForm({...newInvoiceForm, patientName: e.target.value})}
                  placeholder="أحمد محمود"
                />
              </div>

              <Separator />

              <div>
                <Label className="text-base font-semibold">بنود الفاتورة</Label>
                <div className="space-y-3 mt-3">
                  {newInvoiceForm.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-5">
                        <Label className="text-xs">الوصف</Label>
                        <Input 
                          value={item.description}
                          onChange={e => {
                            const items = [...newInvoiceForm.items];
                            items[index].description = e.target.value;
                            setNewInvoiceForm({...newInvoiceForm, items});
                          }}
                          placeholder="تاج زيركون"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-xs">الكمية</Label>
                        <Input 
                          type="number"
                          value={item.quantity}
                          onChange={e => {
                            const items = [...newInvoiceForm.items];
                            items[index].quantity = +e.target.value;
                            setNewInvoiceForm({...newInvoiceForm, items});
                          }}
                        />
                      </div>
                      <div className="col-span-3">
                        <Label className="text-xs">سعر الوحدة (ج.م)</Label>
                        <Input 
                          type="number"
                          value={item.unitPrice}
                          onChange={e => {
                            const items = [...newInvoiceForm.items];
                            items[index].unitPrice = +e.target.value;
                            setNewInvoiceForm({...newInvoiceForm, items});
                          }}
                        />
                      </div>
                      <div className="col-span-2 flex items-center gap-1">
                        <div className="flex-1">
                          <Label className="text-xs">الإجمالي</Label>
                          <p className="font-semibold text-sm">{(item.quantity * item.unitPrice).toLocaleString()} ج.م</p>
                        </div>
                        {newInvoiceForm.items.length > 1 && (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => {
                              const items = newInvoiceForm.items.filter((_, i) => i !== index);
                              setNewInvoiceForm({...newInvoiceForm, items});
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setNewInvoiceForm({
                        ...newInvoiceForm,
                        items: [...newInvoiceForm.items, { description: "", quantity: 1, unitPrice: 0 }]
                      });
                    }}
                  >
                    + إضافة بند
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>الخصم (ج.م)</Label>
                  <Input 
                    type="number"
                    value={newInvoiceForm.discount}
                    onChange={e => setNewInvoiceForm({...newInvoiceForm, discount: +e.target.value})}
                  />
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">المجموع الفرعي:</span>
                    <span className="font-semibold">
                      {newInvoiceForm.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0).toLocaleString()} ج.م
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">الخصم:</span>
                    <span className="font-semibold text-red-600">- {newInvoiceForm.discount.toLocaleString()} ج.م</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between">
                    <span className="font-bold">الإجمالي:</span>
                    <span className="font-bold text-lg text-green-600">
                      {(newInvoiceForm.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) - newInvoiceForm.discount).toLocaleString()} ج.م
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <Label>ملاحظات</Label>
                <Input 
                  value={newInvoiceForm.notes}
                  onChange={e => setNewInvoiceForm({...newInvoiceForm, notes: e.target.value})}
                  placeholder="أي ملاحظات إضافية..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewInvoice(false)}>إلغاء</Button>
              <Button variant="outline">حفظ كمسودة</Button>
              <Button>إنشاء وإرسال الفاتورة</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog: Invoice Details */}
        {selectedInvoice && !showNewPayment && (
          <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl">تفاصيل الفاتورة {selectedInvoice.invoiceNumber}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* Invoice Header */}
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">الطبيب</p>
                      <p className="font-semibold">{selectedInvoice.doctorName}</p>
                      <p className="text-sm">{selectedInvoice.doctorClinic}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-muted-foreground">المريض</p>
                      <p className="font-semibold">{selectedInvoice.patientName}</p>
                    </div>
                  </div>
                  <Separator className="my-3" />
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">تاريخ الإصدار</p>
                      <p className="font-medium">{selectedInvoice.issueDate}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">تاريخ الاستحقاق</p>
                      <p className="font-medium">{selectedInvoice.dueDate}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-muted-foreground">الحالة</p>
                      <p className="font-medium">
                        {selectedInvoice.status === 'paid' ? 'مدفوعة' : selectedInvoice.status === 'sent' ? 'مرسلة' : selectedInvoice.status === 'draft' ? 'مسودة' : 'متأخرة'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Invoice Items */}
                <div>
                  <h4 className="font-semibold mb-3">البنود</h4>
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-right p-2">الوصف</th>
                        <th className="text-right p-2">الكمية</th>
                        <th className="text-right p-2">سعر الوحدة</th>
                        <th className="text-right p-2">الإجمالي</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoice.items.map(item => (
                        <tr key={item.id} className="border-t">
                          <td className="p-2">{item.description}</td>
                          <td className="p-2">{item.quantity}</td>
                          <td className="p-2">{item.unitPrice.toLocaleString()} ج.م</td>
                          <td className="p-2 font-semibold">{item.total.toLocaleString()} ج.م</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>المجموع الفرعي:</span>
                      <span className="font-semibold">{selectedInvoice.subtotal.toLocaleString()} ج.م</span>
                    </div>
                    {selectedInvoice.discount > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>الخصم:</span>
                        <span className="font-semibold">- {selectedInvoice.discount.toLocaleString()} ج.م</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between text-lg">
                      <span className="font-bold">الإجمالي:</span>
                      <span className="font-bold text-green-600">{selectedInvoice.total.toLocaleString()} ج.م</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>المدفوع:</span>
                      <span className="font-semibold text-green-600">{selectedInvoice.paidAmount.toLocaleString()} ج.م</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>المتبقي:</span>
                      <span className="font-semibold text-red-600">{selectedInvoice.remainingAmount.toLocaleString()} ج.م</span>
                    </div>
                  </div>
                </div>

                {selectedInvoice.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground">ملاحظات</p>
                    <p className="text-sm">{selectedInvoice.notes}</p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedInvoice(null)}>إغلاق</Button>
                <Button variant="outline"><Download className="w-4 h-4 ml-2" /> طباعة</Button>
                {selectedInvoice.status !== "paid" && (
                  <Button onClick={() => setShowNewPayment(true)}>
                    <Banknote className="w-4 h-4 ml-2" /> تسجيل دفعة
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Dialog: Profit & Loss Report */}
        <Dialog open={showProfitLossReport} onOpenChange={setShowProfitLossReport}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                تقرير الأرباح والخسائر
              </DialogTitle>
              <p className="text-sm text-muted-foreground">فترة التقرير: فبراير 2026</p>
            </DialogHeader>
            <div className="space-y-6">
              {/* Revenue Section */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  الإيرادات
                </h3>
                <div className="space-y-2 bg-green-50 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <span>إيرادات الفواتير المدفوعة</span>
                    <span className="font-semibold">{totals.revenue.toLocaleString()} ج.م</span>
                  </div>
                  <div className="flex justify-between">
                    <span>إيرادات أخرى</span>
                    <span className="font-semibold">0 ج.م</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">إجمالي الإيرادات</span>
                    <span className="font-bold text-green-600">{totals.revenue.toLocaleString()} ج.م</span>
                  </div>
                </div>
              </div>

              {/* Expenses Section */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                  المصروفات
                </h3>
                <div className="space-y-2 bg-red-50 p-4 rounded-lg">
                  {Object.entries(
                    expenses.reduce((acc, exp) => {
                      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([category, amount]) => (
                    <div key={category} className="flex justify-between">
                      <span>{category}</span>
                      <span className="font-semibold">{amount.toLocaleString()} ج.م</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">إجمالي المصروفات</span>
                    <span className="font-bold text-red-600">{totals.totalExpenses.toLocaleString()} ج.م</span>
                  </div>
                </div>
              </div>

              {/* Net Profit */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">صافي الربح</span>
                  <span className="text-3xl font-bold text-blue-600">
                    {totals.netProfit.toLocaleString()} ج.م
                  </span>
                </div>
                <div className="mt-3 flex justify-between text-sm">
                  <span>هامش الربح</span>
                  <span className="font-semibold">{totals.profitMargin}%</span>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">معدل النمو</p>
                  <p className="text-2xl font-bold text-green-600">+12.5%</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">نسبة التكلفة</p>
                  <p className="text-2xl font-bold">{((totals.totalExpenses / totals.revenue) * 100).toFixed(1)}%</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">العائد</p>
                  <p className="text-2xl font-bold text-blue-600">{((totals.netProfit / totals.revenue) * 100).toFixed(1)}%</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowProfitLossReport(false)}>إغلاق</Button>
              <Button onClick={exportPDF}><Download className="w-4 h-4 ml-2" /> تصدير PDF</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog: Cash Flow Report */}
        <Dialog open={showCashFlowReport} onOpenChange={setShowCashFlowReport}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-600" />
                تقرير التدفق النقدي
              </DialogTitle>
              <p className="text-sm text-muted-foreground">فترة التقرير: فبراير 2026</p>
            </DialogHeader>
            <div className="space-y-6">
              {/* Cash Inflows */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <ArrowUpRight className="w-5 h-5 text-green-600" />
                  التدفقات النقدية الداخلة
                </h3>
                <div className="space-y-2 bg-green-50 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <span>تحصيلات من العملاء</span>
                    <span className="font-semibold text-green-600">{invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.paidAmount, 0).toLocaleString()} ج.م</span>
                  </div>
                  <div className="flex justify-between">
                    <span>دفعات جزئية</span>
                    <span className="font-semibold text-green-600">0 ج.م</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">إجمالي التدفقات الداخلة</span>
                    <span className="font-bold text-green-600">{invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.paidAmount, 0).toLocaleString()} ج.م</span>
                  </div>
                </div>
              </div>

              {/* Cash Outflows */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <ArrowDownRight className="w-5 h-5 text-red-600" />
                  التدفقات النقدية الخارجة
                </h3>
                <div className="space-y-2 bg-red-50 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <span>مصروفات مدفوعة</span>
                    <span className="font-semibold text-red-600">{expenses.filter(e => e.status === 'paid').reduce((s, e) => s + e.amount, 0).toLocaleString()} ج.م</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ضرائب مدفوعة</span>
                    <span className="font-semibold text-red-600">{taxRecords.filter(t => t.status === 'paid').reduce((s, t) => s + t.amount, 0).toLocaleString()} ج.م</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">إجمالي التدفقات الخارجة</span>
                    <span className="font-bold text-red-600">{(expenses.filter(e => e.status === 'paid').reduce((s, e) => s + e.amount, 0) + taxRecords.filter(t => t.status === 'paid').reduce((s, t) => s + t.amount, 0)).toLocaleString()} ج.م</span>
                  </div>
                </div>
              </div>

              {/* Net Cash Flow */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">صافي التدفق النقدي</span>
                  <span className="text-3xl font-bold text-blue-600">
                    {(invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.paidAmount, 0) - expenses.filter(e => e.status === 'paid').reduce((s, e) => s + e.amount, 0) - taxRecords.filter(t => t.status === 'paid').reduce((s, t) => s + t.amount, 0)).toLocaleString()} ج.م
                  </span>
                </div>
              </div>

              {/* Pending Payments */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">مستحقات معلقة (داخلة)</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {invoices.filter(i => i.status !== 'paid' && i.status !== 'cancelled').reduce((s, i) => s + i.remainingAmount, 0).toLocaleString()} ج.م
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">التزامات معلقة (خارجة)</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {expenses.filter(e => e.status !== 'paid').reduce((s, e) => s + e.amount, 0).toLocaleString()} ج.م
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCashFlowReport(false)}>إغلاق</Button>
              <Button onClick={exportPDF}><Download className="w-4 h-4 ml-2" /> تصدير PDF</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog: Expense Analysis */}
        <Dialog open={showExpenseAnalysis} onOpenChange={setShowExpenseAnalysis}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <PieChart className="w-6 h-6 text-purple-600" />
                تحليل المصروفات
              </DialogTitle>
              <p className="text-sm text-muted-foreground">توزيع المصروفات حسب الفئات</p>
            </DialogHeader>
            <div className="space-y-6">
              {/* Category Breakdown */}
              <div>
                <h3 className="font-semibold mb-3">المصروفات حسب الفئة</h3>
                <div className="space-y-3">
                  {Object.entries(
                    expenses.reduce((acc, exp) => {
                      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
                      return acc;
                    }, {} as Record<string, number>)
                  ).sort((a, b) => b[1] - a[1]).map(([category, amount]) => {
                    const percentage = (amount / totals.totalExpenses) * 100;
                    return (
                      <div key={category} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{category}</span>
                          <span className="font-semibold">{amount.toLocaleString()} ج.م ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-purple-600 h-3 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status Breakdown */}
              <div>
                <h3 className="font-semibold mb-3">المصروفات حسب الحالة</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-yellow-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">معلق</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {expenses.filter(e => e.status === 'pending').reduce((s, e) => s + e.amount, 0).toLocaleString()} ج.م
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {expenses.filter(e => e.status === 'pending').length} مصروف
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">معتمد</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {expenses.filter(e => e.status === 'approved').reduce((s, e) => s + e.amount, 0).toLocaleString()} ج.م
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {expenses.filter(e => e.status === 'approved').length} مصروف
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">مدفوع</p>
                    <p className="text-2xl font-bold text-green-600">
                      {expenses.filter(e => e.status === 'paid').reduce((s, e) => s + e.amount, 0).toLocaleString()} ج.م
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {expenses.filter(e => e.status === 'paid').length} مصروف
                    </p>
                  </div>
                </div>
              </div>

              {/* Top Vendors */}
              <div>
                <h3 className="font-semibold mb-3">أكبر الموردين</h3>
                <div className="space-y-2">
                  {Object.entries(
                    expenses.reduce((acc, exp) => {
                      acc[exp.vendor] = (acc[exp.vendor] || 0) + exp.amount;
                      return acc;
                    }, {} as Record<string, number>)
                  ).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([vendor, amount], index) => (
                    <div key={vendor} className="flex justify-between items-center p-3 bg-muted/30 rounded">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-lg text-muted-foreground">#{index + 1}</span>
                        <span className="font-medium">{vendor}</span>
                      </div>
                      <span className="font-semibold">{amount.toLocaleString()} ج.م</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowExpenseAnalysis(false)}>إغلاق</Button>
              <Button onClick={exportPDF}><Download className="w-4 h-4 ml-2" /> تصدير PDF</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog: Doctor Performance */}
        <Dialog open={showDoctorPerformance} onOpenChange={setShowDoctorPerformance}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <Users className="w-6 h-6 text-orange-600" />
                تحليل الأداء حسب الطبيب
              </DialogTitle>
              <p className="text-sm text-muted-foreground">الإيرادات والربحية لكل طبيب/عميل</p>
            </DialogHeader>
            <div className="space-y-6">
              {/* Top Doctors Table */}
              <div>
                <h3 className="font-semibold mb-3">ترتيب الأطباء حسب الإيرادات</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-right p-3 font-medium">#</th>
                        <th className="text-right p-3 font-medium">الطبيب</th>
                        <th className="text-right p-3 font-medium">العيادة</th>
                        <th className="text-right p-3 font-medium">عدد الفواتير</th>
                        <th className="text-right p-3 font-medium">المدفوع</th>
                        <th className="text-right p-3 font-medium">المستحق</th>
                        <th className="text-right p-3 font-medium">الإجمالي</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clients.sort((a, b) => (b.totalPaid + b.totalOutstanding) - (a.totalPaid + a.totalOutstanding)).map((client, index) => (
                        <tr key={client.id} className="border-t hover:bg-muted/20">
                          <td className="p-3 font-bold text-muted-foreground">{index + 1}</td>
                          <td className="p-3 font-medium">{client.name}</td>
                          <td className="p-3 text-muted-foreground">{client.clinic}</td>
                          <td className="p-3 text-center">{client.totalInvoices}</td>
                          <td className="p-3 font-semibold text-green-600">{client.totalPaid.toLocaleString()} ج.م</td>
                          <td className="p-3 font-semibold text-yellow-600">{client.totalOutstanding.toLocaleString()} ج.م</td>
                          <td className="p-3 font-bold">{(client.totalPaid + client.totalOutstanding).toLocaleString()} ج.م</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">إجمالي الأطباء</p>
                  <p className="text-3xl font-bold text-blue-600">{clients.length}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">متوسط الإيراد لكل طبيب</p>
                  <p className="text-3xl font-bold text-green-600">
                    {(clients.reduce((s, c) => s + c.totalPaid, 0) / clients.length).toFixed(0)} ج.م
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">أكبر عميل</p>
                  <p className="text-xl font-bold text-purple-600">
                    {clients.sort((a, b) => (b.totalPaid + b.totalOutstanding) - (a.totalPaid + a.totalOutstanding))[0]?.name}
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDoctorPerformance(false)}>إغلاق</Button>
              <Button onClick={exportPDF}><Download className="w-4 h-4 ml-2" /> تصدير PDF</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog: Invoice Report */}
        <Dialog open={showInvoiceReport} onOpenChange={setShowInvoiceReport}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <Receipt className="w-6 h-6 text-cyan-600" />
                تقرير الفواتير
              </DialogTitle>
              <p className="text-sm text-muted-foreground">تحليل شامل لحالة الفواتير والمستحقات</p>
            </DialogHeader>
            <div className="space-y-6">
              {/* Invoice Status Summary */}
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">مدفوعة</p>
                  <p className="text-2xl font-bold text-green-600">{invoices.filter(i => i.status === 'paid').length}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0).toLocaleString()} ج.م
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">مرسلة</p>
                  <p className="text-2xl font-bold text-blue-600">{invoices.filter(i => i.status === 'sent').length}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {invoices.filter(i => i.status === 'sent').reduce((s, i) => s + i.total, 0).toLocaleString()} ج.م
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">متأخرة</p>
                  <p className="text-2xl font-bold text-red-600">{invoices.filter(i => i.status === 'overdue').length}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.total, 0).toLocaleString()} ج.م
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">مسودات</p>
                  <p className="text-2xl font-bold text-gray-600">{invoices.filter(i => i.status === 'draft').length}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {invoices.filter(i => i.status === 'draft').reduce((s, i) => s + i.total, 0).toLocaleString()} ج.م
                  </p>
                </div>
              </div>

              {/* Payment Analysis */}
              <div>
                <h3 className="font-semibold mb-3">تحليل المدفوعات</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-6 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">إجمالي المحصل</p>
                    <p className="text-3xl font-bold text-green-600">
                      {invoices.reduce((s, i) => s + i.paidAmount, 0).toLocaleString()} ج.م
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      معدل التحصيل: {((invoices.reduce((s, i) => s + i.paidAmount, 0) / invoices.reduce((s, i) => s + i.total, 0)) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-6 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">إجمالي المستحق</p>
                    <p className="text-3xl font-bold text-yellow-600">
                      {invoices.reduce((s, i) => s + i.remainingAmount, 0).toLocaleString()} ج.م
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {invoices.filter(i => i.remainingAmount > 0).length} فاتورة غير مسددة بالكامل
                    </p>
                  </div>
                </div>
              </div>

              {/* Aging Analysis */}
              <div>
                <h3 className="font-semibold mb-3">تحليل أعمار الديون</h3>
                <div className="space-y-2">
                  <div className="flex justify-between p-3 bg-yellow-50 rounded">
                    <span>أقل من 15 يوم</span>
                    <span className="font-semibold">
                      {invoices.filter(i => i.status === 'sent').length} فاتورة
                    </span>
                  </div>
                  <div className="flex justify-between p-3 bg-orange-50 rounded">
                    <span>15-30 يوم</span>
                    <span className="font-semibold">0 فاتورة</span>
                  </div>
                  <div className="flex justify-between p-3 bg-red-50 rounded">
                    <span>أكثر من 30 يوم</span>
                    <span className="font-semibold text-red-600">
                      {invoices.filter(i => i.status === 'overdue').length} فاتورة
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowInvoiceReport(false)}>إغلاق</Button>
              <Button onClick={exportPDF}><Download className="w-4 h-4 ml-2" /> تصدير PDF</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog: Budget Report */}
        <Dialog open={showBudgetReport} onOpenChange={setShowBudgetReport}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <Building2 className="w-6 h-6 text-indigo-600" />
                تقرير الميزانية
              </DialogTitle>
              <p className="text-sm text-muted-foreground">مقارنة المخطط بالفعلي لكل قسم</p>
            </DialogHeader>
            <div className="space-y-6">
              {/* Overall Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">إجمالي المخصص</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {budgets.reduce((s, b) => s + b.allocated, 0).toLocaleString()} ج.م
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">إجمالي المنفق</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {budgets.reduce((s, b) => s + b.spent, 0).toLocaleString()} ج.م
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">إجمالي المتبقي</p>
                  <p className="text-2xl font-bold text-green-600">
                    {budgets.reduce((s, b) => s + b.remaining, 0).toLocaleString()} ج.م
                  </p>
                </div>
              </div>

              {/* Department Details */}
              <div>
                <h3 className="font-semibold mb-3">تفاصيل الأقسام</h3>
                <div className="space-y-4">
                  {budgets.map((budget, index) => {
                    const percentUsed = (budget.spent / budget.allocated) * 100;
                    const isOverBudget = percentUsed > 100;
                    const isNearLimit = percentUsed > 80 && percentUsed <= 100;
                    
                    return (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold">{budget.department}</h4>
                            <p className="text-sm text-muted-foreground">
                              {budget.spent.toLocaleString()} ج.م / {budget.allocated.toLocaleString()} ج.م
                            </p>
                          </div>
                          <div className="text-left">
                            <p className={`text-2xl font-bold ${
                              isOverBudget ? 'text-red-600' : 
                              isNearLimit ? 'text-yellow-600' : 
                              'text-green-600'
                            }`}>
                              {percentUsed.toFixed(1)}%
                            </p>
                            <p className="text-xs text-muted-foreground">مستخدم</p>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full ${
                              isOverBudget ? 'bg-red-600' : 
                              isNearLimit ? 'bg-yellow-600' : 
                              'bg-green-600'
                            }`}
                            style={{ width: `${Math.min(percentUsed, 100)}%` }}
                          />
                        </div>
                        <div className="mt-2 flex justify-between text-sm">
                          <span className="text-green-600 font-medium">متبقي: {budget.remaining.toLocaleString()} ج.م</span>
                          {isOverBudget && (
                            <span className="text-red-600 font-medium flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              تجاوز بـ {(budget.spent - budget.allocated).toLocaleString()} ج.م
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Performance Indicator */}
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">مؤشر الأداء المالي</h4>
                <p className="text-sm text-muted-foreground">
                  معدل الالتزام بالميزانية: {((budgets.reduce((s, b) => s + b.spent, 0) / budgets.reduce((s, b) => s + b.allocated, 0)) * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  الأقسام المتجاوزة: {budgets.filter(b => b.spent > b.allocated).length} من {budgets.length}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowBudgetReport(false)}>إغلاق</Button>
              <Button onClick={exportPDF}><Download className="w-4 h-4 ml-2" /> تصدير PDF</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog: New Expense */}
        <Dialog open={showNewExpense} onOpenChange={setShowNewExpense}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة مصروف جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>التاريخ</Label>
                  <Input 
                    type="date" 
                    value={newExpenseForm.date}
                    onChange={e => setNewExpenseForm({...newExpenseForm, date: e.target.value})}
                  />
                </div>
                <div>
                  <Label>المبلغ (ج.م)</Label>
                  <Input 
                    type="number" 
                    value={newExpenseForm.amount}
                    onChange={e => setNewExpenseForm({...newExpenseForm, amount: +e.target.value})}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <Label>الفئة</Label>
                <select 
                  className="w-full border rounded-md px-3 py-2"
                  value={newExpenseForm.category}
                  onChange={e => setNewExpenseForm({...newExpenseForm, category: e.target.value})}
                >
                  <option value="">اختر الفئة...</option>
                  <option value="خامات ومواد">خامات ومواد</option>
                  <option value="معدات وصيانة">معدات وصيانة</option>
                  <option value="مرافق وخدمات">مرافق وخدمات</option>
                  <option value="رواتب ومكافآت">رواتب ومكافآت</option>
                  <option value="ضرائب ورسوم">ضرائب ورسوم</option>
                  <option value="تسويق ومبيعات">تسويق ومبيعات</option>
                  <option value="أخرى">أخرى</option>
                </select>
              </div>

              <div>
                <Label>المورد/الجهة</Label>
                <Input 
                  value={newExpenseForm.vendor}
                  onChange={e => setNewExpenseForm({...newExpenseForm, vendor: e.target.value})}
                  placeholder="اسم المورد أو الجهة"
                />
              </div>

              <div>
                <Label>طريقة الدفع</Label>
                <select 
                  className="w-full border rounded-md px-3 py-2"
                  value={newExpenseForm.paymentMethod}
                  onChange={e => setNewExpenseForm({...newExpenseForm, paymentMethod: e.target.value})}
                >
                  <option value="">اختر طريقة الدفع...</option>
                  <option value="تحويل بنكي">تحويل بنكي</option>
                  <option value="نقداً">نقداً</option>
                  <option value="بطاقة ائتمان">بطاقة ائتمان</option>
                  <option value="شيك">شيك</option>
                  <option value="خصم تلقائي">خصم تلقائي</option>
                </select>
              </div>

              <div>
                <Label>الوصف</Label>
                <Input 
                  value={newExpenseForm.description}
                  onChange={e => setNewExpenseForm({...newExpenseForm, description: e.target.value})}
                  placeholder="وصف المصروف"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewExpense(false)}>إلغاء</Button>
              <Button onClick={addExpense}>إضافة المصروف</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog: Edit Budget */}
        <Dialog open={showEditBudget} onOpenChange={setShowEditBudget}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>تعديل الميزانيات</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                قم بتعديل المبالغ المخصصة لكل قسم. سيتم حساب المتبقي تلقائياً بناءً على المنفق.
              </p>
              {budgets.map((budget, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 items-center">
                  <div>
                    <Label className="text-sm">{budget.department}</Label>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">المبلغ المخصص (ج.م)</Label>
                    <Input 
                      type="number" 
                      defaultValue={budget.allocated}
                      className="text-left"
                    />
                  </div>
                  <div className="text-sm">
                    <p className="text-muted-foreground">المنفق: {budget.spent.toLocaleString()} ج.م</p>
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditBudget(false)}>إلغاء</Button>
              <Button onClick={() => {
                alert("تم حفظ التعديلات على الميزانيات");
                setShowEditBudget(false);
              }}>حفظ التعديلات</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog: Tax Calculator */}
        <Dialog open={showTaxCalculator} onOpenChange={setShowTaxCalculator}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                حاسبة الضرائب المصرية
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>المبلغ/الإيراد (ج.م)</Label>
                <Input 
                  type="number" 
                  value={taxCalculatorForm.revenue}
                  onChange={e => setTaxCalculatorForm({...taxCalculatorForm, revenue: +e.target.value})}
                  placeholder="0"
                />
              </div>

              <div>
                <Label>نوع الضريبة</Label>
                <select 
                  className="w-full border rounded-md px-3 py-2"
                  value={taxCalculatorForm.taxType}
                  onChange={e => setTaxCalculatorForm({...taxCalculatorForm, taxType: e.target.value})}
                >
                  <option value="vat">ضريبة القيمة المضافة (14%)</option>
                  <option value="income">ضريبة الدخل (22.5%)</option>
                  <option value="corporate">ضريبة الأرباح التجارية (22.5%)</option>
                  <option value="custom">نسبة مخصصة</option>
                </select>
              </div>

              {taxCalculatorForm.taxType === "custom" && (
                <div>
                  <Label>النسبة المئوية (%)</Label>
                  <Input 
                    type="number" 
                    value={taxCalculatorForm.customRate}
                    onChange={e => setTaxCalculatorForm({...taxCalculatorForm, customRate: +e.target.value})}
                    placeholder="14"
                  />
                </div>
              )}

              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">معلومات الضرائب المصرية</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• ضريبة القيمة المضافة: 14% على الخدمات والسلع</li>
                  <li>• ضريبة الدخل: تصاعدية حتى 22.5%</li>
                  <li>• ضريبة الأرباح التجارية: 22.5%</li>
                  <li>• التأمينات الاجتماعية: 26% من الراتب</li>
                </ul>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowTaxCalculator(false)}>إغلاق</Button>
              <Button onClick={calculateTax}>
                <Calculator className="w-4 h-4 ml-2" />
                احسب الضريبة
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog: New Payment */}
        {showNewPayment && selectedInvoice && (
          <Dialog open={showNewPayment} onOpenChange={setShowNewPayment}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>تسجيل دفعة للفاتورة {selectedInvoice.invoiceNumber}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-muted/30 p-3 rounded">
                  <p className="text-sm text-muted-foreground">المبلغ المستحق</p>
                  <p className="text-2xl font-bold text-red-600">{selectedInvoice.remainingAmount.toLocaleString()} ج.م</p>
                </div>

                <div>
                  <Label>مبلغ الدفعة (ج.م)</Label>
                  <Input type="number" placeholder="0" />
                </div>

                <div>
                  <Label>طريقة الدفع</Label>
                  <select className="w-full border rounded-md px-3 py-2">
                    <option>تحويل بنكي</option>
                    <option>نقداً</option>
                    <option>بطاقة ائتمان</option>
                    <option>شيك</option>
                  </select>
                </div>

                <div>
                  <Label>رقم المرجع</Label>
                  <Input placeholder="TRX-..." />
                </div>

                <div>
                  <Label>تاريخ الدفع</Label>
                  <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>

                <div>
                  <Label>ملاحظات</Label>
                  <Input placeholder="أي ملاحظات..." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowNewPayment(false)}>إلغاء</Button>
                <Button>تسجيل الدفعة</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Layout>
  );
}
