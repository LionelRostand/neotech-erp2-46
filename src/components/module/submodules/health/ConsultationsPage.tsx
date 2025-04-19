
import React, { useState, useEffect } from 'react';
import { Clipboard, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ConsultationsList from './components/consultations/ConsultationList';
import AddConsultationDialog from './components/consultations/AddConsultationDialog';
import type { Consultation } from './types/health-types';
import { useFirestore } from '@/hooks/useFirestore';
import { toast } from 'sonner';
import { fetchCollectionData } from './utils/fetchCollectionData';

interface Patient {
  id: string;
  name: string;
}

interface Doctor {
  id: string;
  name: string;
}

const ConsultationsPage: React.FC = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const { add } = useFirestore('consultations');

  // Fetch patients and doctors data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch actual data from your backend
        // For this example, we'll use mock data
        const patientsData = await fetchPatientsData();
        const doctorsData = await fetchDoctorsData();
        setPatients(patientsData);
        setDoctors(doctorsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Mock function to fetch patients (in a real app this would be a database call)
  const fetchPatientsData = async (): Promise<Patient[]> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: '1', name: 'Jean Dupont' },
          { id: '2', name: 'Marie Martin' },
          { id: '3', name: 'Pierre Durand' },
        ]);
      }, 500);
    });
  };

  // Mock function to fetch doctors
  const fetchDoctorsData = async (): Promise<Doctor[]> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: '1', name: 'Dr. Bernard' },
          { id: '2', name: 'Dr. Lambert' },
          { id: '3', name: 'Dr. Robert' },
        ]);
      }, 500);
    });
  };

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
      />
    </div>
  );
};

export default ConsultationsPage;
