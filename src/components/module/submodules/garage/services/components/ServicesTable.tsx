
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
import { ViewServiceDialog } from "../ViewServiceDialog";
import { EditServiceDialog } from "../EditServiceDialog";
import { DeleteServiceDialog } from "../DeleteServiceDialog";
import { Badge } from "@/components/ui/badge";

interface Service {
  id: string;
  name: string;
  description: string;
  cost: number;
  duration: number;
  status: string;
  createdAt: string;
}

interface ServicesTableProps {
  services: Service[];
  onServiceModified: () => void;
}

const ServicesTable: React.FC<ServicesTableProps> = ({ services, onServiceModified }) => {
  const [viewingService, setViewingService] = useState<Service | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingService, setDeletingService] = useState<Service | null>(null);

  const sortedServices = [...services].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <>
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
            {sortedServices.length > 0 ? (
              sortedServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{service.description}</TableCell>
                  <TableCell>{service.cost}€</TableCell>
                  <TableCell>{service.duration}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={service.status === 'active' ? 'default' : 'secondary'}
                      className={service.status === 'active' ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'}
                    >
                      {service.status === 'active' ? 'Actif' : 'Inactif'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setViewingService(service)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Voir</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setEditingService(service)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Modifier</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setDeletingService(service)}
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

      {viewingService && (
        <ViewServiceDialog
          service={viewingService}
          open={!!viewingService}
          onOpenChange={() => setViewingService(null)}
        />
      )}

      {editingService && (
        <EditServiceDialog
          service={editingService}
          open={!!editingService}
          onOpenChange={() => setEditingService(null)}
          onServiceUpdated={onServiceModified}
        />
      )}

      {deletingService && (
        <DeleteServiceDialog
          service={deletingService}
          open={!!deletingService}
          onOpenChange={() => setDeletingService(null)}
          onServiceDeleted={onServiceModified}
        />
      )}
    </>
  );
};

export default ServicesTable;
