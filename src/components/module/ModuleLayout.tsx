
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../DashboardLayout';
import { modules } from '@/data/modules';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface ModuleLayoutProps {
  moduleId: number;
}

const ModuleLayout: React.FC<ModuleLayoutProps> = ({ moduleId }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [module, setModule] = useState(modules.find(m => m.id === moduleId));
  
  useEffect(() => {
    const foundModule = modules.find(m => m.id === moduleId);
    setModule(foundModule);
    
    // Si le module n'existe pas, rediriger vers le dashboard avec un message d'erreur
    if (!foundModule) {
      console.error(`Module with ID ${moduleId} not found`);
      toast.error("Module non trouvé. Redirection vers le tableau de bord.");
      navigate('/dashboard');
      return;
    }
    
    // Si nous sommes à la racine d'un module, rediriger vers son dashboard s'il existe,
    // sinon vers son premier sous-module
    if (location.pathname === `/modules/${foundModule.href.split('/')[2]}`) {
      const dashboardSubmodule = foundModule.submodules.find(sm => sm.id.endsWith('-dashboard'));
      if (dashboardSubmodule) {
        navigate(`/modules/${foundModule.href.split('/')[2]}/dashboard`);
      } else if (foundModule.submodules.length > 0) {
        const firstSubmodule = foundModule.submodules[0];
        const submoduleId = firstSubmodule.id.split('-')[1];
        navigate(`/modules/${foundModule.href.split('/')[2]}/${submoduleId}`);
      }
    }
  }, [moduleId, location.pathname, navigate]);

  if (!module) {
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
