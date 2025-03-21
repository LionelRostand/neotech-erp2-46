
import { useState, useEffect, useCallback } from 'react';
import { SalonAppointment, SalonClient } from '../../types/salon-types';
import { addDocument } from '@/hooks/firestore/create-operations';
import { updateDocument, deleteDocument } from '@/hooks/firestore/update-operations';
import { getAllDocuments } from '@/hooks/firestore/read-operations';
import { toast } from 'sonner';

// Sample mock data for development
const mockAppointments: SalonAppointment[] = [
  {
    id: "apt-001",
    clientId: "client-001",
    service: "Coupe femme",
    stylist: "Sophie Martin",
    date: "2023-10-15",
    time: "10:00",
    duration: 60,
    status: "confirmed",
    notes: "Première visite"
  },
  {
    id: "apt-002",
    clientId: "client-002",
    service: "Coloration",
    stylist: "Jean Dupont",
    date: "2023-10-15",
    time: "14:30",
    duration: 90,
    status: "confirmed",
    notes: ""
  },
  {
    id: "apt-003",
    clientId: "client-003",
    service: "Brushing",
    stylist: "Marie Leclerc",
    date: "2023-10-16",
    time: "09:15",
    duration: 45,
    status: "pending",
    notes: "Client habitué"
  },
  {
    id: "apt-004",
    clientId: "client-004",
    service: "Coupe homme",
    stylist: "Jean Dupont",
    date: "2023-10-16",
    time: "11:30",
    duration: 30,
    status: "cancelled",
    notes: ""
  },
  {
    id: "apt-005",
    clientId: "client-005",
    service: "Coupe + Coloration",
    stylist: "Sophie Martin",
    date: "2023-10-17",
    time: "15:00",
    duration: 120,
    status: "confirmed",
    notes: "Allergie produits ammoniaque"
  }
];

// Sample mock client data
const mockClients: Record<string, SalonClient> = {
  "client-001": {
    id: "client-001",
    firstName: "Emma",
    lastName: "Bernard",
    email: "emma.bernard@example.com",
    phone: "0612345678",
    loyaltyPoints: 50,
    createdAt: "2023-01-15",
    lastVisit: "2023-09-10",
    visits: [],
    appointments: []
  },
  "client-002": {
    id: "client-002",
    firstName: "Thomas",
    lastName: "Petit",
    email: "thomas.petit@example.com",
    phone: "0623456789",
    loyaltyPoints: 120,
    createdAt: "2023-02-05",
    lastVisit: "2023-09-25",
    visits: [],
    appointments: []
  },
  "client-003": {
    id: "client-003",
    firstName: "Sophie",
    lastName: "Martin",
    email: "sophie.martin@example.com",
    phone: "0634567890",
    loyaltyPoints: 85,
    createdAt: "2023-03-10",
    lastVisit: "2023-10-01",
    visits: [],
    appointments: []
  },
  "client-004": {
    id: "client-004",
    firstName: "Lucas",
    lastName: "Dubois",
    email: "lucas.dubois@example.com",
    phone: "0645678901",
    loyaltyPoints: 35,
    createdAt: "2023-04-15",
    lastVisit: "2023-08-20",
    visits: [],
    appointments: []
  },
  "client-005": {
    id: "client-005",
    firstName: "Julie",
    lastName: "Leroy",
    email: "julie.leroy@example.com",
    phone: "0656789012",
    loyaltyPoints: 150,
    createdAt: "2023-01-20",
    lastVisit: "2023-09-30",
    visits: [],
    appointments: []
  }
};

export const useAppointments = (searchTerm: string = '') => {
  const [appointments, setAppointments] = useState<SalonAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        // In a real app, use this:
        // const data = await getAllDocuments('salonAppointments');
        // setAppointments(data as SalonAppointment[]);
        
        // For mock data:
        setTimeout(() => {
          setAppointments(mockAppointments);
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        setError('Erreur lors du chargement des rendez-vous');
        console.error(err);
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Filter appointments based on search term
  const filteredAppointments = appointments.filter(appointment => {
    const client = mockClients[appointment.clientId];
    const clientName = `${client?.firstName} ${client?.lastName}`.toLowerCase();
    const searchLower = searchTerm.toLowerCase();

    return clientName.includes(searchLower) || 
           appointment.service.toLowerCase().includes(searchLower) ||
           appointment.stylist.toLowerCase().includes(searchLower);
  });

  // Create a new appointment
  const createAppointment = useCallback(async (appointmentData: Omit<SalonAppointment, 'id'>) => {
    try {
      // In a real app, use this:
      // const newAppointment = await addDocument('salonAppointments', appointmentData);
      
      // For mock data:
      const newAppointment: SalonAppointment = {
        id: `apt-${appointments.length + 1}`.padStart(7, '0'),
        ...appointmentData
      };
      setAppointments(prev => [...prev, newAppointment]);
      toast.success('Rendez-vous créé avec succès');
      return newAppointment;
    } catch (err) {
      toast.error('Erreur lors de la création du rendez-vous');
      console.error(err);
      throw err;
    }
  }, [appointments]);

  // Update an appointment
  const updateAppointment = useCallback(async (id: string, appointmentData: Partial<SalonAppointment>) => {
    try {
      // In a real app, use this:
      // await updateDocument('salonAppointments', id, appointmentData);
      
      // For mock data:
      setAppointments(prev => 
        prev.map(appointment => 
          appointment.id === id 
            ? { ...appointment, ...appointmentData } 
            : appointment
        )
      );
      toast.success('Rendez-vous mis à jour avec succès');
    } catch (err) {
      toast.error('Erreur lors de la mise à jour du rendez-vous');
      console.error(err);
    }
  }, []);

  // Delete an appointment
  const deleteAppointment = useCallback(async (id: string) => {
    try {
      // In a real app, use this:
      // await deleteDocument('salonAppointments', id);
      
      // For mock data:
      setAppointments(prev => prev.filter(appointment => appointment.id !== id));
      toast.success('Rendez-vous supprimé avec succès');
    } catch (err) {
      toast.error('Erreur lors de la suppression du rendez-vous');
      console.error(err);
    }
  }, []);

  return {
    appointments,
    filteredAppointments,
    isLoading,
    error,
    createAppointment,
    updateAppointment,
    deleteAppointment
  };
};
