
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import AddAppointmentDialog from './AddAppointmentDialog';
import { useGarageData } from '@/hooks/garage/useGarageData';
import StatusBadge from '@/components/StatusBadge';
import { format, isValid } from 'date-fns';

const GarageAppointmentsDashboard = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { appointments, clients, isLoading } = useGarageData();

  const columns = [
    {
      header: "Client",
      accessorKey: "clientName",
    },
    {
      header: "Date",
      accessorKey: "date",
      cell: ({ row }) => {
        try {
          const dateValue = row.original.date;
          if (!dateValue) return "N/A";
          
          const date = new Date(dateValue);
          return isValid(date) ? format(date, 'dd/MM/yyyy') : "Date invalide";
        } catch (error) {
          console.error("Error formatting date:", error, row.original);
          return "Date invalide";
        }
      },
    },
    {
      header: "Heure",
      accessorKey: "time",
    },
    {
      header: "Type",
      accessorKey: "type",
      cell: ({ row }) => {
        const types = {
          maintenance: "Maintenance",
          reparation: "Réparation",
          diagnostic: "Diagnostic",
          revision: "Révision"
        };
        return types[row.original.type as keyof typeof types] || row.original.type;
      }
    },
    {
      header: "Statut",
      accessorKey: "status",
      cell: ({ row }) => {
        const statuses = {
          pending: { label: "En attente", status: "warning" },
          confirmed: { label: "Confirmé", status: "success" },
          canceled: { label: "Annulé", status: "danger" },
          completed: { label: "Terminé", status: "success" },
        };
        const status = row.original.status;
        const statusInfo = statuses[status as keyof typeof statuses] || { label: status, status: "default" };
        return <StatusBadge status={statusInfo.status}>{statusInfo.label}</StatusBadge>;
      }
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Rendez-vous</h1>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau rendez-vous
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <DataTable
            columns={columns}
            data={appointments}
            isLoading={isLoading}
            emptyMessage="Aucun rendez-vous trouvé"
          />
        </CardContent>
      </Card>

      <AddAppointmentDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />
    </div>
  );
};

export default GarageAppointmentsDashboard;
