
import React, { useState } from "react";
import { useCollectionData } from "@/hooks/useCollectionData";
import { COLLECTIONS } from "@/lib/firebase-collections";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Carrier } from "@/types/freight";
import CreateCarrierDialog from "./CreateCarrierDialog";
import { Plus } from "lucide-react";

const columns = [
  { header: "Nom", accessorKey: "name" },
  { header: "Code", accessorKey: "code" },
  { header: "Type", accessorKey: "type" },
  { header: "Contact", accessorKey: "contactName" },
  { header: "Statut", accessorKey: "active" },
  { header: "Actions", accessorKey: "actions" },
];

const typeLabel = (type: string) => {
  switch (type) {
    case "national": return "National";
    case "international": return "International";
    case "local": return "Local";
    default: return type;
  }
};

const FreightCarriersList: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const { data: carriers, isLoading, error } = useCollectionData(COLLECTIONS.FREIGHT.CARRIERS);

  // Remonte la liste après création
  const handleCarrierCreated = () => {
    setOpenDialog(false);
    // useCollectionData se met à jour automatiquement via onSnapshot
  };

  return (
    <div>
      {/* Header section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestion des Transporteurs</h2>
        <Button
          variant="default"
          className="bg-green-700 hover:bg-green-800 text-white"
          onClick={() => setOpenDialog(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Transporteur
        </Button>
      </div>
      <CreateCarrierDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        onCreated={handleCarrierCreated}
      />
      {/* Table displaying carriers */}
      <div className="bg-white shadow rounded-md overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Nom</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Code</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Type</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Contact</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Statut</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-muted-foreground">Chargement...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-red-600">
                  Erreur lors du chargement des transporteurs.
                </td>
              </tr>
            ) : carriers && carriers.length > 0 ? (
              carriers.map((carrier: Carrier) => (
                <tr
                  key={carrier.id}
                  className="border-t hover:bg-accent/20"
                >
                  <td className="px-4 py-3 font-semibold">{carrier.name}</td>
                  <td className="px-4 py-3">{carrier.code}</td>
                  <td className="px-4 py-3">{typeLabel(carrier.type)}</td>
                  <td className="px-4 py-3">{carrier.contactName || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={
                      carrier.active
                        ? "text-green-600 font-semibold"
                        : "text-gray-400 font-semibold"
                    }>
                      {carrier.active ? "Actif" : "Non actif"}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    {/* Actions: voir/éditer/supprimer (icônes en placeholder, fonction à implémenter) */}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="hover:bg-primary/10"
                      title="Voir"
                      disabled
                    >
                      <svg width="18" height="18" fill="none"><circle cx="9" cy="9" r="8" stroke="#1e293b" strokeWidth="1.5"/><circle cx="9" cy="9" r="2.5" stroke="#1e293b" strokeWidth="1.5"/></svg>
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="hover:bg-green-100 text-green-700"
                      title="Éditer"
                      disabled
                    >
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12.38 5.76l5.86 5.87-8.97 8.97H3.4v-5.87l8.98-8.97zm2.97-2.97a2 2 0 0 1 2.83 0l2.03 2.03a2 2 0 0 1 0 2.83l-2.12 2.12-4.86-4.86 2.12-2.12z" stroke="#047857" strokeWidth="1.4"/></svg>
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="hover:bg-red-100 text-red-600"
                      title="Supprimer"
                      disabled
                    >
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M6 7h12M9 7v8m6-8v8M9 7V5a3 3 0 0 1 6 0v2M4 7h16" stroke="#dc2626" strokeWidth="1.4"/></svg>
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-8 text-muted-foreground">
                  Aucun transporteur trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FreightCarriersList;
