
import React from 'react';
import { modules } from '@/data/modules';
import { SubModule } from '@/data/types/modules';
import { renderEmployeesSubmodule } from './EmployeesRenderer';
import { renderAccountingSubmodule } from './AccountingRenderer';
import { renderFreightSubmodule } from './FreightRenderer';
import { renderProjectsSubmodule } from './ProjectsRenderer';
import { renderHealthSubmodule } from './HealthRenderer';
import { renderDocumentsSubmodule } from './DocumentsRenderer';
import DefaultSubmoduleContent from '../DefaultSubmoduleContent';

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
    case 'companies':
      // We don't need to handle companies here, they'll be part of employees
      return <DefaultSubmoduleContent submodule={submodule} />;
    default:
      console.warn(`No renderer found for submodule: ${submoduleId}`);
      return <DefaultSubmoduleContent submodule={submodule} />;
  }
};
