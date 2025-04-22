
import React, { useState, useEffect } from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface CarrierSelectorProps {
  value: string;
  onChange: (value: string, name: string) => void;
}

// Mock data for carriers - in a real application, this would come from an API or database
const mockCarriers = [
  { id: "car-1", name: "Chronopost" },
  { id: "car-2", name: "DHL Express" },
  { id: "car-3", name: "FedEx" },
  { id: "car-4", name: "UPS" },
  { id: "car-5", name: "Maersk Line" },
  { id: "car-6", name: "CMA CGM" },
];

export const CarrierSelector: React.FC<CarrierSelectorProps> = ({ value, onChange }) => {
  // Find the carrier name for display when value is already set
  const [selectedCarrierName, setSelectedCarrierName] = useState<string>("");
  
  useEffect(() => {
    if (value) {
      const carrier = mockCarriers.find(c => c.id === value);
      if (carrier) {
        setSelectedCarrierName(carrier.name);
      }
    }
  }, [value]);

  const handleValueChange = (newValue: string) => {
    const carrier = mockCarriers.find(c => c.id === newValue);
    if (carrier) {
      onChange(newValue, carrier.name);
    }
  };

  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="Sélectionner un transporteur">
          {selectedCarrierName || "Sélectionner un transporteur"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {mockCarriers.map((carrier) => (
          <SelectItem key={carrier.id} value={carrier.id}>
            {carrier.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
