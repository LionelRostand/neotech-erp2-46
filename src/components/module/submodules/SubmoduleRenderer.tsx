
import React from 'react';
import { modules } from '@/data/modules';
import { SubModule } from '@/data/types/modules';
import { renderEmployeesSubmodule } from './renderers/EmployeesRenderer';
import { renderAccountingSubmodule } from './renderers/AccountingRenderer';
import { renderFreightSubmodule } from './renderers/FreightRenderer';
import { renderProjectsSubmodule } from './renderers/ProjectsRenderer';
import { renderHealthSubmodule } from './renderers/HealthRenderer';
import { renderCrmSubmodule } from './renderers/CrmRenderer';
import { renderDocumentsSubmodule } from './renderers/DocumentsRenderer';
import { renderGarageSubmodule } from './renderers/GarageRenderer';
import DefaultSubmoduleContent from './DefaultSubmoduleContent';

interface SubmoduleRenderProps {
  submoduleId: string;
  submodule: SubModule;
}

export const renderSubmoduleContent = ({ submoduleId, submodule }: SubmoduleRenderProps) => {
  console.log('SubmoduleRenderer - Rendering submodule:', submoduleId);
  
  // Determine the parent module of the submodule
  const modulePrefix = submoduleId.split('-')[0];
  
  // Select the appropriate renderer based on the module
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
    case 'documents':
      return renderDocumentsSubmodule(submoduleId, submodule);
    case 'crm':
      return renderCrmSubmodule(submoduleId, submodule);
    case 'garage':
      return renderGarageSubmodule(submoduleId, submodule);
    default:
      console.warn(`No renderer found for submodule: ${submoduleId}`);
      return <DefaultSubmoduleContent submodule={submodule} />;
  }
};
