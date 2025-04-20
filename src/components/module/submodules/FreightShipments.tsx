
import React, { useState } from 'react';
import { useShipments } from './freight/hooks/useShipments';
import { Shipment } from '@/types/freight';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Status, Loader2, Plus, PenSquare, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ShipmentEditDialog from './freight/ShipmentEditDialog';
import { useToast } from '@/hooks/use-toast';
import { updateShipment, deleteShipment } from './freight/services/shipmentService';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'draft': return 'bg-slate-500';
    case 'confirmed': return 'bg-blue-500';
    case 'in_transit': return 'bg-amber-500';
    case 'delivered': return 'bg-green-500';
    case 'cancelled': return 'bg-red-500';
    case 'delayed': return 'bg-purple-500';
    default: return 'bg-slate-500';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'draft': return 'Brouillon';
    case 'confirmed': return 'Confirmée';
    case 'in_transit': return 'En transit';
    case 'delivered': return 'Livrée';
    case 'cancelled': return 'Annulée';
    case 'delayed': return 'Retardée';
    default: return 'Inconnu';
  }
};

const FreightShipments: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<'all' | 'ongoing' | 'delivered' | 'delayed'>('all');
  const { shipments, isLoading, error } = useShipments(activeFilter);
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);
  const { toast } = useToast();

  const handleOpenEditDialog = (shipment: Shipment) => {
    setEditingShipment(shipment);
  };

  const handleCloseEditDialog = () => {
    setEditingShipment(null);
  };

  const handleSaveShipment = async (updatedShipment: Shipment) => {
    try {
      await updateShipment(updatedShipment.id, updatedShipment);
      // Refresh data is handled automatically by the useShipments hook's dependency on the filter
      setActiveFilter(activeFilter); // Trigger a refresh
      
      toast({
        title: "Mise à jour réussie",
        description: `L'expédition ${updatedShipment.reference} a été mise à jour avec succès`,
      });
    } catch (err) {
      console.error('Error updating shipment:', err);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de l'expédition",
        variant: "destructive"
      });
    }
  };

  const handleCreateNewShipment = () => {
    navigate('/modules/freight/create-shipment');
  };

  const handleDeleteShipment = async (shipmentId: string, reference: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'expédition ${reference} ?`)) {
      try {
        await deleteShipment(shipmentId);
        // Refresh data is handled automatically by the useShipments hook's dependency on the filter
        setActiveFilter(activeFilter); // Trigger a refresh
        
        toast({
          title: "Suppression réussie",
          description: `L'expédition ${reference} a été supprimée avec succès`,
        });
      } catch (err) {
        console.error('Error deleting shipment:', err);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la suppression de l'expédition",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des Expéditions</h1>
        <Button onClick={handleCreateNewShipment}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Expédition
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeFilter} onValueChange={(value) => setActiveFilter(value as any)}>
        <TabsList>
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="ongoing">En cours</TabsTrigger>
          <TabsTrigger value="delivered">Livrées</TabsTrigger>
          <TabsTrigger value="delayed">Retardées</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="p-0">
          <Card>
            <CardHeader>
              <CardTitle>Liste des Expéditions</CardTitle>
              <CardDescription>
                Consultez et gérez toutes vos expéditions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : error ? (
                <div className="text-center text-red-500 p-4">
                  Erreur lors du chargement des expéditions
                </div>
              ) : shipments.length === 0 ? (
                <div className="text-center text-muted-foreground p-8">
                  Aucune expédition trouvée
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Référence</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Origine → Destination</TableHead>
                      <TableHead>Date prévue</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shipments.map((shipment) => (
                      <TableRow key={shipment.id}>
                        <TableCell className="font-medium">{shipment.reference}</TableCell>
                        <TableCell>{shipment.customer}</TableCell>
                        <TableCell>{shipment.origin} → {shipment.destination}</TableCell>
                        <TableCell>
                          {format(new Date(shipment.scheduledDate), 'dd/MM/yyyy', { locale: fr })}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(shipment.status)}>
                            {getStatusLabel(shipment.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleOpenEditDialog(shipment)}
                            >
                              <PenSquare className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteShipment(shipment.id, shipment.reference)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ongoing" className="p-0">
          {/* Same content as 'all' but filtered */}
          <Card>
            <CardHeader>
              <CardTitle>Expéditions en cours</CardTitle>
              <CardDescription>
                Consultez et gérez vos expéditions en cours
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Same table content as 'all' */}
              {/* ... */}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="delivered" className="p-0">
          {/* Same content as 'all' but filtered */}
          <Card>
            <CardHeader>
              <CardTitle>Expéditions livrées</CardTitle>
              <CardDescription>
                Consultez et gérez vos expéditions livrées
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Same table content as 'all' */}
              {/* ... */}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="delayed" className="p-0">
          {/* Same content as 'all' but filtered */}
          <Card>
            <CardHeader>
              <CardTitle>Expéditions retardées</CardTitle>
              <CardDescription>
                Consultez et gérez vos expéditions retardées
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Same table content as 'all' */}
              {/* ... */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {editingShipment && (
        <ShipmentEditDialog
          isOpen={!!editingShipment}
          onClose={handleCloseEditDialog}
          shipment={editingShipment}
          onSave={handleSaveShipment}
        />
      )}
    </div>
  );
};

export default FreightShipments;
