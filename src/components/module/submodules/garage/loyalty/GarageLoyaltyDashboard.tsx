
import React, { useState } from 'react';
import { useGarageData } from '@/hooks/garage/useGarageData';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from '@/components/StatCard';
import { BadgePercent, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AddLoyaltyProgramDialog from './AddLoyaltyProgramDialog';

const GarageLoyaltyDashboard = () => {
  const { loyalty = [], clients = [], isLoading } = useGarageData();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  // Make sure loyalty is not undefined before filtering
  const activePrograms = loyalty?.filter(program => program.status === 'active') || [];

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

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
          value={activePrograms.length.toString()}
          icon={<BadgePercent className="h-4 w-4 text-purple-500" />}
          description="Programmes en cours"
          className="bg-purple-50 hover:bg-purple-100"
        />
        
        <StatCard
          title="Clients Inscrits"
          value={(clients?.filter(c => c.loyaltyPoints && c.loyaltyPoints > 0).length || 0).toString()}
          icon={<BadgePercent className="h-4 w-4 text-emerald-500" />}
          description="Participants au programme"
          className="bg-emerald-50 hover:bg-emerald-100"
        />
        
        <StatCard
          title="Points Moyens"
          value={Math.round(
            clients?.length > 0 
              ? clients.reduce((acc, c) => acc + (c.loyaltyPoints || 0), 0) / clients.length 
              : 0
          ).toString()}
          icon={<BadgePercent className="h-4 w-4 text-amber-500" />}
          description="Par client actif"
          className="bg-amber-50 hover:bg-amber-100"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activePrograms.map(program => (
          <Card key={program.id}>
            <CardHeader>
              <CardTitle>{program.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{program.description}</p>
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Avantages:</h4>
                <p>{program.benefitsDescription}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddLoyaltyProgramDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        onSuccess={() => {
          setDialogOpen(false);
          // Refresh data after adding new program
        }} 
      />
    </div>
  );
};

export default GarageLoyaltyDashboard;
