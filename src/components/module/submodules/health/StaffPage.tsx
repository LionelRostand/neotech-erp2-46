import React, { useState } from 'react';
import { Users2, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useHealthData } from '@/hooks/modules/useHealthData';
import { Staff } from './types/health-types';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import { toast } from 'sonner';
import FormDialog from "./dialogs/FormDialog";
import AddStaffForm from "./forms/AddStaffForm";
import { useFirestore } from "@/hooks/useFirestore";
import { COLLECTIONS } from "@/lib/firebase-collections";
import type { StaffFormValues } from "./schemas/formSchemas";

const StaffPage: React.FC = () => {
  const { staff, isLoading } = useHealthData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { add } = useFirestore(COLLECTIONS.HEALTH.STAFF);

  const handleAddStaff = async (data: StaffFormValues) => {
    try {
      await add({
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setIsAddDialogOpen(false);
      toast.success("Personnel ajouté avec succès");
    } catch (error) {
      console.error("Error adding staff member:", error);
      toast.error("Erreur lors de l'ajout du personnel");
    }
  };

  const filteredStaff = staff?.filter(member => 
    member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const columns = [
    {
      accessorKey: 'lastName',
      header: 'Nom',
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.lastName} {row.original.firstName}
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Poste',
    },
    {
      accessorKey: 'department',
      header: 'Service',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'phone',
      header: 'Téléphone',
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users2 className="h-6 w-6 text-primary" />
          Personnel
        </h1>
        <Button onClick={() => setIsAddDialogOpen(true)} disabled={isLoading}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Personnel
        </Button>
      </div>

      <div className="flex items-center gap-2 w-full max-w-sm">
        <Search className="w-4 h-4 text-gray-500" />
        <Input
          placeholder="Rechercher un membre du personnel..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
      </div>

      <Card className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
        <DataTable
          columns={columns}
          data={filteredStaff}
          isLoading={isLoading}
          noDataText="Aucun personnel trouvé"
          searchPlaceholder="Rechercher un membre du personnel..."
        />
      </Card>

      <FormDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        title="Nouveau Personnel"
        description="Ajouter un nouveau membre du personnel"
      >
        <AddStaffForm
          onSubmit={handleAddStaff}
          onCancel={() => setIsAddDialogOpen(false)}
        />
      </FormDialog>
    </div>
  );
};

export default StaffPage;
