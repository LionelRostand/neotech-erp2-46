
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone } from "lucide-react";
import { Prospect } from '../types/crm-types';

interface ProspectDetailsProps {
  prospect: Prospect;
  getStatusBadgeClass: (status: string) => string;
  getStatusText: (status: string) => string;
}

const ProspectDetails: React.FC<ProspectDetailsProps> = ({
  prospect,
  getStatusBadgeClass,
  getStatusText
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold">{prospect.name}</h2>
          <p className="text-muted-foreground">{prospect.company}</p>
        </div>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(prospect.status)}`}>
          {getStatusText(prospect.status)}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Informations de contact</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
              <a href={`mailto:${prospect.email}`} className="text-blue-600 hover:underline">
                {prospect.email}
              </a>
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
              <a href={`tel:${prospect.phone}`} className="text-blue-600 hover:underline">
                {prospect.phone}
              </a>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Informations supplémentaires</h3>
          <div className="space-y-1 text-sm">
            <div>
              <span className="font-medium">Source:</span> {prospect.source}
            </div>
            <div>
              <span className="font-medium">Date de création:</span> {prospect.createdAt ? new Date(prospect.createdAt).toLocaleDateString('fr-FR') : '-'}
            </div>
            <div>
              <span className="font-medium">Dernier contact:</span> {prospect.lastContact ? new Date(prospect.lastContact).toLocaleDateString('fr-FR') : '-'}
            </div>
          </div>
        </Card>
      </div>
      
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Notes</h3>
        <p className="whitespace-pre-line">{prospect.notes || "Aucune note disponible."}</p>
      </Card>
    </div>
  );
};

export default ProspectDetails;
