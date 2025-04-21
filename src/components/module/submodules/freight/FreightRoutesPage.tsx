
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFreightData } from "@/hooks/modules/useFreightData";
import { toast } from "@/hooks/use-toast";
import FreightRouteForm from "./FreightRouteForm";
import { addDocument } from "@/hooks/firestore/create-operations";
import { COLLECTIONS } from "@/lib/firebase-collections";
import type { Route as FreightRoute } from "@/types/freight";

const statusColors = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-500"
};

const transportTypeLabels: Record<string, string> = {
  'road': 'Route',
  'sea': 'Mer',
  'air': 'Air',
  'rail': 'Rail',
  'multimodal': 'Multimodal'
};

const transportTypeColors: Record<string, string> = {
  'road': 'bg-blue-50 text-blue-800',
  'sea': 'bg-teal-50 text-teal-700',
  'air': 'bg-sky-50 text-sky-700',
  'rail': 'bg-violet-50 text-violet-700',
  'multimodal': 'bg-orange-50 text-orange-700'
};

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
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 flex items-center gap-2">
          <span className="inline-block bg-[#E5DEFF] px-3 py-1 rounded mr-2 text-vivid-purple-700">
            Gestion des routes
          </span>
        </h2>
        <Button
          onClick={() => setFormOpen(true)}
          className="bg-vivid-purple hover:bg-vivid-purple/90 text-white font-semibold shadow transition-colors px-5 py-2 rounded-md"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle route
        </Button>
      </div>

      <FreightRouteForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleCreateRoute}
      />

      <div className="relative rounded-xl shadow bg-white border">
        {loading ? (
          <div className="p-16 text-center text-muted-foreground text-lg font-medium">Chargement…</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-5 py-4 text-left font-bold text-medium-gray">Nom</th>
                <th className="px-5 py-4 text-left font-bold text-medium-gray">Origine</th>
                <th className="px-5 py-4 text-left font-bold text-medium-gray">Destination</th>
                <th className="px-5 py-4 text-center font-bold text-medium-gray">Distance (km)</th>
                <th className="px-5 py-4 text-center font-bold text-medium-gray">Temps estimé (h)</th>
                <th className="px-5 py-4 text-center font-bold text-medium-gray">Type</th>
                <th className="px-5 py-4 text-center font-bold text-medium-gray">Statut</th>
              </tr>
            </thead>
            <tbody>
              {routes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-muted-foreground text-lg">Aucune route n’a été enregistrée.</td>
                </tr>
              ) : (
                routes.map((route: FreightRoute) => (
                  <tr
                    key={route.id}
                    className="border-t transition hover:bg-[#F1F0FB]"
                  >
                    <td className="px-5 py-4 font-semibold">{route.name}</td>
                    <td className="px-5 py-4">{route.origin}</td>
                    <td className="px-5 py-4">{route.destination}</td>
                    <td className="px-5 py-4 text-center">{route.distance}</td>
                    <td className="px-5 py-4 text-center">{route.estimatedTime}</td>
                    <td className="px-5 py-4 text-center">
                      <span
                        className={`inline-block rounded-md px-2 py-0.5 font-medium text-xs ${transportTypeColors[route.transportType] || 'bg-gray-100 text-gray-600'}`}
                      >
                        {transportTypeLabels[route.transportType] || route.transportType}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span
                        className={`inline-flex items-center rounded px-2 py-0.5 font-medium text-xs ${
                          route.active
                            ? statusColors.active
                            : statusColors.inactive
                        }`}
                      >
                        {route.active ? "Active" : "Désactivée"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default FreightRoutesPage;
