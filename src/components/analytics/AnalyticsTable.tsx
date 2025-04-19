
import React from 'react';
import { DataTable } from "@/components/ui/data-table";
import { useAnalyticsData } from '@/hooks/useAnalyticsData';

const AnalyticsTable = () => {
  const { monthlyData, loading } = useAnalyticsData();

  const columns = [
    {
      header: "Mois",
      key: "month",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.month}</div>
      )
    },
    {
      header: "Chiffre d'affaires",
      key: "revenue",
      cell: ({ row }) => (
        <div>€{row.original.revenue.toLocaleString()}</div>
      )
    },
    {
      header: "Clients",
      key: "customers",
      cell: ({ row }) => (
        <div>{row.original.customers}</div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Données Analytiques</h3>
      <DataTable
        columns={columns}
        data={monthlyData}
        isLoading={loading}
        emptyMessage="Aucune donnée analytique disponible"
      />
    </div>
  );
};

export default AnalyticsTable;
