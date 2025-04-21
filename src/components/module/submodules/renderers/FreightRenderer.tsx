
import React from 'react';
import FreightShipmentsPage from '../freight/FreightShipmentsPage';
import FreightClientPortal from '../freight/FreightClientPortal';
import FreightPackages from '../freight/FreightPackages';
import FreightRoutesPage from '../freight/FreightRoutesPage';
import FreightClientsPage from '../freight/clients/FreightClientsPage';
import FreightSecuritySettings from '../freight/FreightSecuritySettings';

type FreightSubmoduleProps = {
  submoduleId: string;
};

export const FreightRenderer: React.FC<FreightSubmoduleProps> = ({ submoduleId }) => {
  switch (submoduleId) {
    case 'freight-dashboard':
      return <FreightDashboard />;
    case 'freight-shipments':
      return <FreightShipmentsPage />;
    case 'freight-routes':
      return <FreightRoutesPage />;
    case 'freight-tracking':
      return <FreightTracking />;
    case 'freight-containers':
      return <FreightContainers />;
    case 'freight-carriers':
      return <FreightCarriers />;
    case 'freight-pricing':
      return <FreightPricing />;
    case 'freight-settings':
      return <FreightSecuritySettings />;
    case 'freight-documents':
      return <FreightDocuments />;
    case 'freight-client-portal':
      return <FreightClientPortal />;
    case 'freight-packages':
      return <FreightPackages />;
    default:
      return <DefaultFreightContent />;
  }
};

// Placeholder components
const FreightDashboard = () => (
  <div className="container mx-auto py-8">
    <h1 className="text-2xl font-bold mb-6">Tableau de bord Logistique</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Content will be implemented later */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="font-semibold text-lg mb-2">Expéditions récentes</h2>
        <p className="text-gray-500">Aucune donnée disponible</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="font-semibold text-lg mb-2">Clients actifs</h2>
        <p className="text-gray-500">Aucune donnée disponible</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="font-semibold text-lg mb-2">Transporteurs</h2>
        <p className="text-gray-500">Aucune donnée disponible</p>
      </div>
    </div>
  </div>
);

const FreightTracking = () => (
  <div className="container mx-auto py-8">
    <h1 className="text-2xl font-bold mb-6">Suivi des Expéditions</h1>
    <p className="text-gray-500">À implémenter</p>
  </div>
);

const FreightContainers = () => (
  <div className="container mx-auto py-8">
    <h1 className="text-2xl font-bold mb-6">Gestion des Conteneurs</h1>
    <p className="text-gray-500">À implémenter</p>
  </div>
);

const FreightCarriers = () => (
  <div className="container mx-auto py-8">
    <h1 className="text-2xl font-bold mb-6">Transporteurs</h1>
    <p className="text-gray-500">À implémenter</p>
  </div>
);

const FreightPricing = () => (
  <div className="container mx-auto py-8">
    <h1 className="text-2xl font-bold mb-6">Tarification</h1>
    <p className="text-gray-500">À implémenter</p>
  </div>
);

const FreightDocuments = () => (
  <div className="container mx-auto py-8">
    <h1 className="text-2xl font-bold mb-6">Documents de Transport</h1>
    <p className="text-gray-500">À implémenter</p>
  </div>
);

const DefaultFreightContent = () => (
  <div className="container mx-auto py-8">
    <h1 className="text-2xl font-bold mb-6">Module Logistique</h1>
    <p className="text-gray-500">Sélectionnez une option dans le menu</p>
  </div>
);
