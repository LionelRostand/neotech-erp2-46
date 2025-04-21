
import React, { useEffect, useState } from "react";

interface Article {
  name: string;
  quantity: number;
  weight?: number;
}

interface Props {
  containerType: string;
  articles: Article[];
  cost: number;
  setCost: (cost: number) => void;
}

// Example pricing logic, you might want to fetch/calibrate real rates
const baseRates: Record<string, number> = {
  "20ft": 500,
  "40ft": 900,
  "Standard": 600,
  "Réfrigéré": 1200,
  "Open Top": 800,
  "Flat Rack": 850,
  "Tank": 1300,
};

const ContainerCostTab: React.FC<Props> = ({ containerType = '', articles = [], cost, setCost }) => {
  const [calculated, setCalculated] = useState(0);

  useEffect(() => {
    // Apply the base rate for this container type, or default rate if not found
    const base = baseRates[containerType] || 500;
    
    // Calculate total weight of all articles
    const totalWeight = articles.reduce((acc, art) => acc + (art.weight ?? 0) * art.quantity, 0);
    
    // Apply a pricing formula: base + weight-based cost
    const weightCost = totalWeight * 5; // 5€ per kg
    const computed = base + weightCost;
    
    setCalculated(computed);
  }, [containerType, articles]);

  useEffect(() => {
    setCost(calculated);
  }, [calculated, setCost]);

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="font-medium mb-4">Résumé des coûts</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Type de conteneur:</span>
            <span className="font-medium">{containerType || 'Non spécifié'}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Nombre d'articles:</span>
            <span className="font-medium">{articles.length}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Poids total:</span>
            <span className="font-medium">
              {articles.reduce((acc, art) => acc + (art.weight ?? 0) * art.quantity, 0).toFixed(2)} kg
            </span>
          </div>
          
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between text-lg">
              <span className="font-bold">Coût estimé:</span>
              <span className="text-green-600 font-bold">{calculated.toLocaleString()} €</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-sm text-gray-500">
        <p>Le calcul du coût est basé sur le type de conteneur et le poids total des marchandises.</p>
        <p>Ce tarif est indicatif et peut être ajusté avant la finalisation.</p>
      </div>
    </div>
  );
};

export default ContainerCostTab;
