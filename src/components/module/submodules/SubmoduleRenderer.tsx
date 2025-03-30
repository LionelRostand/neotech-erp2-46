
import React from 'react';
// Import all renderers
import { TransportRenderer } from './renderers/TransportRenderer';
import { renderCrmSubmodule } from './renderers/CrmRenderer';
import { renderProjectsSubmodule } from './renderers/ProjectsRenderer';
import { renderAccountingSubmodule } from './renderers/AccountingRenderer';
import { renderMessagesSubmodule } from './renderers/MessagesRenderer';
import { renderCompaniesSubmodule } from './renderers/CompaniesRenderer';
import { renderEmployeesSubmodule } from './renderers/EmployeesRenderer';
import { renderFreightSubmodule } from './renderers/FreightRenderer';
import { renderGarageSubmodule } from './renderers/GarageRenderer';
import { renderHealthSubmodule } from './renderers/HealthRenderer';
import { renderVehicleRentalsSubmodule } from './renderers/VehicleRentalsRenderer';
import { renderLibrarySubmodule } from './renderers/LibraryRenderer';
import { RestaurantRenderer } from './renderers/RestaurantRenderer';
import { SalonRenderer } from './renderers/SalonRenderer';
import { renderDocumentsSubmodule } from './renderers/DocumentsRenderer';

export const renderSubmoduleContent = ({ submoduleId, submodule }: { submoduleId: string, submodule: any }) => {
  // Transport module
  if (submoduleId.startsWith('transport-')) {
    return <TransportRenderer submoduleId={submoduleId} submodule={submodule} />;
  }
  
  // CRM module
  if (submoduleId.startsWith('crm-')) {
    return renderCrmSubmodule(submoduleId, submodule);
  }
  
  // Projects module
  if (submoduleId.startsWith('projects-')) {
    return renderProjectsSubmodule(submoduleId, submodule);
  }
  
  // Accounting module
  if (submoduleId.startsWith('accounting-')) {
    return renderAccountingSubmodule(submoduleId, submodule);
  }
  
  // Messages module
  if (submoduleId.startsWith('messages-')) {
    return renderMessagesSubmodule(submoduleId, submodule);
  }
  
  // Companies module
  if (submoduleId.startsWith('companies-')) {
    return renderCompaniesSubmodule(submoduleId, submodule);
  }
  
  // Employees module
  if (submoduleId.startsWith('employees-')) {
    return renderEmployeesSubmodule(submoduleId, submodule);
  }
  
  // Freight module
  if (submoduleId.startsWith('freight-')) {
    return renderFreightSubmodule(submoduleId, submodule);
  }
  
  // Garage module
  if (submoduleId.startsWith('garage-')) {
    return renderGarageSubmodule(submoduleId, submodule);
  }

  // Health module
  if (submoduleId.startsWith('health-')) {
    return renderHealthSubmodule(submoduleId, submodule);
  }

  // Vehicle rentals module
  if (submoduleId.startsWith('rentals-')) {
    return renderVehicleRentalsSubmodule(submoduleId, submodule);
  }
  
  // Library module
  if (submoduleId.startsWith('library-')) {
    return renderLibrarySubmodule(submoduleId, submodule);
  }
  
  // Restaurant module
  if (submoduleId.startsWith('restaurant-')) {
    return <RestaurantRenderer submoduleId={submoduleId} submodule={submodule} />;
  }
  
  // Salon module
  if (submoduleId.startsWith('salon-')) {
    return <SalonRenderer submoduleId={submoduleId} submodule={submodule} />;
  }
  
  // Documents module
  if (submoduleId.startsWith('documents-')) {
    return renderDocumentsSubmodule(submoduleId, submodule);
  }
  
  // Default fallback
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold">Contenu non disponible</h3>
      <p>Le contenu pour ce sous-module n'est pas encore implémenté.</p>
    </div>
  );
};
