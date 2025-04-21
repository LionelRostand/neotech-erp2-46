
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
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useContainers } from "@/hooks/modules/useContainersFirestore";
import type { Container } from "@/types/freight";
import ContainerViewDialog from "./ContainerViewDialog";
import ContainerEditDialog from "./ContainerEditDialog";
import DeleteContainerDialog from "./DeleteContainerDialog";

const ContainersListWithCreate: React.FC = () => {
  const { data: containers = [], isLoading } = useContainers();
  const [selectedContainer, setSelectedContainer] = useState<Container | null>(null);
  
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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

  if (isLoading) {
    return <div className="text-center p-8">Chargement des conteneurs...</div>;
  }

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Numéro</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Taille</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Origine</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {containers.length > 0 ? (
            containers.map((container) => (
              <TableRow key={container.id}>
                <TableCell className="font-medium">{container.number}</TableCell>
                <TableCell>{container.type}</TableCell>
                <TableCell>{container.size}</TableCell>
                <TableCell>{container.client}</TableCell>
                <TableCell>{container.status}</TableCell>
                <TableCell>{container.origin}</TableCell>
                <TableCell>{container.destination}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(container)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(container)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(container)}
                    >
                      <Trash2 className="h-4 w-4" />
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
    </div>
  );
};

export default ContainersListWithCreate;
