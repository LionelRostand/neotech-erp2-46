
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Calendar } from 'lucide-react';
import { useGarageData } from '@/hooks/garage/useGarageData';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import CreateAppointmentDialog from './CreateAppointmentDialog';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const GarageAppointmentsDashboard = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { appointments = [], clients = [], vehicles = [], isLoading } = useGarageData();

  // Format la date dans un format français
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP', { locale: fr });
    } catch (e) {
      return dateString || 'Date non spécifiée';
    }
  };

  // Format l'heure dans un format français
  const formatTime = (timeString: string) => {
    return timeString || 'Heure non spécifiée';
  };

  // Obtenir le badge de statut
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500">Confirmé</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">En attente</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Annulé</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500">Terminé</Badge>;
      default:
        return <Badge>{status || 'Non défini'}</Badge>;
    }
  };

  // Données de test pour les rendez-vous si aucun n'existe
  const mockAppointments = [
    {
      id: 'appt1',
      date: '2025-05-02',
      time: '09:30',
      clientId: 'client1',
      clientName: 'Jean Dupont',
      vehicleMake: 'Renault',
      vehicleModel: 'Clio',
      service: 'Entretien standard',
      status: 'confirmed',
      notes: 'Première visite'
    },
    {
      id: 'appt2',
      date: '2025-05-02',
      time: '11:00',
      clientId: 'client2',
      clientName: 'Marie Martin',
      vehicleMake: 'Peugeot',
      vehicleModel: '308',
      service: 'Changement de pneus',
      status: 'pending',
      notes: ''
    },
    {
      id: 'appt3',
      date: '2025-05-03',
      time: '14:30',
      clientId: 'client3',
      clientName: 'Pierre Durand',
      vehicleMake: 'Citroën',
      vehicleModel: 'C3',
      service: 'Diagnostic électronique',
      status: 'confirmed',
      notes: 'Client prioritaire'
    }
  ];

  // Utiliser les données mockées si aucun rendez-vous n'est disponible
  const displayAppointments = appointments.length > 0 ? appointments : mockAppointments;

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement des rendez-vous...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Rendez-vous</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau rendez-vous
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Liste des rendez-vous</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Heure</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Véhicule</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayAppointments.length > 0 ? (
                displayAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>{formatDate(appointment.date)}</TableCell>
                    <TableCell>{formatTime(appointment.time)}</TableCell>
                    <TableCell>{appointment.clientName}</TableCell>
                    <TableCell>
                      {appointment.vehicleMake && appointment.vehicleModel
                        ? `${appointment.vehicleMake} ${appointment.vehicleModel}`
                        : 'Non spécifié'}
                    </TableCell>
                    <TableCell>{appointment.type || appointment.service || 'Non spécifié'}</TableCell>
                    <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Calendar className="h-12 w-12 mb-2 opacity-20" />
                      <p>Aucun rendez-vous trouvé</p>
                      <p className="text-sm">Cliquez sur "Nouveau rendez-vous" pour en ajouter un.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreateAppointmentDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        clients={clients}
        vehicles={vehicles}
      />
    </div>
  );
};

export default GarageAppointmentsDashboard;
