
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus, Minus } from "lucide-react";

interface Service {
  id: string;
  name: string;
  price: number;
  selected?: boolean;
  quantity?: number;
}

interface ServicesSelectorProps {
  services: Service[];
  onChange: (services: Service[]) => void;
  onCostChange: (cost: number) => void;
}

const ServicesSelector = ({ services = [], onChange, onCostChange }: ServicesSelectorProps) => {
  // Mock services data (in a real app, this would come from an API)
  const [availableServices] = useState<Service[]>([
    { id: "service1", name: "Vidange", price: 50 },
    { id: "service2", name: "Changement filtres", price: 40 },
    { id: "service3", name: "Changement freins", price: 120 },
    { id: "service4", name: "Changement pneus", price: 200 },
    { id: "service5", name: "Diagnostic complet", price: 80 },
  ]);
  
  // Initialize selected services from props or empty array
  const [selectedServices, setSelectedServices] = useState<Service[]>(
    services.length > 0 ? services : []
  );
  
  // Calculate total cost whenever selectedServices change
  useEffect(() => {
    const total = selectedServices.reduce((sum, service) => {
      return sum + (service.price * (service.quantity || 1));
    }, 0);
    
    onCostChange(total);
  }, [selectedServices, onCostChange]);

  // This useEffect notifies parent component of changes to services,
  // but only when selectedServices actually changes to avoid loops
  useEffect(() => {
    onChange(selectedServices);
  }, [selectedServices, onChange]);

  // Toggle service selection
  const toggleService = (service: Service) => {
    let updatedServices;
    
    if (selectedServices.some(s => s.id === service.id)) {
      // Remove service
      updatedServices = selectedServices.filter(s => s.id !== service.id);
    } else {
      // Add service with default quantity 1
      updatedServices = [...selectedServices, { ...service, quantity: 1 }];
    }
    
    setSelectedServices(updatedServices);
  };

  // Update service quantity
  const updateQuantity = (id: string, quantity: number) => {
    const updatedServices = selectedServices.map(service => {
      if (service.id === id) {
        return { ...service, quantity: Math.max(1, quantity) };
      }
      return service;
    });
    
    setSelectedServices(updatedServices);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Services</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {availableServices.map((service) => {
              const isSelected = selectedServices.some(s => s.id === service.id);
              return (
                <div 
                  key={service.id} 
                  className={`border rounded-md p-3 cursor-pointer ${isSelected ? 'border-primary bg-primary/5' : 'border-input'}`}
                  onClick={() => toggleService(service)}
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={isSelected} />
                    <div className="flex-grow">
                      <Label>{service.name}</Label>
                      <p className="text-sm text-muted-foreground">
                        {service.price} €
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedServices.length > 0 && (
            <div className="space-y-3 mt-6">
              <h3 className="text-sm font-medium">Services sélectionnés</h3>
              {selectedServices.map((service) => (
                <div key={service.id} className="flex items-center justify-between bg-muted/50 rounded-md p-2">
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <p className="text-sm text-muted-foreground">{service.price} € par unité</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateQuantity(service.id, (service.quantity || 1) - 1);
                      }}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input 
                      type="number"
                      className="w-16 text-center"
                      value={service.quantity || 1}
                      onChange={(e) => updateQuantity(service.id, parseInt(e.target.value) || 1)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Button 
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateQuantity(service.id, (service.quantity || 1) + 1);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t flex justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Services sélectionnés: {selectedServices.length}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total:</p>
          <p className="text-lg font-bold">
            {selectedServices.reduce((sum, service) => sum + (service.price * (service.quantity || 1)), 0)} €
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ServicesSelector;
