
import React, { useState } from 'react';
import { Building2, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useHealthData } from '@/hooks/modules/useHealthData';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import FormDialog from './dialogs/FormDialog';
import AddAdmissionForm from './forms/AddAdmissionForm';
import { useCollectionData } from '@/hooks/useCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Skeleton } from '@/components/ui/skeleton';

const AdmissionsPage: React.FC = () => {
  const { patients, doctors, isLoading: isHealthDataLoading } = useHealthData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: admissions, isLoading: isAdmissionsLoading } = useCollectionData(
    COLLECTIONS.HEALTH.HOSPITALIZATIONS
  );
  
  const getPatientName = (patientId: string) => {
    const patient = patients?.find(p => p.id === patientId);
    return patient ? `${patient.lastName} ${patient.firstName}` : 'Patient inconnu';
  };

  const getDoctorName = (doctorId: string) => {
    const doctor = doctors?.find(d => d.id === doctorId);
    return doctor ? `Dr. ${doctor.lastName} ${doctor.firstName}` : 'Médecin inconnu';
  };

  const filteredAdmissions = admissions?.filter(admission => {
    const patientName = getPatientName(admission.patientId).toLowerCase();
    const doctorName = getDoctorName(admission.doctorId).toLowerCase();
    const room = admission.roomNumber?.toLowerCase() || '';
    
    return patientName.includes(searchTerm.toLowerCase()) || 
           doctorName.includes(searchTerm.toLowerCase()) ||
           room.includes(searchTerm.toLowerCase()) ||
           admission.reason?.toLowerCase().includes(searchTerm.toLowerCase());
  }) || [];

  const columns = [
    {
      key: 'admissionDate',
      accessorKey: 'admissionDate',
      header: 'Date d\'admission',
      cell: ({ row }: { row: any }) => {
        try {
          return format(new Date(row.original.admissionDate), 'dd/MM/yyyy', { locale: fr });
        } catch (error) {
          return row.original.admissionDate || '-';
        }
      }
    },
    {
      key: 'patientId',
      accessorKey: 'patientId',
      header: 'Patient',
      cell: ({ row }: { row: any }) => (
        <div>{getPatientName(row.original.patientId)}</div>
      ),
    },
    {
      key: 'doctorId',
      accessorKey: 'doctorId',
      header: 'Médecin',
      cell: ({ row }: { row: any }) => (
        <div>{getDoctorName(row.original.doctorId)}</div>
      ),
    },
    {
      key: 'roomNumber',
      accessorKey: 'roomNumber',
      header: 'Chambre',
    },
    {
      key: 'reason',
      accessorKey: 'reason',
      header: 'Motif',
    },
    {
      key: 'status',
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }: { row: any }) => (
        <StatusBadge status={row.original.status} />
      ),
    },
    {
      key: 'actions',
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: { row: any }) => (
        <div className="flex items-center justify-end gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              toast.info("Affichage des détails à implémenter");
            }}
          >
            Voir
          </Button>
        </div>
      ),
    },
  ];

  const handleAddAdmission = (data: any) => {
    console.log('New admission:', data);
    setIsAddDialogOpen(false);
    toast.success("Admission créée avec succès");
  };

  const isLoading = isHealthDataLoading || isAdmissionsLoading;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Building2 className="h-6 w-6 text-primary" />
          Hospitalisations
        </h1>
        <Button onClick={() => setIsAddDialogOpen(true)} disabled={isLoading}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Admission
        </Button>
      </div>

      <div className="flex items-center gap-2 w-full max-w-sm">
        <Search className="w-4 h-4 text-gray-500" />
        <Input
          placeholder="Rechercher une admission..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
      </div>

      <Card className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredAdmissions}
            isLoading={isLoading}
            noDataText="Aucune admission trouvée"
            searchPlaceholder="Rechercher une admission..."
          />
        )}
      </Card>

      <FormDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        title="Nouvelle admission"
        description="Enregistrer une nouvelle admission"
      >
        <AddAdmissionForm
          onSubmit={handleAddAdmission}
          onCancel={() => setIsAddDialogOpen(false)}
        />
      </FormDialog>
    </div>
  );
};

export default AdmissionsPage;
