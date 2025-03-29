
import React, { useEffect } from 'react';
import { modules } from '@/data/modules';
import SubmoduleHeader from './submodules/SubmoduleHeader';
import { renderSubmoduleContent } from './submodules/SubmoduleRenderer';

interface SubmodulePageProps {
  moduleId: number;
  submoduleId: string;
}

const SubmodulePage: React.FC<SubmodulePageProps> = ({ moduleId, submoduleId }) => {
  useEffect(() => {
    console.log('Rendering submodule:', submoduleId);
  }, [submoduleId]);
  
  // Find the module
  const module = modules.find(m => m.id === moduleId);
  if (!module) {
    console.error('Module not found:', moduleId);
    return <div>Module not found</div>;
  }
  
  // Find the submodule
  const submodule = module.submodules.find(sm => sm.id === submoduleId);
  if (!submodule) {
    console.error('Submodule not found:', submoduleId, 'in module', moduleId);
    return <div>Submodule not found</div>;
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
