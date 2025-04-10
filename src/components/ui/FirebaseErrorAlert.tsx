
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw, ShieldAlert, WifiOff, Settings } from "lucide-react";

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
  const isPermissionError = errorMessage.includes('permission') || 
                            errorMessage.includes('permission-denied') ||
                            errorMessage.includes('unauthorized') ||
                            errorMessage.includes('access');
  const isOfflineError = errorMessage.includes('offline') || errorMessage.includes('network');
  
  // Déterminer un message d'aide spécifique basé sur le type d'erreur
  const getHelpText = () => {
    if (isPermissionError) {
      return "Cette erreur est souvent due à des règles de sécurité Firebase qui ne sont pas correctement configurées. Voici les actions possibles:";
    } else if (isOfflineError) {
      return "Vous êtes actuellement hors ligne. Veuillez vérifier votre connexion Internet et réessayer.";
    } else {
      return `Une erreur est survenue lors de la récupération des données: ${errorMessage}`;
    }
  };
  
  // Actions d'aide pour les erreurs de permission
  const renderPermissionHelp = () => {
    if (!isPermissionError) return null;
    
    return (
      <div className="mt-2 bg-amber-50 text-amber-900 p-3 rounded-md text-sm space-y-2">
        <p><strong>Actions possibles :</strong></p>
        <ol className="list-decimal ml-5 space-y-1">
          <li>Vérifiez que vous êtes connecté avec un utilisateur ayant les droits appropriés.</li>
          <li>Assurez-vous que les règles de sécurité Firebase permettent l'accès à cette collection.</li>
          <li>Si vous êtes en développement, vous pouvez temporairement assouplir les règles.</li>
          <li>Contactez l'administrateur pour mettre à jour les droits d'accès.</li>
        </ol>
      </div>
    );
  };
  
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
          <>
            <Settings className="h-4 w-4" />
            Erreur Firebase
          </>
        )}
      </AlertTitle>
      <AlertDescription className="mt-2">
        <div className="flex flex-col space-y-2">
          <p>{getHelpText()}</p>
          
          {renderPermissionHelp()}
          
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
