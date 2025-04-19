
import React, { useState } from 'react';
import { Clipboard, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ConsultationsList from './components/consultations/ConsultationList';
import AddConsultationDialog from './components/consultations/AddConsultationDialog';
import type { Consultation } from './types/health-types';
import { useFirestore } from '@/hooks/useFirestore';
import { toast } from 'sonner';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { useHealthData } from '@/hooks/modules/useHealthData';

const ConsultationsPage: React.FC = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { add } = useFirestore(COLLECTIONS.HEALTH.CONSULTATIONS);
  const { patients, doctors, isLoading } = useHealthData();

  const handleAddConsultation = async (consultation: Consultation) => {
    try {
      // Add createdAt and updatedAt timestamps
      const consultationToAdd = {
        ...consultation,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await add(consultationToAdd);
      toast.success("Consultation ajoutée avec succès");
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error adding consultation:", error);
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
        <Button onClick={() => setIsAddDialogOpen(true)} disabled={isLoading}>
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
        patients={patients || []}
        doctors={doctors || []}
      />
    </div>
  );
};

export default ConsultationsPage;
