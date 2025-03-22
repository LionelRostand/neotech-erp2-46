
import React from 'react';
import { SubModule } from "@/data/types/modules";
import DefaultSubmoduleContent from '../DefaultSubmoduleContent';
import GarageDashboard from '../garage/GarageDashboard';

// Render Garage module
export const renderGarageSubmodule = (submoduleId: string, submodule: SubModule) => {
  switch (submoduleId) {
    case 'garage-dashboard':
      return <GarageDashboard />;
    // Add other garage submodules here as they are implemented
    default:
      return <DefaultSubmoduleContent submodule={submodule} />;
  }
};
