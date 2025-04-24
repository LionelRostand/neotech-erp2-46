
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface CreateRepairDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (repair: any) => void;
  clientsMap?: Record<string, string>;
  vehiclesMap?: Record<string, string>;
  mechanicsMap?: Record<string, string>;
}

const CreateRepairDialog: React.FC<CreateRepairDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  clientsMap = {},
  vehiclesMap = {},
  mechanicsMap = {}
}) => {
  const [clientId, setClientId] = useState<string>('');
  const [vehicleId, setVehicleId] = useState<string>('');
  const [mechanicId, setMechanicId] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [estimatedCost, setEstimatedCost] = useState<string>('');
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [estimatedEndDate, setEstimatedEndDate] = useState<string>(
    new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [licensePlate, setLicensePlate] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientId || !vehicleId || !mechanicId || !description || !estimatedCost || !startDate || !estimatedEndDate) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const vehicleName = vehiclesMap[vehicleId] || '';
    const clientName = clientsMap[clientId] || '';
    const mechanicName = mechanicsMap[mechanicId] || '';

    const newRepair = {
      vehicleId,
      vehicleName,
      clientId,
      clientName,
      mechanicId,
      mechanicName,
      startDate,
      estimatedEndDate,
      status: "in_progress",
      description,
      progress: 0,
      estimatedCost: parseFloat(estimatedCost),
      licensePlate
    };

    onSave(newRepair);
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setClientId('');
    setVehicleId('');
    setMechanicId('');
    setDescription('');
    setEstimatedCost('');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEstimatedEndDate(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setLicensePlate('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle réparation</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="client">Client</Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger id="client">
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(clientsMap || {}).map(([id, name]) => (
                    <SelectItem key={id} value={id}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="vehicle">Véhicule</Label>
              <Select value={vehicleId} onValueChange={setVehicleId}>
                <SelectTrigger id="vehicle">
                  <SelectValue placeholder="Sélectionner un véhicule" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(vehiclesMap || {}).map(([id, name]) => (
                    <SelectItem key={id} value={id}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="license">Immatriculation</Label>
              <Input 
                id="license" 
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value)}
                placeholder="Ex: AB-123-CD" 
              />
            </div>
            
            <div>
              <Label htmlFor="mechanic">Mécanicien</Label>
              <Select value={mechanicId} onValueChange={setMechanicId}>
                <SelectTrigger id="mechanic">
                  <SelectValue placeholder="Sélectionner un mécanicien" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(mechanicsMap || {}).map(([id, name]) => (
                    <SelectItem key={id} value={id}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="startDate">Date de début</Label>
              <div className="relative">
                <Input 
                  id="startDate" 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            
            <div>
              <Label htmlFor="endDate">Date de fin estimée</Label>
              <div className="relative">
                <Input 
                  id="endDate" 
                  type="date" 
                  value={estimatedEndDate}
                  onChange={(e) => setEstimatedEndDate(e.target.value)}
                />
                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Description de la réparation</Label>
            <Textarea 
              id="description" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez la réparation à effectuer..." 
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="cost">Coût estimé (€)</Label>
            <Input 
              id="cost" 
              type="number" 
              min="0" 
              step="0.01"
              value={estimatedCost}
              onChange={(e) => setEstimatedCost(e.target.value)}
              placeholder="0.00" 
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">Créer la réparation</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRepairDialog;
