
import React from 'react';
import { Card } from "@/components/ui/card";
import { Users, BarChart3 } from "lucide-react";

interface ClientDetailsProps {
  client: {
    id: string;
    name: string;
    sector: string;
    revenue: string;
    status: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
  };
}

const ClientDetails: React.FC<ClientDetailsProps> = ({ client }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-2">Informations générales</h3>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium">Nom:</span> {client.name}</div>
            <div><span className="font-medium">Secteur:</span> {client.sector}</div>
            <div><span className="font-medium">CA:</span> {parseInt(client.revenue).toLocaleString('fr-FR')} €</div>
            <div><span className="font-medium">Statut:</span> {client.status === 'active' ? 'Actif' : 'Inactif'}</div>
            <div><span className="font-medium">Adresse:</span> {client.address}</div>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Contact principal</h3>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium">Nom:</span> {client.contactName}</div>
            <div><span className="font-medium">Email:</span> {client.contactEmail}</div>
            <div><span className="font-medium">Téléphone:</span> {client.contactPhone}</div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Statistiques</h3>
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex flex-col items-center">
              <Users className="h-8 w-8 text-blue-500 mb-2" />
              <div className="text-2xl font-bold">3</div>
              <div className="text-sm text-muted-foreground">Contacts</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex flex-col items-center">
              <BarChart3 className="h-8 w-8 text-green-500 mb-2" />
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm text-muted-foreground">Opportunités</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex flex-col items-center">
              <BarChart3 className="h-8 w-8 text-purple-500 mb-2" />
              <div className="text-2xl font-bold">8</div>
              <div className="text-sm text-muted-foreground">Interactions</div>
            </div>
          </Card>
        </div>
      </div>
      
      <div>
        <h3 className="font-semibold mb-2">Historique récent</h3>
        <div className="space-y-2">
          <div className="p-2 border rounded-md">
            <div className="flex justify-between items-center">
              <span className="font-medium">Appel téléphonique</span>
              <span className="text-xs text-muted-foreground">Il y a 2 jours</span>
            </div>
            <p className="text-sm mt-1">Discussion sur le renouvellement du contrat</p>
          </div>
          <div className="p-2 border rounded-md">
            <div className="flex justify-between items-center">
              <span className="font-medium">Email</span>
              <span className="text-xs text-muted-foreground">Il y a 1 semaine</span>
            </div>
            <p className="text-sm mt-1">Envoi de la proposition commerciale</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetails;
