
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Wrench } from "lucide-react";
import { useGarageEmployees } from '@/hooks/garage/useGarageEmployees';
import StatCard from '@/components/StatCard';
import { AddMechanicDialog } from './AddMechanicDialog';

const GarageMechanicsDashboard = () => {
  const { employees, loading } = useGarageEmployees();
  const mechanics = employees?.filter(e => e.position?.toLowerCase().includes('mécanicien')) || [];

  if (loading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  <TableCell>{mechanic.status}</TableCell>
                  <TableCell>{mechanic.email}</TableCell>
                  <TableCell>{mechanic.phone}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default GarageMechanicsDashboard;
