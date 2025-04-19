
import React, { useState } from 'react';
import { BedDouble, Plus, Search, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCollectionData } from '@/hooks/useCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import DataTable from '@/components/DataTable';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import FormDialog from './dialogs/FormDialog';
import AddRoomForm from './forms/AddRoomForm';
import { Skeleton } from '@/components/ui/skeleton';
import type { Room } from './types/health-types';

const RoomsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: rooms, isLoading } = useCollectionData<Room>(
    COLLECTIONS.HEALTH.ROOMS
  );
  
  const filteredRooms = rooms?.filter(room => 
    room.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    room.type?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    room.floor?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleAddRoom = async (data: Room) => {
    try {
      // We will implement this later when asked
      console.log('New room:', data);
      setIsAddDialogOpen(false);
      toast.success("Chambre ajoutée avec succès");
    } catch (error) {
      console.error("Error adding room:", error);
      toast.error("Erreur lors de l'ajout de la chambre");
    }
  };

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
      accessorKey: 'notes',
      header: 'Notes',
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-10 w-[150px]" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BedDouble className="h-6 w-6 text-primary" />
          Chambres
        </h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
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
        {filteredRooms.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-2">Aucune chambre trouvée</p>
            <p className="text-gray-400 text-sm">
              {searchTerm ? "Essayez d'autres critères de recherche" : "Ajoutez votre première chambre en cliquant sur le bouton \"Nouvelle Chambre\""}
            </p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredRooms}
            isLoading={isLoading}
            noDataText="Aucune chambre trouvée"
            searchPlaceholder="Rechercher une chambre..."
          />
        )}
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
