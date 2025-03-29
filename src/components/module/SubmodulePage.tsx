
import React, { useEffect } from 'react';
import { modules } from '@/data/modules';
import SubmoduleHeader from './submodules/SubmoduleHeader';
import { renderSubmoduleContent } from './submodules/SubmoduleRenderer';
import { toast } from "@/hooks/use-toast";

interface SubmodulePageProps {
  moduleId: number;
  submoduleId: string;
}

const SubmodulePage: React.FC<SubmodulePageProps> = ({ moduleId, submoduleId }) => {
  useEffect(() => {
    console.log(`Rendering submodule: ${submoduleId} for module: ${moduleId}`);
  }, [submoduleId, moduleId]);
  
  // Find the module
  const module = modules.find(m => m.id === moduleId);
  if (!module) {
    console.error('Module not found:', moduleId);
    toast({
      title: "Erreur",
      description: `Module #${moduleId} introuvable`,
      variant: "destructive"
    });
    return <div>Module non trouvé</div>;
  }
  
  // Find the submodule
  const submodule = module.submodules.find(sm => sm.id === submoduleId);
  if (!submodule) {
    console.error('Submodule not found:', submoduleId, 'in module', moduleId);
    toast({
      title: "Erreur",
      description: `Sous-module ${submoduleId} introuvable dans le module ${module.name}`,
      variant: "destructive"
    });
    return <div>Sous-module non trouvé</div>;
  }

  return (
    <div className="space-y-6">
      <SubmoduleHeader 
        module={module}
        submodule={submodule}
      />
      {renderSubmoduleContent({ submoduleId, submodule })}
    </div>
  );
};

export default SubmodulePage;
