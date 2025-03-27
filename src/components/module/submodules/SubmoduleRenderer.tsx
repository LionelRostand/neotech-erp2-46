
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
  refreshKey?: number;
}

export const renderSubmoduleContent = ({ submoduleId, submodule, refreshKey }: RenderSubmoduleContentProps) => {
  console.log('renderSubmoduleContent called with:', submoduleId, refreshKey ? `(refresh: ${refreshKey})` : '');
  
  try {
    // Use specific renderer based on module prefix
    if (submoduleId.startsWith('employees-')) {
      return renderEmployeesSubmodule(submoduleId, submodule, refreshKey);
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
    return (
      <div className="p-6 bg-amber-50 border border-amber-200 rounded-md">
        <h3 className="text-lg font-medium text-amber-800">Module en développement</h3>
        <p className="mt-2 text-amber-700">
          Le contenu pour <strong>{submoduleId}</strong> n'est pas encore implémenté.
        </p>
      </div>
    );
  } catch (error) {
    console.error(`Error rendering submodule ${submoduleId}:`, error);
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-md">
        <h3 className="text-lg font-medium text-red-800">Erreur de rendu</h3>
        <p className="mt-2 text-red-700">
          Une erreur s'est produite lors du chargement de ce sous-module. Veuillez réessayer ultérieurement.
        </p>
      </div>
    );
  }
};
