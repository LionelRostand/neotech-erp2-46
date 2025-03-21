
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

const ReportsManagement = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Rapports</h2>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <span>En cours d'implémentation</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Cette section permettra bientôt de :</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Générer des statistiques sur les locations, revenus et performances des véhicules</li>
            <li>Analyser les tendances et créer des prévisions</li>
            <li>Exporter les données en Excel/PDF</li>
            <li>Créer des tableaux de bord personnalisés</li>
            <li>Programmer l'envoi automatique de rapports</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsManagement;
