
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Package, Plus } from 'lucide-react';
import StatCard from '@/components/StatCard';
import { Button } from '@/components/ui/button';
import NewInventoryDialog from './NewInventoryDialog';
import { useGarageInventory } from '@/hooks/garage/useGarageInventory';

const GarageInventoryDashboard = () => {
  const { inventory, lowStock, outOfStock, isLoading, refetch } = useGarageInventory();
  const [showAddDialog, setShowAddDialog] = useState(false);

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
      accessorKey: "quantity",
      header: "Quantité",
    },
    {
      accessorKey: "price",
      header: "Prix",
      cell: ({ row }) => {
        const price = row.original.price || 0;
        return `${price.toLocaleString()} €`;
      }
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium
            ${status === 'in_stock' ? 'bg-green-100 text-green-800' :
            status === 'low_stock' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'}`}>
            {status === 'in_stock' ? 'En stock' :
             status === 'low_stock' ? 'Stock bas' : 'Rupture'}
          </span>
        );
      }
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Inventaire</h2>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvel article
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Articles"
          value={inventory.length.toString()}
          icon={<Package className="h-4 w-4 text-blue-500" />}
          description="Tous les articles"
          className="bg-blue-50 hover:bg-blue-100"
        />
        
        <StatCard
          title="Stock Faible"
          value={lowStock.length.toString()}
          icon={<Package className="h-4 w-4 text-amber-500" />}
          description="Articles à réapprovisionner"
          className="bg-amber-50 hover:bg-amber-100"
        />
        
        <StatCard
          title="Rupture de Stock"
          value={outOfStock.length.toString()}
          icon={<Package className="h-4 w-4 text-red-500" />}
          description="Articles épuisés"
          className="bg-red-50 hover:bg-red-100"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={inventory}
            isLoading={isLoading} 
          />
        </CardContent>
      </Card>

      <NewInventoryDialog 
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSuccess={refetch}
      />
    </div>
  );
};

export default GarageInventoryDashboard;
