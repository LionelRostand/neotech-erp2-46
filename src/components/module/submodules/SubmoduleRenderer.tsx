
import React from 'react';
import { SubModule } from '@/data/types/modules';
import { renderEmployeesSubmodule } from './renderers/EmployeesRenderer';
import { renderAccountingSubmodule } from './renderers/AccountingRenderer';
import { FreightRenderer } from './renderers/FreightRenderer';
import { renderProjectsSubmodule } from './renderers/ProjectsRenderer';
import { renderHealthSubmodule } from './renderers/HealthRenderer';
import { renderVehicleRentalsSubmodule } from './renderers/VehicleRentalsRenderer';
import { renderMessagesSubmodule } from './renderers/MessagesRenderer';
import DefaultSubmoduleContent from './DefaultSubmoduleContent';
import FreightCarriersList from "./freight/carriers/FreightCarriersList";
import ContainersListWithCreate from "./freight/containers/ContainersListWithCreate";

interface SubmoduleRenderProps {
  submoduleId: string;
  submodule: SubModule;
}

export const renderSubmoduleContent = ({ submoduleId, submodule }: SubmoduleRenderProps) => {
  console.log('SubmoduleRenderer - Rendering submodule:', submoduleId);
  
  const modulePrefix = submoduleId.split('-')[0];
  
  if (submoduleId === "freight-carriers") {
    return <FreightCarriersList />;
  }
  
  if (submoduleId === "freight-containers") {
    return <ContainersListWithCreate />;
  }

  switch (modulePrefix) {
    case 'employees':
      return renderEmployeesSubmodule(submoduleId, submodule);
    case 'accounting':
      return renderAccountingSubmodule(submoduleId, submodule);
    case 'freight':
      return <FreightRenderer submoduleId={submoduleId} />;
    case 'projects':
      return renderProjectsSubmodule(submoduleId, submodule);
    case 'health':
      return renderHealthSubmodule(submoduleId, submodule);
    case 'rentals':
      return renderVehicleRentalsSubmodule(submoduleId, submodule);
    case 'messages':
      return renderMessagesSubmodule(submoduleId, submodule);
    default:
      console.warn(`No renderer found for submodule: ${submoduleId}`);
      return <DefaultSubmoduleContent submodule={submodule} />;
  }
};
