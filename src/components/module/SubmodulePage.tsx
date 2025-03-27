
import React, { memo, useEffect } from 'react';
import { modules } from '@/data/modules';
import SubmoduleHeader from './submodules/SubmoduleHeader';
import { renderSubmoduleContent } from './submodules/SubmoduleRenderer';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

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
  if (!submodule) return null;

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
