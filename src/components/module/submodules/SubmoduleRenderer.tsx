
import React from 'react';
import { SubModule } from '@/data/types/modules';
import DefaultSubmoduleContent from './DefaultSubmoduleContent';
import {
  renderEmployeesSubmodule,
  renderFreightSubmodule,
  renderProjectsSubmodule,
  renderAccountingSubmodule,
  renderMessagesSubmodule,
  renderCompaniesSubmodule,
  renderCrmSubmodule,
  renderHealthSubmodule
} from './renderers';

interface SubmoduleRendererProps {
  submoduleId: string;
  submodule: SubModule;
}

export const renderSubmoduleContent = ({ submoduleId, submodule }: SubmoduleRendererProps) => {
  // Determine which module this submodule belongs to based on ID prefix
  const modulePrefix = submoduleId.split('-')[0];
  
  // Route to the appropriate module renderer
  switch (modulePrefix) {
    case 'employees':
      return renderEmployeesSubmodule(submoduleId, submodule);
    
    case 'freight':
      return renderFreightSubmodule(submoduleId, submodule);
    
    case 'projects':
      return renderProjectsSubmodule(submoduleId, submodule);
    
    case 'accounting':
      return renderAccountingSubmodule(submoduleId, submodule);
    
    case 'messages':
      return renderMessagesSubmodule(submoduleId, submodule);
    
    case 'companies':
      return renderCompaniesSubmodule(submoduleId, submodule);
    
    case 'crm':
      return renderCrmSubmodule(submoduleId, submodule);
    
    case 'health':
      return renderHealthSubmodule(submoduleId, submodule);
    
    // Default fallback for any other module
    default:
      return <DefaultSubmoduleContent submodule={submodule} />;
  }
};
