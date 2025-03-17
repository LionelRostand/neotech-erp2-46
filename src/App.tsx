
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

// Placeholder pour les modules
const ModulePlaceholder = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-neotech-primary mb-4">Module en construction</h1>
      <p className="text-gray-600">
        Cette page est en cours de développement. <br />
        Revenez bientôt pour découvrir toutes les fonctionnalités.
      </p>
    </div>
  </div>
);

// Import du composant Dashboard
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
          
          {/* Routes pour les modules existants */}
          <Route path="/modules/employees/*" element={<ModulePlaceholder />} />
          <Route path="/modules/freight/*" element={<ModulePlaceholder />} />
          <Route path="/modules/projects/*" element={<ModulePlaceholder />} />
          <Route path="/modules/academy/*" element={<ModulePlaceholder />} />
          
          {/* Routes pour les nouveaux modules */}
          <Route path="/modules/restaurant/*" element={<ModulePlaceholder />} />
          <Route path="/modules/garage/*" element={<ModulePlaceholder />} />
          <Route path="/modules/transport/*" element={<ModulePlaceholder />} />
          <Route path="/modules/health/*" element={<ModulePlaceholder />} />
          <Route path="/modules/accounting/*" element={<ModulePlaceholder />} />
          <Route path="/modules/ecommerce/*" element={<ModulePlaceholder />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
