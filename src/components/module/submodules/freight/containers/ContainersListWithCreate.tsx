
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { COLLECTIONS } from "@/lib/firebase-collections";
import { Container } from "@/types/freight";
import ModuleContainer from "@/components/module/ModuleContainer";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import ContainerCreateDialog from "./ContainerCreateDialog";
import ContainerEditDialog from "./ContainerEditDialog";
import ContainerDeleteDialog from "./ContainerDeleteDialog";
import ContainerViewDialog from "./ContainerViewDialog";

const ContainersListWithCreate = () => {
  const [containers, setContainers] = useState<Container[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedContainer, setSelectedContainer] = useState<Container | null>(null);

  const fetchContainers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.FREIGHT.CONTAINERS));
      const fetchedContainers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Container[];
      
      setContainers(fetchedContainers);
    } catch (error) {
      console.error("Erreur lors du chargement des conteneurs:", error);
      toast.error("Impossible de charger les conteneurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContainers();
  }, []);

  const handleCreateContainer = () => {
    setOpenCreateDialog(true);
  };

  const handleEditContainer = (container: Container) => {
    setSelectedContainer(container);
    setOpenEditDialog(true);
  };

  const handleDeleteContainer = (container: Container) => {
    setSelectedContainer(container);
    setOpenDeleteDialog(true);
  };

  const handleViewContainer = (container: Container) => {
    setSelectedContainer(container);
    setOpenViewDialog(true);
  };

  const handleContainerCreated = (container: Container) => {
    toast.success("Conteneur ajouté avec succès");
    fetchContainers();
  };

  const handleContainerUpdated = (container: Container) => {
    toast.success("Conteneur mis à jour avec succès");
    fetchContainers();
  };

  const handleContainerDeleted = () => {
    toast.success("Conteneur supprimé avec succès");
    fetchContainers();
  };

  return (
    <ModuleContainer title="Gestion des Conteneurs">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Liste des Conteneurs</h2>
        <Button 
          onClick={handleCreateContainer}
          className="bg-green-700 hover:bg-green-800 text-white flex gap-2 items-center"
        >
          <Plus size={16} />
          <span>Nouveau Conteneur</span>
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Chargement des conteneurs...</p>
        </div>
      ) : containers.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <p className="text-gray-500 mb-4">Aucun conteneur trouvé</p>
          <Button 
            onClick={handleCreateContainer}
            className="bg-primary hover:bg-primary/90"
          >
            Ajouter un conteneur
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-200">Numéro</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-200">Type</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-200">Taille</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-200">Statut</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-200">Transporteur</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-200">Origine</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-200">Destination</th>
                <th className="px-4 py-3 text-center font-medium text-gray-600 dark:text-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {containers.map((container) => (
                <tr 
                  key={container.id} 
                  className="border-b hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-4 py-3">{container.number}</td>
                  <td className="px-4 py-3">{container.type}</td>
                  <td className="px-4 py-3">{container.size}</td>
                  <td className="px-4 py-3">
                    <span 
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        container.status === 'en transit' ? 'bg-blue-100 text-blue-800' :
                        container.status === 'livré' ? 'bg-green-100 text-green-800' :
                        container.status === 'en attente' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {container.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{container.carrierName}</td>
                  <td className="px-4 py-3">{container.origin}</td>
                  <td className="px-4 py-3">{container.destination}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleViewContainer(container)}
                        title="Voir"
                      >
                        <Eye size={16} />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleEditContainer(container)}
                        title="Modifier"
                        className="text-blue-600 border-blue-600 hover:bg-blue-50"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleDeleteContainer(container)}
                        title="Supprimer"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ContainerCreateDialog 
        open={openCreateDialog} 
        onOpenChange={setOpenCreateDialog} 
        onCreated={handleContainerCreated} 
      />

      {selectedContainer && (
        <>
          <ContainerEditDialog 
            open={openEditDialog} 
            onOpenChange={setOpenEditDialog} 
            container={selectedContainer} 
            onUpdated={handleContainerUpdated} 
          />

          <ContainerDeleteDialog 
            open={openDeleteDialog} 
            onOpenChange={setOpenDeleteDialog} 
            container={selectedContainer} 
            onDeleted={handleContainerDeleted} 
          />

          <ContainerViewDialog 
            open={openViewDialog} 
            onOpenChange={setOpenViewDialog} 
            container={selectedContainer} 
          />
        </>
      )}
    </ModuleContainer>
  );
};

export default ContainersListWithCreate;
