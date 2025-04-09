
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Database, Loader2 } from "lucide-react";
import { useClientsData } from '../hooks/useClientsData';
import { toast } from 'sonner';

const SeedDataButton: React.FC = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const { seedMockClients } = useClientsData();

  const handleSeedData = async () => {
    if (isSeeding) return; // Prevent multiple clicks
    
    try {
      setIsSeeding(true);
      toast.info("Ajout des données de démonstration en cours...");
      
      // Add a timeout for the entire operation
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          setIsSeeding(false);
          reject(new Error('L\'opération a pris trop de temps'));
        }, 20000); // 20 seconds overall timeout
      });
      
      // Race between the seeding operation and the timeout
      await Promise.race([
        seedMockClients(),
        timeoutPromise
      ]);
    } catch (error) {
      console.error("Error seeding demo data:", error);
      
      // Check if it's a timeout error
      if (error instanceof Error && error.message.includes('trop de temps')) {
        toast.warning("L'ajout des données de démonstration a été interrompu car il prenait trop de temps. Certains clients ont pu être ajoutés.");
      } else {
        const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
        toast.error(`Erreur lors de l'ajout des données de démonstration: ${errorMessage}`);
      }
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
      {isSeeding ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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
