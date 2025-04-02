
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usePlanning } from './context/PlanningContext';

const ExtensionDetailsDialog: React.FC = () => {
  const {
    showExtensionDetailsDialog,
    setShowExtensionDetailsDialog,
    selectedExtensionRequest,
    handleResolveExtension,
  } = usePlanning();

  const handleClose = () => {
    setShowExtensionDetailsDialog(false);
  };

  const handleApprove = () => {
    if (selectedExtensionRequest) {
      handleResolveExtension(selectedExtensionRequest.id, true);
    }
  };

  const handleReject = () => {
    if (selectedExtensionRequest) {
      handleResolveExtension(selectedExtensionRequest.id, false);
    }
  };

  if (!selectedExtensionRequest) {
    return null;
  }

  return (
    <Dialog open={showExtensionDetailsDialog} onOpenChange={setShowExtensionDetailsDialog}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Demande de prolongation</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div>
            <p className="text-sm font-medium">Véhicule:</p>
            <p>{selectedExtensionRequest.vehicleName}</p>
          </div>
          
          {selectedExtensionRequest.driverName && (
            <div>
              <p className="text-sm font-medium">Chauffeur:</p>
              <p>{selectedExtensionRequest.driverName}</p>
            </div>
          )}
          
          <div>
            <p className="text-sm font-medium">Motif de la demande:</p>
            <p>{selectedExtensionRequest.reason}</p>
          </div>
          
          {selectedExtensionRequest.originalEndTime && selectedExtensionRequest.newEndTime && (
            <div>
              <p className="text-sm font-medium">Période demandée:</p>
              <p>De {new Date(selectedExtensionRequest.originalEndTime).toLocaleDateString('fr-FR')} à {new Date(selectedExtensionRequest.newEndTime).toLocaleDateString('fr-FR')}</p>
            </div>
          )}
          
          <div>
            <p className="text-sm font-medium">Statut actuel:</p>
            <p className={`font-medium ${
              selectedExtensionRequest.status === 'approved' ? 'text-green-500' :
              selectedExtensionRequest.status === 'rejected' ? 'text-red-500' :
              'text-amber-500'
            }`}>
              {selectedExtensionRequest.status === 'approved' ? 'Approuvée' :
               selectedExtensionRequest.status === 'rejected' ? 'Rejetée' :
               'En attente'}
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Fermer
          </Button>
          
          {selectedExtensionRequest.status === 'pending' && (
            <>
              <Button variant="destructive" onClick={handleReject}>
                Rejeter
              </Button>
              <Button onClick={handleApprove}>
                Approuver
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExtensionDetailsDialog;
