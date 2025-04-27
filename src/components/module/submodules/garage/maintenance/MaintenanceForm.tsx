
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ServicesSelector from './ServicesSelector';
import { useGarageData } from '@/hooks/garage/useGarageData';
import { Maintenance } from './types';

interface MaintenanceFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  defaultValues?: Maintenance;
}

const MaintenanceForm: React.FC<MaintenanceFormProps> = ({ onSubmit, onCancel, defaultValues }) => {
  const { clients, vehicles, mechanics, services } = useGarageData();
  
  const [formData, setFormData] = useState({
    date: defaultValues?.date || new Date().toISOString().split('T')[0],
    clientId: defaultValues?.clientId || '',
    vehicleId: defaultValues?.vehicleId || '',
    mechanicId: defaultValues?.mechanicId || '',
    status: defaultValues?.status || 'scheduled',
    services: defaultValues?.services || [],
    totalCost: defaultValues?.totalCost || 0,
    notes: defaultValues?.notes || '',
  });

  // Recalculate total cost when services change
  useEffect(() => {
    const total = formData.services.reduce((sum, service) => sum + (service.quantity * service.cost), 0);
    setFormData(prev => ({ ...prev, totalCost: total }));
  }, [formData.services]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServicesChange = (services: Array<{ serviceId: string; quantity: number; cost: number }>) => {
    setFormData(prev => ({ ...prev, services }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">Date</Label>
          <Input 
            id="date" 
            name="date" 
            type="date" 
            value={formData.date} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div>
          <Label htmlFor="clientId">Client</Label>
          <Select name="clientId" value={formData.clientId} onValueChange={(value) => handleSelectChange('clientId', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.firstName} {client.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="vehicleId">Véhicule</Label>
          <Select name="vehicleId" value={formData.vehicleId} onValueChange={(value) => handleSelectChange('vehicleId', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un véhicule" />
            </SelectTrigger>
            <SelectContent>
              {vehicles.map((vehicle) => (
                <SelectItem key={vehicle.id} value={vehicle.id}>
                  {vehicle.make} {vehicle.model} ({vehicle.licensePlate})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="mechanicId">Mécanicien</Label>
          <Select name="mechanicId" value={formData.mechanicId} onValueChange={(value) => handleSelectChange('mechanicId', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un mécanicien" />
            </SelectTrigger>
            <SelectContent>
              {mechanics.map((mechanic) => (
                <SelectItem key={mechanic.id} value={mechanic.id}>
                  {mechanic.firstName} {mechanic.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="status">Statut</Label>
          <Select name="status" value={formData.status} onValueChange={(value) => handleSelectChange('status', value as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="scheduled">Planifiée</SelectItem>
              <SelectItem value="in_progress">En cours</SelectItem>
              <SelectItem value="completed">Terminée</SelectItem>
              <SelectItem value="cancelled">Annulée</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-2">
          <Label htmlFor="services">Services</Label>
          <ServicesSelector 
            availableServices={services}
            selectedServices={formData.services}
            onChange={handleServicesChange}
          />
        </div>

        <div className="col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea 
            id="notes" 
            name="notes" 
            value={formData.notes} 
            onChange={handleChange} 
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="totalCost">Coût total</Label>
          <Input 
            id="totalCost" 
            name="totalCost" 
            type="number" 
            value={formData.totalCost} 
            onChange={handleChange}
            disabled
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          Enregistrer
        </Button>
      </div>
    </form>
  );
};

export default MaintenanceForm;
