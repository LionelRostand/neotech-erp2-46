
import React from 'react';
import { useParams } from 'react-router-dom';
import SalonDashboard from '../salon/SalonDashboard';

// Placeholder components - these would be implemented in separate files
const SalonClients = () => <div>Gestion des Clients</div>;
const SalonAppointments = () => <div>Gestion des Rendez-vous</div>;
const SalonStylists = () => <div>Gestion des Coiffeurs</div>;
const SalonServices = () => <div>Gestion des Services</div>;
const SalonProducts = () => <div>Gestion des Produits</div>;
const SalonBilling = () => <div>Gestion de la Facturation</div>;
const SalonLoyalty = () => <div>Programme de Fidélité</div>;
const SalonInventory = () => <div>Gestion des Stocks</div>;
const SalonReports = () => <div>Statistiques et Rapports</div>;
const SalonBooking = () => <div>Réservation Web & Mobile</div>;
const SalonSettings = () => <div>Paramètres</div>;

export const SalonRenderer = () => {
  const { submoduleId } = useParams<{ submoduleId: string }>();

  // Le problème est que useParams() ne renvoie pas le préfixe 'salon-'
  // donc on doit adapter notre switch pour correspondre à l'ID attendu
  const fullSubmoduleId = submoduleId ? `salon-${submoduleId}` : 'salon-dashboard';
  
  console.log('SalonRenderer: rendering submodule', { submoduleId, fullSubmoduleId });

  switch (fullSubmoduleId) {
    case 'salon-dashboard':
      return <SalonDashboard />;
    case 'salon-clients':
      return <SalonClients />;
    case 'salon-appointments':
      return <SalonAppointments />;
    case 'salon-stylists':
      return <SalonStylists />;
    case 'salon-services':
      return <SalonServices />;
    case 'salon-products':
      return <SalonProducts />;
    case 'salon-billing':
      return <SalonBilling />;
    case 'salon-loyalty':
      return <SalonLoyalty />;
    case 'salon-inventory':
      return <SalonInventory />;
    case 'salon-reports':
      return <SalonReports />;
    case 'salon-booking':
      return <SalonBooking />;
    case 'salon-settings':
      return <SalonSettings />;
    default:
      return <SalonDashboard />;
  }
};
