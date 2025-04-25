
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
  // Format the creation date if it exists
  const formattedDate = service.createdAt ? 
    format(new Date(service.createdAt), 'PPP', { locale: fr }) : 
    'Date inconnue';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Détails du service</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <h3 className="text-lg font-semibold">{service.name}</h3>
            
            <div className="flex items-center mt-2">
              <Badge 
                variant={service.status === 'active' ? 'default' : 'secondary'}
                className={service.status === 'active' ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'}
              >
                {service.status === 'active' ? 'Actif' : 'Inactif'}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-sm text-gray-500">Coût</p>
              <p className="text-lg font-medium">{service.cost}€</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Durée</p>
              <p className="text-lg font-medium">{service.duration} minutes</p>
            </div>
          </div>

          {service.description && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">Description</p>
              <p className="mt-1">{service.description}</p>
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
