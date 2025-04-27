
import React from 'react';
import DefaultSubmoduleContent from './DefaultSubmoduleContent';
import { SubmoduleProps } from '@/types/module-types';

// Import garage submodules
import GarageDashboard from './garage/GarageDashboard';
import GarageMaintenanceDashboard from './garage/maintenance/GarageMaintenanceDashboard';
import GarageRepairsDashboard from './garage/repairs/GarageRepairsDashboard';

// SubmoduleRenderer function that takes a submodule ID and returns the appropriate component
export const renderSubmoduleContent = ({ submoduleId, submodule }: SubmoduleProps) => {
  // Handle garage module components
  if (submoduleId === 'garage-dashboard') {
    return <GarageDashboard />;
  }

  if (submoduleId === 'garage-maintenance') {
    return <GarageMaintenanceDashboard />;
  }
  
  if (submoduleId === 'garage-repairs') {
    return <GarageRepairsDashboard />;
  }

  // The DefaultSubmoduleContent as a fallback
  return <DefaultSubmoduleContent submodule={submodule} />;
};
