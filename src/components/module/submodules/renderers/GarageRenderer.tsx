
import React from 'react';
import { SubModule } from "@/data/types/modules";
import DefaultSubmoduleContent from '../DefaultSubmoduleContent';
import GarageDashboard from '../garage/GarageDashboard';
import GarageClients from '../garage/GarageClients';
import GarageVehicles from '../garage/GarageVehicles';
import GarageAppointments from '../garage/GarageAppointments';
import GarageRepairs from '../garage/GarageRepairs';
import GarageInvoices from '../garage/GarageInvoices';
import GarageSuppliers from '../garage/GarageSuppliers';
import GarageInventory from '../garage/GarageInventory';
import GarageLoyalty from '../garage/GarageLoyalty';
import GarageSettings from '../garage/GarageSettings';

export const renderGarageSubmodule = (submoduleId: string, submodule: SubModule) => {
  console.log('Rendering garage submodule:', submoduleId);
  
  switch (submoduleId) {
    case 'garage-dashboard':
      return <GarageDashboard />;
    case 'garage-clients':
      return <GarageClients />;
    case 'garage-vehicles':
      return <GarageVehicles />;
    case 'garage-appointments':
      return <GarageAppointments />;
    case 'garage-repairs':
      return <GarageRepairs />;
    case 'garage-invoices':
      return <GarageInvoices />;
    case 'garage-suppliers':
      return <GarageSuppliers />;
    case 'garage-inventory':
      return <GarageInventory />;
    case 'garage-loyalty':
      return <GarageLoyalty />;
    case 'garage-settings':
      return <GarageSettings />;
    default:
      return <DefaultSubmoduleContent title={submodule.name} submodule={submodule} />;
  }
};
