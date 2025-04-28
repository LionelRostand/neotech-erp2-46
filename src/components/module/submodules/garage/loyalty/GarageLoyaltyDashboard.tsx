
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from '@/components/StatCard';
import { BadgePercent, Plus, Eye, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AddLoyaltyProgramDialog from './AddLoyaltyProgramDialog';
import ViewLoyaltyProgramDialog from './ViewLoyaltyProgramDialog';
import EditLoyaltyProgramDialog from './EditLoyaltyProgramDialog';
import DeleteLoyaltyProgramDialog from './DeleteLoyaltyProgramDialog';
import { useGarageLoyalty } from '@/hooks/garage/useGarageLoyalty';
import { LoyaltyProgram } from '../types/loyalty-types';

const GarageLoyaltyDashboard = () => {
  const { 
    loyalty = [], 
    activePrograms = [],
    upcomingPrograms = [],
    isLoading,
    refetch
  } = useGarageLoyalty();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<LoyaltyProgram | null>(null);

  const handleView = (program: LoyaltyProgram) => {
    setSelectedProgram(program);
    setViewDialogOpen(true);
  };

  const handleEdit = (program: LoyaltyProgram) => {
    setSelectedProgram(program);
    setEditDialogOpen(true);
  };

  const handleDelete = (program: LoyaltyProgram) => {
    setSelectedProgram(program);
    setDeleteDialogOpen(true);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Programme de Fidélité</h2>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau programme
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Programmes Actifs"
          value={String(activePrograms?.length || 0)}
          icon={<BadgePercent className="h-4 w-4 text-purple-500" />}
          description="Programmes en cours"
          className="bg-purple-50 hover:bg-purple-100"
        />
        
        <StatCard
          title="Programmes à venir"
          value={String(upcomingPrograms?.length || 0)}
          icon={<BadgePercent className="h-4 w-4 text-emerald-500" />}
          description="Programmes planifiés"
          className="bg-emerald-50 hover:bg-emerald-100"
        />
        
        <StatCard
          title="Total Programmes"
          value={String(loyalty?.length || 0)}
          icon={<BadgePercent className="h-4 w-4 text-amber-500" />}
          description="Tous programmes confondus"
          className="bg-amber-50 hover:bg-amber-100"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loyalty && loyalty.length > 0 ? (
          loyalty.map(program => (
            <Card key={program.id}>
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle>{program.name}</CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleView(program)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(program)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(program)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{program.description}</p>
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Avantages:</h4>
                  <p>{program.benefitsDescription}</p>
                  <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
                    <span>Multiplicateur: x{program.pointsMultiplier}</span>
                    <span>Dépense minimum: {program.minimumSpend}€</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-2">
            <CardContent className="p-6 text-center text-muted-foreground">
              Aucun programme de fidélité n'a été créé.
            </CardContent>
          </Card>
        )}
      </div>

      <AddLoyaltyProgramDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        onSuccess={() => {
          setDialogOpen(false);
          refetch();
        }} 
      />

      <ViewLoyaltyProgramDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        program={selectedProgram}
      />

      <EditLoyaltyProgramDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        program={selectedProgram}
        onSuccess={refetch}
      />

      <DeleteLoyaltyProgramDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        program={selectedProgram}
        onSuccess={refetch}
      />
    </div>
  );
};

export default GarageLoyaltyDashboard;
