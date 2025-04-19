
import React, { useState, useEffect } from 'react';
import { Clipboard, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ConsultationsList from './components/consultations/ConsultationList';
import AddConsultationDialog from './components/consultations/AddConsultationDialog';
import type { Consultation, Patient, Doctor } from './types/health-types';
import { useFirestore } from '@/hooks/useFirestore';
import { toast } from 'sonner';
import { fetchCollectionData } from './utils/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';

const ConsultationsPage: React.FC = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const { add } = useFirestore(COLLECTIONS.HEALTH.CONSULTATIONS);

  // Fetch patients and doctors data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch actual data from Firestore collections
        const patientsData = await fetchCollectionData<Patient>(COLLECTIONS.HEALTH.PATIENTS);
        const doctorsData = await fetchCollectionData<Doctor>(COLLECTIONS.HEALTH.DOCTORS);
        
        setPatients(patientsData);
        setDoctors(doctorsData);
        console.log('Loaded patients:', patientsData.length);
        console.log('Loaded doctors:', doctorsData.length);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddConsultation = async (consultation: Consultation) => {
    try {
      await add(consultation);
      toast.success("Consultation ajoutée avec succès");
      setIsAddDialogOpen(false);
    } catch (error) {
      toast.error("Erreur lors de l'ajout de la consultation");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Clipboard className="h-6 w-6 text-primary" />
          Consultations
        </h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Consultation
        </Button>
      </div>
      
      <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
        <ConsultationsList />
      </div>

      <AddConsultationDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onConsultationAdded={handleAddConsultation}
        patients={patients}
        doctors={doctors}
      />
    </div>
  );
};

export default ConsultationsPage;
