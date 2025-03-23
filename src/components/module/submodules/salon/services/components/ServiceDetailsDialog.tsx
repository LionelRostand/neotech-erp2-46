
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, UserCheck } from "lucide-react";
import { SalonService } from '../../types/salon-types';

interface ServiceDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: SalonService;
}

const ServiceDetailsDialog: React.FC<ServiceDetailsDialogProps> = ({
  open,
  onOpenChange,
  service
}) => {
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`;
    }
    return `${mins}min`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Détails du service</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 my-2">
          <div>
            <h3 className="text-lg font-semibold">{service.name}</h3>
            <p className="text-sm text-muted-foreground">{service.description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Catégorie</h4>
              <Badge variant="outline" className="mt-1">{service.category}</Badge>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Prix</h4>
              <p className="mt-1 font-medium">
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(service.price)}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Durée</h4>
              <div className="flex items-center mt-1">
                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>{formatDuration(service.duration)}</span>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Statut</h4>
              <Badge variant={service.available ? "default" : "secondary"} className="mt-1">
                {service.available ? "Actif" : "Inactif"}
              </Badge>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Coiffeurs spécialisés</h4>
            <div className="flex flex-wrap gap-1 mt-2">
              {service.specialists && service.specialists.length > 0 ? (
                service.specialists.map((specialist, idx) => (
                  <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                    <UserCheck className="h-3 w-3" />
                    {specialist}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">Tous les coiffeurs</span>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceDetailsDialog;
