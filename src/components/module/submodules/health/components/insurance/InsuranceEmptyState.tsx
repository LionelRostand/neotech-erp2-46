
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Plus } from "lucide-react";

interface InsuranceEmptyStateProps {
  onAdd: () => void;
}

const InsuranceEmptyState: React.FC<InsuranceEmptyStateProps> = ({ onAdd }) => {
  return (
    <Card className="w-full p-8 mt-4">
      <CardContent className="flex flex-col items-center justify-center text-center pt-6">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
          <Building2 className="h-6 w-6 text-blue-500" />
        </div>
        <h3 className="text-lg font-medium mb-2">Aucune assurance enregistrée</h3>
        <p className="text-sm text-muted-foreground max-w-sm mb-4">
          Vous n'avez pas encore ajouté d'assurances. Commencez par ajouter une nouvelle compagnie d'assurance.
        </p>
        <Button onClick={onAdd} className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Ajouter une assurance
        </Button>
      </CardContent>
    </Card>
  );
};

export default InsuranceEmptyState;
