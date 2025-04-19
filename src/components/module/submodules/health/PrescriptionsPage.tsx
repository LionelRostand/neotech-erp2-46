import React, { useState } from 'react';
import { Syringe, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useHealthData } from '@/hooks/modules/useHealthData';
import { Prescription } from './types/health-types';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import FormDialog from './dialogs/FormDialog';
import AddPrescriptionForm from './forms/AddPrescriptionForm';

const PrescriptionsPage: React.FC = () => {
  const { prescriptions, patients, doctors, isLoading } = useHealthData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const getPatientName = (patientId: string) => {
    const patient = patients?.find(p => p.id === patientId);
    return patient ? `${patient.lastName} ${patient.firstName}` : 'Patient inconnu';
  };

  const getDoctorName = (doctorId: string) => {
    const doctor = doctors?.find(d => d.id === doctorId);
    return doctor ? `Dr. ${doctor.lastName} ${doctor.firstName}` : 'Médecin inconnu';
  };

  const filteredPrescriptions = prescriptions?.filter(prescription => {
    const patientName = getPatientName(prescription.patientId).toLowerCase();
    const doctorName = getDoctorName(prescription.doctorId).toLowerCase();
    
    return patientName.includes(searchTerm.toLowerCase()) || 
           doctorName.includes(searchTerm.toLowerCase()) ||
           prescription.date.toLowerCase().includes(searchTerm.toLowerCase());
  }) || [];

  const columns = [
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => {
        try {
          return format(new Date(row.original.date), 'dd/MM/yyyy', { locale: fr });
        } catch (error) {
          return row.original.date;
        }
      }
    },
    {
      accessorKey: 'patientId',
      header: 'Patient',
      cell: ({ row }) => (
        <div>{getPatientName(row.original.patientId)}</div>
      ),
    },
    {
      accessorKey: 'doctorId',
      header: 'Médecin',
      cell: ({ row }) => (
        <div>{getDoctorName(row.original.doctorId)}</div>
      ),
    },
    {
      accessorKey: 'medications',
      header: 'Médicaments',
      cell: ({ row }) => (
        <div>{row.original.medications.length} médicament(s)</div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => (
        <StatusBadge status={row.original.status} />
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              toast.info("Affichage de l'ordonnance à implémenter");
            }}
          >
            Voir
          </Button>
        </div>
      ),
    },
  ];

  const handleAddPrescription = (data: Partial<Prescription>) => {
    console.log('New prescription:', data);
    setIsAddDialogOpen(false);
    toast.success("Ordonnance créée avec succès");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Syringe className="h-6 w-6 text-primary" />
          Ordonnances
        </h1>
        <Button onClick={() => setIsAddDialogOpen(true)} disabled={isLoading}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle ordonnance
        </Button>
      </div>

      <div className="flex items-center gap-2 w-full max-w-sm">
        <Search className="w-4 h-4 text-gray-500" />
        <Input
          placeholder="Rechercher une ordonnance..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
      </div>

      <Card className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
        <DataTable
          columns={columns}
          data={filteredPrescriptions || []}
          isLoading={isLoading}
          noDataText="Aucune ordonnance trouvée"
          searchPlaceholder="Rechercher une ordonnance..."
        />
      </Card>

      <FormDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        title="Nouvelle ordonnance"
        description="Enregistrer une nouvelle ordonnance"
      >
        <AddPrescriptionForm
          onSubmit={handleAddPrescription}
          onCancel={() => setIsAddDialogOpen(false)}
        />
      </FormDialog>
    </div>
  );
};

export default PrescriptionsPage;
