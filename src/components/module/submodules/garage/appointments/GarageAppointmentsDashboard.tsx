
import React, { useState } from 'react';
import { useGarageData } from '@/hooks/garage/useGarageData';
import AppointmentsTable from './components/AppointmentsTable';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ViewAppointmentDialog from './ViewAppointmentDialog';
import EditAppointmentDialog from './EditAppointmentDialog';
import DeleteAppointmentDialog from './DeleteAppointmentDialog';
import CreateAppointmentDialog from './CreateAppointmentDialog';

const GarageAppointmentsDashboard = () => {
  const { appointments, isLoading } = useGarageData();
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  const handleView = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowViewDialog(true);
  };

  const handleEdit = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowEditDialog(true);
  };

  const handleDelete = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowDeleteDialog(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Liste des rendez-vous</h1>
        <Button onClick={() => setShowCreateDialog(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau rendez-vous
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <AppointmentsTable
          appointments={appointments}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {selectedAppointment && (
        <>
          <ViewAppointmentDialog
            open={showViewDialog}
            onOpenChange={setShowViewDialog}
            appointment={selectedAppointment}
          />
          <EditAppointmentDialog
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
            appointment={selectedAppointment}
          />
          <DeleteAppointmentDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            appointmentId={selectedAppointment.id}
          />
        </>
      )}

      <CreateAppointmentDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
};

export default GarageAppointmentsDashboard;
