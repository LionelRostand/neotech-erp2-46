
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useClientsData } from '../hooks/useClientsData';
import { Loader2, Database } from "lucide-react";
import { toast } from 'sonner';

const SeedDataButton: React.FC = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const { seedMockClients, clients } = useClientsData();

  const handleSeedData = async () => {
    console.log('Current clients:', clients);
    
    if (clients.length > 0) {
      // Demander confirmation si des clients existent déjà
      if (!window.confirm("Des clients existent déjà. Voulez-vous ajouter 10 clients supplémentaires?")) {
        return;
      }
    }
    
    setIsSeeding(true);
    try {
      await seedMockClients();
      console.log('Clients after seeding:', clients);
    } catch (error) {
      console.error('Error seeding data:', error);
      toast.error("Erreur lors de l'ajout des données de démonstration.");
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleSeedData}
      disabled={isSeeding}
      className="flex items-center space-x-1"
    >
      {isSeeding ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Ajout en cours...
        </>
      ) : (
        <>
          <Database className="h-4 w-4 mr-2" />
          Ajouter des données démo
        </>
      )}
    </Button>
  );
};

export default SeedDataButton;
