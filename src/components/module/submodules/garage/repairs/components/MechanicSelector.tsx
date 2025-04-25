
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useGarageMechanics } from "@/hooks/garage/useGarageMechanics";
import { Loader } from "lucide-react";

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
      <SelectContent className="bg-white">
        {isLoading ? (
          <div className="flex items-center justify-center p-2">
            <Loader className="h-4 w-4 animate-spin" />
          </div>
        ) : mechanics.length === 0 ? (
          <div className="p-2 text-center text-sm text-gray-500">
            Aucun mécanicien trouvé
          </div>
        ) : (
          mechanics.map((mechanic) => (
            <SelectItem key={mechanic.id} value={mechanic.id}>
              {`${mechanic.firstName} ${mechanic.lastName}`}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
};
