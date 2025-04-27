import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGarageData } from '@/hooks/garage/useGarageData';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';

interface MaintenanceFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

const MaintenanceForm = ({ onSubmit, onCancel, initialData }: MaintenanceFormProps) => {
  const { vehicles, clients, mechanics, services } = useGarageData();
  
  const [formData, setFormData] = useState({
    vehicleId: '',
    clientId: '',
    mechanicId: '',
    date: '',
    services: [] as Array<{ serviceId: string; quantity: number; cost: number }>,
    totalCost: 0,
    notes: ''
  });

  // Initialize form with initial data if provided
  useEffect(() => {
    if (initialData) {
      setFormData({
        vehicleId: initialData.vehicleId || '',
        clientId: initialData.clientId || '',
        mechanicId: initialData.mechanicId || '',
        date: initialData.date || '',
        services: initialData.services || [],
        totalCost: initialData.totalCost || 0,
        notes: initialData.notes || ''
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, date: date.toISOString() }));
    }
  };

  const handleServiceChange = (serviceId: string, quantity: number) => {
    const service = services.find(s => s.id === serviceId);
    if (!service) return;

    const cost = service.cost * quantity;
    
    // Check if service already exists in the array
    const serviceIndex = formData.services.findIndex(s => s.serviceId === serviceId);
    
    let updatedServices;
    if (serviceIndex >= 0) {
      // Update existing service
      updatedServices = [...formData.services];
      updatedServices[serviceIndex] = { serviceId, quantity, cost };
    } else {
      // Add new service
      updatedServices = [...formData.services, { serviceId, quantity, cost }];
    }
    
    // Calculate total cost
    const totalCost = updatedServices.reduce((sum, s) => sum + s.cost, 0);
    
    setFormData(prev => ({
      ...prev,
      services: updatedServices,
      totalCost
    }));
  };

  const removeService = (serviceId: string) => {
    const updatedServices = formData.services.filter(s => s.serviceId !== serviceId);
    const totalCost = updatedServices.reduce((sum, s) => sum + s.cost, 0);
    
    setFormData(prev => ({
      ...prev,
      services: updatedServices,
      totalCost
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vehicleId">Véhicule</Label>
          <Select 
            value={formData.vehicleId} 
            onValueChange={(value) => handleSelectChange('vehicleId', value)}
          >
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
        
        <div className="space-y-2">
          <Label htmlFor="clientId">Client</Label>
          <Select 
            value={formData.clientId} 
            onValueChange={(value) => handleSelectChange('clientId', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map(client => (
                <SelectItem key={client.id} value={client.id}>
                  {client.firstName} {client.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="mechanicId">Mécanicien</Label>
          <Select 
            value={formData.mechanicId} 
            onValueChange={(value) => handleSelectChange('mechanicId', value)}
          >
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
        
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <DatePicker 
            date={formData.date ? new Date(formData.date) : undefined}
            onSelect={handleDateChange}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Services</Label>
        <div className="border rounded-md p-4 space-y-4">
          {formData.services.map((service, index) => {
            const serviceDetails = services.find(s => s.id === service.serviceId);
            return (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-grow">{serviceDetails?.name}</div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="1"
                    value={service.quantity}
                    onChange={(e) => handleServiceChange(service.serviceId, parseInt(e.target.value) || 1)}
                    className="w-20"
                  />
                  <div className="w-24 text-right">{service.cost}€</div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeService(service.serviceId)}
                  >
                    X
                  </Button>
                </div>
              </div>
            );
          })}
          
          <div className="flex gap-4">
            <Select onValueChange={(value) => handleServiceChange(value, 1)}>
              <SelectTrigger>
                <SelectValue placeholder="Ajouter un service" />
              </SelectTrigger>
              <SelectContent>
                {services.map(service => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name} - {service.cost}€
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end font-bold">
            Total: {formData.totalCost}€
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
        />
      </div>
      
      <div className="flex justify-end gap-2 mt-4">
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
