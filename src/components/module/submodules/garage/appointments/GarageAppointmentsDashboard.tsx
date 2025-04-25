
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Plus, Eye, Pencil, Trash2, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useGarageData } from '@/hooks/garage/useGarageData';
import { DataTable } from "@/components/ui/data-table";
import AppointmentsStats from './components/AppointmentsStats';
import type { Column } from "@/types/table-types";
import ViewAppointmentDialog from './ViewAppointmentDialog';
import EditAppointmentDialog from './EditAppointmentDialog';
import DeleteAppointmentDialog from './DeleteAppointmentDialog';
import AddAppointmentDialog from './AddAppointmentDialog';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

type Appointment = {
  id: string;
  clientId: string;
  vehicleId: string;
  mechanicId: string;
  serviceId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
};

const GarageAppointmentsDashboard = () => {
  const { appointments = [], clients = [], vehicles = [], mechanics = [], services = [], isLoading } = useGarageData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  // Get counts for the stats component
  const scheduledAppointments = appointments.filter(a => a.status === 'scheduled');
  const inProgressAppointments = appointments.filter(a => a.status === 'in-progress');
  const completedAppointments = appointments.filter(a => a.status === 'completed');
  
  // Helper function to get client name by id
  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? `${client.firstName} ${client.lastName}` : 'Client inconnu';
  };
  
  // Helper function to get vehicle info by id
  const getVehicleInfo = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.make} ${vehicle.model}` : 'Véhicule inconnu';
  };
  
  // Helper function to get mechanic name by id
  const getMechanicName = (mechanicId: string) => {
    const mechanic = mechanics.find(m => m.id === mechanicId);
    return mechanic ? `${mechanic.firstName} ${mechanic.lastName}` : 'Mécanicien inconnu';
  };
  
  // Helper function to get service name by id
  const getServiceName = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.name : 'Service inconnu';
  };
  
  // Function to handle view appointment
  const handleView = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsViewOpen(true);
  };
  
  // Function to handle edit appointment
  const handleEdit = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsEditOpen(true);
  };
  
  // Function to handle delete appointment
  const handleDelete = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDeleteOpen(true);
  };
  
  // DataTable columns configuration
  const columns: Column[] = [
    { header: "Client", 
      accessorFn: (row: Appointment) => getClientName(row.clientId) 
    },
    { header: "Véhicule", 
      accessorFn: (row: Appointment) => getVehicleInfo(row.vehicleId) 
    },
    { header: "Date", 
      accessorFn: (row: Appointment) => {
        try {
          return format(new Date(row.date), 'dd/MM/yyyy');
        } catch (e) {
          return row.date || 'N/A';
        }
      } 
    },
    { header: "Heure", accessorKey: "time" },
    { header: "Mécanicien", 
      accessorFn: (row: Appointment) => getMechanicName(row.mechanicId) 
    },
    { header: "Service", 
      accessorFn: (row: Appointment) => getServiceName(row.serviceId) 
    },
    { header: "Statut", accessorKey: "status",
      cell: ({ row }) => {
        const status = row.original.status;
        return status === 'scheduled' ? 'Prévu' :
               status === 'in-progress' ? 'En cours' :
               status === 'completed' ? 'Terminé' :
               status === 'cancelled' ? 'Annulé' : status;
      }
    },
    { 
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleView(row.original)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleEdit(row.original)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(row.original)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  // Check if there's no appointments data
  if (!appointments.length) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Rendez-vous</h1>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau rendez-vous
          </Button>
        </div>

        <Card className="p-8 text-center">
          <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-medium mb-2">Aucun rendez-vous</h2>
          <p className="text-gray-500 mb-6">Vous n'avez pas encore de rendez-vous programmés</p>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un rendez-vous
          </Button>
        </Card>
        
        <AddAppointmentDialog 
          open={isAddDialogOpen} 
          onOpenChange={setIsAddDialogOpen} 
          clients={clients}
          vehicles={vehicles}
          mechanics={mechanics}
          services={services}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Rendez-vous</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau rendez-vous
        </Button>
      </div>

      <AppointmentsStats
        scheduledCount={scheduledAppointments.length}
        inProgressCount={inProgressAppointments.length}
        completedCount={completedAppointments.length}
        totalCount={appointments.length}
      />

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Liste des rendez-vous</h2>
        </div>
        <DataTable 
          columns={columns}
          data={appointments}
          isLoading={isLoading}
        />
      </Card>

      {/* Add Dialog */}
      <AddAppointmentDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
        clients={clients}
        vehicles={vehicles}
        mechanics={mechanics}
        services={services}
      />

      {/* View Dialog */}
      {selectedAppointment && (
        <ViewAppointmentDialog
          appointment={selectedAppointment}
          isOpen={isViewOpen}
          onClose={() => {
            setIsViewOpen(false);
            setSelectedAppointment(null);
          }}
          getClientName={getClientName}
          getVehicleInfo={getVehicleInfo}
          getMechanicName={getMechanicName}
          getServiceName={getServiceName}
        />
      )}

      {/* Edit Dialog */}
      {selectedAppointment && (
        <EditAppointmentDialog
          appointment={selectedAppointment}
          isOpen={isEditOpen}
          onClose={() => {
            setIsEditOpen(false);
            setSelectedAppointment(null);
          }}
          clients={clients}
          vehicles={vehicles}
          mechanics={mechanics}
          services={services}
        />
      )}

      {/* Delete Dialog */}
      {selectedAppointment && (
        <DeleteAppointmentDialog
          appointment={selectedAppointment}
          isOpen={isDeleteOpen}
          onClose={() => {
            setIsDeleteOpen(false);
            setSelectedAppointment(null);
          }}
          getClientName={getClientName}
          getVehicleInfo={getVehicleInfo}
        />
      )}
    </div>
  );
};

export default GarageAppointmentsDashboard;
