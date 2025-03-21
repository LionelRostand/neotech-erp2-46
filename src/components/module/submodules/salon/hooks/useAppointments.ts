
import { SalonAppointment } from '../types/salon-types';

export const useAppointments = () => {
  // Mock appointments data
  const mockAppointments: SalonAppointment[] = [
    {
      id: 'appt1',
      clientId: 'client1',
      service: 'Coupe femme',
      stylist: 'Jean Martin',
      date: '2023-10-15',
      time: '10:00',
      duration: 60,
      status: 'pending',
      notes: 'Première visite'
    },
    {
      id: 'appt2',
      clientId: 'client2',
      service: 'Coloration',
      stylist: 'Sophie Petit',
      date: '2023-10-16',
      time: '14:30',
      duration: 90,
      status: 'pending',
      notes: ''
    },
    {
      id: 'appt3',
      clientId: 'client3',
      service: 'Balayage',
      stylist: 'Jean Martin',
      date: '2023-10-17',
      time: '11:00',
      duration: 120,
      status: 'pending',
      notes: 'A demandé une couleur naturelle'
    }
  ];
  
  return {
    getAppointments: () => mockAppointments,
    getNewAppointments: () => mockAppointments.filter(a => a.status === 'pending'),
    confirmAppointment: (id: string) => console.log(`Confirm appointment ${id}`),
    cancelAppointment: (id: string) => console.log(`Cancel appointment ${id}`)
  };
};
