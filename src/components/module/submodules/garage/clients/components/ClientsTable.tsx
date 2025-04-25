
import React from 'react';
import { DataTable } from "@/components/ui/data-table";
import { GarageClient } from '../types/garage-types';

interface ClientsTableProps {
  clients: GarageClient[];
}

const ClientsTable: React.FC<ClientsTableProps> = ({ clients }) => {
  const columns = [
    {
      accessorKey: "firstName",
      header: "Prénom",
    },
    {
      accessorKey: "lastName",
      header: "Nom",
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
      accessorKey: "address",
      header: "Adresse",
    },
    {
      accessorKey: "createdAt",
      header: "Date d'inscription",
      cell: ({ row }) => {
        const date = row.original.createdAt;
        return date ? new Date(date).toLocaleDateString('fr-FR') : '-';
      },
    },
  ];

  return (
    <DataTable 
      columns={columns} 
      data={clients} 
    />
  );
};

export default ClientsTable;
