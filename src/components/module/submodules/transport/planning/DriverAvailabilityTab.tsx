
import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { fr } from 'date-fns/locale';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TransportDriver } from '../types/transport-types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, User, Clock, PenLine } from "lucide-react";
import DriverNoteDialog from '../drivers/DriverNoteDialog';

interface DriverAvailabilityTabProps {
  drivers: TransportDriver[];
}

const DriverAvailabilityTab: React.FC<DriverAvailabilityTabProps> = ({
  drivers
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedDriverType, setSelectedDriverType] = useState<string | undefined>("all");
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<TransportDriver | null>(null);
  
  // Filter drivers by type if a type is selected
  const filteredDrivers = selectedDriverType && selectedDriverType !== "all"
    ? drivers.filter(d => d.skills?.includes(selectedDriverType))
    : drivers;
  
  // Get status badge based on driver availability
  const getStatusBadge = (driver: TransportDriver) => {
    if (!driver.available) {
      return <Badge className="bg-red-500">Indisponible</Badge>;
    }
    
    if (driver.onLeave) {
      return <Badge className="bg-orange-500">En congé</Badge>;
    }
    
    return <Badge className="bg-green-500">Disponible</Badge>;
  };
  
  const handleAddNote = (driver: TransportDriver) => {
    setSelectedDriver(driver);
    setNoteDialogOpen(true);
  };
  
  const handleSaveNote = (data: { title: string; note: string }) => {
    console.log("Note added:", data, "for driver:", selectedDriver?.id);
    // In a real app, you would save this note to the database
    setNoteDialogOpen(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardContent className="pt-6">
            <div className="mb-6">
              <label className="text-sm font-medium mb-2 block">Filtrer par compétence</label>
              <Select
                value={selectedDriverType ?? "all"}
                onValueChange={setSelectedDriverType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les compétences" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les compétences</SelectItem>
                  <SelectItem value="luxury">VIP/Luxe</SelectItem>
                  <SelectItem value="airport">Aéroport</SelectItem>
                  <SelectItem value="events">Événements</SelectItem>
                  <SelectItem value="long-distance">Longue distance</SelectItem>
                  <SelectItem value="night">Service de nuit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={fr}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      </div>
      
      <div className="md:col-span-2">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              {selectedDate ? (
                `Disponibilités pour le ${selectedDate.toLocaleDateString('fr-FR', { dateStyle: 'long' })}`
              ) : (
                "Sélectionnez une date"
              )}
            </h3>
          </div>
          
          <div className="border rounded-md divide-y">
            {filteredDrivers.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                Aucun chauffeur trouvé
              </div>
            ) : (
              filteredDrivers.map((driver) => (
                <div key={driver.id} className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <div className="font-medium">{driver.firstName} {driver.lastName}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{driver.experience} ans d'expérience</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    {getStatusBadge(driver)}
                    {driver.available && !driver.onLeave && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAddNote(driver)}
                        className="flex items-center gap-1"
                      >
                        <PenLine size={14} />
                        <span>Ajouter note</span>
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      <DriverNoteDialog
        open={noteDialogOpen}
        onOpenChange={setNoteDialogOpen}
        driver={selectedDriver}
        onSave={handleSaveNote}
      />
    </div>
  );
};

export default DriverAvailabilityTab;
