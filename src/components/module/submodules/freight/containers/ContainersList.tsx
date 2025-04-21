
import React from "react";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Container } from "@/types/freight";
import ModuleContainer from "@/components/module/ModuleContainer";
import { useFirebaseCollection } from "@/hooks/useFirebaseCollection";
import ContainerCreateDialog from "./ContainerCreateDialog";

const CONTAINERS_COLLECTION = "freight_containers";

const ContainersList: React.FC = () => {
  // État d'ouverture du dialog
  const [openDialog, setOpenDialog] = React.useState(false);

  // Récupération temps réel des conteneurs
  const {
    data: containers = [],
    isLoading,
    refetch,
    error,
  } = useFirebaseCollection<Container>(CONTAINERS_COLLECTION);

  // Callback succès création
  const onCreated = (container: Container) => {
    setOpenDialog(false);
    refetch?.(); // Rafraîchir la liste en appelant refetch du hook temps réel
    toast.success("Conteneur ajouté avec succès !");
  };

  return (
    <ModuleContainer>
      <div className="space-y-6">
        {/* Barre d'action */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Liste des Conteneurs</h2>
          <Button 
            onClick={() => setOpenDialog(true)}
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
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
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
          open={openDialog}
          onOpenChange={setOpenDialog}
          onCreated={onCreated}
        />
      </div>
    </ModuleContainer>
  );
};

export default ContainersList;
