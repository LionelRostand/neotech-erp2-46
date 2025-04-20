
import React, { useState } from 'react';
import { Plus, BadgePercent, Users, Award, Gift } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { loyaltyPrograms } from './loyaltyData';
import AddLoyaltyProgramDialog from './AddLoyaltyProgramDialog';
import { useToast } from "@/hooks/use-toast";

const GarageLoyaltyDashboard = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { toast } = useToast();

  const columns = [
    {
      accessorKey: "name",
      header: "Nom du programme",
      cell: ({ row }) => row.original.name
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => row.original.description
    },
    {
      accessorKey: "pointsMultiplier",
      header: "Multiplicateur",
      cell: ({ row }) => `${row.original.pointsMultiplier}x`
    },
    {
      accessorKey: "minimumSpend",
      header: "Dépense minimum",
      cell: ({ row }) => `${row.original.minimumSpend} €`
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => (
        <div className={`px-2 py-1 rounded-full text-xs inline-block 
          ${row.original.status === 'active' ? 'bg-green-100 text-green-800' : ''}
          ${row.original.status === 'inactive' ? 'bg-gray-100 text-gray-800' : ''}
          ${row.original.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : ''}`}>
          {row.original.status === 'active' ? 'Actif' : ''}
          {row.original.status === 'inactive' ? 'Inactif' : ''}
          {row.original.status === 'upcoming' ? 'À venir' : ''}
        </div>
      )
    }
  ];

  const handleAddProgram = (data: any) => {
    console.log('Nouveau programme:', data);
    toast({
      title: "Programme créé",
      description: "Le programme de fidélité a été créé avec succès.",
    });
    setShowAddDialog(false);
  };

  const activePrograms = loyaltyPrograms.filter(p => p.status === 'active');
  const totalMembers = 156; // Mock data
  const pointsAwarded = 45678; // Mock data

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Programme de Fidélité</h2>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau programme
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BadgePercent className="h-4 w-4" />
              <span>Programmes Actifs</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{activePrograms.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Membres Fidélité</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalMembers}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-4 w-4" />
              <span>Points Attribués</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{pointsAwarded.toLocaleString()}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Gift className="h-4 w-4" />
              <span>Récompenses Offertes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">34</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Programmes</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={loyaltyPrograms} 
          />
        </CardContent>
      </Card>

      <AddLoyaltyProgramDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
        onSubmit={handleAddProgram}
      />
    </div>
  );
};

export default GarageLoyaltyDashboard;
