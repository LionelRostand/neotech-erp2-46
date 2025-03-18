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
import DashboardLayout from "./components/DashboardLayout";

// Import ModuleLayout and SubmodulePage
import ModuleLayout from "./components/module/ModuleLayout";
import SubmodulePage from "./components/module/SubmodulePage";

// Dashboard component - removed as we're redirecting now
// const Dashboard = () => (...)

// Settings Pages Components
const UserPermissions = () => (
  <DashboardLayout>
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Droits utilisateurs</h1>
      <p className="mb-4">Attribuez les droits d'accès aux modules pour chaque utilisateur ou employé.</p>
      
      <div className="bg-white rounded-lg border p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Attribution des droits par module</h2>
        <div className="space-y-4">
          {/* Sample module permissions UI */}
          <div className="border rounded-md p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Module Entreprises</h3>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">Tous</Button>
                <Button size="sm" variant="outline">Aucun</Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="companies-view" />
                <label htmlFor="companies-view" className="text-sm">Visualisation</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="companies-create" />
                <label htmlFor="companies-create" className="text-sm">Création</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="companies-edit" />
                <label htmlFor="companies-edit" className="text-sm">Modification</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="companies-delete" />
                <label htmlFor="companies-delete" className="text-sm">Suppression</label>
              </div>
            </div>
          </div>
          
          {/* Repeat for other modules */}
        </div>
      </div>
    </div>
  </DashboardLayout>
);

const Translation = () => (
  <DashboardLayout>
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Traduction de la plateforme</h1>
      <p className="mb-4">Configurez les langues disponibles et gérez les traductions.</p>
      
      <div className="bg-white rounded-lg border p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Langues disponibles</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Switch id="lang-fr" checked={true} />
            <label htmlFor="lang-fr">Français (par défaut)</label>
          </div>
          <div className="flex items-center space-x-3">
            <Switch id="lang-en" />
            <label htmlFor="lang-en">Anglais</label>
          </div>
          <div className="flex items-center space-x-3">
            <Switch id="lang-es" />
            <label htmlFor="lang-es">Espagnol</label>
          </div>
          <div className="flex items-center space-x-3">
            <Switch id="lang-de" />
            <label htmlFor="lang-de">Allemand</label>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
);

const SmtpConfig = () => (
  <DashboardLayout>
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Configuration SMTP</h1>
      <p className="mb-4">Configurez vos paramètres email pour l'envoi de notifications.</p>
      
      <div className="bg-white rounded-lg border p-6 shadow-sm">
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="smtp-server">Serveur SMTP</label>
              <Input id="smtp-server" placeholder="smtp.example.com" />
            </div>
            <div className="space-y-2">
              <label htmlFor="smtp-port">Port</label>
              <Input id="smtp-port" placeholder="587" type="number" />
            </div>
            <div className="space-y-2">
              <label htmlFor="smtp-username">Nom d'utilisateur</label>
              <Input id="smtp-username" placeholder="username@example.com" />
            </div>
            <div className="space-y-2">
              <label htmlFor="smtp-password">Mot de passe</label>
              <Input id="smtp-password" type="password" />
            </div>
          </div>
          <div className="flex items-center space-x-3 mt-4">
            <Switch id="smtp-ssl" />
            <label htmlFor="smtp-ssl">Utiliser SSL/TLS</label>
          </div>
          <div className="pt-4">
            <Button>Enregistrer la configuration</Button>
          </div>
        </form>
      </div>
    </div>
  </DashboardLayout>
);

const TwoFactorAuth = () => (
  <DashboardLayout>
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Authentification à deux facteurs (2FA)</h1>
      <p className="mb-4">Gérez les paramètres de sécurité pour l'authentification à deux facteurs.</p>
      
      <div className="bg-white rounded-lg border p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">État du 2FA</h2>
            <p className="text-gray-500">Activez ou désactivez l'authentification à deux facteurs pour tous les utilisateurs</p>
          </div>
          <Switch id="2fa-status" />
        </div>
      </div>
      
      <div className="bg-white rounded-lg border p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Options disponibles</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Checkbox id="2fa-app" checked={true} />
            <label htmlFor="2fa-app">Application d'authentification (Google Authenticator, Authy)</label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox id="2fa-sms" />
            <label htmlFor="2fa-sms">SMS</label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox id="2fa-email" />
            <label htmlFor="2fa-email">Email</label>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
);

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

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
          
          {/* Redirect /dashboard to / */}
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          
          {/* Settings routes - redirect from /settings to the first settings page */}
          <Route path="/settings" element={<Navigate to="/settings/user-permissions" replace />} />
          <Route path="/settings/user-permissions" element={<UserPermissions />} />
          <Route path="/settings/translation" element={<Translation />} />
          <Route path="/settings/smtp" element={<SmtpConfig />} />
          <Route path="/settings/2fa" element={<TwoFactorAuth />} />
          
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
          
          {/* Route pour le nouveau module Entreprises */}
          <Route path="/modules/companies" element={<ModuleLayout moduleId={18} />}>
            <Route index element={<SubmodulePage moduleId={18} submoduleId="companies-dashboard" />} />
            <Route path="dashboard" element={<SubmodulePage moduleId={18} submoduleId="companies-dashboard" />} />
            <Route path="list" element={<SubmodulePage moduleId={18} submoduleId="companies-list" />} />
            <Route path="create" element={<SubmodulePage moduleId={18} submoduleId="companies-create" />} />
            <Route path="contacts" element={<SubmodulePage moduleId={18} submoduleId="companies-contacts" />} />
            <Route path="documents" element={<SubmodulePage moduleId={18} submoduleId="companies-documents" />} />
            <Route path="reports" element={<SubmodulePage moduleId={18} submoduleId="companies-reports" />} />
            <Route path="settings" element={<SubmodulePage moduleId={18} submoduleId="companies-settings" />} />
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
