
import React from 'react';
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2, UserCheck, Building, Mail, Phone } from "lucide-react";
import { Prospect } from '../types/crm-types';

interface ProspectsGridProps {
  prospects: Prospect[];
  onEdit: (prospect: Prospect) => void;
  onDelete: (prospect: Prospect) => void;
  onViewDetails: (prospect: Prospect) => void;
  onConvert: (prospect: Prospect) => void;
}

const ProspectsGrid: React.FC<ProspectsGridProps> = ({
  prospects,
  onEdit,
  onDelete,
  onViewDetails,
  onConvert
}) => {
  // Helper function to get the badge class based on status
  const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'contacted':
        return 'bg-purple-100 text-purple-800';
      case 'meeting':
        return 'bg-green-100 text-green-800';
      case 'proposal':
        return 'bg-amber-100 text-amber-800';
      case 'negotiation':
        return 'bg-orange-100 text-orange-800';
      case 'converted':
        return 'bg-green-100 text-green-800';
      case 'lost':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to get status display text
  const getStatusText = (status: string): string => {
    switch (status) {
      case 'new':
        return 'Nouveau';
      case 'contacted':
        return 'Contacté';
      case 'meeting':
        return 'Rendez-vous';
      case 'proposal':
        return 'Proposition';
      case 'negotiation':
        return 'Négociation';
      case 'converted':
        return 'Converti';
      case 'lost':
        return 'Perdu';
      default:
        return 'Inconnu';
    }
  };

  if (prospects.length === 0) {
    return (
      <div className="text-center py-8">
        Aucun prospect trouvé
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {prospects.map((prospect) => (
        <Card key={prospect.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <h3 className="font-medium">{prospect.company}</h3>
              <Badge className={getStatusBadgeClass(prospect.status)}>
                {getStatusText(prospect.status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-gray-500" />
                <span>{prospect.contactName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="truncate">{prospect.contactEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{prospect.contactPhone || 'Non renseigné'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Source:</span>
                <span className="text-xs">{prospect.source}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-2">
            <Button variant="ghost" size="sm" onClick={() => onViewDetails(prospect)}>
              <Eye className="h-4 w-4 mr-1" />
              Détails
            </Button>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => onEdit(prospect)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onConvert(prospect)}>
                <UserCheck className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(prospect)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ProspectsGrid;
