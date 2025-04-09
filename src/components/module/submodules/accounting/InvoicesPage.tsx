
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, FileDown, Eye, Edit, Trash2 } from 'lucide-react';
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
import { useFirestore } from '@/hooks/useFirestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { exportToExcel } from '@/utils/exportUtils';
import { toast } from 'sonner';
import InvoiceFormDialog from './components/InvoiceFormDialog';
import InvoiceViewDialog from './components/InvoiceViewDialog';
import DeleteConfirmDialog from './components/DeleteConfirmDialog';

const InvoicesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: invoices, isLoading, refetch } = useInvoicesCollection();
  const invoicesCollection = useFirestore(COLLECTIONS.ACCOUNTING.INVOICES);
  
  // État pour les dialogues
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const filteredInvoices = searchTerm 
    ? invoices.filter(invoice => 
        invoice.number?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        invoice.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : invoices;

  const handleExportToExcel = () => {
    // Préparer les données pour l'export
    const dataToExport = filteredInvoices.map(invoice => ({
      Numéro: invoice.number || '',
      Client: invoice.clientName || '',
      'Date d\'émission': invoice.issueDate || '',
      'Date d\'échéance': invoice.dueDate || '',
      Montant: invoice.total || 0,
      Statut: getStatusLabel(invoice.status) || '',
    }));

    // Exporter vers Excel
    const success = exportToExcel(dataToExport, 'Factures', 'Liste_des_factures');
    
    if (success) {
      toast.success('Export réussi');
    } else {
      toast.error('Échec de l\'export');
    }
  };

  const handleDeleteInvoice = async () => {
    if (!selectedInvoice) return;
    
    try {
      await invoicesCollection.remove(selectedInvoice.id);
      toast.success('Facture supprimée avec succès');
      refetch();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression de la facture');
    }
  };

  // Fonction pour obtenir le label du statut en français
  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'paid': return 'Payée';
      case 'sent': return 'Envoyée';
      case 'overdue': return 'En retard';
      case 'draft': return 'Brouillon';
      default: return 'En attente';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline">Brouillon</Badge>;
      case 'sent':
        return <Badge variant="secondary">Envoyée</Badge>;
      case 'paid':
        return <Badge className="bg-green-500">Payée</Badge>;
      case 'overdue':
        return <Badge variant="destructive">En retard</Badge>;
      default:
        return <Badge variant="secondary">En attente</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Factures</h1>
        <div className="flex space-x-2">
          <Button onClick={handleExportToExcel}>
            <FileDown className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
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
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
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
                      <TableCell>{getStatusBadge(invoice.status || '')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => {
                              setSelectedInvoice(invoice);
                              setIsViewDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              setSelectedInvoice(invoice);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              setSelectedInvoice(invoice);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialogue de création/modification de facture */}
      <InvoiceFormDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={() => refetch()}
      />

      {/* Dialogue de modification de facture */}
      {selectedInvoice && (
        <InvoiceFormDialog 
          open={isEditDialogOpen} 
          onOpenChange={setIsEditDialogOpen}
          invoice={selectedInvoice}
          onSuccess={() => refetch()}
        />
      )}

      {/* Dialogue de visualisation de facture */}
      {selectedInvoice && (
        <InvoiceViewDialog 
          open={isViewDialogOpen} 
          onOpenChange={setIsViewDialogOpen}
          invoice={selectedInvoice}
        />
      )}

      {/* Dialogue de confirmation de suppression */}
      <DeleteConfirmDialog 
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteInvoice}
        title="Supprimer la facture"
        description="Êtes-vous sûr de vouloir supprimer cette facture ? Cette action est irréversible."
      />
    </div>
  );
};

export default InvoicesPage;
