
import React from 'react';

const FreightDashboard: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord du fret</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Expéditions récentes</h2>
          <p className="text-gray-500">Aucune expédition récente</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Statut des conteneurs</h2>
          <p className="text-gray-500">Aucun conteneur actif</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Transporteurs</h2>
          <p className="text-gray-500">Aucun transporteur configuré</p>
        </div>
      </div>
    </div>
  );
};

export default FreightDashboard;
