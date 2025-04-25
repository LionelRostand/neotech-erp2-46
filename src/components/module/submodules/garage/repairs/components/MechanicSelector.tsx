
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useGarageMechanics } from "@/hooks/garage/useGarageMechanics";
import { Mechanic } from '../../types/garage-types';

interface MechanicSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const MechanicSelector: React.FC<MechanicSelectorProps> = ({ value, onChange }) => {
  const { mechanics, isLoading } = useGarageMechanics();

  return (
    <Select value={value} onValueChange={onChange} disabled={isLoading}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Sélectionner un mécanicien" />
      </SelectTrigger>
      <SelectContent>
        {mechanics.map((mechanic: Mechanic) => (
          <SelectItem key={mechanic.id} value={mechanic.id}>
            {`${mechanic.firstName} ${mechanic.lastName}`}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
