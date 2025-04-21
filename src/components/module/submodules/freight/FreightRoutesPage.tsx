
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import FreightRouteForm from "./FreightRouteForm";
import type { Route as FreightRoute } from "@/types/freight";

const initialRoutes: FreightRoute[] = [];

const FreightRoutesPage: React.FC = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [routes, setRoutes] = useState<FreightRoute[]>(initialRoutes);

  const onAddRoute = (route: FreightRoute) => {
    setRoutes([...routes, { ...route, id: String(Date.now()) }]);
    setShowDialog(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Routes</h1>
        <Button
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
          onClick={() => setShowDialog(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Route
        </Button>
      </div>
      <div className="bg-white rounded-lg shadow-md p-8">
        <div>
          {routes.length > 0 ? (
            <table className="min-w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2">Nom</th>
                  <th className="py-2">Origine</th>
                  <th className="py-2">Destination</th>
                  <th className="py-2">Distance (km)</th>
                  <th className="py-2">Temps estimé (h)</th>
                  <th className="py-2">Type</th>
                  <th className="py-2">Statut</th>
                </tr>
              </thead>
              <tbody>
                {routes.map((route) => (
                  <tr className="border-b" key={route.id}>
                    <td className="py-2">{route.name}</td>
                    <td className="py-2">{route.origin}</td>
                    <td className="py-2">{route.destination}</td>
                    <td className="py-2">{route.distance}</td>
                    <td className="py-2">{route.estimatedTime}</td>
                    <td className="py-2 capitalize">{route.transportType}</td>
                    <td className="py-2">{route.active ? "Active" : "Inactive"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="border rounded-md px-6 py-10 text-center text-muted-foreground text-lg">
              <p>Aucune route enregistrée</p>
              <span className="block text-sm text-muted-foreground mt-1">
                Ajoutez des routes pour planifier vos trajets logistiques
              </span>
            </div>
          )}
        </div>
      </div>
      <FreightRouteForm open={showDialog} onOpenChange={setShowDialog} onSubmit={onAddRoute} />
    </div>
  );
};

export default FreightRoutesPage;
