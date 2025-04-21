
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useContainers, useAddContainer, useUpdateContainer, useDeleteContainer } from "@/hooks/modules/useContainersFirestore";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import ContainerCostTab from "./ContainerCostTab";
import DeleteContainerDialog from "./DeleteContainerDialog";
import ContainerViewDialog from "./ContainerViewDialog";
import ContainerEditDialog from "./ContainerEditDialog";
import { toast } from "sonner";

const ContainersListWithCreate: React.FC = () => {
  const { data: containers, isLoading } = useContainers();
  const [viewDialog, setViewDialog] = useState<{ open: boolean; container: any | null }>({ open: false, container: null });
  const [editDialog, setEditDialog] = useState<{ open: boolean; container: any | null }>({ open: false, container: null });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; container: any | null }>({ open: false, container: null });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const addContainer = useAddContainer();
  const updateContainer = useUpdateContainer();
  const deleteContainer = useDeleteContainer();

  // Pour simuler le coût, on refait le calcul avec ContainerCostTab logic :
  const computeCost = (container) => {
    const baseRates = { "20ft": 500, "40ft": 900 };
    const base = baseRates[container.type] || 0;
    const articles = Array.isArray(container.articles) ? container.articles : [];
    const totalWeight = articles.reduce((acc, art) => acc + (art?.weight ?? 0) * (art?.quantity ?? 1), 0);
    return base + totalWeight * 5;
  };

  // Gestionnaires pour les icônes d'action
  const handleView = (container) => {
    console.log("Ouverture du dialogue de visualisation pour:", container.number);
    setViewDialog({ open: true, container });
  };

  const handleEdit = (container) => {
    console.log("Ouverture du dialogue d'édition pour:", container.number);
    setEditDialog({ open: true, container });
  };

  const handleDelete = (container) => {
    console.log("Ouverture du dialogue de suppression pour:", container.number);
    setDeleteDialog({ open: true, container });
  };

  const handleAddContainer = (newContainerData) => {
    addContainer.mutate(newContainerData, {
      onSuccess: () => {
        toast.success("Conteneur ajouté avec succès");
        setIsCreateDialogOpen(false);
      },
      onError: (error) => {
        console.error("Erreur lors de l'ajout du conteneur:", error);
        toast.error("Erreur lors de l'ajout du conteneur");
      }
    });
  };

  const handleUpdateContainer = (updatedContainer) => {
    updateContainer.mutate({ id: updatedContainer.id, data: updatedContainer }, {
      onSuccess: () => {
        toast.success("Conteneur mis à jour avec succès");
        setEditDialog({ open: false, container: null });
      },
      onError: (error) => {
        console.error("Erreur lors de la mise à jour du conteneur:", error);
        toast.error("Erreur lors de la mise à jour du conteneur");
      }
    });
  };

  const handleDeleteConfirm = (containerId) => {
    deleteContainer.mutate(containerId, {
      onSuccess: () => {
        toast.success("Conteneur supprimé avec succès");
        setDeleteDialog({ open: false, container: null });
      },
      onError: (error) => {
        console.error("Erreur lors de la suppression du conteneur:", error);
        toast.error("Erreur lors de la suppression du conteneur");
      }
    });
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Gestion des Conteneurs</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
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
                    <td className="p-2 text-green-700 font-bold">{cost.toLocaleString()} €</td>
                    <td className="p-2 flex space-x-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleView(container)}
                        title="Voir"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(container)}
                        title="Modifier"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(container)}
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

      {/* Dialogues */}
      <ContainerViewDialog
        open={viewDialog.open}
        onClose={() => setViewDialog({ open: false, container: null })}
        container={viewDialog.container}
      />
      <ContainerEditDialog
        open={editDialog.open}
        onClose={() => setEditDialog({ open: false, container: null })}
        container={editDialog.container}
        onSave={handleUpdateContainer}
      />
      <DeleteContainerDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, container: null })}
        container={deleteDialog.container || { id: "", number: "" }}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default ContainersListWithCreate;
