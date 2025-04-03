
import React from 'react';
import { modules } from '@/data/modules';
import { SubModule } from '@/data/types/modules';
import { renderChatSubmodule } from './renderers/ChatRenderer';
import { renderEmployeesSubmodule } from './renderers/EmployeesRenderer';
import { renderAccountingSubmodule } from './renderers/AccountingRenderer';
import { renderFreightSubmodule } from './renderers/FreightRenderer';
import { renderBomSubmodule } from './renderers/BomRenderer';
import { renderProjectsSubmodule } from './renderers/ProjectsRenderer';
import { renderSalesSubmodule } from './renderers/SalesRenderer';
import { renderHealthSubmodule } from './renderers/HealthRenderer';
import { renderMessagingSubmodule } from './renderers/MessagingRenderer';
import { renderProductionSubmodule } from './renderers/ProductionRenderer';
import { renderWarehouseSubmodule } from './renderers/WarehouseRenderer';
import { renderTreasurySubmodule } from './renderers/TreasuryRenderer';
import DefaultSubmoduleContent from './DefaultSubmoduleContent';

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
    case 'chat':
      return renderChatSubmodule(submoduleId, submodule);
    case 'employees':
      return renderEmployeesSubmodule(submoduleId, submodule);
    case 'accounting':
      return renderAccountingSubmodule(submoduleId, submodule);
    case 'freight':
      return renderFreightSubmodule(submoduleId, submodule);
    case 'bom':
      return renderBomSubmodule(submoduleId, submodule);
    case 'projects':
      return renderProjectsSubmodule(submoduleId, submodule);
    case 'sales':
      return renderSalesSubmodule(submoduleId, submodule);
    case 'health':
      return renderHealthSubmodule(submoduleId, submodule);
    case 'messaging':
      return renderMessagingSubmodule(submoduleId, submodule);
    case 'production':
      return renderProductionSubmodule(submoduleId, submodule);
    case 'warehouse':
      return renderWarehouseSubmodule(submoduleId, submodule);
    case 'treasury':
      return renderTreasurySubmodule(submoduleId, submodule);
    default:
      console.warn(`No renderer found for submodule: ${submoduleId}`);
      return <DefaultSubmoduleContent submodule={submodule} />;
  }
};
