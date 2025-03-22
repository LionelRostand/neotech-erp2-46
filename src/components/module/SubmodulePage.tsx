
import React from 'react';
import { modules } from '@/data/modules';
import SubmoduleHeader from './submodules/SubmoduleHeader';
import { renderSubmoduleContent } from './submodules/SubmoduleRenderer';

interface SubmodulePageProps {
  moduleId: number;
  submoduleId: string;
}

const SubmodulePage: React.FC<SubmodulePageProps> = ({ moduleId, submoduleId }) => {
  // Find the module
  const module = modules.find(m => m.id === moduleId);
  if (!module) return <div>Module not found</div>;
  
  // Find the submodule
  const submodule = module.submodules.find(sm => sm.id === submoduleId);
  if (!submodule) return <div>Submodule not found</div>;

  console.log('Rendering submodule:', submoduleId);

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
