
import React from 'react';
import { useParams } from 'react-router-dom';
import DefaultSubmoduleContent from './submodules/DefaultSubmoduleContent';
import SubmoduleRenderer from './submodules/SubmoduleRenderer';

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

export default SubmodulePage;
