
import React from 'react';
import { FreightAlert } from './FreightAlert';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface FirebaseErrorAlertProps {
  error: Error | null;
  onRetry?: () => void;
  className?: string;
}

export const FirebaseErrorAlert: React.FC<FirebaseErrorAlertProps> = ({
  error,
  onRetry,
  className,
}) => {
  if (!error) return null;
  
  const isOfflineError = error.message.includes('offline') || error.message.includes('network');
  
  return (
    <FreightAlert
      variant="warning"
      title={isOfflineError ? "Vous êtes hors ligne" : "Erreur de connexion"}
      className={className}
    >
      <div className="flex flex-col space-y-2">
        <p>
          {isOfflineError
            ? "Impossible d'accéder aux données car vous êtes actuellement hors ligne."
            : `Une erreur est survenue lors de la récupération des données: ${error.message}`}
        </p>
        {onRetry && (
          <div className="flex justify-end mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetry}
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              {isOfflineError ? "Réessayer une fois en ligne" : "Réessayer"}
            </Button>
          </div>
        )}
      </div>
    </FreightAlert>
  );
};
