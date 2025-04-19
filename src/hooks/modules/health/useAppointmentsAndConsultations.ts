
import { useCollectionData } from '@/hooks/useCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { orderBy } from 'firebase/firestore';
import type { Appointment, Consultation } from '@/components/module/submodules/health/types/health-types';

export const useAppointmentsAndConsultations = () => {
  // Fetch appointments
  const { 
    data: appointments, 
    isLoading: isAppointmentsLoading, 
    error: appointmentsError 
  } = useCollectionData<Appointment>(
    COLLECTIONS.HEALTH.APPOINTMENTS,
    [orderBy('date', 'desc')]
  );

  // Fetch consultations
  const { 
    data: consultations, 
    isLoading: isConsultationsLoading, 
    error: consultationsError 
  } = useCollectionData<Consultation>(
    COLLECTIONS.HEALTH.CONSULTATIONS,
    [orderBy('date', 'desc')]
  );

  const isLoading = isAppointmentsLoading || isConsultationsLoading;
  const error = appointmentsError || consultationsError;

  return {
    appointments,
    consultations,
    isLoading,
    error
  };
};
