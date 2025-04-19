
import React, { useState } from 'react';
import { Calendar, Plus, Search, X, Check, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useHealthData } from '@/hooks/modules/useHealthData';
import { Appointment, Patient, Doctor } from './types/health-types';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useFirestore } from '@/hooks/useFirestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import FormDialog from "./dialogs/FormDialog";
import AddAppointmentForm from "./forms/AddAppointmentForm";
import { AppointmentFormValues } from "./schemas/formSchemas";

const AppointmentsPage: React.FC = () => {
  const { appointments, patients, doctors, isLoading } = useHealthData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { add, update } = useFirestore(COLLECTIONS.HEALTH.APPOINTMENTS);

  const getPatientName = (patientId: string) => {
    const patient = patients?.find(p => p.id === patientId);
    return patient ? `${patient.lastName} ${patient.firstName}` : 'Patient inconnu';
  };

  const getDoctorName = (doctorId: string) => {
    const doctor = doctors?.find(d => d.id === doctorId);
    return doctor ? `Dr. ${doctor.lastName} ${doctor.firstName}` : 'Médecin inconnu';
  };

  const filteredAppointments = appointments?.filter(appointment => {
    const patientName = getPatientName(appointment.patientId).toLowerCase();
    const doctorName = getDoctorName(appointment.doctorId).toLowerCase();
    
    return patientName.includes(searchTerm.toLowerCase()) || 
           doctorName.includes(searchTerm.toLowerCase()) ||
           appointment.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
           appointment.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           appointment.status.toLowerCase().includes(searchTerm.toLowerCase());
  }) || [];

  const handleCompleteAppointment = async (appointment: Appointment) => {
    try {
      if (appointment.id) {
        await update(appointment.id, {
          ...appointment,
          status: 'completed',
          updatedAt: new Date().toISOString()
        });
        toast.success('Rendez-vous marqué comme terminé');
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast.error('Erreur lors de la mise à jour du rendez-vous');
    }
  };

  const handleCancelAppointment = async (appointment: Appointment) => {
    try {
      if (appointment.id) {
        await update(appointment.id, {
          ...appointment,
          status: 'cancelled',
          updatedAt: new Date().toISOString()
        });
        toast.success('Rendez-vous annulé');
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error('Erreur lors de l\'annulation du rendez-vous');
    }
  };

  const handleAddAppointment = async (data: AppointmentFormValues) => {
    try {
      await add({
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setIsAddDialogOpen(false);
      toast.success("Rendez-vous ajouté avec succès");
    } catch (error) {
      console.error("Error adding appointment:", error);
      toast.error("Erreur lors de l'ajout du rendez-vous");
    }
  };

  const columns = [
    {
      key: 'date',
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }: { row: any }) => {
        try {
          return format(new Date(row.original.date), 'dd/MM/yyyy', { locale: fr });
        } catch (error) {
          return row.original.date;
        }
      }
    },
    {
      key: 'time',
      accessorKey: 'time',
      header: 'Heure',
    },
    {
      key: 'patientId',
      accessorKey: 'patientId',
      header: 'Patient',
      cell: ({ row }: { row: any }) => (
        <div>{getPatientName(row.original.patientId)}</div>
      ),
    },
    {
      key: 'doctorId',
      accessorKey: 'doctorId',
      header: 'Médecin',
      cell: ({ row }: { row: any }) => (
        <div>{getDoctorName(row.original.doctorId)}</div>
      ),
    },
    {
      key: 'reason',
      accessorKey: 'reason',
      header: 'Motif',
    },
    {
      key: 'status',
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }: { row: any }) => (
        <StatusBadge status={row.original.status} />
      ),
    },
    {
      key: 'actions',
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: { row: any }) => {
        const appointment = row.original;
        return (
          <div className="flex items-center justify-end gap-2">
            {appointment.status === 'scheduled' || appointment.status === 'confirmed' ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleCompleteAppointment(appointment)}
                >
                  <Check className="mr-1 h-4 w-4" />
                  Terminer
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleCancelAppointment(appointment)}
                >
                  <X className="mr-1 h-4 w-4" />
                  Annuler
                </Button>
              </>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  toast.info("Affichage du rendez-vous à implémenter");
                }}
              >
                Voir
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="h-6 w-6 text-primary" />
          Rendez-vous
        </h1>
        <Button onClick={() => setIsAddDialogOpen(true)} disabled={isLoading}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Rendez-vous
        </Button>
      </div>

      <div className="flex items-center gap-2 w-full max-w-sm">
        <Search className="w-4 h-4 text-gray-500" />
        <Input
          placeholder="Rechercher un rendez-vous..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
      </div>

      <Card className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
        <DataTable
          columns={columns}
          data={filteredAppointments}
          isLoading={isLoading}
          noDataText="Aucun rendez-vous trouvé"
          searchPlaceholder="Rechercher un rendez-vous..."
        />
      </Card>

      <FormDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        title="Nouveau Rendez-vous"
        description="Planifier un nouveau rendez-vous"
      >
        <AddAppointmentForm
          onSubmit={handleAddAppointment}
          onCancel={() => setIsAddDialogOpen(false)}
          patients={patients || []}
          doctors={doctors || []}
        />
      </FormDialog>
    </div>
  );
};

export default AppointmentsPage;
