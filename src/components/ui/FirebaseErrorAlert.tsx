
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw, ShieldAlert, WifiOff } from "lucide-react";

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
  
  const errorMessage = error.message || String(error);
  const isPermissionError = errorMessage.includes('permission') || errorMessage.includes('permission-denied');
  const isOfflineError = errorMessage.includes('offline') || errorMessage.includes('network');
  
  return (
    <Alert variant="destructive" className={className}>
      <AlertTitle className="flex items-center gap-2">
        {isPermissionError ? (
          <>
            <ShieldAlert className="h-4 w-4" />
            Erreur de permissions Firebase
          </>
        ) : isOfflineError ? (
          <>
            <WifiOff className="h-4 w-4" />
            Erreur de connexion
          </>
        ) : (
          "Erreur Firebase"
        )}
      </AlertTitle>
      <AlertDescription className="mt-2">
        <div className="flex flex-col space-y-2">
          <p>
            {isPermissionError
              ? "Vous n'avez pas les autorisations nécessaires pour accéder à ces données. Veuillez contacter l'administrateur pour mettre à jour les règles de sécurité Firebase."
              : isOfflineError
              ? "Impossible d'accéder aux données car vous êtes actuellement hors ligne."
              : `Une erreur est survenue lors de la récupération des données: ${errorMessage}`}
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
                Réessayer
              </Button>
            </div>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};
