
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link2, Plus } from "lucide-react";

interface IntegrationEmptyStateProps {
  onAdd: () => void;
}

const IntegrationEmptyState: React.FC<IntegrationEmptyStateProps> = ({ onAdd }) => {
  return (
    <Card className="w-full p-8 mt-4">
      <CardContent className="flex flex-col items-center justify-center text-center pt-6">
        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
          <Link2 className="h-6 w-6 text-purple-500" />
        </div>
        <h3 className="text-lg font-medium mb-2">Aucune intégration configurée</h3>
        <p className="text-sm text-muted-foreground max-w-sm mb-4">
          Vous n'avez pas encore configuré d'intégrations avec d'autres systèmes. Ajoutez une nouvelle intégration pour commencer.
        </p>
        <Button onClick={onAdd} className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Configurer une intégration
        </Button>
      </CardContent>
    </Card>
  );
};

export default IntegrationEmptyState;
