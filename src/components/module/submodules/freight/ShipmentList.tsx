
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Badge,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Truck,
  Package,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { useShipments } from './hooks/useShipments';
import { Shipment } from '@/types/freight';
import ShipmentViewDialog from './ShipmentViewDialog';
import ShipmentEditDialog from './ShipmentEditDialog';
import ShipmentDeleteDialog from './ShipmentDeleteDialog';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { updateDocument } from '@/hooks/firestore/firestore-utils';

interface ShipmentListProps {
  filter: 'all' | 'ongoing' | 'delivered' | 'delayed';
}

const ShipmentList: React.FC<ShipmentListProps> = ({ filter }) => {
  const { shipments, isLoading, error } = useShipments(filter);
  const [viewShipment, setViewShipment] = useState<Shipment | null>(null);
  const [editShipment, setEditShipment] = useState<Shipment | null>(null);
  const [deleteShipment, setDeleteShipment] = useState<Shipment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline" className="bg-slate-100 text-slate-800 border-none">Brouillon</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-none">Confirmée</Badge>;
      case 'in_transit':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-none">En transit</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-none">Livrée</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-none">Annulée</Badge>;
      case 'delayed':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-none">Retardée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getShipmentTypeLabel = (type: string) => {
    switch (type) {
      case 'import':
        return 'Import';
      case 'export':
        return 'Export';
      case 'local':
        return 'Local';
      case 'international':
        return 'International';
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP', { locale: fr });
    } catch (error) {
      return 'Date invalide';
    }
  };

  const handleDelete = async () => {
    if (!deleteShipment) return;
    
    try {
      setIsDeleting(true);
      
      // Supprimer l'expédition de Firebase
      await deleteDoc(doc(db, COLLECTIONS.FREIGHT.SHIPMENTS, deleteShipment.id));
      
      toast({
        title: "Expédition supprimée",
        description: `L'expédition ${deleteShipment.reference} a été supprimée avec succès.`,
      });
      
      // Fermer la boîte de dialogue
      setDeleteShipment(null);
      setIsDeleting(false);
      
      // Recharger la liste des expéditions (le hook useShipments va se mettre à jour automatiquement)
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'expédition:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'expédition. Veuillez réessayer.",
        variant: "destructive"
      });
      setIsDeleting(false);
    }
  };

  const handleSaveEdit = async (updatedShipment: Shipment) => {
    try {
      // Mettre à jour l'expédition dans Firebase
      await updateDocument(COLLECTIONS.FREIGHT.SHIPMENTS, updatedShipment.id, updatedShipment);
      
      toast({
        title: "Expédition mise à jour",
        description: `L'expédition ${updatedShipment.reference} a été mise à jour avec succès.`,
      });
      
      // Fermer la boîte de dialogue
      setEditShipment(null);
      
      // Recharger la liste des expéditions (le hook useShipments va se mettre à jour automatiquement)
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'expédition:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'expédition. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Chargement des expéditions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-red-500">
        <p className="font-semibold">Erreur lors du chargement des expéditions</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  if (shipments.length === 0) {
    return (
      <div className="text-center p-8 border rounded-md bg-muted/20">
        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
        <h3 className="text-lg font-medium">Aucune expédition trouvée</h3>
        <p className="text-muted-foreground mb-4">
          Il n'y a pas d'expéditions correspondant à vos critères.
        </p>
        <Button variant="outline">Créer une nouvelle expédition</Button>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Référence</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Origine</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Transporteur</TableHead>
              <TableHead>Date prévue</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shipments.map((shipment) => (
              <TableRow key={shipment.id}>
                <TableCell className="font-medium">{shipment.reference}</TableCell>
                <TableCell>{shipment.customer}</TableCell>
                <TableCell>{getShipmentTypeLabel(shipment.shipmentType)}</TableCell>
                <TableCell>{shipment.origin}</TableCell>
                <TableCell>{shipment.destination}</TableCell>
                <TableCell>{shipment.carrierName || '-'}</TableCell>
                <TableCell>{formatDate(shipment.scheduledDate)}</TableCell>
                <TableCell>{getStatusBadge(shipment.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setViewShipment(shipment)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setEditShipment(shipment)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteShipment(shipment)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Boîtes de dialogue */}
      {viewShipment && (
        <ShipmentViewDialog
          isOpen={!!viewShipment}
          onClose={() => setViewShipment(null)}
          shipment={viewShipment}
        />
      )}

      {editShipment && (
        <ShipmentEditDialog
          isOpen={!!editShipment}
          onClose={() => setEditShipment(null)}
          shipment={editShipment}
          onSave={handleSaveEdit}
        />
      )}

      {deleteShipment && (
        <ShipmentDeleteDialog
          isOpen={!!deleteShipment}
          onClose={() => setDeleteShipment(null)}
          shipment={deleteShipment}
          onConfirm={handleDelete}
          isDeleting={isDeleting}
        />
      )}
    </>
  );
};

export default ShipmentList;
