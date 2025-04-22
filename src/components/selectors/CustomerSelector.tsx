
import React, { useEffect, useState } from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useFreightClients } from "@/hooks/freight/useFreightClients";

interface CustomerSelectorProps {
  value: string;
  onChange: (value: string, name: string) => void;
}

export const CustomerSelector: React.FC<CustomerSelectorProps> = ({ value, onChange }) => {
  const { clients, isLoading } = useFreightClients();
  const [selectedCustomerName, setSelectedCustomerName] = useState<string>("");

  useEffect(() => {
    if (value && clients.length > 0) {
      const customer = clients.find(c => c.id === value);
      if (customer) setSelectedCustomerName(customer.name || "");
    }
  }, [value, clients]);

  const handleValueChange = (newValue: string) => {
    const customer = clients.find(c => c.id === newValue);
    if (customer) {
      onChange(newValue, customer.name || "");
    }
  };

  return (
    <Select value={value} onValueChange={handleValueChange} disabled={isLoading}>
      <SelectTrigger>
        <SelectValue placeholder="Sélectionner un client">
          {selectedCustomerName || "Sélectionner un client"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {clients.map((customer) => (
          <SelectItem key={customer.id} value={customer.id}>
            {customer.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
