
import React from 'react';
import { Button } from "@/components/ui/button";
import { DatabaseIcon } from "lucide-react";
import { useClientsData } from '../hooks/useClientsData';

interface SeedDataButtonProps {
  className?: string;
}

const SeedDataButton: React.FC<SeedDataButtonProps> = ({ className }) => {
  const { seedMockClients } = useClientsData();
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      className={className}
      onClick={() => seedMockClients()}
    >
      <DatabaseIcon className="h-4 w-4 mr-2" />
      Initialiser les données
    </Button>
  );
};

export default SeedDataButton;
