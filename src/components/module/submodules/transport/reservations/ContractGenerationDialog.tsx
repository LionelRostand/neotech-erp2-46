
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2, FileText, Download, Send } from "lucide-react";
import { TransportReservation } from '../types/transport-types';
import { toast } from "sonner";

interface ContractGenerationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: TransportReservation;
  clientName: string;
  vehicleName: string;
  driverName?: string;
  onContractGenerated: () => void;
}

const ContractGenerationDialog: React.FC<ContractGenerationDialogProps> = ({
  open,
  onOpenChange,
  reservation,
  clientName,
  vehicleName,
  driverName,
  onContractGenerated
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [includeInsurance, setIncludeInsurance] = useState(true);
  const [includeFuel, setIncludeFuel] = useState(true);
  const [includeDriverInfo, setIncludeDriverInfo] = useState(reservation.needsDriver);
  const [isGenerated, setIsGenerated] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    
    // Simulate contract generation
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
      console.log("Contract generated for:", reservation.id, {
        includeInsurance,
        includeFuel,
        includeDriverInfo
      });
    }, 2000);
  };

  const handleDownload = () => {
    // Simulate download
    console.log("Downloading contract for:", reservation.id);
    toast.success("Contrat téléchargé avec succès");
  };

  const handleSendToClient = () => {
    // Simulate sending to client
    console.log("Sending contract to client:", reservation.clientId);
    toast.success("Contrat envoyé au client avec succès");
  };

  const handleFinalize = () => {
    onContractGenerated();
    onOpenChange(false);
    toast.success("Contrat généré et associé à la réservation");
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Génération de contrat</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
            <p><strong>Client:</strong> {clientName}</p>
            <p><strong>Véhicule:</strong> {vehicleName}</p>
            {reservation.needsDriver && <p><strong>Chauffeur:</strong> {driverName || "Non assigné"}</p>}
            <p><strong>Date:</strong> {formatDate(reservation.date)} à {reservation.time}</p>
            <p><strong>Trajet:</strong> {reservation.pickup.address} → {reservation.dropoff.address}</p>
            <p><strong>Montant:</strong> {reservation.price} €</p>
          </div>

          {!isGenerated ? (
            <div className="space-y-4">
              <h3 className="text-md font-medium">Options du contrat</h3>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="insurance" 
                  checked={includeInsurance} 
                  onCheckedChange={() => setIncludeInsurance(!includeInsurance)} 
                />
                <Label htmlFor="insurance">Inclure les détails d'assurance</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="fuel" 
                  checked={includeFuel} 
                  onCheckedChange={() => setIncludeFuel(!includeFuel)} 
                />
                <Label htmlFor="fuel">Inclure la politique de carburant</Label>
              </div>
              
              {reservation.needsDriver && (
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="driver" 
                    checked={includeDriverInfo} 
                    onCheckedChange={() => setIncludeDriverInfo(!includeDriverInfo)} 
                  />
                  <Label htmlFor="driver">Inclure les informations du chauffeur</Label>
                </div>
              )}
            </div>
          ) : (
            <div className="border border-green-200 bg-green-50 p-4 rounded-lg flex items-center justify-center gap-3">
              <FileText className="h-5 w-5 text-green-600" />
              <span className="text-green-800">Contrat généré avec succès</span>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:space-x-0">
          {!isGenerated ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button 
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Générer le contrat
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleDownload}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Télécharger
              </Button>
              <Button
                variant="outline"
                onClick={handleSendToClient}
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                Envoyer au client
              </Button>
              <Button onClick={handleFinalize}>
                Finaliser
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContractGenerationDialog;
