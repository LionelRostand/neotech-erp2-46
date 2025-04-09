
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Database, Loader2 } from "lucide-react";
import { useClientsData } from '../hooks/useClientsData';
import { toast } from 'sonner';

const SeedDataButton: React.FC = () => {
  const { seedMockClients } = useClientsData();
  const [isLoading, setIsLoading] = useState(false);

  const handleSeedData = async () => {
    setIsLoading(true);
    try {
      await seedMockClients();
      toast.success('Données de démonstration ajoutées avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'ajout des données de démonstration:', error);
      toast.error('Erreur lors de l\'ajout des données de démonstration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleSeedData}
      title="Ajouter des données de démonstration"
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Chargement...
        </>
      ) : (
        <>
          <Database className="mr-2 h-4 w-4" />
          Ajouter des données démo
        </>
      )}
    </Button>
  );
};

export default SeedDataButton;
