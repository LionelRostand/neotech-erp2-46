
import React from 'react';
import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";
import { useClientsData } from '../hooks/useClientsData';

const SeedDataButton: React.FC = () => {
  const { seedMockClients } = useClientsData();

  const handleSeedData = async () => {
    await seedMockClients();
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleSeedData}
      title="Ajouter des données de démonstration"
    >
      <Database className="mr-2 h-4 w-4" />
      Ajouter des données démo
    </Button>
  );
};

export default SeedDataButton;
