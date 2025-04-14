
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  error: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-800">
          <p>Une erreur est survenue lors du chargement des paramètres.</p>
          <p className="text-sm text-red-600 mt-1">{error}</p>
          <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
