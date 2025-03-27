
import React, { memo, useEffect } from 'react';
import { modules } from '@/data/modules';
import SubmoduleHeader from './submodules/SubmoduleHeader';
import { renderSubmoduleContent } from './submodules/SubmoduleRenderer';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

interface SubmodulePageProps {
  moduleId: number;
  submoduleId: string;
  refreshKey?: number;
}

// Utilisation de memo pour éviter les rendus inutiles
const SubmodulePage: React.FC<SubmodulePageProps> = memo(({ moduleId, submoduleId, refreshKey }) => {
  const navigate = useNavigate();
  
  // Find the module
  const module = modules.find(m => m.id === moduleId);
  
  useEffect(() => {
    if (!module) {
      console.error(`Module with ID ${moduleId} not found`);
      toast.error("Module non trouvé");
      navigate('/dashboard');
      return;
    }
    
    // Find the submodule
    const submodule = module.submodules.find(sm => sm.id === submoduleId);
    if (!submodule) {
      console.error(`Submodule ${submoduleId} not found in module ${moduleId}`);
      
      // Redirect to module dashboard or first submodule
      const dashboardSubmodule = module.submodules.find(sm => sm.id.endsWith('-dashboard'));
      if (dashboardSubmodule) {
        toast.error("Sous-module non trouvé. Redirection vers le tableau de bord du module.");
        navigate(`/modules/${module.href.split('/')[2]}/dashboard`);
      } else if (module.submodules.length > 0) {
        toast.error("Sous-module non trouvé. Redirection vers le premier sous-module.");
        navigate(module.submodules[0].href);
      } else {
        toast.error("Module sans sous-modules. Redirection vers le tableau de bord.");
        navigate('/dashboard');
      }
    }
  }, [moduleId, submoduleId, module, navigate]);
  
  if (!module) return null;
  
  // Find the submodule
  const submodule = module.submodules.find(sm => sm.id === submoduleId);
  if (!submodule) return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/modules/employees/dashboard')}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Retour au module Employés
        </Button>
      </div>
      <div className="p-6 bg-amber-50 border border-amber-200 rounded-md">
        <h3 className="text-lg font-medium text-amber-800">Sous-module non trouvé</h3>
        <p className="mt-2 text-amber-700">
          Le sous-module demandé n'existe pas ou n'est pas accessible.
        </p>
        <div className="mt-4">
          <Link to="/modules/employees/dashboard" className="text-amber-700 hover:text-amber-900 font-medium underline">
            Retour au tableau de bord des employés
          </Link>
        </div>
      </div>
    </div>
  );

  console.log('Rendering submodule:', submoduleId, refreshKey ? `(refresh: ${refreshKey})` : '');

  return (
    <div className="space-y-6">
      <SubmoduleHeader 
        module={module}
        submodule={submodule}
      />
      {renderSubmoduleContent({ submoduleId, submodule, refreshKey })}
    </div>
  );
});

SubmodulePage.displayName = 'SubmodulePage';

export default SubmodulePage;
