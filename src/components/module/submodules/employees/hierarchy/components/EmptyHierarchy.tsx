
import React from 'react';
import { Users } from 'lucide-react';

const EmptyHierarchy: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <Users className="h-12 w-12 text-slate-400 mb-3" />
      <h3 className="text-lg font-medium">Aucune hiérarchie trouvée</h3>
      <p className="text-slate-500 mt-1">
        Aucun employé n'a été trouvé ou les relations hiérarchiques ne sont pas définies.
      </p>
    </div>
  );
};

export default EmptyHierarchy;
