
import React, { useState } from 'react';
import { MapPin, Phone, Edit, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AccessPoint } from './types';

interface AccessPointCardProps {
  accessPoint: AccessPoint;
  onEdit?: () => void;
  onDelete?: () => void;
}

const AccessPointCard: React.FC<AccessPointCardProps> = ({ 
  accessPoint, 
  onEdit, 
  onDelete 
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium">{accessPoint.name}</h3>
        <Badge variant={accessPoint.isActive ? "success" : "destructive"}>
          {accessPoint.isActive ? 'Actif' : 'Inactif'}
        </Badge>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-start">
          <MapPin className="h-4 w-4 text-muted-foreground mr-2 mt-1" />
          <span className="text-sm">{accessPoint.address}</span>
        </div>
        
        {accessPoint.contact && (
          <div className="flex items-center">
            <Phone className="h-4 w-4 text-muted-foreground mr-2" />
            <span className="text-sm">{accessPoint.contact}</span>
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center pt-2 border-t">
        <div className="flex items-center">
          {accessPoint.isActive ? (
            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
          )}
          <span className="text-xs text-muted-foreground">
            Login: {accessPoint.login}
          </span>
        </div>
        
        <div className="flex space-x-2">
          {onEdit && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onEdit}
              title="Modifier"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          
          {onDelete && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsDeleteDialogOpen(true)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              title="Supprimer"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement le point d'accès
              "{accessPoint.name}" et toutes les données associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AccessPointCard;
