
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import FreightRouteForm from "./FreightRouteForm";
import type { Route as FreightRoute } from "@/types/freight";
import { useFirestore } from "@/hooks/useFirestore";
import { toast } from "sonner";

const FreightRoutesPage: React.FC = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [routes, setRoutes] = useState<FreightRoute[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Utiliser le hook pour la collection firestore
  const { add, loading, getAll } = useFirestore("freight_routes");

  // Fonction de chargement des routes extraite pour éviter les boucles
  const loadRoutes = useCallback(async () => {
    try {
      setIsLoading(true);
      const routesData = await getAll();
      console.log("Routes chargées:", routesData);
      
      if (Array.isArray(routesData) && routesData.length > 0) {
        // Traiter chaque route pour s'assurer qu'elle a les propriétés nécessaires
        const formattedRoutes = routesData
          .map(route => {
            // S'assurer que toutes les propriétés nécessaires existent
            return {
              id: route.id || String(Date.now()),
              name: route.name || "",
              origin: route.origin || "",
              destination: route.destination || "",
              distance: typeof route.distance === 'number' ? route.distance : 0,
              estimatedTime: typeof route.estimatedTime === 'number' ? route.estimatedTime : 0,
              transportType: route.transportType || "road",
              active: typeof route.active === 'boolean' ? route.active : true
            };
          })
          // Ne garder que les routes qui ont au moins un nom
          .filter(route => route.name.trim() !== "");
        
        console.log("Routes formatées:", formattedRoutes);
        setRoutes(formattedRoutes);
      } else {
        setRoutes([]);
        console.log("Aucune route trouvée dans la collection");
      }
    } catch (err: any) {
      console.error("Erreur lors du chargement des routes:", err);
      toast.error("Erreur lors du chargement des routes");
    } finally {
      setIsLoading(false);
    }
  }, [getAll]);

  // Charger les routes au chargement de la page - une seule fois
  useEffect(() => {
    loadRoutes();
  }, [loadRoutes]); // useCallback mémorisera cette fonction et évitera des rechargements infinis

  const onAddRoute = async (route: FreightRoute) => {
    // Générer un id local pour un affichage instantané
    const localRoute = { ...route, id: String(Date.now()) };

    // Mise à jour de l'affichage
    setRoutes((prev) => [...prev, localRoute]);
    setShowDialog(false);

    // Sauvegarder en Firestore
    try {
      await add({ ...route, createdAt: new Date().toISOString() });
      toast.success("Route enregistrée avec succès dans la base de données.");
      
      // Recharger les routes pour obtenir les données à jour de Firestore
      await loadRoutes();
    } catch (err: any) {
      console.error("Erreur d'enregistrement:", err);
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
