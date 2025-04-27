
import React, { useState } from 'react';
import { useFreightRoutes } from "@/hooks/freight/useFreightRoutes";
import { Route } from "@/types/freight/route-types";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import FreightRouteViewDialog from "./FreightRouteViewDialog";
import FreightRouteEditDialog from "./FreightRouteEditDialog";
import FreightRouteDeleteDialog from "./FreightRouteDeleteDialog";

const FreightRoutesTable = ({ reloadFlag }: { reloadFlag?: boolean }) => {
  const { routes, isLoading, refetchRoutes } = useFreightRoutes();
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  React.useEffect(() => {
    if (reloadFlag !== undefined) refetchRoutes();
  }, [reloadFlag, refetchRoutes]);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Liste des routes</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2">Nom</th>
              <th className="px-3 py-2">Origine</th>
              <th className="px-3 py-2">Destination</th>
              <th className="px-3 py-2">Type transport</th>
              <th className="px-3 py-2">Distance (km)</th>
              <th className="px-3 py-2">Durée estimée (h)</th>
              <th className="px-3 py-2">Active ?</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} className="py-4 text-center">Chargement...</td>
              </tr>
            ) : routes.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-4 text-center text-muted-foreground">
                  Aucune route enregistrée.
                </td>
              </tr>
            ) : (
              routes.map((route: Route) => (
                <tr key={route.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-3 py-2">{route.name}</td>
                  <td className="px-3 py-2">{route.origin}</td>
                  <td className="px-3 py-2">{route.destination}</td>
                  <td className="px-3 py-2 capitalize">{route.transportType}</td>
                  <td className="px-3 py-2">{route.distance}</td>
                  <td className="px-3 py-2">{route.estimatedTime}</td>
                  <td className="px-3 py-2">
                    {route.active === false 
                      ? <span className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 text-xs">Non</span>
                      : <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs">Oui</span>
                    }
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => {
                        setSelectedRoute(route);
                        setViewOpen(true);
                      }}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => {
                        setSelectedRoute(route);
                        setEditOpen(true);
                      }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => {
                        setSelectedRoute(route);
                        setDeleteOpen(true);
                      }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <FreightRouteViewDialog 
        open={viewOpen} 
        onOpenChange={setViewOpen} 
        route={selectedRoute} 
      />
      
      <FreightRouteEditDialog 
        open={editOpen} 
        onOpenChange={setEditOpen} 
        route={selectedRoute}
        onSuccess={() => {
          setEditOpen(false);
          refetchRoutes();
        }}
      />
      
      <FreightRouteDeleteDialog 
        open={deleteOpen} 
        onOpenChange={setDeleteOpen} 
        route={selectedRoute}
        onSuccess={() => {
          setDeleteOpen(false);
          refetchRoutes();
        }}
      />
    </div>
  );
};

export default FreightRoutesTable;
