import React from 'react';
import FreightRoutesDashboard from "./FreightRoutesDashboard";

const FreightRoutesPage = () => {
  return (
    <div className="px-2 md:px-8 py-6">
      <h1 className="text-xl md:text-2xl font-bold mb-4">Gestion des routes</h1>
      <FreightRoutesDashboard />
    </div>
  );
};

export default FreightRoutesPage;
