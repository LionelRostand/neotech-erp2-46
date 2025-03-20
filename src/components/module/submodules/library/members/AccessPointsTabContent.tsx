
import React from 'react';

const AccessPointsTabContent: React.FC = () => {
  return (
    <div className="bg-slate-50 border rounded-md p-8 text-center">
      <h3 className="text-xl font-semibold mb-2">Gestion des points d'accès</h3>
      <p className="text-slate-600 mb-4">
        Cette section permet de configurer les différents points de vente/accès et de gérer les employés 
        qui peuvent s'y connecter.
      </p>
      <div className="flex justify-center">
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-md text-amber-800 inline-block">
          <p>Fonctionnalité en cours de développement.</p>
        </div>
      </div>
    </div>
  );
};

export default AccessPointsTabContent;
