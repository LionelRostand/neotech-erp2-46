
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchFreightCollection } from '@/hooks/fetchFreightCollectionData';
import { Container } from '@/types/freight';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import ContainerViewDialog from './ContainerViewDialog';
import ContainerEditDialog from './ContainerEditDialog';
import ContainerDeleteDialog from './ContainerDeleteDialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ContainersListWithCreateProps {
  onEditContainer?: (container: Container) => void;
}

const ContainersListWithCreate: React.FC<ContainersListWithCreateProps> = () => {
  const [selectedContainer, setSelectedContainer] = useState<Container | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: containers = [], isLoading, refetch } = useQuery({
    queryKey: ['freight', 'containers'],
    queryFn: () => fetchFreightCollection<Container>('CONTAINERS'),
  });

  if (isLoading) {
    return <div className="p-8 text-center">Chargement des conteneurs...</div>;
  }

  const handleViewContainer = (container: Container) => {
    setSelectedContainer(container);
    setViewDialogOpen(true);
  };

  const handleEditContainer = (container: Container) => {
    setSelectedContainer(container);
    setEditDialogOpen(true);
  };

  const handleDeleteContainer = (container: Container) => {
    setSelectedContainer(container);
    setDeleteDialogOpen(true);
  };

  const handleDeleteSuccess = () => {
    setDeleteDialogOpen(false);
    refetch();
    toast.success('Conteneur supprimé avec succès');
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Numéro</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {containers.map((container) => (
            <TableRow key={container.id}>
              <TableCell>{container.number}</TableCell>
              <TableCell>{container.type}</TableCell>
              <TableCell>{container.client}</TableCell>
              <TableCell>{container.status}</TableCell>
              <TableCell>{container.destination}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewContainer(container)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Voir
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditContainer(container)}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Modifier
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteContainer(container)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Supprimer
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedContainer && (
        <>
          <ContainerViewDialog
            isOpen={viewDialogOpen}
            onClose={() => setViewDialogOpen(false)}
            container={selectedContainer}
          />
          <ContainerEditDialog
            open={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
            container={selectedContainer}
            onSave={() => {
              setEditDialogOpen(false);
              refetch();
            }}
          />
          <ContainerDeleteDialog
            open={deleteDialogOpen} 
            onClose={() => setDeleteDialogOpen(false)}
            container={selectedContainer}
            onDeleted={handleDeleteSuccess}
          />
        </>
      )}
    </div>
  );
};

export default ContainersListWithCreate;
