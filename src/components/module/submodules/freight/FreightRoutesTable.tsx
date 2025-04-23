
import React from 'react';
import { useFreightRoutes } from "@/hooks/freight/useFreightRoutes";

// DataTable UI de shadcn (colonne minimale)
const FreightRoutesTable = ({ reloadFlag }: { reloadFlag?: boolean }) => {
  const { routes, isLoading, refetchRoutes } = useFreightRoutes();

  React.useEffect(() => {
    // Permet de rafraîchir à chaque ajout
    if (reloadFlag !== undefined) refetchRoutes();
    // eslint-disable-next-line
  }, [reloadFlag]);

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
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-4 text-center">Chargement...</td>
              </tr>
            ) : routes.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-4 text-center text-muted-foreground">
                  Aucune route enregistrée.
                </td>
              </tr>
            ) : (
              routes.map((route: any) => (
                <tr key={route.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-3 py-2">{route.name}</td>
                  <td className="px-3 py-2">{route.origin}</td>
                  <td className="px-3 py-2">{route.destination}</td>
                  <td className="px-3 py-2 capitalize">{route.transportType || <span className="text-gray-400">-</span>}</td>
                  <td className="px-3 py-2">{route.distance ?? <span className="text-gray-400">-</span>}</td>
                  <td className="px-3 py-2">{route.estimatedTime ?? <span className="text-gray-400">-</span>}</td>
                  <td className="px-3 py-2">
                    {route.active === false 
                      ? <span className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 text-xs">Non</span>
                      : <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs">Oui</span>
                    }
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FreightRoutesTable;

