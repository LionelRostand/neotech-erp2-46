
import React from 'react';
import { modules } from '@/data/modules';
import SubmoduleHeader from './submodules/SubmoduleHeader';
import { renderSubmoduleContent } from './submodules/SubmoduleRenderer';

interface SubmodulePageProps {
  moduleId: number;
  submoduleId: string;
  refreshKey?: number; // Make refreshKey an optional prop
}

const SubmodulePage: React.FC<SubmodulePageProps> = ({ moduleId, submoduleId, refreshKey }) => {
  // Find the module
  const module = modules.find(m => m.id === moduleId);
  if (!module) return <div>Module not found</div>;
  
  // Find the submodule
  const submodule = module.submodules.find(sm => sm.id === submoduleId);
  if (!submodule) return <div>Submodule not found</div>;

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
};

export default SubmodulePage;
