
import React, { useState, useEffect } from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface CustomerSelectorProps {
  value: string;
  onChange: (value: string, name: string) => void;
}

// Mock data for customers - in a real application, this would come from an API or database
const mockCustomers = [
  { id: "cust-1", name: "Entreprise Martin" },
  { id: "cust-2", name: "Logistique Express" },
  { id: "cust-3", name: "Transport International" },
  { id: "cust-4", name: "Cargo Systems" },
  { id: "cust-5", name: "Global Freight Solutions" },
];

export const CustomerSelector: React.FC<CustomerSelectorProps> = ({ value, onChange }) => {
  // Find the customer name for display when value is already set
  const [selectedCustomerName, setSelectedCustomerName] = useState<string>("");
  
  useEffect(() => {
    if (value) {
      const customer = mockCustomers.find(c => c.id === value);
      if (customer) {
        setSelectedCustomerName(customer.name);
      }
    }
  }, [value]);

  const handleValueChange = (newValue: string) => {
    const customer = mockCustomers.find(c => c.id === newValue);
    if (customer) {
      onChange(newValue, customer.name);
    }
  };

  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="Sélectionner un client">
          {selectedCustomerName || "Sélectionner un client"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {mockCustomers.map((customer) => (
          <SelectItem key={customer.id} value={customer.id}>
            {customer.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
