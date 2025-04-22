
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFreightRoutes } from "@/hooks/freight/useFreightRoutes";
import { generateShipmentReference } from "../utils/shipmentUtils";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface StepTrackingProps {
  form: {
    trackingNumber?: string;
    routeId?: string;
    origin?: string;
    destination?: string;
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
  const [missingData, setMissingData] = useState<boolean>(false);

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
        
        // Mise à jour automatique des champs origine et destination basée sur la route
        updateForm({
          origin: route.origin,
          destination: route.destination
        });
        
        setMissingData(false);
      } else {
        setSelectedRoute(null);
      }
    } else {
      setSelectedRoute(null);
    }
  }, [form.routeId, routes, updateForm]);

  // Vérification des données avant de continuer
  const handleNext = () => {
    if (!form.origin || !form.destination) {
      // Vérifier si l'origine et la destination sont remplies
      setMissingData(true);
      toast.error("Les champs origine et destination sont obligatoires");
      return;
    }
    
    setMissingData(false);
    next();
  };

  return (
    <div className="space-y-6">
      {missingData && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Les champs origine et destination sont obligatoires. Veuillez sélectionner une route ou les remplir manuellement.
          </AlertDescription>
        </Alert>
      )}

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

      {/* Ajout des champs d'origine et destination manuels s'il n'y a pas de route sélectionnée */}
      {!selectedRoute && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Origine *</label>
            <Input
              value={form.origin || ""}
              onChange={(e) => updateForm({ origin: e.target.value })}
              placeholder="Ville ou pays d'origine"
              required
              className={!form.origin && missingData ? "border-red-500" : ""}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Destination *</label>
            <Input
              value={form.destination || ""}
              onChange={(e) => updateForm({ destination: e.target.value })}
              placeholder="Ville ou pays de destination"
              required
              className={!form.destination && missingData ? "border-red-500" : ""}
            />
          </div>
        </div>
      )}

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
        <Button onClick={handleNext}>
          Suivant
        </Button>
      </div>
    </div>
  );
};

export default StepTracking;
