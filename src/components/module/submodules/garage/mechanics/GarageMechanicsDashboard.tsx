
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Wrench, AlertTriangle, RefreshCw } from "lucide-react";
import { useGarageEmployees } from '@/hooks/garage/useGarageEmployees';
import StatCard from '@/components/StatCard';
import { AddMechanicDialog } from './AddMechanicDialog';
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const GarageMechanicsDashboard = () => {
  const { employees: mechanics, loading, error } = useGarageEmployees();
  
  const handleRefresh = () => {
    window.location.reload();
    toast.info("Actualisation de la page...");
  };
  
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="p-6 border-red-200">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-red-600">Erreur de chargement</h3>
            <p className="text-red-600 font-mono text-sm bg-red-50 p-2 mt-2 rounded">{String(error)}</p>
            <Button 
              onClick={handleRefresh} 
              variant="outline" 
              className="mt-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Rafraîchir la page
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const availableMechanics = mechanics.filter(m => m.status === 'active');
  const busyMechanics = mechanics.filter(m => m.status === 'busy');
  const onLeaveMechanics = mechanics.filter(m => m.status === 'onLeave');

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mécaniciens</h1>
        <AddMechanicDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Mécaniciens Disponibles"
          value={availableMechanics.length.toString()}
          icon={<Wrench className="h-4 w-4" />}
          description="Actuellement disponibles"
        />
        <StatCard
          title="En Intervention"
          value={busyMechanics.length.toString()}
          icon={<Wrench className="h-4 w-4" />}
          description="Sur une réparation"
        />
        <StatCard
          title="En Congé"
          value={onLeaveMechanics.length.toString()}
          icon={<Wrench className="h-4 w-4" />}
          description="Absents"
        />
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-6">Liste des Mécaniciens</h2>
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              <p>Chargement des mécaniciens...</p>
            </div>
          ) : mechanics.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Aucun mécanicien trouvé.</p>
              <p className="mt-2 text-sm">Ajoutez des mécaniciens avec le bouton "Nouveau mécanicien".</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Téléphone</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mechanics.map((mechanic) => (
                  <TableRow key={mechanic.id}>
                    <TableCell>{mechanic.firstName} {mechanic.lastName}</TableCell>
                    <TableCell>{mechanic.position}</TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          mechanic.status === 'active' ? 'bg-green-100 text-green-800' :
                          mechanic.status === 'busy' ? 'bg-amber-100 text-amber-800' :
                          'bg-purple-100 text-purple-800'
                        }
                      >
                        {mechanic.status === 'active' ? 'Disponible' :
                         mechanic.status === 'busy' ? 'En intervention' :
                         'En congé'}
                      </Badge>
                    </TableCell>
                    <TableCell>{mechanic.email}</TableCell>
                    <TableCell>{mechanic.phone}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GarageMechanicsDashboard;
