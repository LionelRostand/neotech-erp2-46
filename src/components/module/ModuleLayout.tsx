
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../DashboardLayout';
import { modules } from '@/data/modules';
import { Card } from '@/components/ui/card';

interface ModuleLayoutProps {
  moduleId: number;
}

const ModuleLayout: React.FC<ModuleLayoutProps> = ({ moduleId }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [module, setModule] = useState(modules.find(m => m.id === moduleId));
  
  useEffect(() => {
    // Find the module and set it in state
    const foundModule = modules.find(m => m.id === moduleId);
    setModule(foundModule);
    
    if (foundModule) {
      console.log(`Found module: ${foundModule.name}, checking paths...`);
      
      // Only redirect if we're at the module's root path
      if (location.pathname === `/modules/${foundModule?.href.split('/')[2]}`) {
        console.log('At module root, redirecting to dashboard or first submodule');
        
        // Find dashboard submodule or use first available submodule
        const submodules = foundModule.submodules || [];
        const dashboardSubmodule = submodules.find(sm => sm.id.endsWith('-dashboard'));
        
        if (dashboardSubmodule) {
          navigate(dashboardSubmodule.href);
        } else if (submodules.length > 0) {
          navigate(submodules[0].href);
        }
      }
    } else {
      console.error(`Module with ID ${moduleId} not found in modules array`);
    }
  }, [moduleId, location.pathname, navigate]);

  if (!module) {
    console.error(`Module with ID ${moduleId} not found`);
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
