
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SalonClient } from '../../types/salon-types';
import { User, Calendar, Heart, Mail } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ClientDashboardProps {
  client: SalonClient;
  onEdit: () => void;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ client, onEdit }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <User className="mr-2 h-4 w-4 text-muted-foreground" />
            Informations client
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{client.firstName} {client.lastName}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Client depuis {formatDistanceToNow(new Date(client.createdAt), { addSuffix: true, locale: fr })}
          </p>
          <div className="mt-3 space-y-1">
            <div className="text-sm">{client.email}</div>
            <div className="text-sm">{client.phone}</div>
            {client.address && <div className="text-sm">{client.address}</div>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            Historique
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{client.visits.length}</div>
          <p className="text-xs text-muted-foreground mt-1">Visites totales</p>
          
          <div className="mt-3">
            <div className="text-sm font-medium">Dernière visite</div>
            <div className="text-sm">
              {client.lastVisit 
                ? new Date(client.lastVisit).toLocaleDateString('fr-FR')
                : "Aucune visite enregistrée"}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Heart className="mr-2 h-4 w-4 text-red-500" />
            Fidélité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{client.loyaltyPoints}</div>
          <p className="text-xs text-muted-foreground mt-1">Points de fidélité</p>
          
          <div className="mt-3">
            <div className="text-sm font-medium">
              Récompenses disponibles : {Math.floor(client.loyaltyPoints / 100)}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
            Communications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>SMS</span>
              <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                Activé
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Email</span>
              <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                Activé
              </span>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Dernier envoi: il y a 3 jours
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDashboard;
