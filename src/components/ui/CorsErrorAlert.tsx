
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert, Info } from "lucide-react";

interface CorsErrorAlertProps {
  message?: string;
  className?: string;
}

export const CorsErrorAlert: React.FC<CorsErrorAlertProps> = ({
  message = "Des restrictions CORS empêchent l'accès aux ressources distantes. Les données locales seront utilisées.",
  className,
}) => {
  return (
    <Alert variant="default" className={`bg-amber-50 border-amber-200 text-amber-800 ${className}`}>
      <ShieldAlert className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-2 text-amber-800 font-medium">
        Avertissement CORS
      </AlertTitle>
      <AlertDescription className="mt-2 text-amber-700">
        <div className="flex flex-col space-y-2">
          <p>{message}</p>
          <div className="mt-1 flex items-start">
            <Info className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm">
              Le stockage et l'affichage des fichiers seront gérés localement pour éviter les erreurs CORS.
              Ceci n'affecte pas le fonctionnement de l'application.
            </p>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default CorsErrorAlert;
