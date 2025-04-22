
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFreightRoutes } from "@/hooks/freight/useFreightRoutes";
import { generateShipmentReference } from "../utils/shipmentUtils";

interface StepTrackingProps {
  form: {
    trackingNumber?: string;
    routeId?: string;
    [key: string]: any;
  };
  updateForm: (data: any) => void;
  prev: () => void;
  next: () => void;
  close: () => void;
}

const StepTracking: React.FC<StepTrackingProps> = ({ form, updateForm, prev, next, close }) => {
  const { routes, isLoading } = useFreightRoutes();
  const [selectedRoute, setSelectedRoute] = useState<{ id: string; name: string; origin: string; destination: string } | null>(null);

  // Génère automatiquement le numéro de suivi s'il n'est pas déjà rempli
  useEffect(() => {
    if (!form.trackingNumber) {
      updateForm({ trackingNumber: generateShipmentReference() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set selected route details when le champ routeId change ou lors du chargement des routes
  useEffect(() => {
    if (form.routeId && routes?.length) {
      const route = routes.find(r => r.id === form.routeId);
      if (route) {
        setSelectedRoute(route);
      } else {
        setSelectedRoute(null);
      }
    } else {
      setSelectedRoute(null);
    }
  }, [form.routeId, routes]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Numéro de suivi</label>
          <Input
            value={form.trackingNumber || ""}
            onChange={(e) => updateForm({ trackingNumber: e.target.value })}
            placeholder="TRACK-12345"
            disabled
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Route</label>
        {isLoading ? (
          <div className="text-sm text-gray-500">Chargement des routes...</div>
        ) : (
          <Select 
            value={form.routeId || ""} 
            onValueChange={(value) => updateForm({ routeId: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une route" />
            </SelectTrigger>
            <SelectContent>
              {routes && routes.map((route) => (
                <SelectItem key={route.id} value={route.id}>
                  {route.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {selectedRoute && (
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="font-medium mb-2">Détails de la route</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Origine</p>
              <p className="text-sm">{selectedRoute.origin}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Destination</p>
              <p className="text-sm">{selectedRoute.destination}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={prev}>
          Précédent
        </Button>
        <Button onClick={next}>
          Suivant
        </Button>
      </div>
    </div>
  );
};

export default StepTracking;
