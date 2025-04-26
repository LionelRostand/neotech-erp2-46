
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGarageData } from '@/hooks/garage/useGarageData';
import { Button } from '@/components/ui/button';
import { Plus, FileText } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import AddMaintenanceDialog from './AddMaintenanceDialog';
import ViewMaintenanceDialog from './ViewMaintenanceDialog';
import EditMaintenanceDialog from './EditMaintenanceDialog';
import DeleteMaintenanceDialog from './DeleteMaintenanceDialog';
import { toast } from '@/components/ui/use-toast';

const GarageMaintenanceDashboard = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState<any>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { maintenances = [] } = useGarageData();

  const recentMaintenances = [...maintenances]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const totalMaintenances = maintenances.length;
  const inProgressMaintenances = maintenances.filter(m => m.status === 'in_progress').length;
  const completedMaintenances = maintenances.filter(m => m.status === 'completed').length;
  const pendingMaintenances = maintenances.filter(m => m.status === 'pending').length;

  const handleGenerateInvoice = (maintenance: any) => {
    // Here we just show a toast for now - the actual invoice generation would be implemented later
    toast({
      title: "Génération de facture",
      description: `La facture pour la maintenance du ${format(new Date(maintenance.date), 'dd/MM/yyyy', { locale: fr })} est en cours de génération.`,
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tableau de bord des maintenances</h1>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une maintenance
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Maintenances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMaintenances}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En cours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressMaintenances}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terminées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedMaintenances}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingMaintenances}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Maintenances Récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Coût</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentMaintenances.map((maintenance) => (
                <TableRow key={maintenance.id}>
                  <TableCell>
                    {format(new Date(maintenance.date), 'dd/MM/yyyy', { locale: fr })}
                  </TableCell>
                  <TableCell>{maintenance.description}</TableCell>
                  <TableCell>{maintenance.status}</TableCell>
                  <TableCell>{maintenance.totalCost}€</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedMaintenance(maintenance);
                        setShowViewDialog(true);
                      }}
                    >
                      Voir
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedMaintenance(maintenance);
                        setShowEditDialog(true);
                      }}
                    >
                      Modifier
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedMaintenance(maintenance);
                        setShowDeleteDialog(true);
                      }}
                    >
                      Supprimer
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleGenerateInvoice(maintenance)}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Générer Facture
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddMaintenanceDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />

      {selectedMaintenance && (
        <>
          <ViewMaintenanceDialog
            open={showViewDialog}
            onOpenChange={setShowViewDialog}
            maintenance={selectedMaintenance}
          />

          <EditMaintenanceDialog
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
            maintenance={selectedMaintenance}
          />

          <DeleteMaintenanceDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            maintenanceId={selectedMaintenance.id}
          />
        </>
      )}
    </div>
  );
};

export default GarageMaintenanceDashboard;
