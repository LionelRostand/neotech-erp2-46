
import React, { useState } from 'react';
import { useGarageData } from '@/hooks/garage/useGarageData';
import { Eye, Pencil, Trash, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NewSupplierDialog from './NewSupplierDialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const GarageSuppliersDashboard = () => {
  const { suppliers = [], isLoading, refetch } = useGarageData();
  const [showAddDialog, setShowAddDialog] = useState(false);

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Liste des fournisseurs</h2>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau fournisseur
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom de l'entreprise</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Adresse</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell>{supplier.name}</TableCell>
                <TableCell>{supplier.category}</TableCell>
                <TableCell>{supplier.contactName}</TableCell>
                <TableCell>{supplier.email}</TableCell>
                <TableCell>{supplier.phone}</TableCell>
                <TableCell>{supplier.address}</TableCell>
                <TableCell>{supplier.notes}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium inline-block
                    ${supplier.status === 'active' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                    {supplier.status === 'active' ? 'Actif' : 'Inactif'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" title="Voir">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Modifier">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Supprimer">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {suppliers.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  Aucun fournisseur trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <NewSupplierDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
        onSuccess={refetch}
      />
    </div>
  );
};

export default GarageSuppliersDashboard;
