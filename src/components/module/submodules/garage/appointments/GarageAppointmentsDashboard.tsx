
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { format, isValid } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import AddAppointmentDialog from './AddAppointmentDialog';
import ViewAppointmentDialog from './ViewAppointmentDialog';
import EditAppointmentDialog from './EditAppointmentDialog';
import { useGarageData } from '@/hooks/garage/useGarageData';
import StatusBadge from '@/components/StatusBadge';

const GarageAppointmentsDashboard = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { appointments, clients, isLoading } = useGarageData();

  const handleDelete = async () => {
    if (!selectedAppointment?.id) return;

    try {
      await deleteDoc(doc(db, COLLECTIONS.GARAGE.APPOINTMENTS, selectedAppointment.id));
      toast.success("Rendez-vous supprimé avec succès");
      setShowDeleteDialog(false);
      setSelectedAppointment(null);
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast.error("Erreur lors de la suppression du rendez-vous");
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
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setSelectedAppointment(row.original);
              setShowViewDialog(true);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setSelectedAppointment(row.original);
              setShowEditDialog(true);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setSelectedAppointment(row.original);
              setShowDeleteDialog(true);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
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

      {selectedAppointment && (
        <>
          <ViewAppointmentDialog
            appointment={selectedAppointment}
            open={showViewDialog}
            onClose={() => {
              setShowViewDialog(false);
              setSelectedAppointment(null);
            }}
          />

          <EditAppointmentDialog
            appointment={selectedAppointment}
            open={showEditDialog}
            onClose={() => {
              setShowEditDialog(false);
              setSelectedAppointment(null);
            }}
            onUpdate={() => {
              // The useGarageData hook will automatically refresh the data
            }}
          />

          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                <AlertDialogDescription>
                  Êtes-vous sûr de vouloir supprimer ce rendez-vous ? Cette action ne peut pas être annulée.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
                  Annuler
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
};

export default GarageAppointmentsDashboard;
