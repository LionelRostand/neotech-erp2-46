
import React from 'react';
import { SubModule } from '@/data/types/modules';
import { renderEmployeesSubmodule } from './renderers/EmployeesRenderer';
import { renderAccountingSubmodule } from './renderers/AccountingRenderer';
import { renderFreightSubmodule } from './renderers/FreightRenderer';
import { renderProjectsSubmodule } from './renderers/ProjectsRenderer';
import { renderHealthSubmodule } from './renderers/HealthRenderer';
import { renderVehicleRentalsSubmodule } from './renderers/VehicleRentalsRenderer';
import DefaultSubmoduleContent from '../DefaultSubmoduleContent';

interface SubmoduleRenderProps {
  submoduleId: string;
  submodule: SubModule;
}

export const renderSubmoduleContent = ({ submoduleId, submodule }: SubmoduleRenderProps) => {
  console.log('SubmoduleRenderer - Rendering submodule:', submoduleId);
  
  const modulePrefix = submoduleId.split('-')[0];
  
  switch (modulePrefix) {
    case 'employees':
      return renderEmployeesSubmodule(submoduleId, submodule);
    case 'accounting':
      return renderAccountingSubmodule(submoduleId, submodule);
    case 'freight':
      return renderFreightSubmodule(submoduleId, submodule);
    case 'projects':
      return renderProjectsSubmodule(submoduleId, submodule);
    case 'health':
      return renderHealthSubmodule(submoduleId, submodule);
    case 'rentals':
      return renderVehicleRentalsSubmodule(submoduleId, submodule);
    default:
      console.warn(`No renderer found for submodule: ${submoduleId}`);
      return <DefaultSubmoduleContent submodule={submodule} />;
  }
};
