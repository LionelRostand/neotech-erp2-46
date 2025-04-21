
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash } from "lucide-react";
import { useContainers } from "@/hooks/modules/useContainersFirestore";
import type { Container } from "@/types/freight";
import ContainerViewDialog from "./ContainerViewDialog";
import ContainerEditDialog from "./ContainerEditDialog";
import DeleteContainerDialog from "./DeleteContainerDialog";
import CreateContainerDialog from "./CreateContainerDialog";

interface ContainersListWithCreateProps {
  addDialogOpen?: boolean;
  onCloseAddDialog?: () => void;
}

const ContainersListWithCreate: React.FC<ContainersListWithCreateProps> = ({
  addDialogOpen = false,
  onCloseAddDialog,
}) => {
  const { data: containers = [], isLoading } = useContainers();
  const [selectedContainer, setSelectedContainer] = useState<Container | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Gérer ouverture via le parent
  React.useEffect(() => {
    if (addDialogOpen) setShowAddDialog(true);
    else setShowAddDialog(false);
  }, [addDialogOpen]);

  const handleView = (container: Container) => {
    setSelectedContainer(container);
    setViewDialogOpen(true);
  };

  const handleEdit = (container: Container) => {
    setSelectedContainer(container);
    setEditDialogOpen(true);
  };

  const handleDelete = (container: Container) => {
    setSelectedContainer(container);
    setDeleteDialogOpen(true);
  };

  const closeViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedContainer(null);
  };

  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedContainer(null);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedContainer(null);
  };

  // Ajout : fermeture du dialogue
  const closeAddDialog = () => {
    setShowAddDialog(false);
    if (onCloseAddDialog) onCloseAddDialog();
  };

  if (isLoading) {
    return <div className="text-center p-8">Chargement des conteneurs...</div>;
  }

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Référence</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Transporteur</TableHead>
            <TableHead>Origine</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead>Coût</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {containers.length > 0 ? (
            containers.map((container) => (
              <TableRow key={container.id}>
                <TableCell className="font-medium">{container.number}</TableCell>
                <TableCell>{container.client || "-"}</TableCell>
                <TableCell>{container.carrier || "-"}</TableCell>
                <TableCell>{container.origin || "-"}</TableCell>
                <TableCell>{container.destination || "-"}</TableCell>
                <TableCell>
                  {container.cost != null && container.cost !== ""
                    ? <span className="text-green-600 font-semibold">{container.cost} €</span>
                    : "-"
                  }
                </TableCell>
                <TableCell>{container.status || "-"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Voir"
                      onClick={() => handleView(container)}
                      tabIndex={0}
                      aria-label="Voir"
                    >
                      <Eye className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Modifier"
                      onClick={() => handleEdit(container)}
                      tabIndex={0}
                      aria-label="Modifier"
                    >
                      <Edit className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Supprimer"
                      onClick={() => handleDelete(container)}
                      tabIndex={0}
                      aria-label="Supprimer"
                    >
                      <Trash className="h-5 w-5 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                Aucun conteneur trouvé
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <ContainerViewDialog
        open={viewDialogOpen}
        onClose={closeViewDialog}
        container={selectedContainer}
      />

      <ContainerEditDialog
        open={editDialogOpen}
        onClose={closeEditDialog}
        container={selectedContainer}
      />

      <DeleteContainerDialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        container={selectedContainer}
      />

      <CreateContainerDialog
        open={showAddDialog}
        onOpenChange={closeAddDialog}
      />
    </div>
  );
};

export default ContainersListWithCreate;
