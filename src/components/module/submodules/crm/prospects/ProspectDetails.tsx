import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Prospect } from '../types/crm-types';
import { formatDate } from "@/lib/utils";

interface ProspectDetailsProps {
  prospect: Prospect | null;
  onClose: () => void;
}

const ProspectDetails: React.FC<ProspectDetailsProps> = ({ prospect, onClose }) => {
  if (!prospect) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Détails du prospect</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Aucun prospect sélectionné.</p>
          <button onClick={onClose}>Fermer</button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Détails du prospect</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Nom:</p>
            <p>{prospect.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Statut:</p>
            <p>{prospect.status}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Contact:</p>
            <p>{prospect.contactName}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Email:</p>
            <p>{prospect.contactEmail}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Téléphone:</p>
            <p>{prospect.contactPhone}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Source:</p>
            <p>{prospect.source}</p>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium">Notes:</p>
          <p>{prospect.notes}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Date de création:</p>
          <p>{formatDate(prospect.createdAt)}</p>
        </div>
        <button onClick={onClose}>Fermer</button>
      </CardContent>
    </Card>
  );
};

export default ProspectDetails;
