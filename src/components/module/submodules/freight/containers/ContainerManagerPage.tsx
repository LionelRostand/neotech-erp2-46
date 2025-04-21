import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash } from "lucide-react";
import CreateEditContainerDialog from "./CreateEditContainerDialog";
import DeleteContainerDialog from "./DeleteContainerDialog";
import { useContainers, useAddContainer } from "@/hooks/modules/useContainersFirestore";
import { toast } from "sonner";
import { useFreightData } from "@/hooks/modules/useFreightData";

const generateContainerNumber = () => {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.floor(10000 + Math.random() * 90000).toString();
  return `CTR-${datePart}-${randomPart}`;
};

const ContainerManagerPage: React.FC = () => {
  const { data: containers = [], isLoading } = useContainers();
  const addContainerMutation = useAddContainer();
  const { routes = [], clients = [] } = useFreightData();
  const [openDialog, setOpenDialog] = useState<"create" | "edit" | "delete" | null>(null);
  const [currentContainer, setCurrentContainer] = useState<any>(null);

  const handleNew = () => {
    setCurrentContainer(null);
    setOpenDialog("create");
  };

  const handleEdit = (container: any) => {
    setCurrentContainer(container);
    setOpenDialog("edit");
  };

  const handleDelete = (container: any) => {
    setCurrentContainer(container);
    setOpenDialog("delete");
  };

  const closeDialog = () => {
    setOpenDialog(null);
    setCurrentContainer(null);
  };

  const handleCreateContainer = async (containerData: any) => {
    try {
      await addContainerMutation.mutateAsync(containerData);
      toast.success("Conteneur ajouté avec succès !");
      closeDialog();
    } catch (error) {
      console.error("Error creating container:", error);
      toast.error("Erreur lors de l'ajout du conteneur");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Gestion des Conteneurs</h2>
        <Button
          onClick={handleNew}
          className="flex items-center px-4 py-2 rounded-md"
        >
          <span className="mr-2 text-lg font-bold">+</span>
          Nouveau Conteneur
        </Button>
      </div>
      <div className="bg-white rounded-md shadow border">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="px-5 py-3 text-left font-semibold text-gray-700">Référence</th>
              <th className="px-5 py-3 text-left font-semibold text-gray-700">Client</th>
              <th className="px-5 py-3 text-left font-semibold text-gray-700">Origine</th>
              <th className="px-5 py-3 text-left font-semibold text-gray-700">Destination</th>
              <th className="px-5 py-3 text-left font-semibold text-gray-700">Statut</th>
              <th className="px-5 py-3 text-left font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center p-8 text-muted-foreground">
                  Chargement...
                </td>
              </tr>
            ) : (containers && containers.length > 0 ? (
              containers.map((container: any) => (
                <tr key={container.id || container.number} className="border-t last:border-b-0 hover:bg-gray-50">
                  <td className="px-5 py-4">{container.number}</td>
                  <td className="px-5 py-4">{container.client || "-"}</td>
                  <td className="px-5 py-4">{container.origin || "-"}</td>
                  <td className="px-5 py-4">{container.destination || "-"}</td>
                  <td className="px-5 py-4">{container.status || "-"}</td>
                  <td className="px-5 py-4 space-x-2 flex items-center">
                    <Button size="icon" variant="ghost" className="hover:bg-gray-100" title="Voir">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(container)} className="hover:bg-gray-100" title="Modifier">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(container)} className="hover:bg-gray-100" title="Supprimer">
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center p-8 text-muted-foreground">
                  Aucun conteneur enregistré pour le moment.
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {openDialog && (
        <>
          <CreateEditContainerDialog
            open={openDialog === "create" || openDialog === "edit"}
            onClose={closeDialog}
            container={openDialog === "edit" ? currentContainer : null}
            onSave={handleCreateContainer}
            defaultNumber={generateContainerNumber()}
            routes={routes}
            clients={clients}
          />
          {currentContainer && (
            <DeleteContainerDialog
              open={openDialog === "delete"}
              onClose={closeDialog}
              container={currentContainer}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ContainerManagerPage;
