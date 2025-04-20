
import React from 'react';
import { useGarageData } from '@/hooks/garage/useGarageData';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Package } from 'lucide-react';
import StatCard from '@/components/StatCard';

const GarageInventoryDashboard = () => {
  const { inventory, isLoading } = useGarageData();

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  const lowStock = inventory.filter(item => item.quantity <= item.minQuantity);
  const outOfStock = inventory.filter(item => item.quantity === 0);

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
      cell: ({ row }) => `${row.original.price.toLocaleString()} €`
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium
          ${row.original.status === 'in_stock' ? 'bg-green-100 text-green-800' :
          row.original.status === 'low_stock' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'}`}>
          {row.original.status === 'in_stock' ? 'En stock' :
           row.original.status === 'low_stock' ? 'Stock bas' : 'Rupture'}
        </span>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Inventaire</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Articles"
          value={inventory.length.toString()}
          icon={<Package className="h-4 w-4" />}
          description="Tous les articles"
        />
        
        <StatCard
          title="Stock Faible"
          value={lowStock.length.toString()}
          icon={<Package className="h-4 w-4" />}
          description="Articles à réapprovisionner"
        />
        
        <StatCard
          title="Rupture de Stock"
          value={outOfStock.length.toString()}
          icon={<Package className="h-4 w-4" />}
          description="Articles épuisés"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={inventory} />
        </CardContent>
      </Card>
    </div>
  );
};

export default GarageInventoryDashboard;
