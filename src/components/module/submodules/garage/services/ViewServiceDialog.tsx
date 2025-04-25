
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Service {
  id: string;
  name: string;
  description: string;
  cost: number;
  duration: number;
  status: string;
  createdAt: string;
}

interface ViewServiceDialogProps {
  service: Service;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewServiceDialog({ service, open, onOpenChange }: ViewServiceDialogProps) {
  // Ensure we have a valid service object
  const safeService = service || {
    id: '',
    name: '',
    description: '',
    cost: 0,
    duration: 0,
    status: '',
    createdAt: ''
  };
  
  // Format the creation date if it exists
  let formattedDate = 'Date inconnue';
  if (safeService.createdAt) { 
    try {
      formattedDate = format(new Date(safeService.createdAt), 'PPP', { locale: fr });
    } catch (error) {
      console.error("Error formatting date:", error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Détails du service</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <h3 className="text-lg font-semibold">{safeService.name}</h3>
            
            <div className="flex items-center mt-2">
              <Badge 
                variant={safeService.status === 'active' ? 'default' : 'secondary'}
                className={safeService.status === 'active' ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'}
              >
                {safeService.status === 'active' ? 'Actif' : 'Inactif'}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-sm text-gray-500">Coût</p>
              <p className="text-lg font-medium">{safeService.cost}€</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Durée</p>
              <p className="text-lg font-medium">{safeService.duration} minutes</p>
            </div>
          </div>

          {safeService.description && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">Description</p>
              <p className="mt-1">{safeService.description}</p>
            </div>
          )}

          <div className="mt-4">
            <p className="text-sm text-gray-500">Créé le</p>
            <p>{formattedDate}</p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
