
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const PricingCalculator: React.FC = () => {
  // États pour stocker les valeurs du formulaire
  const [distance, setDistance] = useState<number>(100);
  const [weight, setWeight] = useState<number>(1000);
  const [transportType, setTransportType] = useState<string>('road');
  const [expeditionType, setExpeditionType] = useState<string>('standard');
  const [volume, setVolume] = useState<number>(10);
  const [basePrice, setBasePrice] = useState<number>(300);
  
  // État pour stocker le résultat du calcul
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [breakdown, setBreakdown] = useState<{[key: string]: number}>({
    basePrice: 0,
    distancePrice: 0,
    weightPrice: 0,
    volumePrice: 0,
    expeditionTypePrice: 0,
    transportTypePrice: 0
  });
  
  // Calculer le prix en fonction des paramètres
  const calculatePrice = () => {
    let distancePrice = distance * 0.5; // 0.5€ par km
    let weightPrice = weight * 0.02; // 0.02€ par kg
    let volumePrice = volume * 2; // 2€ par m³
    
    // Majoration selon le type d'expédition
    let expeditionTypeMultiplier = 1;
    switch (expeditionType) {
      case 'express':
        expeditionTypeMultiplier = 1.5;
        break;
      case 'priority':
        expeditionTypeMultiplier = 1.3;
        break;
      case 'standard':
      default:
        expeditionTypeMultiplier = 1;
    }
    
    // Majoration selon le type de transport
    let transportTypeMultiplier = 1;
    switch (transportType) {
      case 'air':
        transportTypeMultiplier = 3;
        break;
      case 'sea':
        transportTypeMultiplier = 0.8;
        break;
      case 'rail':
        transportTypeMultiplier = 1.2;
        break;
      case 'road':
      default:
        transportTypeMultiplier = 1;
    }
    
    // Prix de base
    const basePriceValue = basePrice || 0;
    
    // Application des multiplicateurs
    const expeditionTypePrice = (distancePrice + weightPrice + volumePrice) * (expeditionTypeMultiplier - 1);
    const transportTypePrice = (distancePrice + weightPrice + volumePrice) * (transportTypeMultiplier - 1);
    
    // Calcul du prix total
    const total = (basePriceValue + distancePrice + weightPrice + volumePrice) * expeditionTypeMultiplier * transportTypeMultiplier;
    
    // Mise à jour du prix total
    setTotalPrice(total);
    
    // Mise à jour de la répartition du prix
    setBreakdown({
      basePrice: basePriceValue,
      distancePrice,
      weightPrice,
      volumePrice,
      expeditionTypePrice,
      transportTypePrice
    });
  };
  
  // Calculer le prix lorsque les paramètres changent
  useEffect(() => {
    calculatePrice();
  }, [distance, weight, transportType, expeditionType, volume, basePrice]);
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle>Calculateur de tarifs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Formulaire de paramètres */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="basePrice">Prix de base (€)</Label>
              <Input
                id="basePrice"
                type="number"
                value={basePrice}
                min={0}
                onChange={(e) => setBasePrice(Number(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">Prix de base pour l'expédition, avant calcul des facteurs variables.</p>
            </div>
          
            <div className="space-y-2">
              <Label htmlFor="distance">Distance (km)</Label>
              <Input
                id="distance"
                type="number"
                value={distance}
                min={0}
                onChange={(e) => setDistance(Number(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weight">Poids (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={weight}
                min={0}
                onChange={(e) => setWeight(Number(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="volume">Volume (m³)</Label>
              <Input
                id="volume"
                type="number"
                value={volume}
                min={0}
                onChange={(e) => setVolume(Number(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expedition-type">Type d'expédition</Label>
              <Select value={expeditionType} onValueChange={setExpeditionType}>
                <SelectTrigger id="expedition-type">
                  <SelectValue placeholder="Type d'expédition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="express">Express</SelectItem>
                  <SelectItem value="priority">Prioritaire</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="transport-type">Mode de transport</Label>
              <Select value={transportType} onValueChange={setTransportType}>
                <SelectTrigger id="transport-type">
                  <SelectValue placeholder="Mode de transport" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="road">Route</SelectItem>
                  <SelectItem value="rail">Rail</SelectItem>
                  <SelectItem value="sea">Maritime</SelectItem>
                  <SelectItem value="air">Aérien</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={calculatePrice} className="w-full">
              Calculer le tarif
            </Button>
          </div>
          
          {/* Résultat du calcul */}
          <div className="bg-slate-50 p-6 rounded-lg border">
            <h3 className="font-semibold text-lg mb-4">Détail du tarif</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Prix de base</span>
                <span>{breakdown.basePrice.toFixed(2)} €</span>
              </div>
              
              <div className="flex justify-between">
                <span>Distance ({distance} km)</span>
                <span>{breakdown.distancePrice.toFixed(2)} €</span>
              </div>
              
              <div className="flex justify-between">
                <span>Poids ({weight} kg)</span>
                <span>{breakdown.weightPrice.toFixed(2)} €</span>
              </div>
              
              <div className="flex justify-between">
                <span>Volume ({volume} m³)</span>
                <span>{breakdown.volumePrice.toFixed(2)} €</span>
              </div>
              
              {expeditionType !== 'standard' && (
                <div className="flex justify-between">
                  <span>Supplément {expeditionType === 'express' ? 'Express' : 'Prioritaire'}</span>
                  <span>{breakdown.expeditionTypePrice.toFixed(2)} €</span>
                </div>
              )}
              
              {transportType !== 'road' && (
                <div className="flex justify-between">
                  <span>Supplément transport {
                    transportType === 'air' ? 'Aérien' : 
                    transportType === 'sea' ? 'Maritime' : 'Ferroviaire'
                  }</span>
                  <span>{breakdown.transportTypePrice.toFixed(2)} €</span>
                </div>
              )}
              
              <Separator className="my-2" />
              
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{totalPrice.toFixed(2)} €</span>
              </div>
            </div>
            
            <div className="mt-6 text-sm text-gray-500">
              <p>Ce calcul est une estimation basée sur les paramètres fournis. Le tarif final peut varier en fonction d'autres facteurs (douanes, taxes, etc.).</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingCalculator;
