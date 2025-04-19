
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { suppliers } from './suppliersData';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import NewSupplierForm from './NewSupplierForm';
import { Supplier } from '../types/garage-types';
import { useState } from 'react';

const GarageSuppliersDashboard = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [localSuppliers, setLocalSuppliers] = useState<Supplier[]>(suppliers);

  const handleAddSupplier = (supplier: Supplier) => {
    setLocalSuppliers(prev => [...prev, supplier]);
    setIsDialogOpen(false);
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Nom",
    },
    {
      accessorKey: "category",
      header: "Catégorie",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Téléphone",
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => (
        <div className={`px-2 py-1 rounded-full text-xs inline-block 
          ${row.original.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {row.original.status === 'active' ? 'Actif' : 'Inactif'}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Fournisseurs</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Fournisseur
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau fournisseur</DialogTitle>
            </DialogHeader>
            <NewSupplierForm onSubmit={handleAddSupplier} onCancel={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Fournisseurs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{localSuppliers.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Fournisseurs Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {localSuppliers.filter(s => s.status === 'active').length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Contrats Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {localSuppliers.reduce((sum, s) => sum + s.activeContracts, 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Fournisseurs</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={localSuppliers} />
        </CardContent>
      </Card>
    </div>
  );
};

export default GarageSuppliersDashboard;
