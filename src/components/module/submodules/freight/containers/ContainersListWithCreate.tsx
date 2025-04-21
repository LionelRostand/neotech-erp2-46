
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useContainers } from "@/hooks/modules/useContainersFirestore";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import ContainerCostTab from "./ContainerCostTab";
import DeleteContainerDialog from "./DeleteContainerDialog";
import ContainerViewDialog from "./ContainerViewDialog";
import ContainerEditDialog from "./ContainerEditDialog";

const ContainersListWithCreate: React.FC = () => {
  const { data: containers, isLoading } = useContainers();
  const [viewDialog, setViewDialog] = useState<{ open: boolean; container: any | null }>({ open: false, container: null });
  const [editDialog, setEditDialog] = useState<{ open: boolean; container: any | null }>({ open: false, container: null });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; container: any | null }>({ open: false, container: null });

  // Pour simuler le coût, on refait le calcul avec ContainerCostTab logic :
  const computeCost = (container) => {
    const baseRates = { "20ft": 500, "40ft": 900 };
    const base = baseRates[container.type] || 0;
    const articles = Array.isArray(container.articles) ? container.articles : [];
    const totalWeight = articles.reduce((acc, art) => acc + (art?.weight ?? 0) * (art?.quantity ?? 1), 0);
    return base + totalWeight * 5;
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Gestion des Conteneurs</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau conteneur
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full border">
          <thead>
            <tr className="bg-muted">
              <th className="p-2 text-left">Numéro</th>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Client</th>
              <th className="p-2 text-left">Statut</th>
              <th className="p-2 text-left">Poids total</th>
              <th className="p-2 text-left">Coût estimé</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={7}>Chargement...</td></tr>
            ) : !containers?.length ? (
              <tr><td colSpan={7}>Aucun conteneur trouvé.</td></tr>
            ) : (
              containers.map((container: any) => {
                const articles = Array.isArray(container.articles) ? container.articles : [];
                const totalWeight = articles.reduce((acc, art) => acc + (art?.weight ?? 0) * (art?.quantity ?? 1), 0);
                const cost = computeCost(container);
                return (
                  <tr key={container.id} className="border-b">
                    <td className="p-2">{container.number}</td>
                    <td className="p-2">{container.type}</td>
                    <td className="p-2">{container.client}</td>
                    <td className="p-2">{container.status}</td>
                    <td className="p-2">{totalWeight} kg</td>
                    <td className="p-2 text-green-700 font-bold">{cost.toLocaleString()} €</td>
                    <td className="p-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setViewDialog({ open: true, container })}
                        title="Voir"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setEditDialog({ open: true, container })}
                        title="Modifier"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setDeleteDialog({ open: true, container })}
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <ContainerViewDialog
        open={viewDialog.open}
        onClose={() => setViewDialog({ open: false, container: null })}
        container={viewDialog.container}
      />
      <ContainerEditDialog
        open={editDialog.open}
        onClose={() => setEditDialog({ open: false, container: null })}
        container={editDialog.container}
      />
      <DeleteContainerDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, container: null })}
        container={deleteDialog.container || { id: "", number: "" }}
      />
    </div>
  );
};

export default ContainersListWithCreate;
