
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useGarageData } from '@/hooks/garage/useGarageData';
import { useGarageMechanics } from '@/hooks/garage/useGarageMechanics';
import { format } from 'date-fns';
import { Repair } from '@/components/module/submodules/garage/types/garage-types';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';

interface AddRepairDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRepairAdded: () => void;
}

const AddRepairDialog: React.FC<AddRepairDialogProps> = ({
  open,
  onOpenChange,
  onRepairAdded
}) => {
  const { clients = [], vehicles = [] } = useGarageData();
  const { mechanics = [] } = useGarageMechanics();
  
  const [clientId, setClientId] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [mechanicId, setMechanicId] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = new Date();
  const formattedDate = format(today, 'yyyy-MM-dd');
  
  // Filtrer les véhicules par client sélectionné
  const filteredVehicles = clientId 
    ? vehicles.filter(vehicle => vehicle.clientId === clientId) 
    : vehicles;
  
  const selectedClient = clients.find(c => c.id === clientId);
  const selectedVehicle = vehicles.find(v => v.id === vehicleId);
  const selectedMechanic = mechanics.find(m => m.id === mechanicId);

  const resetForm = () => {
    setClientId('');
    setVehicleId('');
    setMechanicId('');
    setDescription('');
    setEstimatedCost('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientId || !vehicleId || !mechanicId || !description || !estimatedCost) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newRepair: Omit<Repair, 'id'> = {
        clientId,
        clientName: selectedClient?.name || 'Client inconnu',
        vehicleId,
        vehicleName: selectedVehicle?.make && selectedVehicle?.model 
          ? `${selectedVehicle.make} ${selectedVehicle.model}` 
          : 'Véhicule inconnu',
        mechanicId,
        mechanicName: selectedMechanic 
          ? `${selectedMechanic.firstName} ${selectedMechanic.lastName}` 
          : 'Mécanicien inconnu',
        description,
        estimatedCost: parseFloat(estimatedCost),
        status: 'pending',
        progress: 0,
        startDate: formattedDate,
        date: formattedDate,
        licensePlate: selectedVehicle?.licensePlate || 'N/A',
        vehicleInfo: selectedVehicle?.make && selectedVehicle?.model 
          ? `${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.year || 'N/A'})` 
          : 'Détails non disponibles'
      };
      
      const repairsCollectionRef = collection(db, COLLECTIONS.GARAGE.REPAIRS);
      await addDoc(repairsCollectionRef, newRepair);
      
      toast.success("Réparation ajoutée avec succès");
      resetForm();
      onOpenChange(false);
      onRepairAdded();
    } catch (error) {
      console.error("Erreur lors de l'ajout de la réparation:", error);
      toast.error("Erreur lors de l'ajout de la réparation");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Ajouter une réparation</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger id="client">
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vehicle">Véhicule</Label>
              <Select value={vehicleId} onValueChange={setVehicleId} disabled={!clientId}>
                <SelectTrigger id="vehicle">
                  <SelectValue placeholder={clientId ? "Sélectionner un véhicule" : "Sélectionnez d'abord un client"} />
                </SelectTrigger>
                <SelectContent>
                  {filteredVehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mechanic">Mécanicien</Label>
              <Select value={mechanicId} onValueChange={setMechanicId}>
                <SelectTrigger id="mechanic">
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
              <Label htmlFor="cost">Coût estimé (€)</Label>
              <Input 
                id="cost" 
                type="number" 
                value={estimatedCost} 
                onChange={(e) => setEstimatedCost(e.target.value)}
                placeholder="Coût estimé"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description de la réparation</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez la réparation nécessaire"
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Ajout en cours..." : "Ajouter la réparation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRepairDialog;
