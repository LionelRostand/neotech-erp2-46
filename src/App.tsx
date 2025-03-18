
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Welcome from "./pages/Welcome";
import Applications from "./pages/Applications";

// Import ModuleLayout and SubmodulePage
import ModuleLayout from "./components/module/ModuleLayout";
import SubmodulePage from "./components/module/SubmodulePage";

// Dashboard component
const Dashboard = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-neotech-primary mb-4">Tableau de bord</h1>
      <p className="text-gray-600">
        Bienvenue sur votre tableau de bord. <br />
        Les statistiques et informations importantes seront affichées ici.
      </p>
    </div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Index />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Routes with ModuleLayout for all modules */}
          <Route path="/modules/employees" element={<ModuleLayout moduleId={1} />}>
            <Route index element={<SubmodulePage moduleId={1} submoduleId="employees-dashboard" />} />
            <Route path="dashboard" element={<SubmodulePage moduleId={1} submoduleId="employees-dashboard" />} />
            <Route path="profiles" element={<SubmodulePage moduleId={1} submoduleId="employees-profiles" />} />
            <Route path="badges" element={<SubmodulePage moduleId={1} submoduleId="employees-badges" />} />
            <Route path="departments" element={<SubmodulePage moduleId={1} submoduleId="employees-departments" />} />
            <Route path="hierarchy" element={<SubmodulePage moduleId={1} submoduleId="employees-hierarchy" />} />
            <Route path="attendance" element={<SubmodulePage moduleId={1} submoduleId="employees-attendance" />} />
            <Route path="timesheet" element={<SubmodulePage moduleId={1} submoduleId="employees-timesheet" />} />
            <Route path="leaves" element={<SubmodulePage moduleId={1} submoduleId="employees-leaves" />} />
            <Route path="absences" element={<SubmodulePage moduleId={1} submoduleId="employees-absences" />} />
            <Route path="contracts" element={<SubmodulePage moduleId={1} submoduleId="employees-contracts" />} />
            <Route path="documents" element={<SubmodulePage moduleId={1} submoduleId="employees-documents" />} />
            <Route path="evaluations" element={<SubmodulePage moduleId={1} submoduleId="employees-evaluations" />} />
            <Route path="trainings" element={<SubmodulePage moduleId={1} submoduleId="employees-trainings" />} />
            <Route path="salaries" element={<SubmodulePage moduleId={1} submoduleId="employees-salaries" />} />
            <Route path="recruitment" element={<SubmodulePage moduleId={1} submoduleId="employees-recruitment" />} />
            <Route path="reports" element={<SubmodulePage moduleId={1} submoduleId="employees-reports" />} />
            <Route path="alerts" element={<SubmodulePage moduleId={1} submoduleId="employees-alerts" />} />
            <Route path="settings" element={<SubmodulePage moduleId={1} submoduleId="employees-settings" />} />
          </Route>
          
          <Route path="/modules/freight" element={<ModuleLayout moduleId={2} />}>
            <Route index element={<SubmodulePage moduleId={2} submoduleId="freight-dashboard" />} />
            <Route path="dashboard" element={<SubmodulePage moduleId={2} submoduleId="freight-dashboard" />} />
            <Route path="shipments" element={<SubmodulePage moduleId={2} submoduleId="freight-shipments" />} />
            <Route path="packages" element={<SubmodulePage moduleId={2} submoduleId="freight-packages" />} />
            <Route path="tracking" element={<SubmodulePage moduleId={2} submoduleId="freight-tracking" />} />
            <Route path="carriers" element={<SubmodulePage moduleId={2} submoduleId="freight-carriers" />} />
            <Route path="pricing" element={<SubmodulePage moduleId={2} submoduleId="freight-pricing" />} />
            <Route path="quotes" element={<SubmodulePage moduleId={2} submoduleId="freight-quotes" />} />
            <Route path="containers" element={<SubmodulePage moduleId={2} submoduleId="freight-containers" />} />
            <Route path="orders" element={<SubmodulePage moduleId={2} submoduleId="freight-orders" />} />
            <Route path="documents" element={<SubmodulePage moduleId={2} submoduleId="freight-documents" />} />
            <Route path="routes" element={<SubmodulePage moduleId={2} submoduleId="freight-routes" />} />
            <Route path="warehouses" element={<SubmodulePage moduleId={2} submoduleId="freight-warehouses" />} />
            <Route path="inventory" element={<SubmodulePage moduleId={2} submoduleId="freight-inventory" />} />
            <Route path="invoicing" element={<SubmodulePage moduleId={2} submoduleId="freight-invoicing" />} />
            <Route path="reports" element={<SubmodulePage moduleId={2} submoduleId="freight-reports" />} />
            <Route path="client-portal" element={<SubmodulePage moduleId={2} submoduleId="freight-client-portal" />} />
            <Route path="settings" element={<SubmodulePage moduleId={2} submoduleId="freight-settings" />} />
          </Route>
          
          {/* Generic routes for other modules */}
          <Route path="/modules/projects/*" element={<ModuleLayout moduleId={3} />} />
          <Route path="/modules/academy/*" element={<ModuleLayout moduleId={4} />} />
          <Route path="/modules/restaurant/*" element={<ModuleLayout moduleId={5} />} />
          <Route path="/modules/garage/*" element={<ModuleLayout moduleId={6} />} />
          <Route path="/modules/transport/*" element={<ModuleLayout moduleId={7} />} />
          <Route path="/modules/health/*" element={<ModuleLayout moduleId={8} />} />
          <Route path="/modules/accounting/*" element={<ModuleLayout moduleId={9} />} />
          <Route path="/modules/ecommerce/*" element={<ModuleLayout moduleId={10} />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
