
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, FileDown } from 'lucide-react';
import { useInvoicesCollection } from './hooks/useAccountingCollection';
import { Skeleton } from "@/components/ui/skeleton";
import { Invoice } from './types/accounting-types';
import { formatCurrency } from './utils/formatting';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const InvoicesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: invoices, isLoading } = useInvoicesCollection();

  const filteredInvoices = searchTerm 
    ? invoices.filter(invoice => 
        invoice.number?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        invoice.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : invoices;

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'overdue': return 'bg-red-500';
      case 'draft': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Factures</h1>
        <div className="flex space-x-2">
          <Button>
            <FileDown className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle Facture
          </Button>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par numéro ou client..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Liste des Factures</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Numéro</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Échéance</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Aucune facture trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInvoices.map((invoice: Invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.number || 'N/A'}</TableCell>
                      <TableCell>{invoice.clientName || 'Client inconnu'}</TableCell>
                      <TableCell>{invoice.issueDate || 'N/A'}</TableCell>
                      <TableCell>{invoice.dueDate || 'N/A'}</TableCell>
                      <TableCell>{formatCurrency(invoice.total || 0, invoice.currency || 'EUR')}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(invoice.status || 'pending')}>
                          {invoice.status === 'paid' && 'Payée'}
                          {invoice.status === 'pending' && 'En attente'}
                          {invoice.status === 'overdue' && 'En retard'}
                          {invoice.status === 'draft' && 'Brouillon'}
                          {!invoice.status && 'En attente'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoicesPage;
