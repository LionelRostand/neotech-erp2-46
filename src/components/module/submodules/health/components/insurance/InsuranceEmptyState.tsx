
import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';

interface InsuranceEmptyStateProps {
  onAdd: () => void;
}

const InsuranceEmptyState: React.FC<InsuranceEmptyStateProps> = ({ onAdd }) => {
  return (
    <div className="p-8 text-center">
      <Shield className="h-12 w-12 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium mb-2">Aucune assurance configurée</h3>
      <p className="text-sm text-muted-foreground max-w-md mx-auto">
        Vous n'avez pas encore configuré d'assurances ou de mutuelles. 
        Ajoutez des assureurs pour faciliter la gestion des remboursements et des prises en charge.
      </p>
      <Button 
        className="mt-4"
        onClick={onAdd}
      >
        Ajouter un assureur
      </Button>
    </div>
  );
};

export default InsuranceEmptyState;
