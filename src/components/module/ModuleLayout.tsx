
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../DashboardLayout';
import { modules } from '@/data/modules';
import { Card } from '@/components/ui/card';
import { toast } from "@/hooks/use-toast";

interface ModuleLayoutProps {
  moduleId: number;
}

const ModuleLayout: React.FC<ModuleLayoutProps> = ({ moduleId }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [module, setModule] = useState(modules.find(m => m.id === moduleId));
  
  useEffect(() => {
    console.log('ModuleLayout: Current path', location.pathname);
    const foundModule = modules.find(m => m.id === moduleId);
    setModule(foundModule);
    
    // Si nous sommes à la racine d'un module, rediriger vers son dashboard s'il existe,
    // sinon vers son premier sous-module
    if (location.pathname === `/modules/${foundModule?.href.split('/')[2]}`) {
      const dashboardSubmodule = foundModule?.submodules.find(sm => sm.id.endsWith('-dashboard'));
      if (dashboardSubmodule) {
        console.log('Redirecting to dashboard:', dashboardSubmodule.href);
        navigate(dashboardSubmodule.href);
      } else if (foundModule?.submodules.length > 0) {
        const firstSubmodule = foundModule.submodules[0];
        console.log('Redirecting to first submodule:', firstSubmodule.href);
        navigate(firstSubmodule.href);
      }
    }
  }, [moduleId, location.pathname, navigate]);

  if (!module) {
    console.error('Module not found in ModuleLayout:', moduleId);
    toast({
      title: "Erreur",
      description: "Module non trouvé",
      variant: "destructive"
    });
    return (
      <DashboardLayout>
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Module non trouvé</h2>
          <p>Le module demandé n'existe pas ou n'est pas accessible.</p>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default ModuleLayout;
