
import React from 'react';
import { SubModule } from '@/data/types/modules';
import {
  renderEmployeesSubmodule,
  renderFreightSubmodule,
  renderProjectsSubmodule,
  renderAccountingSubmodule,
  renderMessagesSubmodule,
  renderCompaniesSubmodule,
  renderCrmSubmodule,
  renderHealthSubmodule,
  renderDocumentsSubmodule,
  // renderLibrarySubmodule // Remove this import
  renderVehicleRentalsSubmodule
} from './renderers';

interface RenderSubmoduleContentProps {
  submoduleId: string;
  submodule: SubModule;
}

export const renderSubmoduleContent = ({ submoduleId, submodule }: RenderSubmoduleContentProps) => {
  // Use specific renderer based on module prefix
  if (submoduleId.startsWith('employees-')) {
    return renderEmployeesSubmodule(submoduleId, submodule);
  }
  
  if (submoduleId.startsWith('freight-')) {
    return renderFreightSubmodule(submoduleId, submodule);
  }
  
  if (submoduleId.startsWith('projects-')) {
    return renderProjectsSubmodule(submoduleId, submodule);
  }
  
  if (submoduleId.startsWith('accounting-')) {
    return renderAccountingSubmodule(submoduleId, submodule);
  }
  
  if (submoduleId.startsWith('messages-')) {
    return renderMessagesSubmodule(submoduleId, submodule);
  }
  
  if (submoduleId.startsWith('companies-')) {
    return renderCompaniesSubmodule(submoduleId, submodule);
  }
  
  if (submoduleId.startsWith('crm-')) {
    return renderCrmSubmodule(submoduleId, submodule);
  }
  
  if (submoduleId.startsWith('health-')) {
    return renderHealthSubmodule(submoduleId, submodule);
  }
  
  if (submoduleId.startsWith('documents-')) {
    return renderDocumentsSubmodule(submoduleId, submodule);
  }
  
  /* Remove this block
  if (submoduleId.startsWith('library-')) {
    return renderLibrarySubmodule(submoduleId, submodule);
  }
  */
  
  if (submoduleId.startsWith('rentals-')) {
    return renderVehicleRentalsSubmodule(submoduleId, submodule);
  }
  
  // Fallback to default content rendering
  return <div>Module content not implemented: {submoduleId}</div>;
};
