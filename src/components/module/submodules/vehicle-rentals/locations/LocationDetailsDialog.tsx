
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
import { Location } from '../types/rental-types';
import { MapPin, Phone, Mail, Clock, Calendar } from "lucide-react";
import { formatDate } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface LocationDetailsDialogProps {
  location: Location;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LocationDetailsDialog: React.FC<LocationDetailsDialogProps> = ({
  location,
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{location.name}</span>
            <Badge variant={location.isActive ? "default" : "secondary"}>
              {location.isActive ? "Actif" : "Inactif"}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="space-y-3">
            <h3 className="font-medium">Informations générales</h3>
            
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-1 text-gray-500 shrink-0" />
              <span className="text-sm">{location.address}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500 shrink-0" />
              <span className="text-sm">{location.phone}</span>
            </div>
            
            {location.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500 shrink-0" />
                <span className="text-sm">{location.email}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500 shrink-0" />
              <span className="text-sm">
                Créé le: {formatDate(new Date(location.createdAt))}
              </span>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-3">Horaires d'ouverture</h3>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Jour</TableHead>
                  <TableHead>Heures</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {location.openingHours && Object.entries(location.openingHours).map(([day, hours]) => (
                  <TableRow key={day}>
                    <TableCell>
                      {day === 'monday' && 'Lundi'}
                      {day === 'tuesday' && 'Mardi'}
                      {day === 'wednesday' && 'Mercredi'}
                      {day === 'thursday' && 'Jeudi'}
                      {day === 'friday' && 'Vendredi'}
                      {day === 'saturday' && 'Samedi'}
                      {day === 'sunday' && 'Dimanche'}
                    </TableCell>
                    <TableCell>{hours}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        
        {location.coordinates && (
          <div className="mt-4 border rounded-md p-4">
            <h3 className="font-medium mb-2">Coordonnées</h3>
            <div className="text-sm">
              <p>Latitude: {location.coordinates.latitude}</p>
              <p>Longitude: {location.coordinates.longitude}</p>
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LocationDetailsDialog;
