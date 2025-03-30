
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
  renderGarageSubmodule,
  SalonRenderer,
  RestaurantRenderer
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
    console.log('Delegating to renderCompaniesSubmodule for:', submoduleId);
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
  
  if (submoduleId.startsWith('garage-')) {
    console.log('Delegating to renderGarageSubmodule for:', submoduleId);
    return renderGarageSubmodule(submoduleId, submodule);
  }
  
  if (submoduleId.startsWith('salon-')) {
    console.log('Delegating to SalonRenderer for:', submoduleId);
    return <SalonRenderer submoduleId={submoduleId} submodule={submodule} />;
  }
  
  if (submoduleId.startsWith('restaurant-')) {
    console.log('Delegating to RestaurantRenderer for:', submoduleId);
    return <RestaurantRenderer submoduleId={submoduleId} submodule={submodule} />;
  }
  
  // Fallback to default content rendering
  console.warn('No renderer found for:', submoduleId);
  return <div>Module content not implemented: {submoduleId}</div>;
};
