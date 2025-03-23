
import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { fr } from 'date-fns/locale';
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TransportVehicle, MaintenanceSchedule } from '../types/transport-types';

interface AvailabilityCalendarProps {
  vehicles: TransportVehicle[];
  maintenanceSchedules: MaintenanceSchedule[];
  onAddMaintenance: (vehicle: TransportVehicle) => void;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  vehicles,
  maintenanceSchedules,
  onAddMaintenance
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedVehicleType, setSelectedVehicleType] = useState<string | undefined>("all");
  
  // Filter vehicles by type if a type is selected
  const filteredVehicles = selectedVehicleType && selectedVehicleType !== "all"
    ? vehicles.filter(v => v.type === selectedVehicleType)
    : vehicles;
  
  // Format date to YYYY-MM-DD for comparison with maintenance schedules
  const formatDateForComparison = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  
  // Check if a vehicle is unavailable on the selected date due to maintenance
  const isInMaintenance = (vehicleId: string) => {
    if (!selectedDate) return false;
    
    const dateStr = formatDateForComparison(selectedDate);
    
    return maintenanceSchedules.some(schedule => 
      schedule.vehicleId === vehicleId &&
      dateStr >= schedule.startDate &&
      dateStr <= schedule.endDate
    );
  };
  
  // Get maintenance info for a vehicle on the selected date
  const getMaintenanceInfo = (vehicleId: string) => {
    if (!selectedDate) return null;
    
    const dateStr = formatDateForComparison(selectedDate);
    
    return maintenanceSchedules.find(schedule => 
      schedule.vehicleId === vehicleId &&
      dateStr >= schedule.startDate &&
      dateStr <= schedule.endDate
    );
  };
  
  // Get status badge based on vehicle status and maintenance
  const getStatusBadge = (vehicle: TransportVehicle) => {
    const inMaintenance = isInMaintenance(vehicle.id);
    
    if (inMaintenance) {
      return <Badge className="bg-orange-500">En maintenance</Badge>;
    }
    
    switch (vehicle.status) {
      case "active":
        return vehicle.available 
          ? <Badge className="bg-green-500">Disponible</Badge>
          : <Badge className="bg-blue-500">Réservé</Badge>;
      case "maintenance":
        return <Badge className="bg-orange-500">En maintenance</Badge>;
      case "out-of-service":
        return <Badge className="bg-red-500">Hors service</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardContent className="pt-6">
            <div className="mb-6">
              <label className="text-sm font-medium mb-2 block">Filtrer par type de véhicule</label>
              <Select
                value={selectedVehicleType ?? "all"}
                onValueChange={setSelectedVehicleType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="sedan">Berline</SelectItem>
                  <SelectItem value="suv">SUV</SelectItem>
                  <SelectItem value="van">Van</SelectItem>
                  <SelectItem value="luxury">Luxe</SelectItem>
                  <SelectItem value="bus">Bus</SelectItem>
                  <SelectItem value="minibus">Minibus</SelectItem>
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
            {filteredVehicles.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                Aucun véhicule trouvé
              </div>
            ) : (
              filteredVehicles.map((vehicle) => {
                const maintenanceInfo = getMaintenanceInfo(vehicle.id);
                
                return (
                  <div key={vehicle.id} className="p-4 flex justify-between items-center">
                    <div>
                      <div className="font-medium">{vehicle.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)} • 
                        {vehicle.capacity} places • {vehicle.licensePlate}
                      </div>
                      {maintenanceInfo && (
                        <div className="text-sm text-orange-600 mt-1">
                          {maintenanceInfo.description}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 items-center">
                      {getStatusBadge(vehicle)}
                      {vehicle.status === "active" && vehicle.available && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onAddMaintenance(vehicle)}
                        >
                          Planifier maintenance
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
