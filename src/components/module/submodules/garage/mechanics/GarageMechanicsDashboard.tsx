
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Wrench, AlertTriangle } from "lucide-react";
import { useGarageEmployees } from '@/hooks/garage/useGarageEmployees';
import StatCard from '@/components/StatCard';
import { AddMechanicDialog } from './AddMechanicDialog';
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'busy':
      return 'bg-amber-100 text-amber-800';
    case 'onLeave':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'active':
      return 'Disponible';
    case 'busy':
      return 'En intervention';
    case 'onLeave':
      return 'En congé';
    default:
      return status || 'Inconnu';
  }
};

const GarageMechanicsDashboard = () => {
  const { employees, loading, error } = useGarageEmployees();
  
  // Debug logs
  console.log('GarageMechanicsDashboard - employees:', employees);
  console.log('GarageMechanicsDashboard - loading:', loading);
  console.log('GarageMechanicsDashboard - error:', error);

  if (error) {
    console.error('Error fetching mechanics:', error);
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Card className="p-6 border-red-200">
          <div className="flex items-center gap-2 text-red-600 mb-4">
            <AlertTriangle />
            <h3 className="text-lg font-semibold">Erreur de chargement</h3>
          </div>
          <p className="text-gray-700">Une erreur s'est produite lors du chargement des mécaniciens:</p>
          <p className="text-red-600 font-mono text-sm bg-red-50 p-2 mt-2 rounded">{String(error)}</p>
          <div className="mt-4">
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => window.location.reload()}
            >
              Rafraîchir la page
            </button>
          </div>
        </Card>
      </div>
    );
  }

  if (loading) {
    return <div className="flex items-center justify-center h-96">Chargement des mécaniciens...</div>;
  }

  const mechanics = employees;
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
        <CardHeader>
          <CardTitle>Liste des Mécaniciens</CardTitle>
        </CardHeader>
        <CardContent>
          {mechanics.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Aucun mécanicien trouvé.</p>
              <p className="mt-2 text-sm">Ajoutez des mécaniciens avec le bouton "Nouveau mécanicien".</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mechanics.map((mechanic) => (
                  <TableRow key={mechanic.id}>
                    <TableCell>{mechanic.firstName} {mechanic.lastName}</TableCell>
                    <TableCell>{mechanic.email}</TableCell>
                    <TableCell>{mechanic.phone}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(mechanic.status)}>
                        {getStatusText(mechanic.status)}
                      </Badge>
                    </TableCell>
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
