
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { useGarageData } from '@/hooks/garage/useGarageData';
import { toast } from 'sonner';

interface AddRepairDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRepairAdded?: () => void;
}

const AddRepairDialog: React.FC<AddRepairDialogProps> = ({
  open,
  onOpenChange,
  onRepairAdded
}) => {
  const { clients, vehicles, addRepair } = useGarageData();
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  const [selectedMechanicId, setSelectedMechanicId] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [estimatedEndDate, setEstimatedEndDate] = useState<Date>();
  const [description, setDescription] = useState("");
  const [services, setServices] = useState<Array<{ serviceId: string; quantity: number; cost: number }>>([
    { serviceId: "", quantity: 1, cost: 0 }
  ]);
  const [status] = useState("pending_approval");

  const filteredVehicles = vehicles.filter(v => v.clientId === selectedClientId);

  const handleAddService = () => {
    setServices([...services, { serviceId: "", quantity: 1, cost: 0 }]);
  };

  const handleRemoveService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      if (!selectedClientId || !selectedVehicleId || !selectedMechanicId) {
        toast.error("Veuillez remplir tous les champs obligatoires");
        return;
      }

      const estimatedCost = services.reduce((sum, service) => sum + (service.cost * service.quantity), 0);

      const newRepair = {
        clientId: selectedClientId,
        clientName: clients.find(c => c.id === selectedClientId)?.name || "",
        vehicleId: selectedVehicleId,
        vehicleName: vehicles.find(v => v.id === selectedVehicleId)?.make || "",
        mechanicId: selectedMechanicId,
        startDate: startDate.toISOString(),
        estimatedEndDate: estimatedEndDate?.toISOString() || "",
        status,
        description,
        progress: 0,
        estimatedCost,
        services: services.filter(s => s.serviceId !== "")
      };

      await addRepair.mutateAsync(newRepair);
      onRepairAdded?.();
      onOpenChange(false);
      toast.success("Réparation ajoutée avec succès");
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la réparation:', error);
      toast.error("Erreur lors de l'ajout de la réparation");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ajouter une réparation</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Client</label>
              <Select onValueChange={setSelectedClientId} value={selectedClientId}>
                <SelectTrigger>
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
              <label className="text-sm font-medium">Véhicule</label>
              <Select onValueChange={setSelectedVehicleId} value={selectedVehicleId}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un véhicule" />
                </SelectTrigger>
                <SelectContent>
                  {filteredVehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {`${vehicle.make} ${vehicle.model}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Mécanicien</label>
              <Select onValueChange={setSelectedMechanicId} value={selectedMechanicId}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un mécanicien" />
                </SelectTrigger>
                <SelectContent>
                  {/* We'll populate this with mechanics data once available */}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Statut</label>
              <Select disabled value={status}>
                <SelectTrigger>
                  <SelectValue placeholder="En attente d'approbation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending_approval">En attente d'approbation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date de début</label>
              <DatePicker
                date={startDate}
                onSelect={setStartDate}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date de fin estimée</label>
              <DatePicker
                date={estimatedEndDate}
                onSelect={setEstimatedEndDate}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Services</h3>
              <Button onClick={handleAddService} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un service
              </Button>
            </div>

            <div className="space-y-4">
              {services.map((service, index) => (
                <div key={index} className="flex items-center gap-4">
                  <Select
                    value={service.serviceId}
                    onValueChange={(value) => {
                      const newServices = [...services];
                      newServices[index].serviceId = value;
                      setServices(newServices);
                    }}
                  >
                    <SelectTrigger className="flex-grow">
                      <SelectValue placeholder="Sélectionner un service" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* We'll populate this with services data once available */}
                    </SelectContent>
                  </Select>

                  <Input
                    type="number"
                    value={service.quantity}
                    onChange={(e) => {
                      const newServices = [...services];
                      newServices[index].quantity = parseInt(e.target.value) || 0;
                      setServices(newServices);
                    }}
                    className="w-24"
                    placeholder="Qté"
                  />

                  <Input
                    type="number"
                    value={service.cost}
                    onChange={(e) => {
                      const newServices = [...services];
                      newServices[index].cost = parseFloat(e.target.value) || 0;
                      setServices(newServices);
                    }}
                    className="w-24"
                    placeholder="0€"
                  />

                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRemoveService(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Détails de la réparation..."
              className="min-h-[100px]"
            />
          </div>

          <div className="mt-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmit}>
              Ajouter la réparation
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddRepairDialog;
