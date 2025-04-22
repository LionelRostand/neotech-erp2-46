
import React, { useEffect, useState } from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useFreightCarriers } from "@/hooks/freight/useFreightCarriers";

interface CarrierSelectorProps {
  value: string;
  onChange: (value: string, name: string) => void;
}

export const CarrierSelector: React.FC<CarrierSelectorProps> = ({ value, onChange }) => {
  const { carriers, isLoading } = useFreightCarriers();
  const [selectedCarrierName, setSelectedCarrierName] = useState<string>("");

  useEffect(() => {
    if (value && carriers.length > 0) {
      const carrier = carriers.find(c => c.id === value);
      if (carrier) setSelectedCarrierName(carrier.name || "");
    }
  }, [value, carriers]);

  const handleValueChange = (newValue: string) => {
    const carrier = carriers.find(c => c.id === newValue);
    if (carrier) {
      onChange(newValue, carrier.name || "");
    }
  };

  return (
    <Select value={value} onValueChange={handleValueChange} disabled={isLoading}>
      <SelectTrigger>
        <SelectValue placeholder="Sélectionner un transporteur">
          {selectedCarrierName || "Sélectionner un transporteur"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {carriers.map((carrier) => (
          <SelectItem key={carrier.id} value={carrier.id}>
            {carrier.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
