
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, CreditCard, FileText, MapPin, Phone, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface InvoiceDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: any | null;
}

const InvoiceDetailsDialog: React.FC<InvoiceDetailsDialogProps> = ({ 
  open, 
  onOpenChange, 
  invoice 
}) => {
  if (!invoice) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">Payée</Badge>;
      case 'pending':
        return <Badge variant="outline">En attente</Badge>;
      case 'partially_paid':
        return <Badge className="bg-blue-500">Partiellement payée</Badge>;
      case 'overdue':
        return <Badge className="bg-red-500">En retard</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Détails de la facture {invoice.number}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold">{invoice.number}</h3>
              <p className="text-muted-foreground">
                {formatDate(invoice.date)}
              </p>
            </div>
            <div>
              {getStatusBadge(invoice.status)}
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="flex items-start mb-4">
              <User className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Client</p>
                <p>{invoice.clientName}</p>
              </div>
            </div>
            
            <div className="flex items-start mb-4">
              <MapPin className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Véhicule</p>
                <p>{invoice.vehicleInfo}</p>
              </div>
            </div>

            <div className="flex items-start mb-4">
              <Calendar className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Échéance</p>
                <p>{formatDate(invoice.dueDate)}</p>
              </div>
            </div>

            <div className="flex items-start mb-4">
              <Phone className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Contact</p>
                <p>+33 6 12 34 56 78</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-b py-4">
            <h4 className="font-medium mb-3">Détails de la prestation</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Service de transport</span>
                <span>{formatCurrency(invoice.amount * 0.8)}</span>
              </div>
              <div className="flex justify-between">
                <span>Frais additionnels</span>
                <span>{formatCurrency(invoice.amount * 0.2)}</span>
              </div>
              <div className="flex justify-between font-bold pt-2">
                <span>Total</span>
                <span>{formatCurrency(invoice.amount)}</span>
              </div>
            </div>
          </div>
          
          {invoice.paymentMethod && (
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-muted-foreground" />
              <div>
                <p className="font-medium">Paiement</p>
                <p>Payé par {invoice.paymentMethod === 'card' ? 'Carte bancaire' : 
                            invoice.paymentMethod === 'transfer' ? 'Virement bancaire' : 
                            invoice.paymentMethod === 'cash' ? 'Espèces' : 
                            invoice.paymentMethod}</p>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDetailsDialog;
