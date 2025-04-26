import React from 'react';
import DefaultSubmoduleContent from './DefaultSubmoduleContent';
import { SubmoduleProps } from '@/types/module-types';
import GarageDashboard from './garage/GarageDashboard';
import GarageMaintenanceDashboard from './garage/maintenance/GarageMaintenanceDashboard';
import GarageRepairsDashboard from './garage/repairs/GarageRepairsDashboard';

export const renderSubmoduleContent = ({ submoduleId, submodule }: SubmoduleProps) => {
  if (submoduleId === 'garage-dashboard') {
    return <GarageDashboard />;
  }
  
  if (submoduleId === 'garage-maintenance') {
    return <GarageMaintenanceDashboard />;
  }
  
  if (submoduleId === 'garage-repairs') {
    return <GarageRepairsDashboard />;
  }

  return <DefaultSubmoduleContent submodule={submodule} />;
};
