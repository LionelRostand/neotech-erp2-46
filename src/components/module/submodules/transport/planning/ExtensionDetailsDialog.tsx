
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, FileText, Printer } from "lucide-react";
import { usePlanning } from './context/PlanningContext';
import { jsPDF } from "jspdf";

const ExtensionDetailsDialog: React.FC = () => {
  const { 
    selectedExtensionRequest, 
    showExtensionDetailsDialog, 
    setShowExtensionDetailsDialog,
    handleResolveExtension
  } = usePlanning();

  if (!selectedExtensionRequest) return null;

  // Format date string
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', { dateStyle: 'long' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500">En attente</Badge>;
      case 'approved':
        return <Badge className="bg-green-500">Approuvée</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejetée</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

  const handlePrint = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text("Demande de prolongation", 105, 20, { align: 'center' });
    
    // Add reference number
    doc.setFontSize(12);
    doc.text(`Référence: ${selectedExtensionRequest.requestId}`, 20, 30);
    
    // Add creation date
    doc.text(`Date de la demande: ${formatDate(selectedExtensionRequest.createdAt)}`, 20, 40);
    
    // Add status
    let statusText = "En attente";
    if (selectedExtensionRequest.status === "approved") statusText = "Approuvée";
    if (selectedExtensionRequest.status === "rejected") statusText = "Rejetée";
    doc.text(`Statut: ${statusText}`, 20, 50);
    
    // Add horizontal line
    doc.setLineWidth(0.5);
    doc.line(20, 55, 190, 55);
    
    // Client and vehicle info
    doc.setFontSize(16);
    doc.text("Informations", 20, 65);
    
    doc.setFontSize(12);
    doc.text(`Client: ${selectedExtensionRequest.clientName}`, 20, 75);
    doc.text(`Véhicule: ${selectedExtensionRequest.vehicleName}`, 20, 85);
    
    // Dates info
    doc.setFontSize(16);
    doc.text("Dates", 20, 100);
    
    doc.setFontSize(12);
    doc.text(`Date de fin originale: ${formatDate(selectedExtensionRequest.originalEndDate)}`, 20, 110);
    doc.text(`Nouvelle date de fin demandée: ${formatDate(selectedExtensionRequest.requestedEndDate)}`, 20, 120);
    
    // Reason
    doc.setFontSize(16);
    doc.text("Motif de la demande", 20, 135);
    
    doc.setFontSize(12);
    doc.text(selectedExtensionRequest.reason, 20, 145);
    
    // Footer
    doc.setFontSize(10);
    doc.text("Ce document est généré automatiquement par le système de gestion des transports.", 20, 280);
    
    // Save the PDF
    doc.save(`extension-request-${selectedExtensionRequest.requestId}.pdf`);
  };

  return (
    <Dialog 
      open={showExtensionDetailsDialog} 
      onOpenChange={setShowExtensionDetailsDialog}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Détails de la demande de prolongation</DialogTitle>
          <DialogDescription>
            Voir les détails et gérer cette demande de prolongation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="font-medium">Référence:</span>
              <span>{selectedExtensionRequest.requestId}</span>
            </div>
            <div>{getStatusBadge(selectedExtensionRequest.status)}</div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-1">
                <Calendar size={16} />
                <span>Dates</span>
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm text-muted-foreground">Date originale</label>
                  <p>{formatDate(selectedExtensionRequest.originalEndDate)}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Date demandée</label>
                  <p>{formatDate(selectedExtensionRequest.requestedEndDate)}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2 flex items-center gap-1">
                <FileText size={16} />
                <span>Détails</span>
              </h4>
              
              <div className="space-y-2">
                <div>
                  <label className="text-sm text-muted-foreground">Client</label>
                  <p>{selectedExtensionRequest.clientName}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Véhicule</label>
                  <p>{selectedExtensionRequest.vehicleName}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Motif</label>
                  <p>{selectedExtensionRequest.reason}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2 flex items-center gap-1">
                <Clock size={16} />
                <span>Historique</span>
              </h4>
              <div>
                <label className="text-sm text-muted-foreground">Créée le</label>
                <p>{formatDate(selectedExtensionRequest.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <div className="flex w-full justify-between">
            <Button 
              variant="outline" 
              onClick={handlePrint}
              className="flex items-center gap-1"
            >
              <Printer size={16} />
              <span>Imprimer</span>
            </Button>

            <div className="flex gap-2">
              {selectedExtensionRequest.status === 'pending' && (
                <>
                  <Button 
                    variant="destructive"
                    onClick={() => handleResolveExtension(selectedExtensionRequest.id, false)}
                  >
                    Refuser
                  </Button>
                  <Button
                    onClick={() => handleResolveExtension(selectedExtensionRequest.id, true)}
                  >
                    Approuver
                  </Button>
                </>
              )}
              {selectedExtensionRequest.status !== 'pending' && (
                <Button 
                  onClick={() => setShowExtensionDetailsDialog(false)}
                >
                  Fermer
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExtensionDetailsDialog;
