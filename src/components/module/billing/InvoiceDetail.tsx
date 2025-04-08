
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Printer, Download, Send, QrCode, Eye } from 'lucide-react';
import QRCodeInvoice from './QRCodeInvoice';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { toast } from 'sonner';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Invoice {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  client: {
    id: string;
    name: string;
    address: string;
    email: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
}

interface InvoiceDetailProps {
  invoice: Invoice;
}

const InvoiceDetail: React.FC<InvoiceDetailProps> = ({ invoice }) => {
  // Status badge color based on invoice status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline" className="bg-gray-100">Brouillon</Badge>;
      case 'sent':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Envoyée</Badge>;
      case 'paid':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Payée</Badge>;
      case 'overdue':
        return <Badge variant="outline" className="bg-red-100 text-red-800">En retard</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Format date to French format
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PPP', { locale: fr });
  };

  // Handle print invoice
  const handlePrint = () => {
    toast.success('Impression de la facture en cours...');
    window.print();
  };

  // Handle download invoice
  const handleDownload = () => {
    toast.success('Téléchargement de la facture en cours...');
    // This would typically download a PDF version of the invoice
  };

  // Handle send invoice
  const handleSendInvoice = () => {
    toast.success(`Facture envoyée à ${invoice.client.email}`);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Facture #{invoice.number}</h2>
          <p className="text-muted-foreground">
            Émise le {formatDate(invoice.date)} • Échéance le {formatDate(invoice.dueDate)}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Télécharger
          </Button>
          <Button variant="default" size="sm" onClick={handleSendInvoice}>
            <Send className="h-4 w-4 mr-2" />
            Envoyer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Détails de la facture</CardTitle>
            <CardDescription>Informations sur les produits et services</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Quantité</TableHead>
                  <TableHead className="text-right">Prix unitaire</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.totalPrice)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">
                    Sous-total
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(invoice.subtotal)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">
                    TVA (20%)
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(invoice.tax)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">
                    Total
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {formatCurrency(invoice.total)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Information client</CardTitle>
                {getStatusBadge(invoice.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">{invoice.client.name}</p>
                <p className="text-sm whitespace-pre-line">{invoice.client.address}</p>
                <p className="text-sm">{invoice.client.email}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">QR Code Facture</CardTitle>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Eye className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>Voir le QR code</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>QR Code de la facture #{invoice.number}</SheetTitle>
                    <SheetDescription>
                      Ce QR code contient les informations essentielles de la facture.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="flex justify-center py-8">
                    <QRCodeInvoice 
                      invoiceData={{
                        id: invoice.id,
                        number: invoice.number,
                        date: invoice.date,
                        amount: invoice.total,
                        client: invoice.client.name,
                        dueDate: invoice.dueDate
                      }}
                      size={256}
                    />
                  </div>
                  <p className="text-sm text-center text-muted-foreground mt-4">
                    Ce QR code peut être scanné pour accéder rapidement aux détails de la facture,
                    faciliter les paiements ou vérifier l'authenticité du document.
                  </p>
                </SheetContent>
              </Sheet>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <QRCodeInvoice 
                  invoiceData={{
                    id: invoice.id,
                    number: invoice.number,
                    date: invoice.date,
                    amount: invoice.total,
                    client: invoice.client.name,
                    dueDate: invoice.dueDate
                  }}
                  size={128}
                  showControls={false}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-center pt-0">
              <p className="text-xs text-center text-muted-foreground">
                Scannez pour accéder aux détails ou effectuer un paiement
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;
