import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import {
  ArrowRight,
  CheckCircle,
  Zap,
  Users,
  Gauge,
  Shield,
  TrendingUp,
  FileText,
  Beaker,
  Microscope,
  Printer,
  ClipboardList,
  PhoneCall,
  Boxes,
  DollarSign,
  BarChart3,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Index() {
  const { t } = useTranslation();

  const departments = [
    {
      id: 1,
      name: t("indexDepartments.receptionIntake"),
      description: t("indexDepartments.receptionIntakeDesc"),
      icon: ClipboardList,
      color: "from-blue-500 to-blue-600",
    },
    {
      id: 2,
      name: t("indexDepartments.casePlanning"),
      description: t("indexDepartments.casePlanningDesc"),
      icon: FileText,
      color: "from-cyan-500 to-cyan-600",
    },
    {
      id: 3,
      name: t("indexDepartments.modelScan"),
      description: t("indexDepartments.modelScanDesc"),
      icon: Microscope,
      color: "from-teal-500 to-teal-600",
    },
    {
      id: 4,
      name: t("indexDepartments.cadDesign"),
      description: t("indexDepartments.cadDesignDesc"),
      icon: Beaker,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      id: 5,
      name: t("indexDepartments.camMilling"),
      description: t("indexDepartments.camMillingDesc"),
      icon: Printer,
      color: "from-green-500 to-green-600",
    },
    {
      id: 6,
      name: t("indexDepartments.ceramicFinishing"),
      description: t("indexDepartments.ceramicFinishingDesc"),
      icon: Gauge,
      color: "from-lime-500 to-lime-600",
    },
    {
      id: 7,
      name: t("indexDepartments.qualityControl"),
      description: t("indexDepartments.qualityControlDesc"),
      icon: Shield,
      color: "from-amber-500 to-amber-600",
    },
    {
      id: 8,
      name: t("indexDepartments.logisticsDelivery"),
      description: t("indexDepartments.logisticsDeliveryDesc"),
      icon: Boxes,
      color: "from-orange-500 to-orange-600",
    },
    {
      id: 9,
      name: t("indexDepartments.doctorComm"),
      description: t("indexDepartments.doctorCommDesc"),
      icon: PhoneCall,
      color: "from-red-500 to-red-600",
    },
    {
      id: 10,
      name: t("indexDepartments.inventoryMgmt"),
      description: t("indexDepartments.inventoryMgmtDesc"),
      icon: Boxes,
      color: "from-pink-500 to-pink-600",
    },
    {
      id: 11,
      name: t("indexDepartments.financialTracking"),
      description: t("indexDepartments.financialTrackingDesc"),
      icon: DollarSign,
      color: "from-purple-500 to-purple-600",
    },
    {
      id: 12,
      name: t("indexDepartments.continuousImprovement"),
      description: t("indexDepartments.continuousImprovementDesc"),
      icon: TrendingUp,
      color: "from-indigo-500 to-indigo-600",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: t("features.isoCompliant"),
      description: t("features.isoCompliantDesc"),
    },
    {
      icon: Zap,
      title: t("features.realTimeTracking"),
      description: t("features.realTimeTrackingDesc"),
    },
    {
      icon: Users,
      title: t("features.doctorCommunication"),
      description: t("features.doctorCommunicationDesc"),
    },
    {
      icon: Gauge,
      title: t("features.qualityControl"),
      description: t("features.qualityControlDesc"),
    },
    {
      icon: TrendingUp,
      title: t("features.performanceAnalytics"),
      description: t("features.performanceAnalyticsDesc"),
    },
    {
      icon: FileText,
      title: t("features.digitalDocumentation"),
      description: t("features.digitalDocumentationDesc"),
    },
  ];

  const caseTypes = [
    t("caseTypes.crowns"),
    t("caseTypes.bridges"),
    t("caseTypes.veneers"),
    t("caseTypes.implants"),
    t("caseTypes.fullArch"),
    t("caseTypes.removable"),
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 md:py-24 animate-fadeIn">
        <div className="max-w-4xl">
          <div className="inline-block px-4 py-2 bg-accent/10 rounded-full border border-accent/30 mb-6">
            <p className="text-sm font-semibold text-accent">
              {t("index.badge")}
            </p>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            {t("index.heroTitle")}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
            {t("index.heroSubtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/cases">
              <Button size="lg" className="w-full sm:w-auto">
                {t("index.startManaging")}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              {t("index.learnMore")}
            </Button>
          </div>
        </div>
      </section>

      {/* Standards & Compliance */}
      <section className="py-12 bg-secondary/30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 rounded-lg my-12">
        <div className="flex flex-wrap gap-8 items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <CheckCircle className="w-6 h-6 text-accent" />
            <span className="text-sm font-semibold text-foreground">
              {t("index.iso13485")}
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <CheckCircle className="w-6 h-6 text-accent" />
            <span className="text-sm font-semibold text-foreground">
              {t("index.fdaGuidelines")}
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <CheckCircle className="w-6 h-6 text-accent" />
            <span className="text-sm font-semibold text-foreground">
              {t("index.adaStandards")}
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <CheckCircle className="w-6 h-6 text-accent" />
            <span className="text-sm font-semibold text-foreground">
              {t("index.digitalDentistry")}
            </span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <h2 className="dlos-section-title">{t("index.coreFeatures")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-card border rounded-lg p-5 hover:shadow-md transition-shadow duration-300"
            >
              <feature.icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Case Types Section */}
      <section className="py-16">
        <h2 className="dlos-section-title">{t("index.caseTypesSupported")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {caseTypes.map((caseType, idx) => (
            <div key={idx} className="flex items-start gap-3 p-4">
              <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <span className="text-foreground font-medium">{caseType}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 12 Departments Grid */}
      <section className="py-16">
        <h2 className="dlos-section-title">{t("index.departmentWorkflow")}</h2>
        <p className="text-muted-foreground mb-12 max-w-3xl">
          {t("index.departmentWorkflowDesc")}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => {
            const IconComponent = dept.icon;
            return (
              <div
                key={dept.id}
                className="bg-card border rounded-lg p-5 hover:shadow-lg transition-all duration-300 hover:border-primary/50"
              >
                <div
                  className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${dept.color} mb-4`}
                >
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-start gap-2 mb-2">
                  <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded">
                    {t("index.dept")} {dept.id}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {dept.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {dept.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Workflow Highlights */}
      <section className="py-16 bg-secondary/30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 rounded-lg">
        <h2 className="dlos-section-title">{t("index.keyWorkflows")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {t("index.caseIntakeProtocol")}
            </h3>
            <ul className="space-y-3">
              {[
                t("workflows.validatePrescription"),
                t("workflows.identifyMissing"),
                t("workflows.assignCaseId"),
                t("workflows.defineTurnaround"),
                t("workflows.logCase"),
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {t("index.technicalDecisionEngine")}
            </h3>
            <ul className="space-y-3">
              {[
                t("workflows.recommendMaterial"),
                t("workflows.selectPreparation"),
                t("workflows.defineCementation"),
                t("workflows.anticipateRisks"),
                t("workflows.flagConcerns"),
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Quality Control Section */}
      <section className="py-16">
        <h2 className="dlos-section-title">{t("index.qcSystem")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {t("index.preDeliveryVerification")}
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                t("qcChecks.marginalFit"),
                t("qcChecks.occlusionVerification"),
                t("qcChecks.contactPoint"),
                t("qcChecks.shadeAccuracy"),
                t("qcChecks.surfaceFinishing"),
                t("qcChecks.structuralIntegrity"),
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {t("index.errorManagement")}
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                t("qcChecks.rootCause"),
                t("qcChecks.responsibilityAssignment"),
                t("qcChecks.categoryClassification"),
                t("qcChecks.preventionLogging"),
                t("qcChecks.trendAnalysis"),
                t("qcChecks.continuousImprovement"),
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          {t("index.ctaTitle")}
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          {t("index.ctaSubtitle")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/cases">
            <Button size="lg">
              {t("index.createFirstCase")}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Button size="lg" variant="outline">
            {t("index.viewDocumentation")}
          </Button>
        </div>
      </section>
    </Layout>
  );
}
