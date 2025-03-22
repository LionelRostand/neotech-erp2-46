
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";
import { 
  LayoutDashboard, 
  Users, 
  Car, 
  CalendarCheck, 
  Wrench, 
  Receipt, 
  Truck,
  Package,
  BadgePercent,
  Settings,
  ToggleRight,
  CheckCircle2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { garageModule } from "@/data/modules/garage";

const GarageDashboard: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [activeModules, setActiveModules] = React.useState<Record<string, boolean>>({
    'garage-dashboard': true,
    'garage-clients': true,
    'garage-vehicles': true,
    'garage-appointments': false,
    'garage-repairs': false,
    'garage-invoices': false,
    'garage-suppliers': false,
    'garage-inventory': false,
    'garage-loyalty': false,
    'garage-settings': true,
  });

  const handleToggleModule = (moduleId: string) => {
    setActiveModules(prev => {
      const newState = { ...prev, [moduleId]: !prev[moduleId] };
      
      toast({
        title: newState[moduleId] ? "Module activé" : "Module désactivé",
        description: `Le module ${garageModule.submodules?.find(m => m.id === moduleId)?.name} a été ${newState[moduleId] ? "activé" : "désactivé"}`,
      });
      
      return newState;
    });
  };

  const navigateToModule = (path: string) => {
    navigate(path);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Tableau de bord - Garage Auto</h2>
        <Button onClick={() => toast({ title: "Configuration sauvegardée", description: "Vos paramètres d'activation des modules ont été sauvegardés." })}>
          Sauvegarder la configuration
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {garageModule.submodules?.map((submodule) => (
          <Card key={submodule.id} className={!activeModules[submodule.id] ? "opacity-75" : ""}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    {submodule.icon}
                  </div>
                  <CardTitle>{submodule.name}</CardTitle>
                </div>
                <Badge variant={activeModules[submodule.id] ? "default" : "outline"}>
                  {activeModules[submodule.id] ? "Activé" : "Désactivé"}
                </Badge>
              </div>
              <CardDescription className="mt-2">
                {getModuleDescription(submodule.id)}
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-2 flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => navigateToModule(submodule.href)}
                disabled={!activeModules[submodule.id]}
              >
                Accéder
              </Button>
              <Button 
                variant={activeModules[submodule.id] ? "default" : "outline"}
                size="icon"
                onClick={() => handleToggleModule(submodule.id)}
              >
                {activeModules[submodule.id] 
                  ? <CheckCircle2 className="h-4 w-4" /> 
                  : <ToggleRight className="h-4 w-4" />}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Helper function to get descriptions for each module
const getModuleDescription = (moduleId: string): string => {
  switch (moduleId) {
    case 'garage-dashboard':
      return "Vue d'ensemble de l'activité du garage";
    case 'garage-clients':
      return "Gestion de la base client et des informations associées";
    case 'garage-vehicles':
      return "Suivi des véhicules en maintenance et de l'historique";
    case 'garage-appointments':
      return "Gestion des rendez-vous et du planning";
    case 'garage-repairs':
      return "Suivi des réparations en cours et historique";
    case 'garage-invoices':
      return "Facturation et suivi des paiements";
    case 'garage-suppliers':
      return "Relations avec les fournisseurs de pièces";
    case 'garage-inventory':
      return "Gestion des stocks de pièces détachées";
    case 'garage-loyalty':
      return "Programme de fidélité pour les clients";
    case 'garage-settings':
      return "Configuration générale du module garage";
    default:
      return "Module de gestion garage";
  }
};

export default GarageDashboard;
