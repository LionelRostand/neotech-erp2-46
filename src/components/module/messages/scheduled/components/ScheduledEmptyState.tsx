
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

interface ScheduledEmptyStateProps {
  onCreateNewMessage: () => void;
}

const ScheduledEmptyState: React.FC<ScheduledEmptyStateProps> = ({ onCreateNewMessage }) => {
  return (
    <div className="p-8 text-center">
      <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium mb-2">Aucun message programmé</h3>
      <p className="text-sm text-muted-foreground max-w-md mx-auto">
        Vous n'avez pas de messages programmés pour le moment. Vous pouvez créer un nouveau message et le programmer pour un envoi ultérieur.
      </p>
      <Button 
        className="mt-4"
        onClick={onCreateNewMessage}
      >
        Créer un message programmé
      </Button>
    </div>
  );
};

export default ScheduledEmptyState;
