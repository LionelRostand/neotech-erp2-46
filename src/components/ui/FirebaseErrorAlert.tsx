
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw, ShieldAlert, WifiOff, Settings, ArrowRight, LogIn } from "lucide-react";
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  
  if (!error) return null;
  
  const errorMessage = error.message || String(error);
  const isPermissionError = errorMessage.includes('permission') || 
                            errorMessage.includes('permission-denied') ||
                            errorMessage.includes('unauthorized') ||
                            errorMessage.includes('access');
  const isOfflineError = errorMessage.includes('offline') || errorMessage.includes('network');
  const isAuthError = errorMessage.includes('auth/') || 
                      errorMessage.includes('unauthenticated') ||
                      errorMessage.includes('login') ||
                      errorMessage.includes('sign-in');
  const isConfigError = errorMessage.includes('api-key-not-valid') || 
                        errorMessage.includes('API key not valid') ||
                        errorMessage.includes('configuration');
  
  // Déterminer un message d'aide spécifique basé sur le type d'erreur
  const getHelpText = () => {
    if (isConfigError) {
      return "Cette erreur est due à une configuration Firebase invalide. La clé API Firebase n'est pas valide ou est manquante.";
    } else if (isPermissionError) {
      return "Cette erreur est souvent due à des règles de sécurité Firebase qui ne sont pas correctement configurées.";
    } else if (isOfflineError) {
      return "Vous êtes actuellement hors ligne. Veuillez vérifier votre connexion Internet et réessayer.";
    } else if (isAuthError) {
      return "Vous n'êtes pas connecté ou votre session a expiré. Veuillez vous reconnecter pour accéder à cette ressource.";
    } else {
      return `Une erreur est survenue lors de la récupération des données: ${errorMessage}`;
    }
  };
  
  // Actions d'aide pour les erreurs de configuration
  const renderConfigHelp = () => {
    if (!isConfigError) return null;
    
    return (
      <div className="mt-2 bg-red-50 text-red-900 p-3 rounded-md text-sm space-y-2">
        <p><strong>Problème de configuration:</strong></p>
        <ol className="list-decimal ml-5 space-y-1">
          <li>Vérifiez que vous avez remplacé la clé API factice par une véritable clé API Firebase.</li>
          <li>Pour un projet de développement, utilisez la clé API Firebase de développement.</li>
          <li>Vérifiez que votre projet Firebase est correctement configuré et que l'authentification est activée.</li>
        </ol>
      </div>
    );
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
          <li>Pour la collection <code>hr_employees</code>, vérifiez que les règles suivantes sont appliquées:</li>
        </ol>
        <div className="bg-zinc-800 text-amber-100 p-2 my-2 rounded-md font-mono text-xs overflow-auto">
          match /hr_employees/{'{'}document=**{'}'} {'{'}
            <br />
            &#160;&#160;allow read: if isAuthenticated() && (hasPermission('employees', 'view') || isAdmin());
            <br />
            &#160;&#160;allow create: if isAuthenticated() && (hasPermission('employees', 'create') || isAdmin());
            <br />
            &#160;&#160;allow update: if isAuthenticated() && (hasPermission('employees', 'edit') || isAdmin());
            <br />
            &#160;&#160;allow delete: if isAuthenticated() && (hasPermission('employees', 'delete') || isAdmin());
            <br />
          {'}'}
        </div>
        <p className="mt-2">En mode développement, vous pouvez temporairement permettre un accès complet:</p>
        <div className="bg-zinc-800 text-amber-100 p-2 my-2 rounded-md font-mono text-xs overflow-auto">
          match /hr_employees/{'{'}document=**{'}'} {'{'}
            <br />
            &#160;&#160;allow read, write: if true; // Uniquement pour le développement
            <br />
          {'}'}
        </div>
      </div>
    );
  };
  
  // Actions d'aide pour les erreurs d'authentification
  const renderAuthHelp = () => {
    if (!isAuthError) return null;
    
    return (
      <div className="mt-2 bg-blue-50 text-blue-900 p-3 rounded-md text-sm">
        <p>Votre session a peut-être expiré ou vous n'êtes pas connecté.</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/login')}
          className="mt-2 flex items-center gap-1"
        >
          <LogIn className="h-4 w-4 mr-1" />
          Se connecter
        </Button>
      </div>
    );
  };
  
  return (
    <Alert variant="destructive" className={className}>
      <AlertTitle className="flex items-center gap-2">
        {isConfigError ? (
          <>
            <Settings className="h-4 w-4" />
            Erreur de configuration Firebase
          </>
        ) : isPermissionError ? (
          <>
            <ShieldAlert className="h-4 w-4" />
            Erreur de permissions Firebase
          </>
        ) : isOfflineError ? (
          <>
            <WifiOff className="h-4 w-4" />
            Erreur de connexion
          </>
        ) : isAuthError ? (
          <>
            <LogIn className="h-4 w-4" />
            Erreur d'authentification
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
          
          {renderConfigHelp()}
          {renderPermissionHelp()}
          {renderAuthHelp()}
          
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
