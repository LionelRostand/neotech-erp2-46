import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Wrench } from "lucide-react";
import StatCard from '@/components/StatCard';
import { useGarageData } from '@/hooks/garage/useGarageData';
import CreateRepairDialog from './CreateRepairDialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import { Repair } from '../types/garage-types';

const GarageRepairsDashboard = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { repairs = [], vehicles = [], clients = [], isLoading } = useGarageData();

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  const todayRepairs = repairs.filter(r => {
    const today = new Date().toISOString().split('T')[0];
    return r.startDate === today;
  });

  const inProgressRepairs = repairs.filter(r => 
    r.status === 'in_progress'
  );

  const awaitingPartsRepairs = repairs.filter(r => 
    r.status === 'awaiting_parts'
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'awaiting_parts':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200';
      case 'awaiting_approval':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const handleAddRepair = (repair: Repair) => {
    console.log('New repair created:', repair);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Réparations</h1>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle réparation
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Réparations aujourd'hui"
          value={todayRepairs.length.toString()}
          icon={<Wrench className="h-4 w-4 text-blue-500" />}
          description="Planifiées pour aujourd'hui"
          className="bg-blue-50 hover:bg-blue-100"
        />
        <StatCard
          title="En cours"
          value={inProgressRepairs.length.toString()}
          icon={<Wrench className="h-4 w-4 text-amber-500" />}
          description="Réparations actives"
          className="bg-amber-50 hover:bg-amber-100"
        />
        <StatCard
          title="En attente de pièces"
          value={awaitingPartsRepairs.length.toString()}
          icon={<Wrench className="h-4 w-4 text-purple-500" />}
          description="Commandes en attente"
          className="bg-purple-50 hover:bg-purple-100"
        />
        <StatCard
          title="Total réparations"
          value={repairs.length.toString()}
          icon={<Wrench className="h-4 w-4 text-emerald-500" />}
          description="Toutes les réparations"
          className="bg-emerald-50 hover:bg-emerald-100"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dernières réparations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Véhicule</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Mécanicien</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Progression</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {repairs.sort((a, b) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              ).slice(0, 5).map((repair) => (
                <TableRow key={repair.id}>
                  <TableCell>{repair.startDate}</TableCell>
                  <TableCell>{repair.clientName || 'N/A'}</TableCell>
                  <TableCell>{repair.vehicleName || 'N/A'}</TableCell>
                  <TableCell>{repair.description}</TableCell>
                  <TableCell>{repair.mechanicName || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge className={cn(getStatusColor(repair.status))}>
                      {repair.status === 'in_progress' ? 'En cours' 
                       : repair.status === 'awaiting_parts' ? 'En attente de pièces'
                       : repair.status === 'completed' ? 'Terminé'
                       : repair.status === 'awaiting_approval' ? 'En attente d\'approbation'
                       : 'En attente'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${repair.progress || 0}%` }}
                      ></div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreateRepairDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
        onSave={handleAddRepair}
      />
    </div>
  );
};

export default GarageRepairsDashboard;
