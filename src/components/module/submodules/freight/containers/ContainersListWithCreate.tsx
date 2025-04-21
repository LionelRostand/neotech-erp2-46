
import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContainers } from "@/hooks/modules/useContainersFirestore";
import { Container } from "@/types/freight";

// Statuts mapping -> badge + label
const STATUS_LABELS: Record<string, string> = {
  vide: "Vide",
  chargement: "En chargement",
  plein: "Plein",
  "en transit": "En transit",
  livré: "Livré",
  draft: "Brouillon",
  in_transit: "En transit"
};
const STATUS_COLORS: Record<string, string> = {
  vide: "bg-blue-100 text-blue-800 border-blue-200",
  chargement: "bg-yellow-100 text-yellow-800 border-yellow-200",
  plein: "bg-green-100 text-green-800 border-green-200",
  "en transit": "bg-purple-100 text-purple-800 border-purple-200",
  livré: "bg-gray-100 text-gray-800 border-gray-200",
  draft: "bg-gray-100 text-gray-800 border-gray-200",
  in_transit: "bg-purple-100 text-purple-800 border-purple-200"
};

interface ContainersListWithCreateProps {
  onEditContainer?: (container: Container) => void;
}

const ContainersListWithCreate: React.FC<ContainersListWithCreateProps> = ({ onEditContainer }) => {
  const [search, setSearch] = useState("");
  const { data: containers = [], isLoading, error } = useContainers();

  const filtered = useMemo(() => {
    if (!search.trim()) return containers;
    const s = search.trim().toLowerCase();
    return containers.filter(
      (c: any) =>
        c.number?.toLowerCase().includes(s) ||
        c.origin?.toLowerCase().includes(s) ||
        c.destination?.toLowerCase().includes(s) ||
        c.client?.toLowerCase().includes(s) ||
        c.carrierName?.toLowerCase().includes(s) ||
        c.type?.toLowerCase().includes(s) ||
        (STATUS_LABELS[c.status]?.toLowerCase().includes(s))
    );
  }, [search, containers]);

  const handleEditClick = (container: Container) => {
    if (onEditContainer) {
      onEditContainer(container);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Chargement des conteneurs...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Erreur lors du chargement des conteneurs</div>;
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-sm overflow-hidden p-0">
      <div className="p-6 pb-3 border-b border-gray-100 bg-white">
        <h2 className="text-xl font-bold mb-2">Conteneurs</h2>
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Rechercher un conteneur..."
            className="pl-10 bg-gray-50"
            value={search}
            onChange={e => setSearch(e.target.value)}
            data-testid="container-search"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase border-b border-gray-100">
              <th className="px-6 py-4 font-semibold tracking-wider">RÉFÉRENCE</th>
              <th className="px-6 py-4 font-semibold tracking-wider">ORIGINE</th>
              <th className="px-6 py-4 font-semibold tracking-wider">DESTINATION</th>
              <th className="px-6 py-4 font-semibold tracking-wider">CLIENT</th>
              <th className="px-6 py-4 font-semibold tracking-wider">TRANSPORTEUR</th>
              <th className="px-6 py-4 font-semibold tracking-wider">TYPE</th>
              <th className="px-6 py-4 font-semibold tracking-wider">STATUT</th>
              <th className="px-6 py-4 font-semibold tracking-wider">DATE PRÉVUE</th>
              <th className="px-6 py-4 font-semibold tracking-wider">COÛT</th>
              <th className="px-6 py-4 font-semibold tracking-wider">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-6 text-gray-500">
                  Aucun conteneur trouvé.
                </td>
              </tr>
            ) : (
              filtered.map((c: any) => (
                <tr key={c.id} className="border-b last:border-0">
                  <td className="px-6 py-4">{c.number}</td>
                  <td className="px-6 py-4">{c.origin}</td>
                  <td className="px-6 py-4">{c.destination}</td>
                  <td className="px-6 py-4">{c.client}</td>
                  <td className="px-6 py-4">{c.carrierName}</td>
                  <td className="px-6 py-4">{c.type}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium border ${STATUS_COLORS[c.status] || "bg-gray-100 text-gray-800 border-gray-200"}`}>
                      {STATUS_LABELS[c.status] || c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{c.departureDate ? new Date(c.departureDate).toLocaleDateString("fr-FR") : "-"}</td>
                  <td className="px-6 py-4">{c.cost !== undefined ? c.cost.toLocaleString("fr-FR", { style: "currency", currency: "EUR" }) : "-"}</td>
                  <td className="px-6 py-4">
                    <Button size="sm" variant="ghost" onClick={() => handleEditClick(c)}>
                      <Edit className="h-4 w-4" />
                    </Button>
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

export default ContainersListWithCreate;
