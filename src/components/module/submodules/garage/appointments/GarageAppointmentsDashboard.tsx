
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Plus, Eye, Edit, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from "@/components/ui/badge";
import { collection, query, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { useToast } from '@/hooks/use-toast';
import ViewAppointmentDialog from './ViewAppointmentDialog';
import EditAppointmentDialog from './EditAppointmentDialog';
import DeleteAppointmentDialog from './DeleteAppointmentDialog';

type Appointment = {
  id: string;
  clientName: string;
  date: string;
  time: string;
  service: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
};

const GarageAppointmentsDashboard = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Add the missing state variables
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    const appointmentsRef = collection(db, COLLECTIONS.GARAGE.APPOINTMENTS);
    const q = query(appointmentsRef);
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const appointmentData: Appointment[] = [];
      querySnapshot.forEach((doc) => {
        appointmentData.push({ id: doc.id, ...doc.data() } as Appointment);
      });
      setAppointments(appointmentData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching appointments:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les rendez-vous",
        variant: "destructive",
      });
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [toast]);
  
  const handleUpdateAppointment = async (id: string, data: Partial<Appointment>) => {
    try {
      const appointmentRef = doc(db, COLLECTIONS.GARAGE.APPOINTMENTS, id);
      await updateDoc(appointmentRef, data);
      toast({
        title: "Succès",
        description: "Le rendez-vous a été mis à jour",
      });
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le rendez-vous",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteAppointment = async () => {
    if (!selectedAppointment) return;
    
    try {
      const appointmentRef = doc(db, COLLECTIONS.GARAGE.APPOINTMENTS, selectedAppointment.id);
      await deleteDoc(appointmentRef);
      toast({
        title: "Succès",
        description: "Le rendez-vous a été supprimé",
      });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le rendez-vous",
        variant: "destructive",
      });
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP', { locale: fr });
    } catch (error) {
      return dateString;
    }
  };
  
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
        return <Badge>Inconnu</Badge>;
    }
  };
  
  const handleView = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsViewDialogOpen(true);
  };
  
  const handleEdit = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsEditDialogOpen(true);
  };
  
  const handleDelete = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDeleteDialogOpen(true);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Rendez-vous</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Rendez-vous
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Liste des rendez-vous</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Chargement...</div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-4">Aucun rendez-vous trouvé</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Heure</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>{appointment.clientName}</TableCell>
                      <TableCell>{formatDate(appointment.date)}</TableCell>
                      <TableCell>{appointment.time}</TableCell>
                      <TableCell>{appointment.service}</TableCell>
                      <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            size="icon"
                            variant="ghost"
                            onClick={() => handleView(appointment)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEdit(appointment)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDelete(appointment)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Dialog for creating new appointment - placeholder for now */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer un rendez-vous</DialogTitle>
          </DialogHeader>
          <div>
            <p>Formulaire de création de rendez-vous à implémenter.</p>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* View appointment dialog */}
      {selectedAppointment && (
        <ViewAppointmentDialog
          open={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
          appointment={selectedAppointment}
        />
      )}
      
      {/* Edit appointment dialog */}
      {selectedAppointment && (
        <EditAppointmentDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          appointment={selectedAppointment}
          onUpdate={handleUpdateAppointment}
        />
      )}
      
      {/* Delete appointment dialog */}
      {selectedAppointment && (
        <DeleteAppointmentDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleDeleteAppointment}
        />
      )}
    </div>
  );
};

export default GarageAppointmentsDashboard;
