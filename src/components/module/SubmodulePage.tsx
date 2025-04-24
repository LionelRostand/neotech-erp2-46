
import React, { useEffect, useState, Suspense } from 'react';
import { renderSubmoduleContent } from './submodules/SubmoduleRenderer';
import { modules } from '@/data/modules';
import { SubModule } from '@/data/types/modules';

interface SubmodulePageProps {
  moduleId: number;
  submoduleId: string;
}

const SubmodulePage: React.FC<SubmodulePageProps> = ({ moduleId, submoduleId }) => {
  const [submodule, setSubmodule] = useState<SubModule | null>(null);
  
  useEffect(() => {
    console.log(`SubmodulePage - Looking for submodule: ${submoduleId} in module: ${moduleId}`);
    
    // Find the module with the given ID
    const module = modules.find(m => m.id === moduleId);
    
    if (module) {
      // Find the submodule with the given ID within the module
      const foundSubmodule = module.submodules.find(sm => sm.id === submoduleId);
      
      if (foundSubmodule) {
        console.log(`SubmodulePage - Found submodule: ${foundSubmodule.name}`);
        setSubmodule(foundSubmodule);
      } else {
        console.error(`SubmodulePage - Submodule not found: ${submoduleId}`);
      }
    } else {
      console.error(`SubmodulePage - Module not found: ${moduleId}`);
    }
  }, [moduleId, submoduleId]);

  if (!submodule) {
    return <div>Loading submodule...</div>;
  }

  return (
    <div className="submodule-content">
      <Suspense fallback={<div className="flex items-center justify-center h-96">Chargement du module...</div>}>
        {renderSubmoduleContent({ submoduleId, submodule })}
      </Suspense>
    </div>
  );
};

export default SubmodulePage;
