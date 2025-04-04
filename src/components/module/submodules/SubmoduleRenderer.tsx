
import React from 'react';
import { modules } from '@/data/modules';
import { SubModule } from '@/data/types/modules';
import { renderEmployeesSubmodule } from './renderers/EmployeesRenderer';
import { renderAccountingSubmodule } from './renderers/AccountingRenderer';
import { renderFreightSubmodule } from './renderers/FreightRenderer';
import { renderProjectsSubmodule } from './renderers/ProjectsRenderer';
import { renderHealthSubmodule } from './renderers/HealthRenderer';
import { renderHrSubmodule } from './renderers/HrRenderer';
import DefaultSubmoduleContent from './DefaultSubmoduleContent';

// Import all renderer functions from the renderers/index.ts
import * as Renderers from './renderers';

interface SubmoduleRenderProps {
  submoduleId: string;
  submodule: SubModule;
}

export const renderSubmoduleContent = ({ submoduleId, submodule }: SubmoduleRenderProps) => {
  console.log('SubmoduleRenderer - Rendering submodule:', submoduleId);
  
  // Déterminer le module parent du sous-module
  const modulePrefix = submoduleId.split('-')[0];
  
  // Sélectionner le bon renderer en fonction du module
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
    case 'hr':
      return renderHrSubmodule(submoduleId, submodule);
    default:
      console.warn(`No renderer found for submodule: ${submoduleId}`);
      return <DefaultSubmoduleContent submodule={submodule} />;
  }
};
