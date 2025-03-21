
import React from 'react';
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter, DialogTitle, DialogContent, Dialog, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin, User, Car, FileText, Check, X, Printer } from "lucide-react";
import { ExtensionRequest } from '../types/transport-types';
import { Separator } from "@/components/ui/separator";

interface ExtensionDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  extension: ExtensionRequest | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const ExtensionDetailDialog: React.FC<ExtensionDetailDialogProps> = ({
  open,
  onOpenChange,
  extension,
  onApprove,
  onReject
}) => {
  if (!extension) return null;
  
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', { dateStyle: 'long' });
  };
  
  const getStatusBadge = (status: "pending" | "approved" | "rejected") => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approuvée</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Refusée</Badge>;
      default:
        return <Badge className="bg-yellow-500">En attente</Badge>;
    }
  };
  
  const calculateExtensionDays = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  const extensionDays = calculateExtensionDays(extension.originalEndDate, extension.requestedEndDate);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock size={18} />
            <span>Détails de la demande de prolongation</span>
          </DialogTitle>
          <DialogDescription>
            Réservation {extension.reservationId}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User size={20} className="text-blue-600" />
              <div>
                <div className="text-sm text-muted-foreground">Client</div>
                <div className="font-medium">{extension.clientName}</div>
              </div>
            </div>
            
            <div>
              {getStatusBadge(extension.status)}
            </div>
          </div>
          
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <Car size={20} className="text-blue-600" />
                <div>
                  <div className="text-sm text-muted-foreground">Véhicule</div>
                  <div className="font-medium">{extension.vehicleName}</div>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar size={20} className="text-blue-600" />
                  <div>
                    <div className="text-sm text-muted-foreground">Date de fin originale</div>
                    <div className="font-medium">{formatDate(extension.originalEndDate)}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Calendar size={20} className="text-green-600" />
                  <div>
                    <div className="text-sm text-muted-foreground">Date de fin demandée</div>
                    <div className="font-medium">{formatDate(extension.requestedEndDate)}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 p-3 rounded-md">
                <div className="text-sm font-medium mb-1">Motif de la prolongation</div>
                <div className="text-sm">{extension.reason}</div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Durée de prolongation:
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-800">
                  {extensionDays} jour{extensionDays > 1 ? 's' : ''}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
          <Button 
            onClick={() => onOpenChange(false)} 
            variant="outline"
            className="flex items-center gap-1"
          >
            <Printer size={16} />
            <span>Imprimer</span>
          </Button>
          
          <div className="flex gap-2">
            {extension.status === 'pending' && (
              <>
                <Button 
                  onClick={() => onReject(extension.id)} 
                  variant="destructive"
                  className="flex items-center gap-1"
                >
                  <X size={16} />
                  <span>Refuser</span>
                </Button>
                <Button 
                  onClick={() => onApprove(extension.id)} 
                  className="flex items-center gap-1"
                >
                  <Check size={16} />
                  <span>Approuver</span>
                </Button>
              </>
            )}
            {extension.status !== 'pending' && (
              <Button onClick={() => onOpenChange(false)}>
                Fermer
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExtensionDetailDialog;
