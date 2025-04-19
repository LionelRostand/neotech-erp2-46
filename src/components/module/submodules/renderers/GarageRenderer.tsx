
import React from 'react';
import { SubModule } from "@/data/types/modules";
import DefaultSubmoduleContent from '../DefaultSubmoduleContent';
import GarageDashboard from '../garage/GarageDashboard';

export const renderGarageSubmodule = (submoduleId: string, submodule: SubModule) => {
  console.log('Rendering garage submodule:', submoduleId);
  
  switch (submoduleId) {
    case 'garage-dashboard':
      return <GarageDashboard />;
    default:
      return <DefaultSubmoduleContent submodule={submodule} />;
  }
};
