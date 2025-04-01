
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { TransportVehicle, VehicleMaintenanceSchedule } from '../types';
import { usePlanning } from './context/PlanningContext';

// Define the type for form data
interface MaintenanceFormData {
  type: "regular" | "repair" | "inspection";
  description: string;
  vehicleId: string;
  notes: any[]; // Changed to any[] to match expected type
  startDate: Date;
  endDate: Date;
  technician: string;
}

const MaintenanceScheduleDialog: React.FC = () => {
  const {
    vehicles,
    selectedVehicle,
    selectedMaintenanceSchedule,
    showMaintenanceScheduleDialog,
    setShowMaintenanceScheduleDialog
  } = usePlanning();

  // Initialize form state
  const [formData, setFormData] = useState<MaintenanceFormData>({
    type: "regular",
    description: "",
    vehicleId: selectedVehicle?.id || "",
    notes: [], // Initialize as empty array
    startDate: new Date(),
    endDate: new Date(),
    technician: ""
  });

  // Handle form changes
  const handleChange = (field: keyof MaintenanceFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you'd submit this to your backend
    console.log("Form data submitted:", formData);
    
    // Reset form and close dialog
    setShowMaintenanceScheduleDialog(false);
  };

  // Populate form with data when editing
  React.useEffect(() => {
    if (selectedMaintenanceSchedule) {
      // Convert to our form data structure
      setFormData({
        type: selectedMaintenanceSchedule.type as "regular" | "repair" | "inspection",
        description: selectedMaintenanceSchedule.description,
        vehicleId: selectedMaintenanceSchedule.vehicleId,
        notes: [], // Initialize as empty array
        startDate: new Date(selectedMaintenanceSchedule.startDate || selectedMaintenanceSchedule.scheduledDate),
        endDate: new Date(selectedMaintenanceSchedule.endDate || selectedMaintenanceSchedule.scheduledDate),
        technician: selectedMaintenanceSchedule.technicianAssigned || ""
      });
    } else if (selectedVehicle) {
      // New maintenance for selected vehicle
      setFormData(prev => ({
        ...prev,
        vehicleId: selectedVehicle.id
      }));
    }
  }, [selectedMaintenanceSchedule, selectedVehicle]);

  const dialogTitle = selectedMaintenanceSchedule 
    ? "Modifier la maintenance" 
    : "Programmer une maintenance";

  return (
    <Dialog open={showMaintenanceScheduleDialog} onOpenChange={setShowMaintenanceScheduleDialog}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicle">Véhicule</Label>
              <Select 
                value={formData.vehicleId} 
                onValueChange={(value) => handleChange("vehicleId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un véhicule" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.name} ({vehicle.licensePlate})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Type de maintenance</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => handleChange("type", value as "regular" | "repair" | "inspection")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Régulière</SelectItem>
                  <SelectItem value="repair">Réparation</SelectItem>
                  <SelectItem value="inspection">Inspection</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Détails de la maintenance"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date de début</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(formData.startDate, "PPP", { locale: fr })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => handleChange("startDate", date || new Date())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>Date de fin</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(formData.endDate, "PPP", { locale: fr })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => handleChange("endDate", date || new Date())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="technician">Technicien assigné</Label>
            <Input
              id="technician"
              value={formData.technician}
              onChange={(e) => handleChange("technician", e.target.value)}
              placeholder="Nom du technicien"
            />
          </div>
          
          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowMaintenanceScheduleDialog(false)}
            >
              Annuler
            </Button>
            <Button type="submit">
              {selectedMaintenanceSchedule ? "Mettre à jour" : "Programmer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MaintenanceScheduleDialog;
