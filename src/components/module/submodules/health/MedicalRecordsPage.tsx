import React, { useState } from 'react';
import { FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AddMedicalRecordDialog from './components/medical-records/AddMedicalRecordDialog';

const MedicalRecordsPage: React.FC = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [records, setRecords] = useState<any[]>([]);

  // Mock patients data for demonstration
  const patients = [
    { id: '1', name: 'Jean Dupont' },
    { id: '2', name: 'Marie Martin' },
    { id: '3', name: 'Pierre Durand' },
  ];

  const handleAddRecord = () => {
    setIsAddDialogOpen(true);
  };

  const handleRecordAdded = (newRecord: any) => {
    setRecords([...records, newRecord]);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FileText className="h-8 w-8 text-primary" />
          Dossiers Médicaux
        </h1>
        <Button onClick={handleAddRecord}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau dossier
        </Button>
      </div>

      {/* Add your records list/grid component here */}

      <AddMedicalRecordDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onRecordAdded={handleRecordAdded}
        patients={patients}
      />
    </div>
  );
};

export default MedicalRecordsPage;
