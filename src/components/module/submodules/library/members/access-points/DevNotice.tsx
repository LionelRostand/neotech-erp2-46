
import React from 'react';

const DevNotice: React.FC = () => {
  return (
    <div className="bg-amber-50 border border-amber-200 p-4 rounded-md text-amber-800">
      <p className="text-sm">
        ⚠️ Cette fonctionnalité est en cours de développement. Les modifications ne sont pas enregistrées.
      </p>
      <p className="text-sm mt-1">
        Prochaines étapes : ajout des formulaires de création/modification et gestion des employés associés.
      </p>
    </div>
  );
};

export default DevNotice;
