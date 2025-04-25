
import React from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { GarageService, RepairService } from './types';
import { useGarageData } from '@/hooks/garage/useGarageData';

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

  const addService = () => {
    const newServices = [...services, { serviceId: '', quantity: 1, cost: 0 }];
    onChange(newServices);
    calculateTotalCost(newServices);
  };

  const removeService = (index: number) => {
    const newServices = services.filter((_, i) => i !== index);
    onChange(newServices);
    calculateTotalCost(newServices);
  };

  const updateService = (index: number, field: keyof RepairService, value: any) => {
    const newServices = [...services];
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
    
    onChange(newServices);
    calculateTotalCost(newServices);
  };

  const calculateTotalCost = (services: RepairService[]) => {
    const total = services.reduce((sum, service) => sum + service.cost, 0);
    onCostChange(total);
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
          {services.map((service, index) => (
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
