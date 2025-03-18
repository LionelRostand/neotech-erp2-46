
import React, { useState } from 'react';
import { Carrier } from '@/types/freight';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Check, Truck, Plane, Ship, Globe } from 'lucide-react';

interface CarrierSelectorProps {
  carriers: Carrier[];
  selectedCarrierId: string | null;
  onSelect: (carrierId: string) => void;
}

const CarrierSelector: React.FC<CarrierSelectorProps> = ({
  carriers,
  selectedCarrierId,
  onSelect
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCarriers = carriers.filter(carrier => 
    carrier.active && (
      carrier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carrier.code.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getCarrierIcon = (type: string) => {
    switch (type) {
      case 'international':
        return <Globe className="h-5 w-5 text-blue-500" />;
      case 'national':
        return <Truck className="h-5 w-5 text-green-500" />;
      case 'local':
        return <Truck className="h-5 w-5 text-orange-500" />;
      default:
        return <Truck className="h-5 w-5" />;
    }
  };

  const getCarrierTypeLabel = (type: string) => {
    switch (type) {
      case 'international': return 'International';
      case 'national': return 'National';
      case 'local': return 'Local';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Sélectionner un transporteur</h3>
        <p className="text-sm text-gray-500 mb-4">
          Choisissez le transporteur qui sera responsable de la livraison de ce colis
        </p>
        <Input
          type="search"
          placeholder="Rechercher un transporteur..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <RadioGroup value={selectedCarrierId || ''} onValueChange={onSelect}>
        <div className="grid grid-cols-1 gap-4">
          {filteredCarriers.map((carrier) => (
            <div 
              key={carrier.id} 
              className={`border rounded-lg p-4 transition-all relative ${
                selectedCarrierId === carrier.id 
                  ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                  : 'hover:border-gray-300'
              }`}
            >
              <RadioGroupItem 
                value={carrier.id} 
                id={carrier.id} 
                className="absolute right-4 top-4"
              />
              <Label htmlFor={carrier.id} className="flex items-start gap-4 cursor-pointer">
                <div className="p-2 bg-gray-100 rounded">
                  {getCarrierIcon(carrier.type)}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{carrier.name}</div>
                  <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">{carrier.code}</span>
                    <span className="text-xs">{getCarrierTypeLabel(carrier.type)}</span>
                  </div>
                  {carrier.contactPhone && (
                    <div className="text-sm mt-2">
                      {carrier.contactPhone}
                    </div>
                  )}
                </div>
              </Label>
            </div>
          ))}

          {filteredCarriers.length === 0 && (
            <div className="text-center py-6 text-gray-500 border rounded-lg">
              Aucun transporteur trouvé
            </div>
          )}
        </div>
      </RadioGroup>
    </div>
  );
};

export default CarrierSelector;
