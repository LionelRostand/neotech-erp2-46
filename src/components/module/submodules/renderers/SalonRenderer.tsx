
import React from 'react';
import { useLocation } from 'react-router-dom';
import SalonDashboard from '../salon/dashboard/SalonDashboard';
import SalonClients from '../salon/clients/SalonClients';
import SalonAppointments from '../salon/appointments/SalonAppointments';
import SalonLoyalty from '../salon/loyalty/SalonLoyalty'; 
import SalonStylists from '../salon/stylists/SalonStylists';
import SalonServices from '../salon/services/SalonServices';
import SalonProducts from '../salon/products/SalonProducts';
import SalonBilling from '../salon/billing/SalonBilling';
import SalonInventory from '../salon/inventory/SalonInventory';
import { Card, CardContent } from "@/components/ui/card";

// Style pour les pages sans contenu spécifique
const placeholderStyle = "flex justify-center items-center p-8 text-lg text-muted-foreground";

// Placeholder components
const SalonReports = () => (
  <Card>
    <CardContent className="pt-6">
      <div className={placeholderStyle}>
        <p>Statistiques et Rapports</p>
      </div>
    </CardContent>
  </Card>
);

const SalonBooking = () => (
  <Card>
    <CardContent className="pt-6">
      <div className={placeholderStyle}>
        <p>Réservation Web & Mobile</p>
      </div>
    </CardContent>
  </Card>
);

const SalonSettings = () => (
  <Card>
    <CardContent className="pt-6">
      <div className={placeholderStyle}>
        <p>Paramètres</p>
      </div>
    </CardContent>
  </Card>
);

export const SalonRenderer = () => {
  // Utiliser useLocation au lieu de useParams pour déterminer le submodule
  const location = useLocation();
  console.log('SalonRenderer: location path is', location.pathname);
  
  // Extraire le nom du sous-module à partir du chemin
  const pathSegments = location.pathname.split('/');
  const submoduleName = pathSegments[pathSegments.length - 1];
  console.log('Extracted submodule name from path:', submoduleName);
  
  switch (submoduleName) {
    case 'dashboard':
      return <SalonDashboard />;
    case 'clients':
      return <SalonClients />;
    case 'appointments':
      return <SalonAppointments />;
    case 'stylists':
      return <SalonStylists />;
    case 'services':
      return <SalonServices />;
    case 'products':
      return <SalonProducts />;
    case 'billing':
      return <SalonBilling />;
    case 'loyalty':
      return <SalonLoyalty />;
    case 'inventory':
      return <SalonInventory />;
    case 'reports':
      return <SalonReports />;
    case 'booking':
      return <SalonBooking />;
    case 'settings':
      return <SalonSettings />;
    default:
      console.warn(`Unknown salon submodule: ${submoduleName}, falling back to dashboard`);
      return <SalonDashboard />;
  }
};
