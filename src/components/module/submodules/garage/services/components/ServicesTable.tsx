
import React, { useState } from 'react';
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
import { GarageService } from '../../types/garage-types';
import ViewServiceDialog from '../ViewServiceDialog';
import EditServiceDialog from '../EditServiceDialog';
import DeleteServiceDialog from '../DeleteServiceDialog';

interface ServicesTableProps {
  services: GarageService[];
  onServiceModified: () => void;
}

const ServicesTable = ({ services, onServiceModified }: ServicesTableProps) => {
  const [selectedService, setSelectedService] = useState<GarageService | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom du service</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Coût (€)</TableHead>
            <TableHead>Durée (min)</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell>{service.name}</TableCell>
              <TableCell>{service.description}</TableCell>
              <TableCell>{service.cost}€</TableCell>
              <TableCell>{service.duration}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      setSelectedService(service);
                      setViewDialogOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      setSelectedService(service);
                      setEditDialogOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      setSelectedService(service);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ViewServiceDialog
        service={selectedService}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />

      <EditServiceDialog
        service={selectedService}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onServiceUpdated={onServiceModified}
      />

      <DeleteServiceDialog
        service={selectedService}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onServiceDeleted={onServiceModified}
      />
    </>
  );
};

export default ServicesTable;
