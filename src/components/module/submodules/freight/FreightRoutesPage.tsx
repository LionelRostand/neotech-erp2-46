
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import FreightRouteForm from "./FreightRouteForm";
import type { Route as FreightRoute } from "@/types/freight";
import { useFirestore } from "@/hooks/useFirestore";
import { toast } from "sonner";

const initialRoutes: FreightRoute[] = [];

const FreightRoutesPage: React.FC = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [routes, setRoutes] = useState<FreightRoute[]>(initialRoutes);
  const [isLoading, setIsLoading] = useState(true);

  // Utiliser le hook pour la collection firestore
  const { add, loading, getAll } = useFirestore("freight_routes");

  // Charger les routes au chargement de la page
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setIsLoading(true);
        const routesData = await getAll();
        console.log("Routes chargées:", routesData);
        setRoutes(routesData as FreightRoute[]);
      } catch (err: any) {
        console.error("Erreur lors du chargement des routes:", err);
        toast.error("Erreur lors du chargement des routes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoutes();
  }, [getAll]);

  const onAddRoute = async (route: FreightRoute) => {
    // Générer un id local pour un affichage instantané
    const localRoute = { ...route, id: String(Date.now()) };

    // Mise à jour de l'affichage
    setRoutes((prev) => [...prev, localRoute]);
    setShowDialog(false);

    // Sauvegarder en Firestore
    try {
      const res = await add({ ...route, createdAt: new Date().toISOString() });
      toast.success("Route enregistrée avec succès dans la base de données.");
      // Optionnel : remonter l'id firestore pour correspondre à la vraie donnée
      setRoutes((prev) =>
        prev.map((r) =>
          r.id === localRoute.id && res?.id ? { ...res, ...r } : r
        )
      );
    } catch (err: any) {
      toast.error("Erreur lors de l'enregistrement dans la base de données.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Routes</h1>
        <Button
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
          onClick={() => setShowDialog(true)}
          disabled={loading}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Route
        </Button>
      </div>
      <div className="bg-white rounded-lg shadow-md p-8">
        <div>
          {isLoading ? (
            <div className="text-center py-6">
              <div className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Chargement des routes...</p>
            </div>
          ) : routes.length > 0 ? (
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
