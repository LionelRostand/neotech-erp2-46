
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from 'lucide-react';

interface RepairsTableProps {
  repairs: any[];
}

const RepairsTable = ({ repairs }: RepairsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Véhicule</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Mécanicien</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Progression</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {repairs.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center text-gray-500">
              Aucune réparation trouvée
            </TableCell>
          </TableRow>
        ) : (
          repairs.map((repair, index) => (
            <TableRow key={repair.id || index}>
              <TableCell>{repair.date}</TableCell>
              <TableCell>{repair.clientName}</TableCell>
              <TableCell>{repair.vehicleInfo}</TableCell>
              <TableCell>{repair.description}</TableCell>
              <TableCell>{repair.mechanicName}</TableCell>
              <TableCell>{repair.status}</TableCell>
              <TableCell>{repair.progress}%</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default RepairsTable;
