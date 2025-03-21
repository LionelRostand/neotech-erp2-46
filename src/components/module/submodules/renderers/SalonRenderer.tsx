
import React from 'react';
import { useParams } from 'react-router-dom';
import SalonDashboard from '../salon/dashboard/SalonDashboard';
import SalonClients from '../salon/clients/SalonClients';
import SalonAppointments from '../salon/appointments/SalonAppointments';
import { Card, CardContent } from "@/components/ui/card";

// Styles pour les pages sans contenu spécifique
const placeholderStyle = "flex justify-center items-center p-8 text-lg text-muted-foreground";

// Placeholder components - ces composants seraient implémentés dans des fichiers séparés
const SalonStylists = () => (
  <Card>
    <CardContent className="pt-6">
      <div className={placeholderStyle}>
        <p>Gestion des Coiffeurs</p>
      </div>
    </CardContent>
  </Card>
);

const SalonServices = () => (
  <Card>
    <CardContent className="pt-6">
      <div className={placeholderStyle}>
        <p>Gestion des Services</p>
      </div>
    </CardContent>
  </Card>
);

const SalonProducts = () => (
  <Card>
    <CardContent className="pt-6">
      <div className={placeholderStyle}>
        <p>Gestion des Produits</p>
      </div>
    </CardContent>
  </Card>
);

const SalonBilling = () => (
  <Card>
    <CardContent className="pt-6">
      <div className={placeholderStyle}>
        <p>Gestion de la Facturation</p>
      </div>
    </CardContent>
  </Card>
);

const SalonLoyalty = () => (
  <Card>
    <CardContent className="pt-6">
      <div className={placeholderStyle}>
        <p>Programme de Fidélité</p>
      </div>
    </CardContent>
  </Card>
);

const SalonInventory = () => (
  <Card>
    <CardContent className="pt-6">
      <div className={placeholderStyle}>
        <p>Gestion des Stocks</p>
      </div>
    </CardContent>
  </Card>
);

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
  const { submoduleId } = useParams<{ submoduleId: string }>();
  console.log('SalonRenderer from renderers: called with submoduleId:', submoduleId);
  
  // Extract the submodule name from the full ID (e.g., 'salon-clients' -> 'clients')
  const submoduleName = submoduleId?.split('-')[1] || '';
  console.log('Extracted submodule name:', submoduleName);
  
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
