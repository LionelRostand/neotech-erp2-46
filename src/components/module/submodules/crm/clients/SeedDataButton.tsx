
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";
import { toast } from 'sonner';
import mockClientsData from '../data/mockClients';
import { useFirestore } from '@/hooks/useFirestore';
import { COLLECTIONS } from '@/lib/firebase-collections';

const SeedDataButton: React.FC = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const { add } = useFirestore(COLLECTIONS.CRM.CLIENTS);

  const handleSeedData = async () => {
    try {
      setIsSeeding(true);
      toast.info("Ajout des données de démo en cours...");
      
      // Add each mock client to the database
      const promises = mockClientsData.map(async (client) => {
        try {
          // Remove the id so Firestore generates one
          const { id, _offlineCreated, ...clientData } = client;
          return await add(clientData);
        } catch (error) {
          console.error(`Error adding demo client ${client.name}:`, error);
          return null;
        }
      });
      
      const results = await Promise.all(promises);
      const successCount = results.filter(Boolean).length;
      
      if (successCount > 0) {
        toast.success(`${successCount} clients de démo ajoutés avec succès.`);
      } else {
        toast.error("Impossible d'ajouter les clients de démo. Vérifiez votre connexion.");
      }
    } catch (error) {
      console.error("Error seeding demo data:", error);
      toast.error("Erreur lors de l'ajout des données de démo.");
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
