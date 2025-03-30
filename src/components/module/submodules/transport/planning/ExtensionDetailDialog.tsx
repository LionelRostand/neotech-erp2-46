
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePlanning } from './context/PlanningContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ExtensionDetailDialogProps {
  // No props needed, all data will come from context
}

const ExtensionDetailDialog: React.FC<ExtensionDetailDialogProps> = () => {
  const { 
    showExtensionDetailsDialog, 
    setShowExtensionDetailsDialog, 
    selectedExtensionRequest,
    handleResolveExtension 
  } = usePlanning();

  if (!selectedExtensionRequest) return null;

  // Helper to format dates
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      return format(new Date(dateStr), 'PPP', { locale: fr });
    } catch (error) {
      return dateStr;
    }
  };

  // Helper to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="border-amber-500 text-amber-500">En attente</Badge>;
      case 'approved':
        return <Badge variant="success">Approuvée</Badge>;
      case 'rejected':
      case 'denied':
        return <Badge variant="destructive">Rejetée</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Handle approval or rejection
  const handleAction = (approved: boolean) => {
    if (selectedExtensionRequest) {
      handleResolveExtension(selectedExtensionRequest.id, approved);
    }
  };

  // Check if the extension can be handled (is not already approved or rejected)
  const canBeHandled = selectedExtensionRequest.status === 'pending';

  return (
    <Dialog 
      open={showExtensionDetailsDialog} 
      onOpenChange={setShowExtensionDetailsDialog}
    >
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Demande d'extension</span>
            {getStatusBadge(selectedExtensionRequest.status)}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Client</p>
            <p className="font-medium">{selectedExtensionRequest.clientName}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-1">Véhicule</p>
            <p className="font-medium">{selectedExtensionRequest.vehicleName}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-1">Date de fin initiale</p>
            <p className="font-medium">{formatDate(selectedExtensionRequest.originalEndDate)}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-1">Date de fin demandée</p>
            <p className="font-medium">{formatDate(selectedExtensionRequest.requestedEndDate)}</p>
          </div>
        </div>
        
        <div className="border-t pt-4 mt-2">
          <p className="text-sm text-muted-foreground mb-1">Motif de la demande</p>
          <p>{selectedExtensionRequest.reason || selectedExtensionRequest.extensionReason || 'Aucun motif spécifié'}</p>
        </div>
        
        <DialogFooter className="pt-4">
          {canBeHandled ? (
            <div className="flex gap-3 w-full">
              <Button 
                variant="outline" 
                onClick={() => handleAction(false)}
                className="flex-1"
              >
                Rejeter
              </Button>
              <Button 
                onClick={() => handleAction(true)}
                className="flex-1"
              >
                Approuver
              </Button>
            </div>
          ) : (
            <Button 
              onClick={() => setShowExtensionDetailsDialog(false)}
              className="w-full"
            >
              Fermer
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExtensionDetailDialog;
