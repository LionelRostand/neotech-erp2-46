
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Maintenance } from './types';

interface MaintenancesTableProps {
  maintenances: Maintenance[];
  onView: (maintenance: Maintenance) => void;
  onEdit: (maintenance: Maintenance) => void;
  onDelete: (maintenance: Maintenance) => void;
}

const MaintenancesTable: React.FC<MaintenancesTableProps> = ({
  maintenances,
  onView,
  onEdit,
  onDelete
}) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Coût</TableHead>
            <TableHead>Durée (min)</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {maintenances.length > 0 ? (
            maintenances.map((maintenance) => (
              <TableRow key={maintenance.id}>
                <TableCell className="font-medium">{maintenance.name}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {maintenance.description}
                </TableCell>
                <TableCell>{maintenance.cost}€</TableCell>
                <TableCell>{maintenance.duration}</TableCell>
                <TableCell>
                  <Badge 
                    variant={maintenance.status === 'active' ? 'default' : 'secondary'}
                    className={
                      maintenance.status === 'active' 
                        ? 'bg-emerald-500 hover:bg-emerald-600' 
                        : 'bg-gray-500 hover:bg-gray-600'
                    }
                  >
                    {maintenance.status === 'active' ? 'Actif' : 'Inactif'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onView(maintenance)}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Voir</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onEdit(maintenance)}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Modifier</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onDelete(maintenance)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Supprimer</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                Aucun service trouvé
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default MaintenancesTable;
