
import React from 'react';
import { modules } from '@/data/modules';
import { SubModule } from '@/data/types/modules';
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
      return Renderers.renderEmployeesSubmodule(submoduleId, submodule);
    case 'accounting':
      return Renderers.renderAccountingSubmodule(submoduleId, submodule);
    case 'freight':
      return Renderers.renderFreightSubmodule(submoduleId, submodule);
    case 'projects':
      return Renderers.renderProjectsSubmodule(submoduleId, submodule);
    case 'health':
      return Renderers.renderHealthSubmodule(submoduleId, submodule);
    case 'crm':
      return Renderers.renderCrmSubmodule(submoduleId, submodule);
    case 'documents':
      return Renderers.renderDocumentsSubmodule(submoduleId, submodule);
    default:
      console.warn(`No renderer found for submodule: ${submoduleId}`);
      return <DefaultSubmoduleContent submodule={submodule} />;
  }
};
