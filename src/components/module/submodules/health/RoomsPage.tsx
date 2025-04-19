import React, { useState } from 'react';
import { BedDouble, Plus, Search, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useHealthData } from '@/hooks/modules/useHealthData';
import DataTable from '@/components/DataTable';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import FormDialog from './dialogs/FormDialog';
import AddRoomForm from './forms/AddRoomForm';

const RoomsPage: React.FC = () => {
  const { patients, isLoading } = useHealthData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const rooms = [
    {
      id: "R101",
      roomNumber: "101",
      type: "Single",
      floor: "1",
      bedsTotal: 1,
      bedsAvailable: 1,
      isAvailable: true,
      currentPatientId: null,
      notes: "Chambre privée avec salle de bain"
    },
    {
      id: "R102",
      roomNumber: "102",
      type: "Single",
      floor: "1",
      bedsTotal: 1,
      bedsAvailable: 0,
      isAvailable: false,
      currentPatientId: patients?.[0]?.id || "P001",
      notes: "Chambre privée avec salle de bain"
    },
    {
      id: "R201",
      roomNumber: "201",
      type: "Double",
      floor: "2",
      bedsTotal: 2,
      bedsAvailable: 1,
      isAvailable: true,
      currentPatientId: patients?.[1]?.id || "P002",
      notes: "Chambre double standard"
    },
    {
      id: "R301",
      roomNumber: "301",
      type: "Suite",
      floor: "3",
      bedsTotal: 1,
      bedsAvailable: 1,
      isAvailable: true,
      currentPatientId: null,
      notes: "Suite VIP avec espace salon"
    }
  ];

  const getPatientName = (patientId: string | null) => {
    if (!patientId) return 'Aucun';
    const patient = patients?.find(p => p.id === patientId);
    return patient ? `${patient.lastName} ${patient.firstName}` : 'Patient inconnu';
  };

  const filteredRooms = rooms.filter(room => 
    room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
    room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.floor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (room.currentPatientId && getPatientName(room.currentPatientId).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const columns = [
    {
      accessorKey: 'roomNumber',
      header: 'Numéro',
      cell: ({ row }) => (
        <div className="font-medium">{row.original.roomNumber}</div>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
    },
    {
      accessorKey: 'floor',
      header: 'Étage',
    },
    {
      accessorKey: 'bedsAvailable',
      header: 'Disponibilité',
      cell: ({ row }) => (
        <div>
          {row.original.bedsAvailable}/{row.original.bedsTotal} lits
        </div>
      ),
    },
    {
      accessorKey: 'isAvailable',
      header: 'Statut',
      cell: ({ row }) => (
        <Badge variant={row.original.isAvailable ? "success" : "destructive"}>
          {row.original.isAvailable ? (
            <div className="flex items-center">
              <CheckCircle className="w-3.5 h-3.5 mr-1" />
              Disponible
            </div>
          ) : (
            <div className="flex items-center">
              <XCircle className="w-3.5 h-3.5 mr-1" />
              Occupée
            </div>
          )}
        </Badge>
      ),
    },
    {
      accessorKey: 'currentPatientId',
      header: 'Patient',
      cell: ({ row }) => (
        <div>{getPatientName(row.original.currentPatientId)}</div>
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
              toast.info("Gestion de la chambre à implémenter");
            }}
          >
            Gérer
          </Button>
        </div>
      ),
    },
  ];

  const handleAddRoom = (data: any) => {
    console.log('New room:', data);
    setIsAddDialogOpen(false);
    toast.success("Chambre ajoutée avec succès");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BedDouble className="h-6 w-6 text-primary" />
          Chambres
        </h1>
        <Button onClick={() => setIsAddDialogOpen(true)} disabled={isLoading}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Chambre
        </Button>
      </div>

      <div className="flex items-center gap-2 w-full max-w-sm">
        <Search className="w-4 h-4 text-gray-500" />
        <Input
          placeholder="Rechercher une chambre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
      </div>

      <Card className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
        <DataTable
          columns={columns}
          data={filteredRooms}
          isLoading={isLoading}
          noDataText="Aucune chambre trouvée"
          searchPlaceholder="Rechercher une chambre..."
        />
      </Card>

      <FormDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        title="Nouvelle chambre"
        description="Ajouter une nouvelle chambre"
      >
        <AddRoomForm
          onSubmit={handleAddRoom}
          onCancel={() => setIsAddDialogOpen(false)}
        />
      </FormDialog>
    </div>
  );
};

export default RoomsPage;
