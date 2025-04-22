
import React, { useEffect, useState } from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useFreightRoutes } from "@/hooks/freight/useFreightRoutes";

interface RouteSelectorProps {
  value: string;
  onChange: (value: string, name: string) => void;
}

export const RouteSelector: React.FC<RouteSelectorProps> = ({ value, onChange }) => {
  const { routes, isLoading } = useFreightRoutes();
  const [selectedRouteName, setSelectedRouteName] = useState<string>("");

  useEffect(() => {
    if (value && routes.length > 0) {
      const route = routes.find(r => r.id === value);
      if (route) setSelectedRouteName(route.name || "");
    }
  }, [value, routes]);

  const handleValueChange = (newValue: string) => {
    const route = routes.find(r => r.id === newValue);
    if (route) {
      onChange(newValue, route.name || "");
    }
  };

  return (
    <Select value={value} onValueChange={handleValueChange} disabled={isLoading}>
      <SelectTrigger>
        <SelectValue placeholder="Sélectionner une route">
          {selectedRouteName || "Sélectionner une route"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {routes.map((route) => (
          <SelectItem key={route.id} value={route.id}>
            {route.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default RouteSelector;
