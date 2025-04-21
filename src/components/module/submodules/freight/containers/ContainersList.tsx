
import React from "react";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Container } from "@/types/freight";
import ModuleContainer from "@/components/module/ModuleContainer";
import { useFirebaseCollection } from "@/hooks/useFirebaseCollection";
import ContainerCreateDialog from "./ContainerCreateDialog";
import ContainerViewDialog from "./ContainerViewDialog";
import ContainerEditDialog from "./ContainerEditDialog";
import ContainerDeleteDialog from "./ContainerDeleteDialog";
import { deleteDocument } from "@/hooks/firestore/delete-operations";
import { updateDocument } from "@/hooks/firestore/update-operations";

const CONTAINERS_COLLECTION = "freight_containers";

const ContainersList: React.FC = () => {
  // États pour la gestion des dialogs
  const [openCreateDialog, setOpenCreateDialog] = React.useState(false);
  const [openViewDialog, setOpenViewDialog] = React.useState(false);
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [selectedContainer, setSelectedContainer] = React.useState<Container | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);

  // Récupération temps réel des conteneurs
  const {
    data: containers = [],
    isLoading,
    refetch,
    error,
  } = useFirebaseCollection<Container>(CONTAINERS_COLLECTION);

  // Callback succès création
  const onCreated = (container: Container) => {
    setOpenCreateDialog(false);
    refetch?.(); // Rafraîchir la liste en appelant refetch du hook temps réel
    toast.success("Conteneur ajouté avec succès !");
  };

  // Handle pour afficher les détails
  const handleViewContainer = (container: Container) => {
    setSelectedContainer(container);
    setOpenViewDialog(true);
  };

  // Handle pour éditer
  const handleEditContainer = (container: Container) => {
    setSelectedContainer(container);
    setOpenEditDialog(true);
  };

  // Handle pour supprimer
  const handleDeleteContainer = (container: Container) => {
    setSelectedContainer(container);
    setOpenDeleteDialog(true);
  };

  // Exécuter la suppression
  const confirmDelete = async () => {
    if (!selectedContainer) return;
    
    setIsDeleting(true);
    try {
      await deleteDocument(CONTAINERS_COLLECTION, selectedContainer.id);
      toast.success("Conteneur supprimé avec succès !");
      setOpenDeleteDialog(false);
      refetch?.();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression du conteneur.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Exécuter la mise à jour
  const handleUpdate = async (updatedContainer: Partial<Container>) => {
    if (!selectedContainer) return;
    
    setIsUpdating(true);
    try {
      await updateDocument(CONTAINERS_COLLECTION, selectedContainer.id, updatedContainer);
      toast.success("Conteneur mis à jour avec succès !");
      setOpenEditDialog(false);
      refetch?.();
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast.error("Erreur lors de la mise à jour du conteneur.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <ModuleContainer>
      <div className="space-y-6">
        {/* Barre d'action */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Liste des Conteneurs</h2>
          <Button 
            onClick={() => setOpenCreateDialog(true)}
            variant="default"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nouveau Conteneur
          </Button>
        </div>
        
        {/* Liste des conteneurs */}
        <div className="overflow-x-auto border rounded-md">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Numéro</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Taille</th>
                <th className="px-4 py-2 text-left">Statut</th>
                <th className="px-4 py-2 text-left">Transporteur</th>
                <th className="px-4 py-2 text-left">Origine</th>
                <th className="px-4 py-2 text-left">Destination</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center">
                    Chargement des conteneurs...
                  </td>
                </tr>
              ) : containers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-gray-400">
                    Aucun conteneur enregistré
                  </td>
                </tr>
              ) : (
                containers.map((container) => (
                  <tr key={container.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-semibold">{container.number}</td>
                    <td className="px-4 py-2">{container.type}</td>
                    <td className="px-4 py-2">{container.size}</td>
                    <td className="px-4 py-2">{container.status}</td>
                    <td className="px-4 py-2">{container.carrierName}</td>
                    <td className="px-4 py-2">{container.origin}</td>
                    <td className="px-4 py-2">{container.destination}</td>
                    <td className="px-4 py-2">
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleViewContainer(container)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleEditContainer(container)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-500"
                          onClick={() => handleDeleteContainer(container)}
                        >
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
        
        {/* Dialog de création */}
        <ContainerCreateDialog
          open={openCreateDialog}
          onOpenChange={setOpenCreateDialog}
          onCreated={onCreated}
        />

        {/* Dialog de consultation */}
        <ContainerViewDialog
          open={openViewDialog}
          onOpenChange={setOpenViewDialog}
          container={selectedContainer}
        />

        {/* Dialog de modification */}
        <ContainerEditDialog
          open={openEditDialog}
          onOpenChange={setOpenEditDialog}
          container={selectedContainer}
          onSubmit={handleUpdate}
          submitting={isUpdating}
        />

        {/* Dialog de suppression */}
        <ContainerDeleteDialog
          open={openDeleteDialog}
          onOpenChange={setOpenDeleteDialog}
          container={selectedContainer}
          onDelete={confirmDelete}
          deleting={isDeleting}
        />
      </div>
    </ModuleContainer>
  );
};

export default ContainersList;
