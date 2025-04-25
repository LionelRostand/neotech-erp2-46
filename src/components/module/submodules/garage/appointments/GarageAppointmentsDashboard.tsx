
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Plus, Calendar, Clock, UserCheck, AlertTriangle } from "lucide-react";
import { useGarageData } from '@/hooks/garage/useGarageData';
import { format, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';
import StatusBadge from '@/components/StatusBadge';
import AddAppointmentDialog from './AddAppointmentDialog';
import ViewAppointmentDialog from './ViewAppointmentDialog';
import EditAppointmentDialog from './EditAppointmentDialog';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

const GarageAppointmentsDashboard = () => {
  const { appointments, isLoading } = useGarageData();
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  const [selectedAppointment, setSelectedAppointment] = React.useState<any>(null);
  const [showViewDialog, setShowViewDialog] = React.useState(false);
  const [showEditDialog, setShowEditDialog] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  const pendingAppointments = appointments.filter(a => a.status === 'pending');
  const confirmedAppointments = appointments.filter(a => a.status === 'confirmed');
  const canceledAppointments = appointments.filter(a => a.status === 'canceled');
  const todayAppointments = appointments.filter(a => {
    const appointmentDate = new Date(a.date);
    const today = new Date();
    return appointmentDate.toDateString() === today.toDateString();
  });

  const handleDelete = async () => {
    if (selectedAppointment) {
      try {
        await deleteDoc(doc(db, COLLECTIONS.GARAGE.APPOINTMENTS, selectedAppointment.id));
        toast.success("Rendez-vous supprimé avec succès");
        setShowDeleteDialog(false);
        setSelectedAppointment(null);
      } catch (error) {
        console.error('Error deleting appointment:', error);
        toast.error("Erreur lors de la suppression du rendez-vous");
      }
    }
  };

  const columns = [
    {
      header: "Client",
      accessorKey: "clientName",
    },
    {
      header: "Date",
      accessorKey: "date",
      cell: ({ row }: { row: any }) => {
        const date = new Date(row.original.date);
        return isValid(date) ? format(date, 'dd MMMM yyyy', { locale: fr }) : 'Date invalide';
      },
    },
    {
      header: "Heure",
      accessorKey: "time",
    },
    {
      header: "Type",
      accessorKey: "type",
      cell: ({ row }: { row: any }) => {
        const typeMap: { [key: string]: string } = {
          maintenance: "Maintenance",
          reparation: "Réparation",
          diagnostic: "Diagnostic",
          revision: "Révision"
        };
        return typeMap[row.original.type] || row.original.type;
      },
    },
    {
      header: "Statut",
      accessorKey: "status",
      cell: ({ row }: { row: any }) => (
        <StatusBadge status={row.original.status}>
          {row.original.status === 'pending' ? 'En attente' :
           row.original.status === 'confirmed' ? 'Confirmé' :
           row.original.status === 'canceled' ? 'Annulé' :
           row.original.status === 'completed' ? 'Terminé' : 
           row.original.status}
        </StatusBadge>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }: { row: any }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => {
            setSelectedAppointment(row.original);
            setShowViewDialog(true);
          }}>
            Voir
          </Button>
          <Button variant="ghost" size="sm" onClick={() => {
            setSelectedAppointment(row.original);
            setShowEditDialog(true);
          }}>
            Modifier
          </Button>
          <Button variant="ghost" size="sm" onClick={() => {
            setSelectedAppointment(row.original);
            setShowDeleteDialog(true);
          }}>
            Supprimer
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Rendez-vous</h1>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau rendez-vous
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-blue-50 hover:bg-blue-100 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span>Aujourd'hui</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{todayAppointments.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 hover:bg-yellow-100 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <span>En attente</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingAppointments.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 hover:bg-green-100 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-green-600" />
              <span>Confirmés</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{confirmedAppointments.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 hover:bg-red-100 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span>Annulés</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{canceledAppointments.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des rendez-vous</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={appointments}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      {showAddDialog && (
        <AddAppointmentDialog 
          open={showAddDialog}
          onClose={() => setShowAddDialog(false)}
        />
      )}

      {showViewDialog && selectedAppointment && (
        <ViewAppointmentDialog 
          open={showViewDialog}
          onClose={() => {
            setShowViewDialog(false);
            setSelectedAppointment(null);
          }}
          appointment={selectedAppointment}
        />
      )}

      {showEditDialog && selectedAppointment && (
        <EditAppointmentDialog 
          open={showEditDialog}
          onClose={() => {
            setShowEditDialog(false);
            setSelectedAppointment(null);
          }}
          appointment={selectedAppointment}
          onUpdate={() => {
            setShowEditDialog(false);
            setSelectedAppointment(null);
          }}
        />
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Cela supprimera définitivement le rendez-vous.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GarageAppointmentsDashboard;
