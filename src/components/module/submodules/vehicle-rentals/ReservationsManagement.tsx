
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck } from "lucide-react";

const ReservationsManagement = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Gestion des Réservations</h2>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarCheck className="h-5 w-5" />
            <span>En cours d'implémentation</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Cette section permettra bientôt de :</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Créer et gérer des réservations (dates, véhicules, clients)</li>
            <li>Configurer un système de tarification dynamique (saisonnalité, promotions)</li>
            <li>Gérer les cautions et paiements anticipés</li>
            <li>Visualiser le calendrier des locations</li>
            <li>Suivre l'état des réservations en temps réel</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReservationsManagement;
