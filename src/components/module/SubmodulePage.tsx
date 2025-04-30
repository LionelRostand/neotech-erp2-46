
import React from 'react';
import { useParams } from 'react-router-dom';
import DefaultSubmoduleContent from './submodules/DefaultSubmoduleContent';
import { renderSubmoduleContent } from './submodules/SubmoduleRenderer';
import { modules } from '@/data/modules';

// Import des composants garage
import GarageAppointments from './submodules/garage/appointments/GarageAppointments';

interface SubmodulePageProps {
  moduleId: number;
  submoduleId?: string;
}

const SubmodulePage = ({ moduleId, submoduleId }: SubmodulePageProps) => {
  const params = useParams();
  const currentSubmoduleId = submoduleId || params.submoduleId;

  // Mapper les ID de sous-modules aux composants spécifiques
  const renderSubmodule = () => {
    // Module garage (moduleId 6)
    if (moduleId === 6) {
      switch (currentSubmoduleId) {
        case 'garage-appointments':
          return <GarageAppointments />;
        default:
          return <SubmoduleRenderer moduleId={moduleId} submoduleId={currentSubmoduleId} />;
      }
    }

    // Modules généraux (fallback)
    return <SubmoduleRenderer moduleId={moduleId} submoduleId={currentSubmoduleId} />;
  };

  return renderSubmodule();
};

// Create a SubmoduleRenderer component that uses the imported renderSubmoduleContent function
const SubmoduleRenderer = ({ moduleId, submoduleId }: { moduleId: number; submoduleId: string }) => {
  // Find the matching module from the modules list
  const module = modules.find((m) => m.id === moduleId);
  
  if (!module || !submoduleId) {
    return <DefaultSubmoduleContent submodule={{ 
      id: submoduleId || 'unknown', 
      name: 'Unknown',
      href: '',
      icon: <span />
    }} />;
  }
  
  // Find the matching submodule from the module
  const submodule = module.submodules?.find((sm) => sm.id === submoduleId) || {
    id: submoduleId,
    name: submoduleId.split('-').pop() || 'Unknown',
    href: `/modules/${module.href.split('/').pop()}/${submoduleId.split('-').pop()}`,
    icon: <span />
  };
  
  return renderSubmoduleContent({ submoduleId, submodule });
};

export default SubmodulePage;
