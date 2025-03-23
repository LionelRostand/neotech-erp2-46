
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, AlertCircle, Sparkles } from "lucide-react";

interface SpecialOffer {
  id: string;
  name: string;
  description: string;
  discount: number;
  validUntil: string;
  conditions: string;
  isActive: boolean;
}

interface OfferDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offer: SpecialOffer;
}

const OfferDetailsDialog: React.FC<OfferDetailsDialogProps> = ({
  open,
  onOpenChange,
  offer
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            Détails de l'offre
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              {offer.name}
              <Badge variant={offer.isActive ? "default" : "outline"}>
                {offer.isActive ? "Active" : "Inactive"}
              </Badge>
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{offer.description}</p>
          </div>
          
          {offer.discount > 0 && (
            <div className="p-3 bg-green-50 rounded-md border border-green-100">
              <h4 className="font-medium text-green-800">Remise appliquée</h4>
              <p className="text-xl font-bold text-green-700 mt-1">-{offer.discount}%</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Période de validité
              </h4>
              <p className="mt-1">
                Jusqu'au {new Date(offer.validUntil).toLocaleDateString('fr-FR')}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                Conditions d'utilisation
              </h4>
              <p className="mt-1 text-sm bg-gray-50 p-3 rounded-md border">{offer.conditions}</p>
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

export default OfferDetailsDialog;
