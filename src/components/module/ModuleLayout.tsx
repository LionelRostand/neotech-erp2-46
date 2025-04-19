
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../DashboardLayout';
import { modules } from '@/data/modules';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Function to get the color based on module category
const getModuleColor = (category: string) => {
  switch (category) {
    case 'business':
      return {
        background: 'bg-gradient-to-r from-blue-100 to-blue-50',
        text: 'text-blue-700',
        hover: 'hover:bg-blue-200',
        active: 'data-[state=active]:bg-blue-200'
      };
    case 'services':
      return {
        background: 'bg-gradient-to-r from-emerald-100 to-emerald-50',
        text: 'text-emerald-700',
        hover: 'hover:bg-emerald-200',
        active: 'data-[state=active]:bg-emerald-200'
      };
    case 'digital':
      return {
        background: 'bg-gradient-to-r from-purple-100 to-purple-50',
        text: 'text-purple-700',
        hover: 'hover:bg-purple-200',
        active: 'data-[state=active]:bg-purple-200'
      };
    case 'communication':
      return {
        background: 'bg-gradient-to-r from-orange-100 to-orange-50',
        text: 'text-orange-700',
        hover: 'hover:bg-orange-200',
        active: 'data-[state=active]:bg-orange-200'
      };
    default:
      return {
        background: 'bg-gradient-to-r from-gray-100 to-gray-50',
        text: 'text-gray-700',
        hover: 'hover:bg-gray-200',
        active: 'data-[state=active]:bg-gray-200'
      };
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

  const currentColors = getModuleColor(module.category);
  const defaultValue = location.pathname.split('/').pop();

  return (
    <DashboardLayout>
      {module.submodules && module.submodules.length > 0 && (
        <Tabs defaultValue={defaultValue} className="mb-6">
          <TabsList 
            className={cn(
              "bg-transparent space-x-2 p-1 rounded-lg border",
              "flex flex-wrap gap-2 justify-start items-center"
            )}
          >
            {module.submodules.map((submodule) => {
              const submoduleId = submodule.id.split('-')[1];
              return (
                <TabsTrigger
                  key={submodule.id}
                  value={submoduleId}
                  onClick={() => navigate(`/modules/${module.href.split('/')[2]}/${submoduleId}`)}
                  className={cn(
                    currentColors.background,
                    currentColors.text,
                    currentColors.hover,
                    currentColors.active,
                    "px-4 py-2 rounded-lg transition-all duration-200",
                    "flex items-center gap-2 font-medium"
                  )}
                >
                  {submodule.icon}
                  {submodule.name}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      )}
      <Outlet />
    </DashboardLayout>
  );
};

export default ModuleLayout;
