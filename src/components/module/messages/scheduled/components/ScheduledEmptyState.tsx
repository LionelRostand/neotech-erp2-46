
import React from 'react';
import { Clock, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScheduledEmptyStateProps {
  onCreateNewMessage: () => void;
}

const ScheduledEmptyState: React.FC<ScheduledEmptyStateProps> = ({ onCreateNewMessage }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-lg">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
        <Clock className="w-8 h-8 text-primary" />
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Aucun message programmé
      </h3>
      
      <p className="text-sm text-gray-500 text-center mb-6 max-w-md">
        Les messages que vous programmez pour un envoi ultérieur apparaîtront ici.
        Vous pouvez créer un nouveau message et définir une date d'envoi future.
      </p>
      
      <Button onClick={onCreateNewMessage} className="flex items-center">
        <PlusCircle className="mr-2 h-4 w-4" />
        Créer un message
      </Button>
    </div>
  );
};

export default ScheduledEmptyState;
