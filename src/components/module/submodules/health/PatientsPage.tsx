
import React, { useState } from 'react';
import { User, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useHealthData } from '@/hooks/modules/useHealthData';
import FormDialog from './dialogs/FormDialog';
import AddPatientForm from './forms/AddPatientForm';
import { useFirestore } from '@/hooks/useFirestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import type { PatientFormValues } from './schemas/formSchemas';
import PatientsTable from './components/PatientsTable';

const PatientsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { patients, isLoading } = useHealthData();
  const { add } = useFirestore(COLLECTIONS.HEALTH.PATIENTS);

  const handleAddPatient = async (data: PatientFormValues) => {
    try {
      await add({
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setIsAddDialogOpen(false);
      toast.success("Patient ajouté avec succès");
    } catch (error) {
      console.error("Error adding patient:", error);
      toast.error("Erreur lors de l'ajout du patient");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <User className="h-6 w-6 text-primary" />
          Patients
        </h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Patient
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="Rechercher un patient..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <PatientsTable searchQuery={searchQuery} />

      <FormDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        title="Nouveau Patient"
        description="Ajouter un nouveau patient au système"
      >
        <AddPatientForm
          onSubmit={handleAddPatient}
          onCancel={() => setIsAddDialogOpen(false)}
        />
      </FormDialog>
    </div>
  );
};

export default PatientsPage;
