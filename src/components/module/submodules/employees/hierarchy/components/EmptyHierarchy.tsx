
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Users } from 'lucide-react';

interface EmptyHierarchyProps {
  onRefresh?: () => void;
}

const EmptyHierarchy: React.FC<EmptyHierarchyProps> = ({ onRefresh }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
      <Users className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium mb-2">Aucune hiérarchie disponible</h3>
      <p className="text-gray-500 mb-6 max-w-md">
        La structure hiérarchique de votre organisation n'a pas encore été configurée ou importée.
      </p>
      {onRefresh && (
        <Button onClick={onRefresh} variant="default">
          <RefreshCw className="h-4 w-4 mr-2" />
          Créer un PDG par défaut
        </Button>
      )}
    </div>
  );
};

export default EmptyHierarchy;
