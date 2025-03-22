
import React from 'react';
import { SubModule } from "@/data/types/modules";
import DefaultSubmoduleContent from './DefaultSubmoduleContent';
import { 
  renderEmployeesSubmodule,
  renderFreightSubmodule,
  renderProjectsSubmodule,
  renderAccountingSubmodule,
  renderCrmSubmodule,
  renderCompaniesSubmodule,
  renderDocumentsSubmodule,
  renderMessagesSubmodule,
  renderHealthSubmodule,
  renderTransportSubmodule,
  renderVehicleRentalsSubmodule,
  renderGarageSubmodule,
  renderSalonSubmodule
} from './renderers';

export const renderSubmodule = (moduleId: number, submoduleId: string, submodule: SubModule) => {
  console.log(`Rendering submodule: ${submoduleId} for module: ${moduleId}`);
  
  switch (moduleId) {
    case 1:
      return renderEmployeesSubmodule(submoduleId, submodule);
    case 2:
      return renderFreightSubmodule(submoduleId, submodule);
    case 3:
      return renderProjectsSubmodule(submoduleId, submodule);
    case 4:
      return renderCompaniesSubmodule(submoduleId, submodule);
    case 5:
      return renderCrmSubmodule(submoduleId, submodule);
    case 6:
      return renderGarageSubmodule(submoduleId, submodule);
    case 7:
      return renderTransportSubmodule(submoduleId, submodule);
    case 8:
      return renderHealthSubmodule(submoduleId, submodule);
    case 9:
      return renderVehicleRentalsSubmodule(submoduleId, submodule);
    case 11:
      return renderAccountingSubmodule(submoduleId, submodule);
    case 17:
      return renderMessagesSubmodule(submoduleId, submodule);
    case 18:
      return renderDocumentsSubmodule(submoduleId, submodule);
    case 19:
      return renderSalonSubmodule(submoduleId, submodule);
    default:
      return <DefaultSubmoduleContent submodule={submodule} />;
  }
};
