
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Download,
  Printer,
  Mail,
  CheckCircle,
  FileText,
  Calendar,
  Building,
  Truck,
  CreditCard
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import DocumentPreview from '../DocumentPreview';
import { Invoice } from '@/types/freight';

interface ViewInvoiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice;
}

const ViewInvoiceDialog: React.FC<ViewInvoiceDialogProps> = ({
  isOpen,
  onClose,
  invoice
}) => {
  const [showDocumentPreview, setShowDocumentPreview] = useState(false);
  const { toast } = useToast();

  const handlePrint = () => {
    toast({
      title: "Impression lancée",
      description: "La facture est envoyée à l'imprimante."
    });
    setTimeout(() => {
      window.print();
    }, 500);
  };
  
  const handleDownload = () => {
    toast({
      title: "Téléchargement",
      description: "La facture a été téléchargée."
    });
  };

  const handleSendByEmail = () => {
    toast({
      title: "Email envoyé",
      description: `La facture a été envoyée à ${invoice.clientName}.`
    });
  };

  const handleMarkAsPaid = () => {
    toast({
      title: "Facture payée",
      description: "La facture a été marquée comme payée."
    });
    onClose();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">Payée</Badge>;
      case 'unpaid':
        return <Badge variant="outline">Non payée</Badge>;
      case 'partially_paid':
        return <Badge className="bg-blue-500">Partiellement payée</Badge>;
      case 'overdue':
        return <Badge className="bg-red-500">En retard</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-500">Annulée</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <DialogTitle className="text-xl">Facture {invoice.reference}</DialogTitle>
              <div>{getStatusBadge(invoice.status)}</div>
            </div>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-sm text-muted-foreground mb-1">Client</p>
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                  <p className="font-medium">{invoice.clientName}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-medium text-sm text-muted-foreground mb-1">Numéro de facture</p>
                <div className="flex items-center justify-end">
                  <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                  <p className="font-medium">{invoice.id}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-sm text-muted-foreground mb-1">Date d'émission</p>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <p>{format(new Date(invoice.createdAt), 'P', { locale: fr })}</p>
                </div>
              </div>
              
              <div>
                <p className="font-medium text-sm text-muted-foreground mb-1">Date d'échéance</p>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <p>{format(new Date(invoice.dueDate), 'P', { locale: fr })}</p>
                </div>
              </div>
            </div>
            
            {invoice.shipmentId && (
              <div>
                <p className="font-medium text-sm text-muted-foreground mb-1">Expédition associée</p>
                <div className="flex items-center">
                  <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
                  <p>{invoice.shipmentId}</p>
                </div>
              </div>
            )}
            
            {invoice.paymentDetails && (
              <div>
                <p className="font-medium text-sm text-muted-foreground mb-1">Informations de paiement</p>
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <p>
                      {invoice.paymentDetails.method === 'bank_transfer' ? 'Virement bancaire' : 
                        invoice.paymentDetails.method === 'card' ? 'Carte bancaire' : 
                        invoice.paymentDetails.method === 'cash' ? 'Espèces' : 
                        invoice.paymentDetails.method}
                      {invoice.paymentDetails.date && ` (${format(new Date(invoice.paymentDetails.date), 'P', { locale: fr })})`}
                    </p>
                    {invoice.paymentDetails.transactionId && (
                      <p className="text-sm text-muted-foreground">
                        Transaction: {invoice.paymentDetails.transactionId}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            <Separator />
            
            <div>
              <h3 className="font-medium mb-4">Détails de la facturation</h3>
              <table className="w-full">
                <thead className="text-sm text-muted-foreground">
                  <tr>
                    <th className="text-left pb-2">Description</th>
                    <th className="text-right pb-2">Qté</th>
                    <th className="text-right pb-2">Prix unitaire</th>
                    <th className="text-right pb-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, idx) => (
                    <tr key={item.id} className="border-t">
                      <td className="py-3">{item.description}</td>
                      <td className="text-right py-3">{item.quantity}</td>
                      <td className="text-right py-3">
                        {item.unitPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                      </td>
                      <td className="text-right py-3">
                        {item.total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t">
                  <tr>
                    <td colSpan={2}></td>
                    <td className="text-right py-2">Sous-total</td>
                    <td className="text-right py-2">
                      {invoice.totalAmount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2}></td>
                    <td className="text-right py-2">TVA (20%)</td>
                    <td className="text-right py-2">
                      {(invoice.totalAmount * 0.2).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td colSpan={2}></td>
                    <td className="text-right py-2 font-bold">Total</td>
                    <td className="text-right py-2 font-bold">
                      {(invoice.totalAmount * 1.2).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </td>
                  </tr>
                  {invoice.paidAmount !== undefined && (
                    <>
                      <tr>
                        <td colSpan={2}></td>
                        <td className="text-right py-2 text-green-600">Montant payé</td>
                        <td className="text-right py-2 text-green-600">
                          {invoice.paidAmount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                        </td>
                      </tr>
                      <tr className="border-t">
                        <td colSpan={2}></td>
                        <td className="text-right py-2 font-bold">Reste à payer</td>
                        <td className="text-right py-2 font-bold">
                          {((invoice.totalAmount * 1.2) - invoice.paidAmount).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                        </td>
                      </tr>
                    </>
                  )}
                </tfoot>
              </table>
            </div>
            
            {invoice.cancelReason && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="font-medium text-sm text-red-600 mb-1">Raison d'annulation</p>
                <p className="text-red-700">{invoice.cancelReason}</p>
              </div>
            )}
          </div>
          
          <DialogFooter className="gap-2">
            <div className="flex gap-2 flex-wrap justify-end">
              <Button variant="outline" onClick={() => setShowDocumentPreview(true)}>
                <FileText className="mr-2 h-4 w-4" />
                Aperçu
              </Button>
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Imprimer
              </Button>
              <Button variant="outline" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Télécharger
              </Button>
              <Button variant="outline" onClick={handleSendByEmail}>
                <Mail className="mr-2 h-4 w-4" />
                Envoyer par email
              </Button>
              {(invoice.status === 'unpaid' || invoice.status === 'partially_paid' || invoice.status === 'overdue') && (
                <Button onClick={handleMarkAsPaid}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Marquer comme payée
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showDocumentPreview && (
        <DocumentPreview
          type="invoice"
          isOpen={showDocumentPreview}
          onClose={() => setShowDocumentPreview(false)}
          shipmentLines={[{
            id: '1',
            productName: 'Expédition de marchandises',
            quantity: 1,
            weight: 100
          }]}
          totalPrice={invoice.totalAmount}
          trackingCode={invoice.shipmentId || 'NO-TRACKING'}
        />
      )}
    </>
  );
};

export default ViewInvoiceDialog;
