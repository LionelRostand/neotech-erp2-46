
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
  renderVehicleRentalsSubmodule,
  renderTransportSubmodule,
  SalonRenderer
} from './renderers';

interface RenderSubmoduleContentProps {
  submoduleId: string;
  submodule: SubModule;
}

export const renderSubmoduleContent = ({ submoduleId, submodule }: RenderSubmoduleContentProps) => {
  console.log('renderSubmoduleContent called with:', submoduleId);
  
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
  
  if (submoduleId.startsWith('rentals-')) {
    return renderVehicleRentalsSubmodule(submoduleId, submodule);
  }
  
  if (submoduleId.startsWith('transport-')) {
    console.log('Delegating to renderTransportSubmodule for:', submoduleId);
    return renderTransportSubmodule(submoduleId, submodule);
  }
  
  if (submoduleId.startsWith('salon-')) {
    console.log('Delegating to SalonRenderer for:', submoduleId);
    const submoduleName = submoduleId.split('-')[1]; // Extract 'clients', 'dashboard', etc.
    return <SalonRenderer />;
  }
  
  // Fallback to default content rendering
  console.warn('No renderer found for:', submoduleId);
  return <div>Module content not implemented: {submoduleId}</div>;
};
