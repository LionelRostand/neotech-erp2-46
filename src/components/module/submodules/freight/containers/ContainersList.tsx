
import React from "react";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ContainerCreateDialog from "./ContainerCreateDialog";
import ContainerViewDialog from "./ContainerViewDialog";
import ContainerEditDialog from "./ContainerEditDialog";
import ContainerDeleteDialog from "./ContainerDeleteDialog";
import { toast } from "sonner";
import { Container } from "@/types/freight";
import { fetchCollectionData } from "@/lib/fetchCollectionData";

const ContainersList: React.FC = () => {
  // Etat d'ouverture du dialog de création
  const [openDialog, setOpenDialog] = React.useState(false);
  
  // Etats pour les dialogs de visualisation, édition et suppression
  const [viewDialog, setViewDialog] = React.useState(false);
  const [editDialog, setEditDialog] = React.useState(false);
  const [deleteDialog, setDeleteDialog] = React.useState(false);
  const [selectedContainer, setSelectedContainer] = React.useState<Container | null>(null);

  // Etat de la dernière création
  const [lastCreated, setLastCreated] = React.useState<Container | null>(null);

  // Fetch des conteneurs depuis Firestore
  const { data: containers = [], refetch, isLoading } = useQuery({
    queryKey: ["freight-containers"],
    queryFn: () => fetchCollectionData<Container>("freight-containers"),
  });

  // Au succès d'ajout, refetch + toast
  const onCreated = (container: Container) => {
    setLastCreated(container);
    setOpenDialog(false);
    refetch();
    toast.success("Conteneur ajouté avec succès !");
  };

  // Fonctions pour les actions sur les conteneurs
  const handleView = (container: Container) => {
    setSelectedContainer(container);
    setViewDialog(true);
  };

  const handleEdit = (container: Container) => {
    setSelectedContainer(container);
    setEditDialog(true);
  };

  const handleDelete = (container: Container) => {
    setSelectedContainer(container);
    setDeleteDialog(true);
  };

  const handleEditSuccess = () => {
    refetch();
    setEditDialog(false);
    toast.success("Conteneur modifié avec succès !");
  };

  const handleDeleteSuccess = () => {
    refetch();
    setDeleteDialog(false);
    toast.success("Conteneur supprimé avec succès !");
  };

  return (
    <div className="space-y-6">
      {/* Barre d'action */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Liste des Conteneurs</h2>
        <Button onClick={() => setOpenDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Conteneur
        </Button>
      </div>
      {/* Liste des conteneurs */}
      <div className="overflow-x-auto border rounded-md">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 font-semibold text-left">Numéro</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Taille</th>
              <th className="px-4 py-2">Statut</th>
              <th className="px-4 py-2">Transporteur</th>
              <th className="px-4 py-2">Origine</th>
              <th className="px-4 py-2">Destination</th>
              <th className="px-4 py-2">Départ</th>
              <th className="px-4 py-2">Arrivée</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={10} className="p-6 text-center">
                  Chargement des conteneurs...
                </td>
              </tr>
            ) : containers.length === 0 ? (
              <tr>
                <td colSpan={10} className="p-6 text-center text-gray-400">
                  Aucun conteneur enregistré
                </td>
              </tr>
            ) : (
              containers.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-2 font-semibold">{c.number}</td>
                  <td className="px-4 py-2">{c.type}</td>
                  <td className="px-4 py-2">{c.size}</td>
                  <td className="px-4 py-2">{c.status}</td>
                  <td className="px-4 py-2">{c.carrierName}</td>
                  <td className="px-4 py-2">{c.origin}</td>
                  <td className="px-4 py-2">{c.destination}</td>
                  <td className="px-4 py-2">{c.departureDate}</td>
                  <td className="px-4 py-2">{c.arrivalDate}</td>
                  <td className="px-4 py-2 text-right space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleView(c)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(c)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(c)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Dialog de création */}
      <ContainerCreateDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        onCreated={onCreated}
      />
      
      {/* Dialog de visualisation */}
      <ContainerViewDialog 
        open={viewDialog}
        onOpenChange={setViewDialog}
        container={selectedContainer}
      />
      
      {/* Dialog d'édition */}
      <ContainerEditDialog
        open={editDialog}
        onOpenChange={setEditDialog}
        container={selectedContainer}
        onEdited={handleEditSuccess}
      />
      
      {/* Dialog de suppression */}
      <ContainerDeleteDialog
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
        container={selectedContainer}
        onDeleted={handleDeleteSuccess}
      />
    </div>
  );
};

export default ContainersList;
