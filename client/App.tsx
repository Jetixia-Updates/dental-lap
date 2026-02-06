import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Cases from "./pages/Cases";
import CaseDetail from "./pages/CaseDetail";
import Departments from "./pages/Departments";
import QualityControl from "./pages/QualityControl";
import Communication from "./pages/Communication";
import NotFound from "./pages/NotFound";

// Department sub-pages
import Reception from "./pages/departments/Reception";
import CasePlanning from "./pages/departments/CasePlanning";
import ModelScan from "./pages/departments/ModelScan";
import CADDesign from "./pages/departments/CADDesign";
import CAMProduction from "./pages/departments/CAMProduction";
import Finishing from "./pages/departments/Finishing";
import Logistics from "./pages/departments/Logistics";
import Inventory from "./pages/departments/Inventory";
import Financial from "./pages/departments/Financial";
import ContinuousImprovement from "./pages/departments/ContinuousImprovement";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/cases" element={<Cases />} />
      <Route path="/cases/:caseId" element={<CaseDetail />} />
      <Route path="/departments" element={<Departments />} />
      <Route path="/quality-control" element={<QualityControl />} />
      <Route path="/communication" element={<Communication />} />

      {/* Department sub-pages */}
      <Route path="/departments/reception" element={<Reception />} />
      <Route path="/departments/case-planning" element={<CasePlanning />} />
      <Route path="/departments/model-scan" element={<ModelScan />} />
      <Route path="/departments/cad-design" element={<CADDesign />} />
      <Route path="/departments/cam-production" element={<CAMProduction />} />
      <Route path="/departments/finishing" element={<Finishing />} />
      <Route path="/departments/logistics" element={<Logistics />} />
      <Route path="/departments/inventory" element={<Inventory />} />
      <Route path="/departments/financial" element={<Financial />} />
      <Route path="/departments/continuous-improvement" element={<ContinuousImprovement />} />

      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
