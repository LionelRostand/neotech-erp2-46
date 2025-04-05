
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, Trash2, Mail, Phone, Calendar, RotateCw } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Prospect } from '../types/crm-types';

interface ProspectListProps {
  prospects: Prospect[];
  onView: (prospect: Prospect) => void;
  onEdit: (prospect: Prospect) => void;
  onDelete: (prospect: Prospect) => void;
  onReminder?: (prospect: Prospect) => void;
  onConvert?: (prospect: Prospect) => void;
}

const ProspectList: React.FC<ProspectListProps> = ({
  prospects,
  onView,
  onEdit,
  onDelete,
  onReminder,
  onConvert
}) => {
  // Helper function to get status badge color
  const getStatusBadgeColor = (status: string): string => {
    switch (status) {
      case 'new':
        return 'bg-blue-200 text-blue-800';
      case 'contacted':
        return 'bg-purple-200 text-purple-800';
      case 'qualified':
        return 'bg-green-200 text-green-800';
      case 'unqualified':
        return 'bg-red-200 text-red-800';
      case 'hot':
        return 'bg-orange-200 text-orange-800';
      case 'warm':
        return 'bg-amber-200 text-amber-800';
      case 'cold':
        return 'bg-slate-200 text-slate-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  // Helper function to get status label
  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'new':
        return 'Nouveau';
      case 'contacted':
        return 'Contacté';
      case 'qualified':
        return 'Qualifié';
      case 'unqualified':
        return 'Non qualifié';
      case 'hot':
        return 'Chaud';
      case 'warm':
        return 'Tiède';
      case 'cold':
        return 'Froid';
      default:
        return status;
    }
  };

  // Format date for display
  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString('fr-FR');
  };

  // If no prospects, show empty state
  if (prospects.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Aucun prospect trouvé</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {prospects.map(prospect => (
        <Card key={prospect.id} className="cursor-pointer hover:border-primary transition-colors">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{prospect.company}</h3>
                  <Badge className={getStatusBadgeColor(prospect.status)}>
                    {getStatusLabel(prospect.status)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{prospect.contactName || prospect.name}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  {(prospect.contactEmail || prospect.email) && (
                    <div className="flex items-center gap-1 text-sm">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span>{prospect.contactEmail || prospect.email}</span>
                    </div>
                  )}
                  
                  {(prospect.contactPhone || prospect.phone) && (
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span>{prospect.contactPhone || prospect.phone}</span>
                    </div>
                  )}
                  
                  {prospect.lastContact && (
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span>Dernier contact: {formatDate(prospect.lastContact)}</span>
                    </div>
                  )}
                  
                  {prospect.source && (
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-muted-foreground">Source: {prospect.source}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Ouvrir le menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onView(prospect)}>
                    <Eye className="mr-2 h-4 w-4" />
                    <span>Voir</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(prospect)}>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Modifier</span>
                  </DropdownMenuItem>
                  {onReminder && (
                    <DropdownMenuItem onClick={() => onReminder(prospect)}>
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Ajouter un rappel</span>
                    </DropdownMenuItem>
                  )}
                  {onConvert && (
                    <DropdownMenuItem onClick={() => onConvert(prospect)}>
                      <RotateCw className="mr-2 h-4 w-4" />
                      <span>Convertir en client</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => onDelete(prospect)} className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Supprimer</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProspectList;
