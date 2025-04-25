
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGarageVehicles } from '@/hooks/garage/useGarageVehicles';
import { useGarageServicesList } from '@/components/module/submodules/garage/hooks/useGarageServicesList';
import { useGarageMechanics } from '@/hooks/garage/useGarageMechanics';
import { useGarageClients } from '@/hooks/garage/useGarageClients';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

interface MaintenanceFormProps {
  onCancel: () => void;
}

const MaintenanceForm: React.FC<MaintenanceFormProps> = ({ onCancel }) => {
  const { vehicles, loading: loadingVehicles } = useGarageVehicles();
  const { mechanics, isLoading: loadingMechanics } = useGarageMechanics();
  const { clients, isLoading: loadingClients } = useGarageClients();
  const { servicesOptions, isLoading: loadingServices } = useGarageServicesList();
  
  const [formData, setFormData] = useState({
    vehicleId: '',
    clientId: '',
    mechanicId: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    selectedServices: [] as string[],
    status: 'scheduled'
  });
  
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // If vehicle selected, auto-select the client
    if (name === 'vehicleId') {
      const selectedVehicle = vehicles.find(v => v.id === value);
      if (selectedVehicle && selectedVehicle.clientId) {
        setFormData(prev => ({ ...prev, clientId: selectedVehicle.clientId }));
      }
    }
  };
  
  const handleServicesChange = (selectedValues: string[]) => {
    setFormData(prev => ({ ...prev, selectedServices: selectedValues }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Find related data
      const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId);
      const selectedClient = clients.find(c => c.id === formData.clientId);
      const selectedMechanic = mechanics.find(m => m.id === formData.mechanicId);
      
      // Create maintenance record
      const maintenanceData = {
        vehicleId: formData.vehicleId,
        vehicleName: selectedVehicle ? `${selectedVehicle.make} ${selectedVehicle.model}` : '',
        clientId: formData.clientId,
        clientName: selectedClient ? `${selectedClient.firstName} ${selectedClient.lastName}` : '',
        mechanicId: formData.mechanicId,
        mechanicName: selectedMechanic ? `${selectedMechanic.firstName} ${selectedMechanic.lastName}` : '',
        date: formData.date,
        description: formData.description,
        services: formData.selectedServices,
        status: formData.status,
        createdAt: new Date().toISOString()
      };
      
      await addDoc(collection(db, COLLECTIONS.GARAGE.MAINTENANCE), maintenanceData);
      toast.success('Maintenance planifiée avec succès');
      onCancel();
    } catch (error) {
      console.error('Error adding maintenance:', error);
      toast.error('Erreur lors de la création de la maintenance');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vehicleId">Véhicule</Label>
          <Select 
            value={formData.vehicleId} 
            onValueChange={value => handleSelectChange('vehicleId', value)}
          >
            <SelectTrigger id="vehicleId">
              <SelectValue placeholder="Sélectionnez un véhicule" />
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
            onValueChange={value => handleSelectChange('clientId', value)}
            disabled={loadingClients}
          >
            <SelectTrigger id="clientId">
              <SelectValue placeholder="Sélectionnez un client" />
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
            onValueChange={value => handleSelectChange('mechanicId', value)}
            disabled={loadingMechanics}
          >
            <SelectTrigger id="mechanicId">
              <SelectValue placeholder="Sélectionnez un mécanicien" />
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
          <Input
            id="date"
            name="date"
            type="date"
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
          rows={3}
        />
      </div>
      
      <div className="space-y-6 pt-4">
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel} type="button">
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default MaintenanceForm;
