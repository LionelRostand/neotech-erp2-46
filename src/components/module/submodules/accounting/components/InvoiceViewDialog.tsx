import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Invoice } from '../types/accounting-types';
import { formatCurrency } from '../utils/formatting';
import { Download, Printer } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface InvoiceViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice;
}

const InvoiceViewDialog: React.FC<InvoiceViewDialogProps> = ({ open, onOpenChange, invoice }) => {
  const handlePrint = () => {
    const printContents = document.getElementById('invoice-to-print')?.innerHTML;
    const originalContents = document.body.innerHTML;

    if (printContents) {
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR').format(date);
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'paid': return 'Payée';
      case 'sent': return 'Envoyée';
      case 'overdue': return 'En retard';
      case 'draft': return 'Brouillon';
      case 'cancelled': return 'Annulée';
      default: return 'En attente';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Facture {invoice.number}</DialogTitle>
        </DialogHeader>
        
        <div id="invoice-to-print" className="p-6 bg-white">
          <div className="flex justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">FACTURE</h1>
              <p className="text-xl font-semibold"># {invoice.number}</p>
              <p className="text-gray-500">
                Status: <span className="font-medium">{getStatusLabel(invoice.status)}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold">Société ABCDE</p>
              <p>123 Rue du Commerce</p>
              <p>75001 Paris, France</p>
              <p>Email: contact@abcde.com</p>
              <p>Téléphone: +33 1 23 45 67 89</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <p className="font-bold mb-2">Facturer à:</p>
              <p className="font-medium">{invoice.clientName}</p>
              <p>Adresse du client</p>
              <p>Ville, Pays</p>
            </div>
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-bold">Date d'émission:</p>
                  <p>{formatDate(invoice.issueDate)}</p>
                </div>
                <div>
                  <p className="font-bold">Date d'échéance:</p>
                  <p>{formatDate(invoice.dueDate)}</p>
                </div>
              </div>
            </div>
          </div>
          
          <Card className="mb-8">
            <CardContent className="p-0">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 text-left">Description</th>
                    <th className="py-2 px-4 text-right">Quantité</th>
                    <th className="py-2 px-4 text-right">Prix unitaire</th>
                    <th className="py-2 px-4 text-right">TVA</th>
                    <th className="py-2 px-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-4">{item.description}</td>
                      <td className="py-2 px-4 text-right">{item.quantity}</td>
                      <td className="py-2 px-4 text-right">{formatCurrency(item.unitPrice, invoice.currency)}</td>
                      <td className="py-2 px-4 text-right">{item.taxRate}%</td>
                      <td className="py-2 px-4 text-right">
                        {formatCurrency(item.quantity * item.unitPrice * (1 + item.taxRate / 100), invoice.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
          
          <div className="flex justify-end mb-8">
            <div className="w-64">
              <div className="flex justify-between py-2">
                <span>Sous-total:</span>
                <span>{formatCurrency(invoice.subtotal, invoice.currency)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>TVA:</span>
                <span>{formatCurrency(invoice.taxAmount, invoice.currency)}</span>
              </div>
              <div className="flex justify-between py-2 font-bold text-lg">
                <span>Total:</span>
                <span>{formatCurrency(invoice.total, invoice.currency)}</span>
              </div>
            </div>
          </div>
          
          {invoice.notes && (
            <div className="mb-6">
              <p className="font-bold mb-2">Notes:</p>
              <p>{invoice.notes}</p>
            </div>
          )}
          
          <div className="border-t pt-4">
            <p className="font-bold mb-2">Conditions de paiement:</p>
            <p>{invoice.termsAndConditions || 'Paiement à réception de la facture'}</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimer
          </Button>
          <Button type="button">
            <Download className="mr-2 h-4 w-4" />
            Télécharger PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceViewDialog;
