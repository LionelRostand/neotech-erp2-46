
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateAppointmentDialog from './CreateAppointmentDialog';
import { DataTable } from "@/components/ui/data-table";
import { useGarageAppointments } from '@/hooks/garage/useGarageAppointments';
import { useGarageClients } from '@/hooks/garage/useGarageClients';
import { useGarageServices } from '@/hooks/garage/useGarageServices';
import { Column } from '@/types/table-types';
import StatusBadge from '@/components/StatusBadge';

const GarageAppointmentsDashboard = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { appointments, isLoading } = useGarageAppointments();
  const { clients } = useGarageClients();
  const { services } = useGarageServices();

  const columns: Column[] = [
    {
      header: "Client",
      accessorKey: "clientId",
      cell: ({ row }) => {
        const client = clients.find(c => c.id === row.original.clientId);
        return client ? `${client.firstName} ${client.lastName}` : row.original.clientId;
      }
    },
    {
      header: "Service",
      accessorKey: "serviceId",
      cell: ({ row }) => {
        const service = services.find(s => s.id === row.original.serviceId);
        return service ? service.name : row.original.serviceId;
      }
    },
    {
      header: "Date",
      accessorKey: "date"
    },
    {
      header: "Heure",
      accessorKey: "time"
    },
    {
      header: "Statut",
      accessorKey: "status",
      cell: ({ row }) => {
        const statusMap = {
          pending: { label: "En attente", variant: "warning" },
          confirmed: { label: "Confirmé", variant: "success" },
          cancelled: { label: "Annulé", variant: "destructive" },
          completed: { label: "Terminé", variant: "default" }
        };
        
        // Extract the status from the row
        const statusKey = row.original.status as keyof typeof statusMap;
        
        // Provide a fallback for unknown status values
        const status = statusMap[statusKey] || { label: statusKey || "Inconnu", variant: "default" };
        
        return <StatusBadge status={status.variant}>{status.label}</StatusBadge>;
      }
    }
  ];

  const handleCreateAppointment = async (data: any) => {
    console.log('Creating new appointment:', data);
    // TODO: Implement appointment creation
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Rendez-vous</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Nouveau Rendez-vous</span>
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={appointments}
        isLoading={isLoading}
      />

      <CreateAppointmentDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateAppointment}
      />
    </div>
  );
};

export default GarageAppointmentsDashboard;
