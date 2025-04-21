
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash } from "lucide-react";

interface Cost {
  id: string;
  description: string;
  amount: number;
  currency: string;
}

interface Props {
  costs: Cost[];
  containerType: string;
  onChange: (costs: Cost[]) => void;
}

const ContainerCostTab: React.FC<Props> = ({ 
  costs, 
  containerType,
  onChange 
}) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState("EUR");

  // Suggestion de prix basée sur le type de conteneur
  const getSuggestedPrice = () => {
    if (!containerType) return null;
    
    // Prix de référence par type
    if (containerType.includes("20 pieds")) return 1200;
    if (containerType.includes("40 pieds")) return 2300;
    if (containerType.includes("45 pieds")) return 2600;
    if (containerType.includes("frigorifique")) return 3500;
    return 1500; // Prix par défaut
  };

  const addCost = () => {
    if (!description || amount <= 0) {
      return;
    }

    const newCost = {
      id: Date.now().toString(),
      description,
      amount,
      currency
    };

    onChange([...costs, newCost]);
    
    // Reset form
    setDescription("");
    setAmount(0);
  };

  const removeCost = (id: string) => {
    onChange(costs.filter((cost) => cost.id !== id));
  };

  const handlePrefilledCost = () => {
    const suggestedPrice = getSuggestedPrice();
    if (!suggestedPrice) return;
    
    setDescription(`Transport ${containerType}`);
    setAmount(suggestedPrice);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-12 gap-2 items-end">
        <div className="col-span-6">
          <label className="block text-sm font-medium text-gray-900 mb-1">Description</label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description du coût"
          />
        </div>
        <div className="col-span-3">
          <label className="block text-sm font-medium text-gray-900 mb-1">Montant</label>
          <Input
            type="number"
            min={0}
            step={100}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-900 mb-1">Devise</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full border rounded px-2 py-2 text-sm"
          >
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
        <div className="col-span-1">
          <Button type="button" onClick={addCost} size="sm" className="w-full">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {containerType && (
        <div className="mb-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePrefilledCost}
          >
            Suggérer le prix pour {containerType}
          </Button>
        </div>
      )}

      {costs.length > 0 ? (
        <div className="border rounded-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Devise
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {costs.map((cost) => (
                <tr key={cost.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cost.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cost.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cost.currency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="ghost"
                      onClick={() => removeCost(cost.id)}
                      size="sm"
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">
          Aucun coût ajouté
        </div>
      )}

      <div className="mt-2 text-sm text-gray-500">
        Coût total: {costs.reduce((acc, cost) => acc + cost.amount, 0).toFixed(2)} {costs.length > 0 ? costs[0].currency : ''}
      </div>
    </div>
  );
};

export default ContainerCostTab;
