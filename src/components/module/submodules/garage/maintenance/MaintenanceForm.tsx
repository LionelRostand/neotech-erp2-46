
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Trash2, Plus } from "lucide-react";
import { useGarageData } from '@/hooks/garage/useGarageData';
import { format } from 'date-fns';

interface MaintenanceFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const MaintenanceForm = ({ onSubmit, onCancel }: MaintenanceFormProps) => {
  const { services, mechanics, clients, vehicles } = useGarageData();
  const [date, setDate] = useState<Date>(new Date());
  const [clientId, setClientId] = useState<string>("");
  const [vehicleId, setVehicleId] = useState<string>("");
  const [mechanicId, setMechanicId] = useState<string>("");
  const [selectedServices, setSelectedServices] = useState<Array<{serviceId: string, quantity: number, cost: number}>>([]);
  const [notes, setNotes] = useState<string>("");
  const [totalCost, setTotalCost] = useState<number>(0);

  // Calculate total cost when services change
  useEffect(() => {
    const total = selectedServices.reduce((sum, service) => sum + (service.cost * service.quantity), 0);
    setTotalCost(total);
  }, [selectedServices]);

  // Add a service row
  const addServiceRow = () => {
    setSelectedServices([...selectedServices, { serviceId: "", quantity: 1, cost: 0 }]);
  };

  // Remove a service row
  const removeServiceRow = (index: number) => {
    const updatedServices = [...selectedServices];
    updatedServices.splice(index, 1);
    setSelectedServices(updatedServices);
  };

  // Update service details
  const updateServiceRow = (index: number, field: string, value: any) => {
    const updatedServices = [...selectedServices];
    
    if (field === 'serviceId') {
      const selectedService = services.find(s => s.id === value);
      if (selectedService) {
        updatedServices[index] = {
          ...updatedServices[index],
          serviceId: value,
          cost: selectedService.cost
        };
      }
    } else {
      updatedServices[index] = { ...updatedServices[index], [field]: value };
    }
    
    setSelectedServices(updatedServices);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Format date to ISO string for database storage
    const maintenanceData = {
      vehicleId,
      clientId,
      mechanicId,
      date: date.toISOString(),
      services: selectedServices,
      totalCost,
      notes,
      status: 'scheduled'
    };

    onSubmit(maintenanceData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Client, vehicle and mechanic selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Client</label>
          <Select value={clientId} onValueChange={setClientId} required>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map(client => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name || `${client.firstName} ${client.lastName}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Véhicule</label>
          <Select value={vehicleId} onValueChange={setVehicleId} required>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un véhicule" />
            </SelectTrigger>
            <SelectContent>
              {vehicles.map(vehicle => (
                <SelectItem key={vehicle.id} value={vehicle.id}>
                  {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Mécanicien</label>
          <Select value={mechanicId} onValueChange={setMechanicId} required>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un mécanicien" />
            </SelectTrigger>
            <SelectContent>
              {mechanics.map(mechanic => (
                <SelectItem key={mechanic.id} value={mechanic.id}>
                  {mechanic.firstName} {mechanic.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Date */}
      <div>
        <label className="block text-sm font-medium mb-1">Date de maintenance</label>
        <DatePicker 
          date={date} 
          onSelect={(newDate) => newDate && setDate(newDate)}
          className="w-full" 
        />
      </div>
      
      {/* Services */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium">Services</label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={addServiceRow}
            className="text-xs"
          >
            <Plus className="h-4 w-4 mr-1" /> Ajouter un service
          </Button>
        </div>
        
        {selectedServices.length === 0 ? (
          <div className="text-center py-4 border border-dashed rounded-md border-gray-300 text-gray-500">
            Aucun service ajouté
          </div>
        ) : (
          <div className="space-y-2">
            {selectedServices.map((service, index) => (
              <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                <div className="flex-grow">
                  <Select 
                    value={service.serviceId} 
                    onValueChange={(value) => updateServiceRow(index, 'serviceId', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.name} - {s.cost}€</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-20">
                  <Input 
                    type="number" 
                    min="1" 
                    value={service.quantity} 
                    onChange={(e) => updateServiceRow(index, 'quantity', parseInt(e.target.value) || 1)}
                    placeholder="Qté"
                    required
                  />
                </div>
                <div className="w-24 text-right">
                  {(service.cost * service.quantity).toFixed(2)}€
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeServiceRow(index)} 
                  className="text-destructive hover:text-destructive/80"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Notes */}
      <div>
        <label className="block text-sm font-medium mb-1">Notes</label>
        <Textarea
          placeholder="Notes sur la maintenance..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[100px]"
        />
      </div>
      
      {/* Total Cost */}
      <div className="flex justify-end">
        <div className="text-lg font-semibold">
          Total: {totalCost.toFixed(2)}€
        </div>
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          Ajouter la maintenance
        </Button>
      </div>
    </form>
  );
};

export default MaintenanceForm;
