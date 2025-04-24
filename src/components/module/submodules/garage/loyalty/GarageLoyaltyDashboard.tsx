
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import AddLoyaltyProgramDialog from './AddLoyaltyProgramDialog';
import { useGarageLoyalty } from '@/hooks/garage/useGarageLoyalty';
import { Skeleton } from '@/components/ui/skeleton';

const GarageLoyaltyDashboard = () => {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { loyaltyPrograms, loading, refetchLoyaltyPrograms } = useGarageLoyalty();

  const handleProgramAdded = () => {
    refetchLoyaltyPrograms();
    setAddDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Programme de Fidélité</h1>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Programme
        </Button>
      </div>

      <Tabs defaultValue="programs" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="programs">Programmes</TabsTrigger>
          <TabsTrigger value="customers">Clients fidèles</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="programs" className="space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="h-64">
                  <CardHeader>
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <div className="flex justify-between">
                      <Skeleton className="h-6 w-1/3" />
                      <Skeleton className="h-6 w-1/4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : loyaltyPrograms.length === 0 ? (
            <Card className="border-dashed border-2">
              <CardContent className="flex flex-col items-center justify-center p-6 h-64">
                <p className="text-muted-foreground mb-4 text-center">
                  Aucun programme de fidélité n'a encore été créé
                </p>
                <Button onClick={() => setAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un programme
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loyaltyPrograms.map((program) => (
                <Card key={program.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{program.name}</CardTitle>
                        <CardDescription>
                          {program.pointsPerEuro} points par €
                        </CardDescription>
                      </div>
                      <Badge variant={program.status === 'active' ? 'default' : 'secondary'}>
                        {program.status === 'active' ? 'Actif' : 'Inactif'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{program.description}</p>
                    <div className="flex justify-between text-sm">
                      <span>Seuil: {program.rewardThreshold} points</span>
                      <span>
                        Récompense: {program.discount}
                        {program.type === 'percentage' ? '%' : program.type === 'fixed' ? '€' : ' points'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Clients Fidèles</CardTitle>
              <CardDescription>
                Liste des clients participant aux programmes de fidélité
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Fonctionnalité en cours de développement
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Historique des Transactions</CardTitle>
              <CardDescription>
                Points gagnés et utilisés par les clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Fonctionnalité en cours de développement
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AddLoyaltyProgramDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSuccess={handleProgramAdded}
      />
    </div>
  );
};

export default GarageLoyaltyDashboard;
