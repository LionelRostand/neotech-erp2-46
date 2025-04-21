import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import FreightRouteForm from "./FreightRouteForm";
import FreightRouteViewDialog from "./FreightRouteViewDialog";
import FreightRouteEditDialog from "./FreightRouteEditDialog";
import FreightRouteDeleteDialog from "./FreightRouteDeleteDialog";
import { Eye, Pencil, Trash2 } from "lucide-react";
import type { Route as FreightRoute } from "@/types/freight";
import { useFirestore } from "@/hooks/useFirestore";
import { toast } from "sonner";

const FreightRoutesPage: React.FC = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [routes, setRoutes] = useState<FreightRoute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewRoute, setViewRoute] = useState<FreightRoute | null>(null);
  const [editRoute, setEditRoute] = useState<FreightRoute | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState<FreightRoute | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { add, loading, getAll, update, remove } = useFirestore("freight_routes");

  const loadRoutes = useCallback(async () => {
    if (isSubmitting) return;

    try {
      setIsLoading(true);
      const routesData = await getAll();
      
      if (Array.isArray(routesData) && routesData.length > 0) {
        const formattedRoutes = routesData
          .filter(route => 
            typeof route === 'object' && 
            route !== null && 
            'name' in route && 
            route.name && 
            typeof route.name === 'string'
          )
          .map(route => ({
            id: route.id || String(Date.now()),
            name: route.name || "",
            origin: route.origin || "",
            destination: route.destination || "",
            distance: typeof route.distance === 'number' ? route.distance : 0,
            estimatedTime: typeof route.estimatedTime === 'number' ? route.estimatedTime : 0,
            transportType: route.transportType || "road",
            active: typeof route.active === 'boolean' ? route.active : true
          }));
        
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
  }, [getAll, isSubmitting]);

  useEffect(() => {
    loadRoutes();
  }, []);

  const onAddRoute = async (route: FreightRoute) => {
    try {
      setIsSubmitting(true);
      
      const localRoute = { ...route, id: String(Date.now()) };

      setRoutes((prev) => [...prev, localRoute]);
      setShowDialog(false);

      await add({ ...route, createdAt: new Date().toISOString() });
      toast.success("Route enregistrée avec succès dans la base de données.");
      
      loadRoutes();
    } catch (err: any) {
      console.error("Erreur d'enregistrement:", err);
      toast.error("Erreur lors de l'enregistrement dans la base de données.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onEditRoute = async (route: FreightRoute) => {
    setEditRoute(route);
    setEditDialogOpen(true);
  };

  const handleSubmitEdit = async (route: FreightRoute) => {
    setIsSubmitting(true);
    try {
      await update(route.id, {
        name: route.name,
        origin: route.origin,
        destination: route.destination,
        distance: route.distance,
        estimatedTime: route.estimatedTime,
        transportType: route.transportType,
        active: route.active
      });
      toast.success("Route mise à jour.");
      setEditDialogOpen(false);
      setEditRoute(null);
      loadRoutes();
    } catch (err: any) {
      toast.error("Erreur lors de la mise à jour.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteRoute = (route: FreightRoute) => {
    setRouteToDelete(route);
    setDeleteDialogOpen(true);
  };

  const handleDeleteRoute = async () => {
    if (!routeToDelete) return;
    setDeleting(true);
    try {
      await remove(routeToDelete.id);
      toast.success("Route supprimée.");
      setDeleteDialogOpen(false);
      setRouteToDelete(null);
      loadRoutes();
    } catch (err: any) {
      toast.error("Erreur lors de la suppression.");
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const onViewRoute = (route: FreightRoute) => {
    setViewRoute(route);
    setViewDialogOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Routes</h1>
        <Button
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
          onClick={() => setShowDialog(true)}
          disabled={loading || isSubmitting}
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
                  <th className="py-2 text-center">Actions</th>
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
                    <td className="py-2 text-center">
                      <button
                        title="Voir"
                        onClick={() => onViewRoute(route)}
                        className="inline-flex items-center hover:bg-gray-100 rounded p-1 mr-2"
                      >
                        <Eye className="w-4 h-4 text-gray-700" />
                      </button>
                      <button
                        title="Modifier"
                        onClick={() => onEditRoute(route)}
                        className="inline-flex items-center hover:bg-emerald-100 rounded p-1 mr-2"
                      >
                        <Pencil className="w-4 h-4 text-emerald-700" />
                      </button>
                      <button
                        title="Supprimer"
                        onClick={() => confirmDeleteRoute(route)}
                        className="inline-flex items-center hover:bg-red-100 rounded p-1"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </td>
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
      <FreightRouteViewDialog open={viewDialogOpen} onOpenChange={setViewDialogOpen} route={viewRoute} />
      <FreightRouteEditDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} route={editRoute} onSubmit={handleSubmitEdit} submitting={isSubmitting} />
      <FreightRouteDeleteDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} route={routeToDelete} onDelete={handleDeleteRoute} deleting={deleting} />
    </div>
  );
};

export default FreightRoutesPage;
