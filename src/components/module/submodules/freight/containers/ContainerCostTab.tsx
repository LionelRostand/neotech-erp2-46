
import React, { useEffect, useState } from "react";

interface Props {
  containerType: string;
  articles: { name: string; quantity: number; weight?: number }[];
  cost: number;
  setCost: (cost: number) => void;
}

// Example pricing logic, you might want to fetch/calibrate real rates
const baseRates: Record<string, number> = {
  "20ft": 500,
  "40ft": 900,
};

const ContainerCostTab: React.FC<Props> = ({ containerType, articles, cost, setCost }) => {
  const [calculated, setCalculated] = useState(0);

  useEffect(() => {
    // Example: base + poids total * 5€/kg
    const base = baseRates[containerType] || 0;
    const totalWeight = articles.reduce((acc, art) => acc + (art.weight ?? 0) * art.quantity, 0);
    const computed = base + totalWeight * 5;
    setCalculated(computed);
  }, [containerType, articles]);

  useEffect(() => {
    setCost(calculated);
    // eslint-disable-next-line
  }, [calculated]);

  return (
    <div>
      <div className="flex flex-col gap-2 mb-2">
        <div>
          <span className="font-medium">Type de conteneur :</span> {containerType}
        </div>
        <div>
          <span className="font-medium">Nombre d'articles :</span> {articles.length}
        </div>
        <div>
          <span className="font-medium">Poids total (kg)&nbsp;:</span>{" "}
          {articles.reduce((acc, art) => acc + (art.weight ?? 0) * art.quantity, 0)}
        </div>
        <div>
          <span className="font-medium">Coût estimé :</span>{" "}
          <span className="text-green-600 font-semibold">{calculated.toLocaleString()} €</span>
        </div>
      </div>
    </div>
  );
};

export default ContainerCostTab;
