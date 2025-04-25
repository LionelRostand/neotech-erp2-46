
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
import { Eye, Pencil, Trash2 } from "lucide-react";
import type { Mechanic } from '../../types/garage-types';

interface MechanicsTableProps {
  mechanics: Mechanic[];
  onView: (mechanic: Mechanic) => void;
  onEdit: (mechanic: Mechanic) => void;
  onDelete: (mechanic: Mechanic) => void;
}

const MechanicsTable = ({ mechanics, onView, onEdit, onDelete }: MechanicsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>PRÉNOM</TableHead>
          <TableHead>NOM</TableHead>
          <TableHead>EMAIL</TableHead>
          <TableHead>TÉLÉPHONE</TableHead>
          <TableHead>SPÉCIALISATION</TableHead>
          <TableHead>STATUT</TableHead>
          <TableHead>ACTIONS</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mechanics.map((mechanic) => (
          <TableRow key={mechanic.id}>
            <TableCell>{mechanic.firstName}</TableCell>
            <TableCell>{mechanic.lastName}</TableCell>
            <TableCell>{mechanic.email}</TableCell>
            <TableCell>{mechanic.phone}</TableCell>
            <TableCell>{Array.isArray(mechanic.specialization) ? mechanic.specialization.join(', ') : mechanic.specialization}</TableCell>
            <TableCell>{mechanic.status === 'available' ? 'Disponible' : mechanic.status === 'in_service' ? 'En service' : 'En pause'}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" onClick={() => onView(mechanic)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onEdit(mechanic)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(mechanic)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default MechanicsTable;
