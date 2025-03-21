
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, Edit, Trash2, Eye } from "lucide-react";
import { Location } from '../types/rental-types';
import DeleteLocationDialog from './DeleteLocationDialog';
import LocationDetailsDialog from './LocationDetailsDialog';

interface LocationsListProps {
  locations: Location[];
  onEdit: (location: Location) => void;
  onDelete: (id: string) => void;
}

const LocationsList: React.FC<LocationsListProps> = ({ locations, onEdit, onDelete }) => {
  const [openDetails, setOpenDetails] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const handleViewDetails = (location: Location) => {
    setSelectedLocation(location);
    setOpenDetails(true);
  };

  const handleEdit = (location: Location) => {
    onEdit(location);
  };

  const handleDelete = (location: Location) => {
    setSelectedLocation(location);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedLocation) {
      onDelete(selectedLocation.id);
      setOpenDeleteDialog(false);
    }
  };

  if (locations.length === 0) {
    return (
      <Card className="border border-dashed p-8 text-center">
        <div className="flex flex-col items-center gap-2">
          <MapPin className="h-8 w-8 text-gray-400" />
          <h3 className="text-lg font-medium">Aucun emplacement trouvé</h3>
          <p className="text-sm text-gray-500">
            Ajoutez votre premier emplacement pour commencer à gérer votre flotte.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {locations.map((location) => (
        <Card key={location.id} className="overflow-hidden">
          <CardContent className="p-5">
            <div className="flex flex-col h-full">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-medium truncate">{location.name}</h3>
                <Badge variant={location.isActive ? "default" : "secondary"}>
                  {location.isActive ? "Actif" : "Inactif"}
                </Badge>
              </div>
              
              <div className="mt-4 space-y-2 flex-grow">
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
                    <span className="text-sm truncate">{location.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500 shrink-0" />
                  <span className="text-sm">Ouvert aujourd'hui: {getOpeningHoursForToday(location)}</span>
                </div>
              </div>
              
              <div className="flex gap-2 mt-6 justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleViewDetails(location)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Détails
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEdit(location)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Modifier
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-destructive hover:text-destructive" 
                  onClick={() => handleDelete(location)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Supprimer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {selectedLocation && (
        <>
          <LocationDetailsDialog
            location={selectedLocation}
            open={openDetails}
            onOpenChange={setOpenDetails}
          />
          
          <DeleteLocationDialog
            open={openDeleteDialog}
            onOpenChange={setOpenDeleteDialog}
            onConfirm={confirmDelete}
            location={selectedLocation}
          />
        </>
      )}
    </div>
  );
};

// Helper function to get today's opening hours
const getOpeningHoursForToday = (location: Location) => {
  if (!location.openingHours) return "Non spécifié";
  
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const today = days[new Date().getDay()];
  
  return location.openingHours[today as keyof typeof location.openingHours] || "Fermé";
};

export default LocationsList;
