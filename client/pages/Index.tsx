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

const departments = [
  {
    id: 1,
    name: "Reception & Case Intake",
    description: "Validate prescriptions and register cases",
    icon: ClipboardList,
    color: "from-blue-500 to-blue-600",
  },
  {
    id: 2,
    name: "Case Planning",
    description: "Prescription analysis and case strategy",
    icon: FileText,
    color: "from-cyan-500 to-cyan-600",
  },
  {
    id: 3,
    name: "Model & Scan",
    description: "Physical and digital scanning",
    icon: Microscope,
    color: "from-teal-500 to-teal-600",
  },
  {
    id: 4,
    name: "CAD Design",
    description: "Advanced digital design workflows",
    icon: Beaker,
    color: "from-emerald-500 to-emerald-600",
  },
  {
    id: 5,
    name: "CAM / Milling",
    description: "Milling and 3D printing production",
    icon: Printer,
    color: "from-green-500 to-green-600",
  },
  {
    id: 6,
    name: "Ceramic & Finishing",
    description: "Material finishing and customization",
    icon: Gauge,
    color: "from-lime-500 to-lime-600",
  },
  {
    id: 7,
    name: "Quality Control",
    description: "Fit verification and inspection",
    icon: Shield,
    color: "from-amber-500 to-amber-600",
  },
  {
    id: 8,
    name: "Logistics & Delivery",
    description: "Documentation and case shipping",
    icon: Boxes,
    color: "from-orange-500 to-orange-600",
  },
  {
    id: 9,
    name: "Doctor Communication",
    description: "Feedback and relationship management",
    icon: PhoneCall,
    color: "from-red-500 to-red-600",
  },
  {
    id: 10,
    name: "Inventory Management",
    description: "Material and supply tracking",
    icon: Boxes,
    color: "from-pink-500 to-pink-600",
  },
  {
    id: 11,
    name: "Financial Tracking",
    description: "Case costing and analytics",
    icon: DollarSign,
    color: "from-purple-500 to-purple-600",
  },
  {
    id: 12,
    name: "Continuous Improvement",
    description: "Error analysis and optimization",
    icon: TrendingUp,
    color: "from-indigo-500 to-indigo-600",
  },
];

const features = [
  {
    icon: Shield,
    title: "ISO 13485 Compliant",
    description: "Full compliance with international medical device standards",
  },
  {
    icon: Zap,
    title: "Real-Time Tracking",
    description: "Complete case traceability from intake to delivery",
  },
  {
    icon: Users,
    title: "Doctor Communication",
    description: "Professional feedback and clinical collaboration tools",
  },
  {
    icon: Gauge,
    title: "Quality Control",
    description: "Comprehensive verification before case delivery",
  },
  {
    icon: TrendingUp,
    title: "Performance Analytics",
    description: "Data-driven insights for lab optimization",
  },
  {
    icon: FileText,
    title: "Digital Documentation",
    description: "Complete audit trail and compliance records",
  },
];

const caseTypes = [
  "Crowns (Zirconia, E.max, PFM)",
  "Bridges & Partial Restorations",
  "Veneers & Inlays/Onlays",
  "Implant Restorations",
  "Full Arch Prosthetics",
  "Removable Prosthetics",
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 md:py-24 animate-fadeIn">
        <div className="max-w-4xl">
          <div className="inline-block px-4 py-2 bg-accent/10 rounded-full border border-accent/30 mb-6">
            <p className="text-sm font-semibold text-accent">
              Professional Dental Laboratory Management
            </p>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Master Your Dental Laboratory Workflow
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
            DLOS is a complete management system designed for professional dental laboratories. 
            Streamline operations, ensure quality, and maintain ISO 13485 compliance across all departments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/cases">
              <Button size="lg" className="w-full sm:w-auto">
                Start Managing Cases
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Learn More
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
              ISO 13485
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <CheckCircle className="w-6 h-6 text-accent" />
            <span className="text-sm font-semibold text-foreground">
              FDA Guidelines
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <CheckCircle className="w-6 h-6 text-accent" />
            <span className="text-sm font-semibold text-foreground">
              ADA Standards
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <CheckCircle className="w-6 h-6 text-accent" />
            <span className="text-sm font-semibold text-foreground">
              Digital Dentistry
            </span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <h2 className="dlos-section-title">Core Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="dlos-card hover:shadow-md transition-shadow duration-300"
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
        <h2 className="dlos-section-title">Case Types Supported</h2>
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
        <h2 className="dlos-section-title">12 Department Workflow</h2>
        <p className="text-muted-foreground mb-12 max-w-3xl">
          DLOS structures your entire laboratory into 12 integrated departments, 
          each with specific responsibilities, workflows, and quality standards. 
          This ensures complete traceability and compliance across all operations.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => {
            const IconComponent = dept.icon;
            return (
              <div
                key={dept.id}
                className="dlos-card hover:shadow-lg transition-all duration-300 hover:border-primary/50"
              >
                <div
                  className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${dept.color} mb-4`}
                >
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-start gap-2 mb-2">
                  <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded">
                    Dept {dept.id}
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
        <h2 className="dlos-section-title">Key Workflows</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Case Intake Protocol
            </h3>
            <ul className="space-y-3">
              {[
                "Validate doctor prescription completeness",
                "Identify and request missing clinical data",
                "Assign internal case ID and priority",
                "Define turnaround time requirements",
                "Log case with full digital traceability",
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
              Technical Decision Engine
            </h3>
            <ul className="space-y-3">
              {[
                "Recommend ideal material based on indication",
                "Select correct preparation design requirements",
                "Define cementation and margin protocols",
                "Anticipate clinical risks early",
                "Flag technical concerns for doctor feedback",
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
        <h2 className="dlos-section-title">Quality Control System</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="dlos-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Pre-Delivery Verification
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                "Marginal fit assessment",
                "Occlusion verification",
                "Contact point evaluation",
                "Shade accuracy check",
                "Surface finishing inspection",
                "Structural integrity test",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="dlos-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Error Management
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                "Root cause identification",
                "Responsibility assignment",
                "Category classification",
                "Prevention logging",
                "Trend analysis",
                "Continuous improvement",
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
          Ready to Transform Your Lab?
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Start managing your dental laboratory with professional workflows, 
          complete compliance tracking, and integrated quality control.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/cases">
            <Button size="lg">
              Create Your First Case
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Button size="lg" variant="outline">
            View Documentation
          </Button>
        </div>
      </section>
    </Layout>
  );
}
