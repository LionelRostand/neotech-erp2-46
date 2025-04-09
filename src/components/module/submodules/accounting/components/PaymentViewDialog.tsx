
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Payment } from '../types/accounting-types';
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from '../utils/formatting';
import {
  Calendar,
  Receipt,
  CreditCard,
  FileText,
  Clock
} from 'lucide-react';

interface PaymentViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: Payment | null;
}

const PaymentViewDialog: React.FC<PaymentViewDialogProps> = ({
  open,
  onOpenChange,
  payment
}) => {
  if (!payment) return null;

  const getMethodName = (method: string) => {
    switch (method) {
      case 'stripe': return 'Carte de crédit';
      case 'bank_transfer': return 'Virement bancaire';
      case 'cash': return 'Espèces';
      case 'check': return 'Chèque';
      case 'paypal': return 'PayPal';
      default: return 'Virement bancaire';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Validé';
      case 'pending': return 'En attente';
      case 'failed': return 'Échoué';
      case 'refunded': return 'Remboursé';
      default: return 'En attente';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'success' as const;
      case 'pending': return 'outline' as const;
      case 'failed': return 'destructive' as const;
      case 'refunded': return 'warning' as const;
      default: return 'outline' as const;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Détails du paiement
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {/* Header with amount and status */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Montant</p>
              <p className="text-2xl font-bold">
                {formatCurrency(payment.amount || 0, payment.currency || 'EUR')}
              </p>
            </div>
            <Badge variant={getStatusVariant(payment.status || '')}>
              {getStatusText(payment.status || '')}
            </Badge>
          </div>

          {/* Invoice and transaction details */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Numéro de facture</p>
                <p className="text-base font-medium">
                  {payment.invoiceId || 'Non spécifié'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Date de paiement</p>
                <p className="text-base font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {payment.date || 'Non spécifiée'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Méthode de paiement</p>
                <p className="text-base font-medium flex items-center">
                  <CreditCard className="h-4 w-4 mr-1" />
                  {getMethodName(payment.method || '')}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">ID de transaction</p>
                <p className="text-base font-medium font-mono">
                  {payment.transactionId || 'Non spécifié'}
                </p>
              </div>
            </div>

            {payment.notes && (
              <div className="pt-2">
                <p className="text-sm text-muted-foreground">Notes</p>
                <div className="p-3 bg-muted rounded-md mt-1">
                  <p className="text-sm">{payment.notes}</p>
                </div>
              </div>
            )}

            <div className="border-t pt-4 mt-4">
              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <p className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" /> Créé le:
                  </p>
                  <p>{payment.createdAt ? new Date(payment.createdAt).toLocaleString() : 'N/A'}</p>
                </div>
                <div>
                  <p className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" /> Modifié le:
                  </p>
                  <p>{payment.updatedAt ? new Date(payment.updatedAt).toLocaleString() : 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
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

export default PaymentViewDialog;
