
import React, { useState } from 'react';
import { Clipboard, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ConsultationsList from './components/consultations/ConsultationList';
import AddConsultationDialog from './components/consultations/AddConsultationDialog';
import type { Consultation } from './types/health-types';
import { useFirestore } from '@/hooks/useFirestore';
import { toast } from 'sonner';

const ConsultationsPage: React.FC = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { add } = useFirestore('consultations');

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
