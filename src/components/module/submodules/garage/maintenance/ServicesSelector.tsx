
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useGarageData } from '@/hooks/garage/useGarageData';

interface RepairService {
  serviceId: string;
  quantity: number;
  cost: number;
}

interface ServicesSelectorProps {
  services: RepairService[];
  onChange: (services: RepairService[]) => void;
  onCostChange: (totalCost: number) => void;
}

const ServicesSelector: React.FC<ServicesSelectorProps> = ({
  services,
  onChange,
  onCostChange,
}) => {
  const { services: garageServices = [], isLoading } = useGarageData();
  // Use a local state to track services
  const [localServices, setLocalServices] = useState<RepairService[]>(services || []);

  // Update local services when props change, but only if different
  useEffect(() => {
    if (JSON.stringify(services) !== JSON.stringify(localServices)) {
      setLocalServices(services);
    }
  }, [services]);

  // Calculate and update total cost whenever localServices changes
  useEffect(() => {
    const total = localServices.reduce((sum, service) => sum + service.cost, 0);
    onCostChange(total);
  }, [localServices, onCostChange]);

  // Update parent component but only when our local state changes
  useEffect(() => {
    // Avoid calling onChange unnecessarily to prevent infinite loop
    if (JSON.stringify(services) !== JSON.stringify(localServices)) {
      onChange(localServices);
    }
  }, [localServices, onChange, services]);

  const addService = () => {
    const newServices = [...localServices, { serviceId: '', quantity: 1, cost: 0 }];
    setLocalServices(newServices);
  };

  const removeService = (index: number) => {
    const newServices = localServices.filter((_, i) => i !== index);
    setLocalServices(newServices);
  };

  const updateService = (index: number, field: keyof RepairService, value: any) => {
    const newServices = [...localServices];
    newServices[index] = { ...newServices[index], [field]: value };
    
    if (field === 'serviceId') {
      const selectedService = garageServices.find(s => s.id === value);
      if (selectedService) {
        newServices[index].cost = selectedService.cost * newServices[index].quantity;
      }
    }
    
    if (field === 'quantity') {
      const selectedService = garageServices.find(s => s.id === newServices[index].serviceId);
      if (selectedService) {
        newServices[index].cost = selectedService.cost * value;
      }
    }
    
    setLocalServices(newServices);
  };

  if (isLoading) {
    return <div>Chargement des services...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Services</h3>
        <Button 
          onClick={addService}
          variant="outline"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un service
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Service</TableHead>
            <TableHead>Quantité</TableHead>
            <TableHead>Coût (€)</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {localServices.map((service, index) => (
            <TableRow key={index}>
              <TableCell>
                <Select
                  value={service.serviceId}
                  onValueChange={(value) => updateService(index, 'serviceId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un service" />
                  </SelectTrigger>
                  <SelectContent>
                    {garageServices.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name} - {s.cost}€
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  min={1}
                  value={service.quantity}
                  onChange={(e) => updateService(index, 'quantity', parseInt(e.target.value) || 1)}
                  className="w-20"
                />
              </TableCell>
              <TableCell>{service.cost}€</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeService(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ServicesSelector;
