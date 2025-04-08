
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, Edit, Globe, Mail, MapPin, Phone } from "lucide-react";
import { Client } from '../types/crm-types';

interface ClientDetailsProps {
  client: Client;
  onEdit: () => void;
}

const ClientDetails: React.FC<ClientDetailsProps> = ({ client, onEdit }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold">{client.name}</h2>
          <p className="text-muted-foreground">{client.sector}</p>
        </div>
        <Button size="sm" variant="outline" onClick={onEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Modifier
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Informations générales</h3>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${
                client.status === 'active' ? 'bg-green-500' : 
                client.status === 'inactive' ? 'bg-gray-400' : 'bg-blue-500'
              }`}></div>
              <span>
                {client.status === 'active' ? 'Client actif' : 
                 client.status === 'inactive' ? 'Inactif' : 'Prospect'}
              </span>
            </div>
            
            {client.website && (
              <div className="flex items-start">
                <Globe className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                <a 
                  href={client.website.startsWith('http') ? client.website : `https://${client.website}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {client.website}
                </a>
              </div>
            )}
            
            {client.address && (
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                <span>{client.address}</span>
              </div>
            )}
            
            {client.customerSince && (
              <div className="flex items-start">
                <Calendar className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                <span>Client depuis le {new Date(client.customerSince).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Contact principal</h3>
          
          <div className="space-y-2">
            <div className="font-medium">{client.contactName}</div>
            
            <div className="flex items-start">
              <Mail className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
              <a 
                href={`mailto:${client.contactEmail}`}
                className="text-blue-600 hover:underline"
              >
                {client.contactEmail}
              </a>
            </div>
            
            <div className="flex items-start">
              <Phone className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
              <span>{client.contactPhone}</span>
            </div>
          </div>
        </div>
      </div>
      
      {client.notes && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
          <p className="text-sm whitespace-pre-line">{client.notes}</p>
        </div>
      )}
    </div>
  );
};

export default ClientDetails;
