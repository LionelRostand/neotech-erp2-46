
import React, { useState } from "react";
import { Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFreightData } from "@/hooks/modules/useFreightData";
import { toast } from "@/hooks/use-toast";
import FreightRouteForm from "./FreightRouteForm";
import { addDocument } from "@/hooks/firestore/create-operations";
import { COLLECTIONS } from "@/lib/firebase-collections";
import type { Route as FreightRoute } from "@/types/freight";

const FreightRoutesPage: React.FC = () => {
  const { routes, loading } = useFreightData();
  const [formOpen, setFormOpen] = useState(false);

  // Ajouter une route à Firestore
  const handleCreateRoute = async (route: FreightRoute) => {
    try {
      await addDocument(COLLECTIONS.FREIGHT.ROUTES, {
        ...route,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      toast({
        title: "Route créée",
        description: `La route "${route.name}" a bien été ajoutée.`,
        variant: "success",
      });
      setFormOpen(false);
    } catch (e) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la route.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestion des routes</h2>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle route
        </Button>
      </div>

      <FreightRouteForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleCreateRoute}
      />

      <div className="bg-white rounded shadow p-6">
        {loading ? (
          <div>Chargement…</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b font-semibold text-left">
                <th>Nom</th>
                <th>Origine</th>
                <th>Destination</th>
                <th>Distance (km)</th>
                <th>Temps estimé (h)</th>
                <th>Type</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((route: FreightRoute) => (
                <tr key={route.id} className="border-b">
                  <td>{route.name}</td>
                  <td>{route.origin}</td>
                  <td>{route.destination}</td>
                  <td>{route.distance}</td>
                  <td>{route.estimatedTime}</td>
                  <td>{route.transportType}</td>
                  <td>
                    <span className={route.active ? "text-green-600" : "text-gray-400"}>
                      {route.active ? "Active" : "Désactivée"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default FreightRoutesPage;

