import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Beaker, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [deptDropdownOpen, setDeptDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { path: "/dashboard", label: t("nav.dashboard") },
    { path: "/cases", label: t("nav.cases") },
    { path: "/departments", label: t("nav.departments"), hasDropdown: true },
    { path: "/quality-control", label: t("nav.qc") },
    { path: "/communication", label: t("nav.communication") },
  ];

  const departmentLinks = [
    { path: "/departments/reception", label: t("deptNames.receptionIntake") },
    { path: "/departments/case-planning", label: t("deptNames.casePlanning") },
    { path: "/departments/model-scan", label: t("deptNames.modelScan") },
    { path: "/departments/cad-design", label: t("deptNames.cadDesign") },
    { path: "/departments/cam-production", label: t("deptNames.camMilling") },
    { path: "/departments/finishing", label: t("deptNames.ceramicFinishing") },
    { path: "/departments/logistics", label: t("deptNames.logisticsDelivery") },
    { path: "/departments/inventory", label: t("deptNames.inventory") },
    { path: "/departments/financial", label: t("deptNames.financial") },
    { path: "/departments/continuous-improvement", label: t("deptNames.continuousImprovement") },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isDeptActive = location.pathname.startsWith("/departments");

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDeptDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setDeptDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
                <Beaker className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">DLOS</h1>
                <p className="text-xs text-muted-foreground">Dental Lab OS</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) =>
                item.hasDropdown ? (
                  <div key={item.path} className="relative" ref={dropdownRef}>
                    <div className="flex items-center">
                      <Link
                        to={item.path}
                        className={`px-3 py-2 rounded-l-md text-sm font-medium transition-colors ${
                          isDeptActive
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground hover:bg-secondary hover:text-primary"
                        }`}
                      >
                        {item.label}
                      </Link>
                      <button
                        onClick={() => setDeptDropdownOpen(!deptDropdownOpen)}
                        className={`px-1 py-2 rounded-r-md text-sm font-medium transition-colors ${
                          isDeptActive
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground hover:bg-secondary hover:text-primary"
                        }`}
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform ${deptDropdownOpen ? "rotate-180" : ""}`} />
                      </button>
                    </div>

                    {/* Dropdown */}
                    {deptDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 w-64 bg-card rounded-lg border border-border shadow-lg py-2 z-50">
                        <Link
                          to="/departments"
                          className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary hover:text-primary transition-colors"
                        >
                          {t("common.allDepartments")}
                        </Link>
                        <div className="my-1 border-t border-border" />
                        {departmentLinks.map((dept) => (
                          <Link
                            key={dept.path}
                            to={dept.path}
                            className={`block px-4 py-2 text-sm transition-colors ${
                              isActive(dept.path)
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-foreground hover:bg-secondary hover:text-primary"
                            }`}
                          >
                            {dept.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-secondary hover:text-primary"
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <LanguageSwitcher />
              <Link to="/dashboard">
                <Button variant="outline" size="sm">{t("nav.dashboard")}</Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-foreground hover:bg-secondary"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pt-4 border-t border-border space-y-1 animate-slideUp">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path) || (item.hasDropdown && isDeptActive)
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-secondary hover:text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              {/* Mobile department sub-links */}
              <div className="pl-4 space-y-1 pt-1">
                <p className="text-xs font-semibold text-muted-foreground px-3 py-1">{t("nav.departments")}</p>
                {departmentLinks.map((dept) => (
                  <Link
                    key={dept.path}
                    to={dept.path}
                    className={`block px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      isActive(dept.path)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-primary"
                    }`}
                  >
                    {dept.label}
                  </Link>
                ))}
              </div>

              <div className="flex gap-2 pt-3">
                <Link to="/dashboard" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">{t("nav.dashboard")}</Button>
                </Link>
                <Link to="/cases" className="flex-1">
                  <Button size="sm" className="w-full">{t("common.newCase")}</Button>
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-foreground mb-4">{t("footer.platform")}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/dashboard" className="hover:text-primary transition-colors">{t("nav.dashboard")}</Link></li>
                <li><Link to="/cases" className="hover:text-primary transition-colors">{t("nav.cases")}</Link></li>
                <li><Link to="/quality-control" className="hover:text-primary transition-colors">{t("common.qualityControl")}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">{t("footer.departments")}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/departments/reception" className="hover:text-primary transition-colors">{t("footer.reception")}</Link></li>
                <li><Link to="/departments/cad-design" className="hover:text-primary transition-colors">{t("footer.cadDesign")}</Link></li>
                <li><Link to="/departments/cam-production" className="hover:text-primary transition-colors">{t("footer.camProduction")}</Link></li>
                <li><Link to="/departments/finishing" className="hover:text-primary transition-colors">{t("footer.finishing")}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">{t("footer.resources")}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/departments/inventory" className="hover:text-primary transition-colors">{t("footer.inventory")}</Link></li>
                <li><Link to="/departments/financial" className="hover:text-primary transition-colors">{t("footer.financial")}</Link></li>
                <li><Link to="/departments/continuous-improvement" className="hover:text-primary transition-colors">{t("footer.improvement")}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">{t("footer.communication")}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/communication" className="hover:text-primary transition-colors">{t("footer.doctorMessages")}</Link></li>
                <li><Link to="/departments/logistics" className="hover:text-primary transition-colors">{t("footer.logistics")}</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {t("common.copyright", { year: new Date().getFullYear() })}
            </p>
            <p className="text-sm text-muted-foreground mt-4 md:mt-0">
              {t("common.compliance")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
