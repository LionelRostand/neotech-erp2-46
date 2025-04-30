
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ContainerStatusSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const ContainerStatusSelect: React.FC<ContainerStatusSelectProps> = ({ value, onChange }) => {
  // Liste standardisée des statuts
  const statuses = [
    { value: "En chargement", label: "En chargement" },
    { value: "Prêt", label: "Prêt" },
    { value: "En transit", label: "En transit" },
    { value: "En douane", label: "En douane" },
    { value: "Livré", label: "Livré" }
  ];

  // Ensure value is never empty string
  const safeValue = value || "En chargement";

  return (
    <div className="space-y-2">
      <Label htmlFor="status">Statut</Label>
      <Select 
        value={safeValue}
        onValueChange={onChange}
      >
        <SelectTrigger id="status">
          <SelectValue placeholder="Sélectionner un statut" />
        </SelectTrigger>
        <SelectContent>
          {statuses.map((status) => (
            <SelectItem key={status.value} value={status.value}>
              {status.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ContainerStatusSelect;
