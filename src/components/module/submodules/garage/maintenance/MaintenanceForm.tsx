
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ServicesSelector from './ServicesSelector';
import { useGarageData } from '@/hooks/garage/useGarageData';
import { format } from 'date-fns';

interface MaintenanceFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

const MaintenanceForm = ({ onSubmit, onCancel, initialData }: MaintenanceFormProps) => {
  const [formData, setFormData] = useState({
    vehicleId: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    status: 'pending',
    totalCost: 0,
    services: [],
    notes: '',
  });

  // Load initial data if provided
  useEffect(() => {
    if (initialData) {
      const dateValue = initialData.date
        ? typeof initialData.date === 'string'
            ? initialData.date.substring(0, 10) // Extract YYYY-MM-DD from ISO string
            : format(new Date(initialData.date), 'yyyy-MM-dd')
        : format(new Date(), 'yyyy-MM-dd');

      setFormData({
        vehicleId: initialData.vehicleId || '',
        description: initialData.description || '',
        date: dateValue,
        status: initialData.status || 'pending',
        totalCost: initialData.totalCost || 0,
        services: Array.isArray(initialData.services) ? [...initialData.services] : [],
        notes: initialData.notes || '',
      });
    }
  }, [initialData]);

  const { vehicles = [], isLoading } = useGarageData();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServicesChange = (services: any[]) => {
    setFormData(prev => ({ ...prev, services }));
  };

  const handleCostChange = (totalCost: number) => {
    setFormData(prev => ({ ...prev, totalCost }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (isLoading) {
    return <div className="text-center py-8">Chargement des données...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              {vehicles.map((vehicle: any) => (
                <SelectItem key={vehicle.id} value={vehicle.id}>
                  {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description des travaux de maintenance"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Statut</Label>
        <Select 
          value={formData.status} 
          onValueChange={(value) => handleSelectChange('status', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="in_progress">En cours</SelectItem>
            <SelectItem value="completed">Terminée</SelectItem>
            <SelectItem value="cancelled">Annulée</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ServicesSelector 
        services={formData.services}
        onChange={handleServicesChange}
        onCostChange={handleCostChange}
      />

      <div className="space-y-2">
        <Label htmlFor="notes">Notes additionnelles</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Notes additionnelles"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-lg font-medium">
          Coût total: {formData.totalCost}€
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          {initialData ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
  );
};

export default MaintenanceForm;
