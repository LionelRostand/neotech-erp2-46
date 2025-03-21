
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map } from "lucide-react";

const LocationsManagement = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Gestion des Emplacements</h2>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5" />
            <span>En cours d'implémentation</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Cette section permettra bientôt de :</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Suivre les agences ou points de dépôt/retrait des véhicules</li>
            <li>Gérer les transferts entre emplacements</li>
            <li>Visualiser la disponibilité des véhicules par emplacement</li>
            <li>Configurer les horaires d'ouverture par emplacement</li>
            <li>Gérer le personnel par emplacement</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationsManagement;
