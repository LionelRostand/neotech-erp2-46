import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { fr } from "date-fns/locale";
import { TransportVehicle } from '../types/vehicle-types';
import { MaintenanceSchedule } from '../types/vehicle-types';
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AvailabilityCalendarProps {
  vehicles: TransportVehicle[];
  maintenanceSchedules: MaintenanceSchedule[];
  onAddMaintenance: (vehicle: TransportVehicle | null) => void;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  vehicles,
  maintenanceSchedules,
  onAddMaintenance
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("all");

  const filteredVehicles = selectedVehicleId === "all" 
    ? vehicles 
    : vehicles.filter(v => v.id === selectedVehicleId);

  const getMaintenanceByDate = (date: Date) => {
    if (!date) return [];
    
    const dateStr = date.toISOString().split('T')[0];
    
    return maintenanceSchedules.filter(schedule => {
      const start = new Date(schedule.startDate);
      const end = new Date(schedule.endDate);
      const current = new Date(dateStr);
      
      // Check if the current date is between start and end dates (inclusive)
      return current >= start && current <= end;
    });
  };

  const maintenancesOnSelectedDate = selectedDate 
    ? getMaintenanceByDate(selectedDate)
    : [];

  const getMaintenancesByVehicle = () => {
    if (!selectedDate) return {};

    const result: Record<string, MaintenanceSchedule[]> = {};
    
    filteredVehicles.forEach(vehicle => {
      const vehicleMaintenance = maintenancesOnSelectedDate.filter(
        m => m.vehicleId === vehicle.id
      );
      if (vehicleMaintenance.length > 0) {
        result[vehicle.id] = vehicleMaintenance;
      }
    });
    
    return result;
  };

  const maintenancesByVehicle = getMaintenancesByVehicle();

  const getVehicleName = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? vehicle.name : "Véhicule inconnu";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Calendrier de disponibilité</h3>
          <p className="text-sm text-muted-foreground">
            Consultez les maintenances prévues et planifiez de nouvelles périodes d'indisponibilité
          </p>
          
          <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un véhicule" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les véhicules</SelectItem>
              {vehicles.map((vehicle) => (
                <SelectItem key={vehicle.id} value={vehicle.id}>
                  {vehicle.name} ({vehicle.licensePlate})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            onClick={() => onAddMaintenance(null)}
            className="w-full flex items-center gap-2 mt-2"
          >
            <CalendarIcon size={16} />
            <span>Planifier maintenance</span>
          </Button>
        </div>
        
        <div className="border rounded-md p-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            locale={fr}
            className="w-full"
          />
        </div>
      </div>
      
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-lg font-medium">
          Maintenances pour le {selectedDate?.toLocaleDateString('fr-FR', { dateStyle: 'long' })}
        </h3>
        
        {Object.keys(maintenancesByVehicle).length === 0 ? (
          <div className="text-center py-8 border rounded-md">
            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h4 className="text-lg font-medium mb-2">Aucune maintenance prévue</h4>
            <p className="text-sm text-gray-500 mx-auto max-w-md">
              Il n'y a pas de maintenance prévue pour cette date. Vous pouvez planifier une nouvelle maintenance en utilisant le bouton ci-dessus.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(maintenancesByVehicle).map(([vehicleId, schedules]) => (
              <Card key={vehicleId}>
                <CardContent className="pt-6">
                  <h4 className="text-lg font-medium mb-2">
                    {getVehicleName(vehicleId)}
                  </h4>
                  {schedules.map((schedule) => (
                    <div 
                      key={schedule.id}
                      className="border-l-4 border-blue-500 pl-4 py-2 mb-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{schedule.type === 'regular' ? 'Entretien régulier' : schedule.type === 'repair' ? 'Réparation' : 'Inspection'}</p>
                          <p className="text-sm text-muted-foreground">{schedule.description}</p>
                          <p className="text-xs mt-1">
                            {new Date(schedule.startDate).toLocaleDateString('fr-FR')} - {new Date(schedule.endDate).toLocaleDateString('fr-FR')}
                          </p>
                          {schedule.technician && (
                            <p className="text-xs">Technicien: {schedule.technician}</p>
                          )}
                        </div>
                        <div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              const vehicle = vehicles.find(v => v.id === vehicleId);
                              if (vehicle) {
                                onAddMaintenance(vehicle);
                              }
                            }}
                          >
                            Modifier
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
