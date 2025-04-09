
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";
import { useClientsData } from '../hooks/useClientsData';
import { toast } from 'sonner';

const SeedDataButton: React.FC = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const { seedMockClients } = useClientsData();

  const handleSeedData = async () => {
    try {
      setIsSeeding(true);
      await seedMockClients();
      // Toast notification is already handled in seedMockClients
    } catch (error) {
      console.error("Error seeding demo data:", error);
      const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
      toast.error(`Erreur lors de l'ajout des données de démonstration: ${errorMessage}`);
    } finally {
      setIsSeeding(false);
    }
  };
  
  return (
    <Button 
      variant="outline" 
      onClick={handleSeedData} 
      disabled={isSeeding}
      title="Ajouter des clients de démonstration"
    >
      <Database className="h-4 w-4 mr-2" />
      {isSeeding ? "Ajout en cours..." : "Ajouter des données démo"}
    </Button>
  );
};

export default SeedDataButton;
