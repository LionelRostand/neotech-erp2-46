
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import { useContainers, useDeleteContainer } from "@/hooks/modules/useContainersFirestore";
import ContainerDetailsDialog from "./ContainerDetailsDialog";
import EditContainerDialog from "./EditContainerDialog";
import DeleteContainerDialog from "./DeleteContainerDialog";

const ContainerManagerPage = () => {
  const { data: containers = [], isLoading } = useContainers();

  // Popups
  const [selectedContainer, setSelectedContainer] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const { mutate: deleteContainer, isLoading: deleteLoading } = useDeleteContainer();

  const openView = (container: any) => {
    setSelectedContainer(container);
    setShowDetails(true);
  };

  const openEdit = (container: any) => {
    setSelectedContainer(container);
    setShowEdit(true);
  };

  const openDelete = (container: any) => {
    setSelectedContainer(container);
    setShowDelete(true);
  };

  const handleDelete = () => {
    if (selectedContainer && selectedContainer.id) {
      deleteContainer(selectedContainer.id, {
        onSuccess: () => {
          setShowDelete(false);
          setSelectedContainer(null);
        },
      });
    }
  };

  const getCarrierName = (str: string | undefined) => {
    if (!str) return "-";
    return str;
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Gestion des Conteneurs</h2>
      <div className="overflow-x-auto rounded shadow bg-white">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-5 py-3 text-left font-semibold text-gray-700">Numéro</th>
              <th className="px-5 py-3 text-left font-semibold text-gray-700">Type</th>
              <th className="px-5 py-3 text-left font-semibold text-gray-700">Taille</th>
              <th className="px-5 py-3 text-left font-semibold text-gray-700">Transporteur</th>
              <th className="px-5 py-3 text-left font-semibold text-gray-700">Origine</th>
              <th className="px-5 py-3 text-left font-semibold text-gray-700">Destination</th>
              <th className="px-5 py-3 text-left font-semibold text-gray-700">Coût</th>
              <th className="px-5 py-3 text-left font-semibold text-gray-700">Statut</th>
              <th className="px-5 py-3 text-left font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={9} className="text-center p-8 text-muted-foreground">
                  Chargement...
                </td>
              </tr>
            ) : containers.length > 0 ? (
              containers.map((container: any) => (
                <tr key={container.id}>
                  <td className="px-5 py-4">{container.number}</td>
                  <td className="px-5 py-4">{container.type}</td>
                  <td className="px-5 py-4">{container.size}</td>
                  <td className="px-5 py-4">{getCarrierName(container.carrierName)}</td>
                  <td className="px-5 py-4">{container.origin || "-"}</td>
                  <td className="px-5 py-4">{container.destination || "-"}</td>
                  <td className="px-5 py-4">
                    {typeof container.cost === "number"
                      ? <span className="text-green-700 font-medium">{container.cost.toLocaleString()} €</span>
                      : "-"}
                  </td>
                  <td className="px-5 py-4">{container.status || "-"}</td>
                  <td className="px-5 py-4 space-x-2 flex items-center">
                    <Button size="icon" variant="ghost" className="hover:bg-gray-100" title="Voir"
                      onClick={() => openView(container)}>
                      <Eye className="w-5 h-5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="hover:bg-gray-100" title="Modifier"
                      onClick={() => openEdit(container)}>
                      <Edit className="w-5 h-5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="hover:bg-gray-100" title="Supprimer"
                      onClick={() => openDelete(container)}>
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center p-8 text-muted-foreground">
                  Aucun conteneur enregistré pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ContainerDetailsDialog
        open={showDetails}
        onOpenChange={(op) => {
          setShowDetails(op);
          if (!op) setSelectedContainer(null);
        }}
        container={selectedContainer}
      />
      <EditContainerDialog
        open={showEdit}
        onOpenChange={(op) => {
          setShowEdit(op);
          if (!op) setSelectedContainer(null);
        }}
        container={selectedContainer}
      />
      <DeleteContainerDialog
        open={showDelete}
        onOpenChange={(op) => {
          setShowDelete(op);
          if (!op) setSelectedContainer(null);
        }}
        onDelete={handleDelete}
        containerNumber={selectedContainer?.number}
      />
    </div>
  );
};

export default ContainerManagerPage;
