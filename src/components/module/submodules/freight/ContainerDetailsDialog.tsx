
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/StatusBadge';
import { Container } from '@/types/freight';

interface ContainerDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  container: Container;
}

const ContainerDetailsDialog: React.FC<ContainerDetailsDialogProps> = ({ isOpen, onClose, container }) => {
  const getStatusColor = (status: string): "success" | "warning" | "danger" => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'in_transit':
      case 'loading':
      case 'ready':
        return 'warning';
      case 'customs':
      default:
        return 'danger';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'in_transit': return 'En transit';
      case 'delivered': return 'Livré';
      case 'loading': return 'En chargement';
      case 'customs': return 'En douane';
      case 'ready': return 'Prêt';
      default: return status;
    }
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return "Non spécifié";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Détails du conteneur {container.number}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Numéro</h3>
            <p className="mt-1">{container.number}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Type</h3>
            <p className="mt-1">{container.type}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Client</h3>
            <p className="mt-1">{container.client}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Statut</h3>
            <div className="mt-1">
              <StatusBadge status={getStatusColor(container.status)}>
                {getStatusText(container.status)}
              </StatusBadge>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Localisation</h3>
            <p className="mt-1">{container.location}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Destination</h3>
            <p className="mt-1">{container.destination}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Date de départ</h3>
            <p className="mt-1">{formatDate(container.departure)}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Date d'arrivée prévue</h3>
            <p className="mt-1">{formatDate(container.arrival)}</p>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">ID du conteneur</h3>
            <p className="mt-1 text-xs text-gray-500">{container.id}</p>
          </div>
        </div>
        
        <DialogFooter className="mt-6">
          <Button onClick={onClose}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContainerDetailsDialog;
