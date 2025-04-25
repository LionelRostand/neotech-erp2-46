
import React, { useState } from 'react';
import { useGarageData } from '@/hooks/garage/useGarageData';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Truck, Plus } from 'lucide-react';
import StatCard from '@/components/StatCard';
import { Button } from '@/components/ui/button';
import NewSupplierDialog from './NewSupplierDialog';

const GarageSuppliersDashboard = () => {
  const { suppliers = [], isLoading, refetch } = useGarageData();
  const [showAddDialog, setShowAddDialog] = useState(false);

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  // Ensure suppliers is an array even if it's undefined from useGarageData
  const suppliersArray = Array.isArray(suppliers) ? suppliers : [];
  const activeSuppliers = suppliersArray.filter(s => s.status === 'active');

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
        <span className={`px-2 py-1 rounded-full text-xs font-medium
          ${row.original.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {row.original.status === 'active' ? 'Actif' : 'Inactif'}
        </span>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Fournisseurs</h2>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau fournisseur
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Fournisseurs"
          value={suppliersArray.length.toString()}
          icon={<Truck className="h-4 w-4 text-primary-500" />}
          description="Tous les fournisseurs"
          className="bg-soft-purple hover:bg-soft-purple-100"
        />
        
        <StatCard
          title="Fournisseurs Actifs"
          value={activeSuppliers.length.toString()}
          icon={<Truck className="h-4 w-4 text-emerald-500" />}
          description="Fournisseurs actifs"
          className="bg-emerald-50 hover:bg-emerald-100"
        />
        
        <StatCard
          title="Catégories"
          value={Array.from(new Set(suppliersArray.map(s => s.category))).length.toString()}
          icon={<Truck className="h-4 w-4 text-amber-500" />}
          description="Types de fournisseurs"
          className="bg-amber-50 hover:bg-amber-100"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Fournisseurs</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={suppliersArray} />
        </CardContent>
      </Card>

      <NewSupplierDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
        onSuccess={refetch}
      />
    </div>
  );
};

export default GarageSuppliersDashboard;
