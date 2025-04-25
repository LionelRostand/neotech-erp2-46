
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGarageData } from '@/hooks/garage/useGarageData';
import { useGarageMechanics } from '@/hooks/garage/useGarageMechanics';
import { useGarageServices } from '@/hooks/garage/useGarageServices';
import { Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface AddRepairDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRepairAdded?: () => void;
}

interface ServiceLine {
  serviceId: string;
  quantity: number;
  cost: number;
}

const AddRepairDialog = ({ open, onOpenChange, onRepairAdded }: AddRepairDialogProps) => {
  const { addRepair, clients = [], vehicles = [] } = useGarageData();
  const { mechanics = [] } = useGarageMechanics();
  const { services = [] } = useGarageServices();
  const [formData, setFormData] = useState({
    clientId: '',
    vehicleId: '',
    mechanicId: '',
    status: 'pending',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    estimatedEndDate: '',
    description: '',
    estimatedCost: 0,
  });
  const [serviceLines, setServiceLines] = useState<ServiceLine[]>([{
    serviceId: '',
    quantity: 1,
    cost: 0
  }]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const vehicleInfo = vehicles.find(v => v.id === formData.vehicleId);
      const clientInfo = clients.find(c => c.id === formData.clientId);
      const mechanicInfo = mechanics.find(m => m.id === formData.mechanicId);

      const repairData = {
        ...formData,
        date: new Date().toISOString(),
        progress: 0,
        vehicleName: vehicleInfo ? `${vehicleInfo.make} ${vehicleInfo.model}` : undefined,
        clientName: clientInfo?.name,
        mechanicName: mechanicInfo ? `${mechanicInfo.firstName} ${mechanicInfo.lastName}` : undefined,
        services: serviceLines,
      };

      await addRepair.mutateAsync(repairData);
      onOpenChange(false);
      if (onRepairAdded) {
        onRepairAdded();
      }
    } catch (error) {
      console.error('Error adding repair:', error);
    }
  };

  const addServiceLine = () => {
    setServiceLines([...serviceLines, { serviceId: '', quantity: 1, cost: 0 }]);
  };

  const removeServiceLine = (index: number) => {
    setServiceLines(serviceLines.filter((_, i) => i !== index));
  };

  const updateServiceLine = (index: number, field: keyof ServiceLine, value: string | number) => {
    const updatedLines = [...serviceLines];
    updatedLines[index] = { ...updatedLines[index], [field]: value };
    
    if (field === 'serviceId') {
      const service = services.find(s => s.id === value);
      if (service) {
        updatedLines[index].cost = service.cost * updatedLines[index].quantity;
      }
    } else if (field === 'quantity') {
      const service = services.find(s => s.id === updatedLines[index].serviceId);
      if (service) {
        updatedLines[index].cost = service.cost * Number(value);
      }
    }
    
    setServiceLines(updatedLines);
    // Update total estimated cost
    const total = updatedLines.reduce((sum, line) => sum + line.cost, 0);
    setFormData({ ...formData, estimatedCost: total });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter une réparation</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Client</label>
              <Select 
                onValueChange={(value) => setFormData({ ...formData, clientId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(clients) && clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Véhicule</label>
              <Select
                onValueChange={(value) => setFormData({ ...formData, vehicleId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un véhicule" />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(vehicles) && vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Mécanicien</label>
              <Select
                onValueChange={(value) => setFormData({ ...formData, mechanicId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un mécanicien" />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(mechanics) && mechanics.map((mechanic) => (
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
                  <SelectValue placeholder="En attente d'approbation" />
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
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date de fin estimée</label>
              <Input
                type="date"
                value={formData.estimatedEndDate}
                onChange={(e) => setFormData({ ...formData, estimatedEndDate: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-lg font-medium">Services</label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={addServiceLine}
              >
                <Plus className="h-4 w-4 mr-1" />
                Ajouter un service
              </Button>
            </div>

            <div className="space-y-2">
              {serviceLines.map((line, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <Select
                    value={line.serviceId}
                    onValueChange={(value) => updateServiceLine(index, 'serviceId', value)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Sélectionner un service" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(services) && services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Input
                    type="number"
                    min="1"
                    value={line.quantity}
                    onChange={(e) => updateServiceLine(index, 'quantity', Number(e.target.value))}
                    className="w-20"
                  />
                  
                  <Input
                    type="number"
                    value={line.cost}
                    readOnly
                    className="w-24"
                  />
                  
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeServiceLine(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Coût estimé (€)</label>
            <Input
              type="number"
              value={formData.estimatedCost}
              readOnly
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              className="w-full min-h-[100px] p-2 border rounded-md"
              placeholder="Détails de la réparation..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Ajouter la réparation
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRepairDialog;
