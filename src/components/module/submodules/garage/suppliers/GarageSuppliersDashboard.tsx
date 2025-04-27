
import React from 'react';
import { useGarageSuppliers } from '@/hooks/garage/useGarageSuppliers';
import { Eye, Pencil, Trash, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NewSupplierDialog from './NewSupplierDialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const GarageSuppliersDashboard = () => {
  const { suppliers = [], isLoading, refetch } = useGarageSuppliers();
  const [showAddDialog, setShowAddDialog] = React.useState(false);

  // Dashboard statistics
  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter(supplier => supplier.status === 'active').length;
  const inactiveSuppliers = totalSuppliers - activeSuppliers;

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Suppliers Dashboard */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 bg-blue-50">
          <div className="text-sm text-gray-600 mb-2">Total Fournisseurs</div>
          <div className="text-2xl font-bold">{totalSuppliers}</div>
        </Card>
        <Card className="p-4 bg-green-50">
          <div className="text-sm text-gray-600 mb-2">Fournisseurs Actifs</div>
          <div className="text-2xl font-bold text-green-700">{activeSuppliers}</div>
        </Card>
        <Card className="p-4 bg-red-50">
          <div className="text-sm text-gray-600 mb-2">Fournisseurs Inactifs</div>
          <div className="text-2xl font-bold text-red-700">{inactiveSuppliers}</div>
        </Card>
      </div>

      {/* Suppliers List Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Liste des fournisseurs</h2>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau fournisseur
        </Button>
      </div>

      {/* Suppliers List */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom de l'entreprise</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
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
                <TableCell>
                  <Badge 
                    variant={supplier.status === 'active' ? 'default' : 'secondary'}
                  >
                    {supplier.status === 'active' ? 'Actif' : 'Inactif'}
                  </Badge>
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
                <TableCell colSpan={7} className="text-center py-8">
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
