import React from 'react';
import { SubModule } from "@/data/types/modules";
import DefaultSubmoduleContent from '../DefaultSubmoduleContent';
import GarageDashboard from '../garage/GarageDashboard';
import GarageClientsDashboard from '../garage/clients/GarageClientsDashboard';
import GarageVehiclesDashboard from '../garage/vehicles/GarageVehiclesDashboard';
import GarageAppointmentsDashboard from '../garage/appointments/GarageAppointmentsDashboard';
import GarageRepairsDashboard from '../garage/repairs/GarageRepairsDashboard';
import GarageServicesDashboard from '../garage/services/GarageServicesDashboard';
import GarageInvoicesDashboard from '../garage/invoices/GarageInvoicesDashboard';
import GarageSuppliersDashboard from '../garage/suppliers/GarageSuppliersDashboard';
import GarageInventoryDashboard from '../garage/inventory/GarageInventoryDashboard';
import GarageLoyaltyDashboard from '../garage/loyalty/GarageLoyaltyDashboard';
import GarageSettings from '../garage/settings/GarageSettings';
import GarageMechanicsDashboard from '../garage/mechanics/GarageMechanicsDashboard';
import GarageMaintenanceDashboard from '../garage/maintenance/GarageMaintenanceDashboard';

export const renderGarageSubmodule = (submoduleId: string, submodule: SubModule) => {
  console.log('Rendering garage submodule:', submoduleId);
  
  switch (submoduleId) {
    case 'garage-dashboard':
      return <GarageDashboard />;
    case 'garage-clients':
      return <GarageClientsDashboard />;
    case 'garage-vehicles':
      return <GarageVehiclesDashboard />;
    case 'garage-appointments':
      return <GarageAppointmentsDashboard />;
    case 'garage-services':
      return <GarageServicesDashboard />;
    case 'garage-mechanics':
      return <GarageMechanicsDashboard />;
    case 'garage-maintenance':
      return <GarageMaintenanceDashboard />;
    case 'garage-repairs':
      return <GarageRepairsDashboard />;
    case 'garage-invoices':
      return <GarageInvoicesDashboard />;
    case 'garage-suppliers':
      return <GarageSuppliersDashboard />;
    case 'garage-inventory':
      return <GarageInventoryDashboard />;
    case 'garage-loyalty':
      return <GarageLoyaltyDashboard />;
    case 'garage-settings':
      return <GarageSettings />;
    default:
      return <DefaultSubmoduleContent submodule={submodule} />;
  }
};
