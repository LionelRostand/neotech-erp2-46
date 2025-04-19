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

const AdmissionsPage: React.FC = () => {
  const { patients, doctors, isLoading } = useHealthData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const admissions = [
    {
      id: "ADM001",
      patientId: patients?.[0]?.id || "P001",
      doctorId: doctors?.[0]?.id || "D001",
      admissionDate: new Date().toISOString(),
      dischargeDate: "",
      reason: "Intervention chirurgicale",
      roomNumber: "301",
      status: "active",
      notes: "Patient admis pour une appendicectomie",
    },
    {
      id: "ADM002",
      patientId: patients?.[1]?.id || "P002",
      doctorId: doctors?.[0]?.id || "D001",
      admissionDate: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
      dischargeDate: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      reason: "Pneumonie",
      roomNumber: "205",
      status: "completed",
      notes: "Patient sorti après 2 jours d'hospitalisation",
    }
  ];

  const getPatientName = (patientId: string) => {
    const patient = patients?.find(p => p.id === patientId);
    return patient ? `${patient.lastName} ${patient.firstName}` : 'Patient inconnu';
  };

  const getDoctorName = (doctorId: string) => {
    const doctor = doctors?.find(d => d.id === doctorId);
    return doctor ? `Dr. ${doctor.lastName} ${doctor.firstName}` : 'Médecin inconnu';
  };

  const filteredAdmissions = admissions.filter(admission => {
    const patientName = getPatientName(admission.patientId).toLowerCase();
    const doctorName = getDoctorName(admission.doctorId).toLowerCase();
    const room = admission.roomNumber.toLowerCase();
    
    return patientName.includes(searchTerm.toLowerCase()) || 
           doctorName.includes(searchTerm.toLowerCase()) ||
           room.includes(searchTerm.toLowerCase()) ||
           admission.reason.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const columns = [
    {
      accessorKey: 'admissionDate',
      header: 'Date d\'admission',
      cell: ({ row }) => {
        try {
          return format(new Date(row.original.admissionDate), 'dd/MM/yyyy', { locale: fr });
        } catch (error) {
          return row.original.admissionDate;
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
      accessorKey: 'roomNumber',
      header: 'Chambre',
    },
    {
      accessorKey: 'reason',
      header: 'Motif',
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
        <DataTable
          columns={columns}
          data={filteredAdmissions}
          isLoading={isLoading}
          noDataText="Aucune admission trouvée"
          searchPlaceholder="Rechercher une admission..."
        />
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
