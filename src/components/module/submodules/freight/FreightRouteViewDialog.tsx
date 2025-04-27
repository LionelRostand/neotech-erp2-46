
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Route } from "@/types/freight/route-types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  route: Route | null;
};

const transportTypeLUT = {
  road: "Route",
  sea: "Mer",
  air: "Air",
  rail: "Rail",
  multimodal: "Multimodal",
};

const FreightRouteViewDialog: React.FC<Props> = ({ open, onOpenChange, route }) => {
  if (!route) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Détail de la route</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <p><b>Nom :</b> {route.name}</p>
          <p><b>Origine :</b> {route.origin}</p>
          <p><b>Destination :</b> {route.destination}</p>
          <p><b>Distance :</b> {route.distance} km</p>
          <p><b>Temps estimé :</b> {route.estimatedTime} h</p>
          <p><b>Type :</b> {transportTypeLUT[route.transportType]}</p>
          <p><b>Statut :</b> <span className={route.active ? "text-green-600" : "text-gray-500"}>{route.active ? "Active" : "Inactive"}</span></p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FreightRouteViewDialog;
