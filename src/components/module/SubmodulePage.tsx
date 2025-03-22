
import React from 'react';
import { modules } from '@/data/modules';
import SubmoduleHeader from './submodules/SubmoduleHeader';
import { renderSubmodule } from './submodules/SubmoduleRenderer';

interface SubmodulePageProps {
  moduleId: number;
  submoduleId: string;
}

const SubmodulePage: React.FC<SubmodulePageProps> = ({ moduleId, submoduleId }) => {
  console.log('SubmodulePage - Rendering with moduleId:', moduleId, 'submoduleId:', submoduleId);
  
  // Find the module
  const module = modules.find(m => m.id === moduleId);
  if (!module) {
    console.error('Module not found for ID:', moduleId);
    return <div>Module not found</div>;
  }
  
  // Find the submodule
  const submodule = module.submodules.find(sm => sm.id === submoduleId);
  if (!submodule) {
    console.error('Submodule not found for ID:', submoduleId, 'in module:', module.name);
    return <div>Submodule not found</div>;
  }

  console.log('Rendering submodule:', submoduleId, 'in module:', module.name);

  return (
    <div className="space-y-6">
      <SubmoduleHeader 
        module={module}
        submodule={submodule}
      />
      {renderSubmodule(moduleId, submoduleId, submodule)}
    </div>
  );
};

export default SubmodulePage;
