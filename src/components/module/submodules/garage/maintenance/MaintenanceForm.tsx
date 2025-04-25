
import React, { useState } from 'react';
import { useGarageClients } from '@/hooks/garage/useGarageClients';
import { useGarageVehicles } from '@/hooks/garage/useGarageVehicles';
import { useGarageMechanics } from '@/hooks/garage/useGarageMechanics';
import { useGarageData } from '@/hooks/garage/useGarageData';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MaintenanceFormProps {
  onCancel: () => void;
}

const MaintenanceForm = ({ onCancel }: MaintenanceFormProps) => {
  const { clients } = useGarageClients();
  const { vehicles } = useGarageVehicles();
  const { mechanics } = useGarageMechanics();
  const { services } = useGarageData();

  const [formData, setFormData] = useState({
    clientId: '',
    vehicleId: '',
    mechanicId: '',
    status: 'pending',
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    selectedServices: [] as { serviceId: string; quantity: number }[],
    estimatedCost: 0,
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Client</label>
          <Select onValueChange={(value) => setFormData({ ...formData, clientId: value })}>
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

        <div className="space-y-2">
          <label className="text-sm font-medium">Véhicule</label>
          <Select onValueChange={(value) => setFormData({ ...formData, vehicleId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un véhicule" />
            </SelectTrigger>
            <SelectContent>
              {vehicles.map((vehicle) => (
                <SelectItem key={vehicle.id} value={vehicle.id}>
                  {vehicle.brand} {vehicle.model} - {vehicle.licensePlate}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Mécanicien</label>
          <Select onValueChange={(value) => setFormData({ ...formData, mechanicId: value })}>
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

        <div className="space-y-2">
          <label className="text-sm font-medium">Statut</label>
          <Select 
            defaultValue="pending"
            onValueChange={(value) => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">En attente d'approbation</SelectItem>
              <SelectItem value="approved">Approuvé</SelectItem>
              <SelectItem value="in_progress">En cours</SelectItem>
              <SelectItem value="completed">Terminé</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Date de début</label>
          <DatePicker
            date={formData.startDate}
            onSelect={(date) => setFormData({ ...formData, startDate: date })}
            placeholder="Sélectionner une date"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Date de fin estimée</label>
          <DatePicker
            date={formData.endDate}
            onSelect={(date) => setFormData({ ...formData, endDate: date })}
            placeholder="Sélectionner une date"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Services</label>
        <Select onValueChange={(value) => console.log('Service selected:', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un service" />
          </SelectTrigger>
          <SelectContent>
            {services.map((service) => (
              <SelectItem key={service.id} value={service.id}>
                {service.name} - {service.cost}€
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Coût estimé</label>
        <Input
          type="number"
          value={formData.estimatedCost}
          onChange={(e) => setFormData({ ...formData, estimatedCost: Number(e.target.value) })}
          placeholder="0"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Détails de la maintenance..."
          rows={4}
        />
      </div>

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
