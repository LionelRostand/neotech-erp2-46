
import React from 'react';
import { Calendar, Car, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Mock data for recent reservations
const recentReservations = [
  {
    id: "r1",
    clientName: "Martin Dupont",
    vehicleName: "Renault Clio",
    status: "confirmed",
    startDate: "2023-06-18",
    endDate: "2023-06-22",
  },
  {
    id: "r2",
    clientName: "Sophie Lefebvre",
    vehicleName: "Peugeot 308",
    status: "in-progress",
    startDate: "2023-06-15",
    endDate: "2023-06-20",
  },
  {
    id: "r3",
    clientName: "Jean Moreau",
    vehicleName: "Citroen C3",
    status: "pending",
    startDate: "2023-06-20",
    endDate: "2023-06-25",
  },
  {
    id: "r4",
    clientName: "Marie Durand",
    vehicleName: "Dacia Duster",
    status: "confirmed",
    startDate: "2023-06-22",
    endDate: "2023-06-29",
  },
];

export const RecentReservations = () => {
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Confirmée</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">En cours</Badge>;
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Terminée</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Annulée</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">En attente</Badge>;
      default:
        return <Badge variant="outline">Non défini</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {recentReservations.length === 0 ? (
        <div className="text-center p-6">
          <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-2" />
          <h3 className="text-lg font-medium">Aucune réservation récente</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Les nouvelles réservations apparaîtront ici
          </p>
        </div>
      ) : (
        recentReservations.map((reservation) => (
          <div key={reservation.id} className="border rounded-lg p-3">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <h3 className="font-medium">{reservation.clientName}</h3>
                </div>
                <div className="flex items-center mt-1 space-x-2">
                  <Car className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{reservation.vehicleName}</span>
                </div>
              </div>
              
              {getStatusBadge(reservation.status)}
            </div>
            
            <div className="mt-2 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">
                  {new Date(reservation.startDate).toLocaleDateString('fr-FR')} au {new Date(reservation.endDate).toLocaleDateString('fr-FR')}
                </span>
              </div>
              
              <Button variant="ghost" size="sm">Détails</Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
