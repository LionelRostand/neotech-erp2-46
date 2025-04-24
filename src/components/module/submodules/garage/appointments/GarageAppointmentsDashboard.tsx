
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users, CheckCircle } from "lucide-react";
import { format, isValid, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import StatCard from '@/components/StatCard';
import { useGarageData } from '@/hooks/garage/useGarageData';
import { DataTable } from '@/components/ui/data-table';
import EditAppointmentDialog from './EditAppointmentDialog';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

const GarageAppointmentsDashboard = () => {
  const { appointments, isLoading } = useGarageData();
  const [selectedAppointment, setSelectedAppointment] = React.useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

  const today = new Date().toISOString().split('T')[0];
  
  const todayAppointments = appointments.filter(a => a.date === today);
  const upcomingAppointments = appointments.filter(a => a.date > today);
  const completedAppointments = appointments.filter(a => a.status === 'completed');

  const handleUpdate = async (id: string, data: any) => {
    try {
      // Implement your update logic here
      toast.success('Rendez-vous mis à jour avec succès');
      setIsEditDialogOpen(false);
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du rendez-vous');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      // First, check if the date string is valid
      if (!dateString) return 'Date non disponible';
      
      const parsedDate = parseISO(dateString);
      
      // Verify the date is valid before formatting
      if (!isValid(parsedDate)) {
        return 'Date invalide';
      }
      
      return format(parsedDate, 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      console.error('Date formatting error:', error, dateString);
      return 'Erreur de date';
    }
  };

  const columns = [
    {
      accessorKey: "clientName",
      header: "Client",
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => formatDate(row.original.date)
    },
    {
      accessorKey: "time",
      header: "Heure",
    },
    {
      accessorKey: "service",
      header: "Service",
    },
    {
      accessorKey: "notes",
      header: "Notes",
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          onClick={() => {
            setSelectedAppointment(row.original);
            setIsEditDialogOpen(true);
          }}
        >
          Modifier
        </Button>
      )
    }
  ];

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold">Gestion des Rendez-vous</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="RDV Aujourd'hui"
          value={todayAppointments.length.toString()}
          icon={<Calendar className="h-4 w-4" />}
          description="Rendez-vous du jour"
          className="bg-blue-50 hover:bg-blue-100"
        />
        <StatCard
          title="À venir"
          value={upcomingAppointments.length.toString()}
          icon={<Clock className="h-4 w-4" />}
          description="Rendez-vous planifiés"
          className="bg-green-50 hover:bg-green-100"
        />
        <StatCard
          title="Clients"
          value={appointments.length.toString()}
          icon={<Users className="h-4 w-4" />}
          description="Total clients"
          className="bg-purple-50 hover:bg-purple-100"
        />
        <StatCard
          title="Terminés"
          value={completedAppointments.length.toString()}
          icon={<CheckCircle className="h-4 w-4" />}
          description="Rendez-vous terminés"
          className="bg-amber-50 hover:bg-amber-100"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Rendez-vous</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={appointments} 
          />
        </CardContent>
      </Card>

      <EditAppointmentDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        appointment={selectedAppointment}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default GarageAppointmentsDashboard;
