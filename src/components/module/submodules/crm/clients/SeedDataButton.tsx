
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";
import { useClientsData } from '../hooks/useClientsData';

const SeedDataButton: React.FC = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const { seedMockClients } = useClientsData();

  const handleSeedData = async () => {
    try {
      setIsSeeding(true);
      await seedMockClients();
    } catch (error) {
      console.error("Error seeding demo data:", error);
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
