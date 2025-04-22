
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
    const foundModule = modules.find(m => m.id === moduleId);
    setModule(foundModule);
    
    // Check if current path corresponds to a submodule that exists
    const currentPath = location.pathname;
    const pathParts = currentPath.split('/');
    
    // If we're at the root of a module, redirect to dashboard or first submodule
    if (location.pathname === `/modules/${foundModule?.href.split('/')[2]}`) {
      console.log('At module root, redirecting to dashboard or first submodule');
      
      const dashboardSubmodule = foundModule?.submodules.find(sm => sm.id.endsWith('-dashboard'));
      if (dashboardSubmodule) {
        navigate(`/modules/${foundModule?.href.split('/')[2]}/dashboard`);
      } else if (foundModule?.submodules.length > 0) {
        const firstSubmodule = foundModule.submodules[0];
        const submoduleId = firstSubmodule.id.split('-')[1];
        navigate(`/modules/${foundModule?.href.split('/')[2]}/${submoduleId}`);
      }
    } 
    // Handle case when user tries to access a submodule that doesn't exist anymore
    else if (pathParts.length >= 4 && foundModule) {
      const submodulePath = pathParts[3]; // e.g., "accounting"
      const submoduleExists = foundModule.submodules.some(sm => {
        const smPath = sm.href.split('/').pop();
        return smPath === submodulePath;
      });
      
      if (!submoduleExists) {
        console.log(`Submodule ${submodulePath} not found, redirecting to dashboard`);
        navigate(`/modules/${foundModule.href.split('/')[2]}/dashboard`);
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
