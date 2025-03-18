
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ShipmentLine } from '@/types/freight';

interface ShipmentPriceCalculatorProps {
  totalWeight: number;
  shipmentLines: ShipmentLine[];
  onPriceCalculated: (price: number) => void;
}

const ShipmentPriceCalculator: React.FC<ShipmentPriceCalculatorProps> = ({
  totalWeight,
  shipmentLines,
  onPriceCalculated
}) => {
  const [basePrice, setBasePrice] = useState(10.0);
  const [weightPrice, setWeightPrice] = useState(0);
  const [distancePrice, setDistancePrice] = useState(0);
  const [distance, setDistance] = useState(100);
  const [zone, setZone] = useState<string>('national');
  const [expeditionType, setExpeditionType] = useState<string>('standard');
  const [totalPrice, setTotalPrice] = useState(0);
  const [extraFees, setExtraFees] = useState(0);
  const [customsFees, setCustomsFees] = useState(0);
  
  // Calculer le prix basé sur les paramètres
  useEffect(() => {
    // Prix par kg selon la zone
    const weightRates = {
      local: 0.2,
      national: 0.5,
      europe: 1.2,
      international: 2.5
    };
    
    // Prix par km selon la zone
    const distanceRates = {
      local: 0.05,
      national: 0.1,
      europe: 0.2,
      international: 0.3
    };
    
    // Multiplicateurs selon le type d'expédition
    const typeMultipliers = {
      economic: 0.8,
      standard: 1.0,
      express: 1.5,
      priority: 2.0
    };
    
    const zoneRate = weightRates[zone as keyof typeof weightRates] || 0.5;
    const distanceRate = distanceRates[zone as keyof typeof distanceRates] || 0.1;
    const multiplier = typeMultipliers[expeditionType as keyof typeof typeMultipliers] || 1;
    
    // Calcul du prix au poids
    const calculatedWeightPrice = totalWeight * zoneRate;
    
    // Calcul du prix à la distance
    const calculatedDistancePrice = distance * distanceRate;
    
    // Calcul du prix total avec multiplicateur du type d'expédition
    const calculatedTotalPrice = (basePrice + calculatedWeightPrice + calculatedDistancePrice + extraFees + customsFees) * multiplier;
    
    setWeightPrice(calculatedWeightPrice);
    setDistancePrice(calculatedDistancePrice);
    setTotalPrice(calculatedTotalPrice);
    
    // Notifier le parent du prix calculé
    onPriceCalculated(calculatedTotalPrice);
  }, [
    basePrice,
    totalWeight,
    distance,
    zone,
    expeditionType,
    extraFees,
    customsFees,
    onPriceCalculated
  ]);
  
  // Déterminer si des frais de douane doivent être appliqués
  useEffect(() => {
    if (zone === 'international' || zone === 'europe') {
      setCustomsFees(15.0);
    } else {
      setCustomsFees(0);
    }
  }, [zone]);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Paramètres de tarification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="zone">Zone géographique</Label>
              <Select 
                value={zone} 
                onValueChange={setZone}
              >
                <SelectTrigger id="zone">
                  <SelectValue placeholder="Sélectionner une zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="local">Local (même ville)</SelectItem>
                  <SelectItem value="national">National</SelectItem>
                  <SelectItem value="europe">Europe</SelectItem>
                  <SelectItem value="international">International</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expeditionType">Type d'expédition</Label>
              <Select 
                value={expeditionType} 
                onValueChange={setExpeditionType}
              >
                <SelectTrigger id="expeditionType">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="economic">Économique (3-5 jours)</SelectItem>
                  <SelectItem value="standard">Standard (1-3 jours)</SelectItem>
                  <SelectItem value="express">Express (24h)</SelectItem>
                  <SelectItem value="priority">Prioritaire (Même jour)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="distance">Distance estimée (km)</Label>
              <Input 
                id="distance" 
                type="number" 
                min="1" 
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="extraFees">Frais supplémentaires (€)</Label>
              <Input 
                id="extraFees" 
                type="number" 
                min="0" 
                step="0.01"
                value={extraFees}
                onChange={(e) => setExtraFees(Number(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Résumé du calcul</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Poids total:</span>
              <span className="font-medium">{totalWeight.toFixed(2)} kg</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Tarif de base:</span>
              <span>{basePrice.toFixed(2)} €</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Tarif au poids:</span>
              <span>{weightPrice.toFixed(2)} €</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Tarif à la distance:</span>
              <span>{distancePrice.toFixed(2)} €</span>
            </div>
            
            {customsFees > 0 && (
              <div className="flex justify-between items-center">
                <span>Frais de douane:</span>
                <span>{customsFees.toFixed(2)} €</span>
              </div>
            )}
            
            {extraFees > 0 && (
              <div className="flex justify-between items-center">
                <span>Frais supplémentaires:</span>
                <span>{extraFees.toFixed(2)} €</span>
              </div>
            )}
            
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between items-center font-bold">
                <span>PRIX TOTAL:</span>
                <span className="text-lg">{totalPrice.toFixed(2)} €</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground">
            Les prix sont calculés selon nos tarifs en vigueur et peuvent être ajustés.
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ShipmentPriceCalculator;
