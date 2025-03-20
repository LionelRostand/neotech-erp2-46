
import React from 'react';

const EmptyState: React.FC = () => {
  return (
    <div className="bg-slate-50 border rounded-md p-8 text-center">
      <h3 className="text-xl font-semibold mb-2">Aucun point d'accès trouvé</h3>
      <p className="text-slate-600 mb-4">
        Essayez de modifier votre recherche ou ajoutez un nouveau point d'accès.
      </p>
    </div>
  );
};

export default EmptyState;
