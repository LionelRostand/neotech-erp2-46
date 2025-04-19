import React, { useState } from 'react';
import { Clipboard, Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useHealthData } from '@/hooks/modules/useHealthData';
import { Staff } from './types/health-types';
import DataTable from '@/components/DataTable';
import { toast } from 'sonner';
import StatusBadge from '@/components/StatusBadge';
import FormDialog from "./dialogs/FormDialog";
import AddNurseForm from "./forms/AddNurseForm";
import { useFirestore } from "@/hooks/useFirestore";
import { COLLECTIONS } from "@/lib/firebase-collections";
import type { NurseFormValues } from "./schemas/formSchemas";

const NursesPage: React.FC = () => {
  const { staff, isLoading } = useHealthData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { add } = useFirestore(COLLECTIONS.HEALTH.STAFF);

  const handleAddNurse = async (data: NurseFormValues) => {
    try {
      await add({
        ...data,
        role: "nurse",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setIsAddDialogOpen(false);
      toast.success("Infirmier(ère) ajouté(e) avec succès");
    } catch (error) {
      console.error("Error adding nurse:", error);
      toast.error("Erreur lors de l'ajout de l'infirmier(ère)");
    }
  };

  const nurses = staff?.filter(s => 
    s.role === 'nurse' || 
    s.role === 'infirmier' || 
    s.role === 'infirmière' || 
    s.department?.toLowerCase().includes('infirm')
  ) || [];

  const columns = [
    {
      key: 'lastName',
      header: 'Nom',
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.lastName} {row.original.firstName}
        </div>
      ),
    },
    {
      key: 'department',
      header: 'Service',
    },
    {
      key: 'email',
      header: 'Email',
    },
    {
      key: 'phone',
      header: 'Téléphone',
    },
    {
      key: 'status',
      header: 'Statut',
      cell: ({ row }) => (
        <StatusBadge status={row.original.status}>{row.original.status}</StatusBadge>
      ),
    },
    {
      key: 'actions',
      header: '',
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          Infirmiers
        </h1>
        <Button onClick={() => setIsAddDialogOpen(true)} disabled={isLoading}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvel Infirmier
        </Button>
      </div>

      <Card className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
        <DataTable
          title="Liste des infirmiers"
          data={nurses}
          columns={columns}
          className="w-full"
        />
      </Card>

      <FormDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        title="Nouvel Infirmier"
        description="Ajouter un nouvel infirmier"
      >
        <AddNurseForm
          onSubmit={handleAddNurse}
          onCancel={() => setIsAddDialogOpen(false)}
        />
      </FormDialog>
    </div>
  );
};

export default NursesPage;
