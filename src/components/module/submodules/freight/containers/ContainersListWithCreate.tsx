
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/types/freight";
import { useContainersData } from "@/hooks/modules/useContainersData";
import ContainerDeleteDialog from "./ContainerDeleteDialog";
import ContainerViewDialog from "./ContainerViewDialog";
import ContainerEditDialog from "./ContainerEditDialog";

interface Props {
  onEditContainer: (container: Container) => void;
}

const ContainersListWithCreate: React.FC<Props> = ({ onEditContainer }) => {
  const [selectedContainer, setSelectedContainer] = React.useState<Container | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const { containers, isLoading, error } = useContainersData();

  const calculateTotalCost = (costs: any[] = []) => {
    return costs.reduce((total, cost) => total + Number(cost.amount), 0);
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur lors du chargement des conteneurs</div>;
  }

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
            <TableHead>Coût</TableHead>
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
                {container.costs && container.costs.length > 0 
                  ? `${calculateTotalCost(container.costs).toLocaleString('fr-FR')} €` 
                  : '0 €'}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      setSelectedContainer(container);
                      setIsViewDialogOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onEditContainer(container)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => {
                      setSelectedContainer(container);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash className="h-4 w-4" />
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
            open={isViewDialogOpen}
            onClose={() => {
              setIsViewDialogOpen(false);
              setSelectedContainer(null);
            }}
            container={selectedContainer}
          />
          <ContainerDeleteDialog
            open={isDeleteDialogOpen}
            onClose={() => {
              setIsDeleteDialogOpen(false);
              setSelectedContainer(null);
            }}
            container={selectedContainer}
          />
        </>
      )}
    </div>
  );
};

export default ContainersListWithCreate;
