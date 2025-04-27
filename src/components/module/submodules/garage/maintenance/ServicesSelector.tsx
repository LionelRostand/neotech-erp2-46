
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Minus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { GarageService } from '@/hooks/garage/useGarageData';

interface ServicesSelectorProps {
  availableServices: GarageService[];
  selectedServices: Array<{
    serviceId: string;
    quantity: number;
    cost: number;
  }>;
  onChange: (services: Array<{
    serviceId: string;
    quantity: number;
    cost: number;
  }>) => void;
}

const ServicesSelector: React.FC<ServicesSelectorProps> = ({ 
  availableServices, 
  selectedServices, 
  onChange 
}) => {
  const handleAddService = () => {
    if (availableServices.length === 0) return;
    
    const firstService = availableServices[0];
    onChange([
      ...selectedServices,
      {
        serviceId: firstService.id,
        quantity: 1,
        cost: firstService.cost
      }
    ]);
  };

  const handleRemoveService = (index: number) => {
    const updatedServices = [...selectedServices];
    updatedServices.splice(index, 1);
    onChange(updatedServices);
  };

  const handleServiceChange = (index: number, serviceId: string) => {
    const service = availableServices.find(s => s.id === serviceId);
    if (!service) return;

    const updatedServices = [...selectedServices];
    updatedServices[index] = {
      ...updatedServices[index],
      serviceId,
      cost: service.cost
    };
    onChange(updatedServices);
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    const updatedServices = [...selectedServices];
    updatedServices[index] = {
      ...updatedServices[index],
      quantity: Math.max(1, quantity)
    };
    onChange(updatedServices);
  };

  const getServiceNameById = (serviceId: string) => {
    const service = availableServices.find(s => s.id === serviceId);
    return service ? service.name : 'Service inconnu';
  };

  return (
    <div className="space-y-2">
      {selectedServices.map((service, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Select 
            value={service.serviceId} 
            onValueChange={(value) => handleServiceChange(index, value)}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Sélectionner un service" />
            </SelectTrigger>
            <SelectContent>
              {availableServices.map((availableService) => (
                <SelectItem key={availableService.id} value={availableService.id}>
                  {availableService.name} ({availableService.cost} €)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex items-center space-x-2">
            <span>Quantité:</span>
            <Input
              type="number"
              value={service.quantity}
              onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 1)}
              className="w-[80px]"
              min="1"
            />
          </div>
          
          <div className="flex-1">
            <span>{service.quantity * service.cost} €</span>
          </div>
          
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            onClick={() => handleRemoveService(index)}
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
      ))}
      
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAddService}
        className="mt-2"
      >
        <Plus className="h-4 w-4 mr-2" />
        Ajouter un service
      </Button>
    </div>
  );
};

export default ServicesSelector;
