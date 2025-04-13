
import React from 'react';
import { AlertTriangle } from 'lucide-react';

const EmptyHierarchy: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertTriangle className="h-16 w-16 text-amber-500 mb-4" />
      <h3 className="text-xl font-medium mb-2">Aucune donnée de hiérarchie disponible</h3>
      <p className="text-muted-foreground max-w-md mb-4">
        L'organigramme ne peut pas être affiché car aucune donnée de hiérarchie n'a été trouvée.
      </p>
      <div className="text-sm text-muted-foreground">
        <p>Suggestions:</p>
        <ul className="list-disc list-inside text-left mt-2">
          <li>Assurez-vous d'avoir ajouté des employés avec des relations manager/subordonné</li>
          <li>Vérifiez que les départements ont des managers assignés</li>
          <li>Assurez-vous qu'au moins un employé est défini comme PDG ou manager principal</li>
          <li>Allez dans la section "Départements" pour attribuer un manager à chaque département</li>
        </ul>
      </div>
    </div>
  );
};

export default EmptyHierarchy;
