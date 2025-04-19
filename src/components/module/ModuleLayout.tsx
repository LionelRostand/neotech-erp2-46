
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../DashboardLayout';
import { modules } from '@/data/modules';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Fonction pour obtenir la couleur en fonction de la catégorie du module
const getModuleColor = (category: string) => {
  switch (category) {
    case 'business':
      return 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 hover:bg-blue-200 data-[state=active]:bg-blue-200';
    case 'services':
      return 'bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 hover:bg-emerald-200 data-[state=active]:bg-emerald-200';
    case 'digital':
      return 'bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 hover:bg-purple-200 data-[state=active]:bg-purple-200';
    case 'communication':
      return 'bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 hover:bg-orange-200 data-[state=active]:bg-orange-200';
    default:
      return 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 hover:bg-gray-200 data-[state=active]:bg-gray-200';
  }
};

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
    
    if (foundModule && location.pathname === `/modules/${foundModule.href.split('/')[2]}`) {
      console.log('At module root, redirecting to dashboard or first submodule');
      
      const dashboardSubmodule = foundModule.submodules?.find(sm => sm.id.endsWith('-dashboard'));
      if (dashboardSubmodule) {
        navigate(`/modules/${foundModule.href.split('/')[2]}/dashboard`);
      } else if (foundModule.submodules && foundModule.submodules.length > 0) {
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
      {module.submodules && module.submodules.length > 0 && (
        <Tabs defaultValue={location.pathname.split('/').pop()} className="mb-6">
          <TabsList className="bg-transparent space-x-2">
            {module.submodules.map((submodule) => (
              <TabsTrigger
                key={submodule.id}
                value={submodule.id.split('-')[1]}
                onClick={() => navigate(`/modules/${module.href.split('/')[2]}/${submodule.id.split('-')[1]}`)}
                className={`${getModuleColor(module.category)} px-4 py-2 rounded-lg transition-colors`}
              >
                <span className="flex items-center gap-2">
                  {submodule.icon}
                  {submodule.name}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}
      <Outlet />
    </DashboardLayout>
  );
};

export default ModuleLayout;
