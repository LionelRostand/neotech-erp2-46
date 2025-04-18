
import React from 'react';
import { AlertTriangle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyHierarchyProps {
  onRefresh?: () => void;
}

const EmptyHierarchy: React.FC<EmptyHierarchyProps> = ({ onRefresh }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertTriangle className="h-16 w-16 text-amber-500 mb-4" />
      <h3 className="text-xl font-medium mb-2">Aucune donnée de hiérarchie disponible</h3>
      <p className="text-muted-foreground max-w-md mb-6">
        L'organigramme ne peut pas être affiché car aucune donnée de hiérarchie n'a été trouvée.
      </p>
      
      {onRefresh && (
        <Button 
          onClick={onRefresh}
          className="mb-6"
          variant="outline"
        >
          <Users className="h-4 w-4 mr-2" />
          Créer un organigramme automatique
        </Button>
      )}
      
      <div className="text-sm text-muted-foreground">
        <p>Suggestions:</p>
        <ul className="list-disc list-inside text-left mt-2">
          <li>Assurez-vous d'avoir ajouté des employés avec des relations manager/subordonné</li>
          <li>Vérifiez que les départements ont des managers assignés</li>
          <li>Assurez-vous qu'au moins un employé est défini comme PDG ou manager principal</li>
          <li>Créez un nouvel employé avec le titre "PDG" ou "CEO" pour en faire la racine de l'organigramme</li>
        </ul>
      </div>
    </div>
  );
};

export default EmptyHierarchy;
