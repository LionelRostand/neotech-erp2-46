import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Filter, Download, Edit, Trash } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from './utils/formatting';
import { useInvoicesData } from './hooks/useInvoicesData';
import { Invoice } from './types/accounting-types';
import { Skeleton } from "@/components/ui/skeleton";
import InvoiceViewDialog from './components/InvoiceViewDialog';
import DeleteConfirmDialog from './components/DeleteConfirmDialog';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { exportToExcel } from '@/utils/exportUtils';
import InvoiceFormDialog from './components/InvoiceFormDialog';

const InvoicesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("recent");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Firestore operations
  const invoicesCollection = useFirestore(COLLECTIONS.ACCOUNTING.INVOICES);
  
  // Récupération des données depuis Firestore
  const { invoices, isLoading, error } = useInvoicesData();

  const handleAddInvoice = () => {
    setSelectedInvoice(null);
    setIsEditing(false);
    setFormDialogOpen(true);
  };

  const handleEditInvoice = (invoice: Invoice, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedInvoice(invoice);
    setIsEditing(true);
    setFormDialogOpen(true);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setViewDialogOpen(true);
  };

  const handleDeleteInvoice = (invoice: Invoice, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedInvoice(invoice);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedInvoice) return;
    
    try {
      await invoicesCollection.remove(selectedInvoice.id);
      toast.success("Facture supprimée avec succès");
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression de la facture");
    }
  };

  const handleExportToExcel = () => {
    const dataToExport = invoices.map(invoice => ({
      'Numéro': invoice.invoiceNumber,
      'Client': invoice.clientName,
      'Date d\'émission': formatDate(invoice.issueDate),
      'Date d\'échéance': formatDate(invoice.dueDate),
      'Montant Total': invoice.total,
      'Devise': invoice.currency,
      'Statut': getStatusText(invoice.status),
    }));
    
    exportToExcel(dataToExport, 'Factures', 'factures_export');
    toast.success("Export réussi");
  };

  const handleInvoiceFormSuccess = () => {
    setFormDialogOpen(false);
    // La liste se rafraîchira automatiquement grâce au hook useInvoicesData
  };

  // Filtrer les factures selon leur statut
  const draftInvoices = invoices.filter(inv => inv.status === 'draft');
  const paidInvoices = invoices.filter(inv => inv.status === 'paid');
  const overdueInvoices = invoices.filter(inv => inv.status === 'overdue');

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Payée';
      case 'pending': return 'En attente';
      case 'overdue': return 'En retard';
      case 'draft': return 'Brouillon';
      case 'sent': return 'Envoyée';
      case 'cancelled': return 'Annulée';
      default: return 'En attente';
    }
  };

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <p className="text-red-500">Erreur lors du chargement des factures: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Factures</h1>
        <div className="flex space-x-2">
          <Button variant="default" onClick={handleExportToExcel} className="ml-2">
            <Download className="mr-2 h-4 w-4" /> Exporter
          </Button>
          <Button onClick={handleAddInvoice}>
            <Plus className="mr-2 h-4 w-4" /> Nouvelle Facture
          </Button>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="recent">Récentes</TabsTrigger>
            <TabsTrigger value="drafts">Brouillons</TabsTrigger>
            <TabsTrigger value="paid">Payées</TabsTrigger>
            <TabsTrigger value="overdue">En retard</TabsTrigger>
          </TabsList>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" /> Filtrer
          </Button>
        </div>

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Factures récentes</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <InvoicesTable 
                  invoices={invoices}
                  onViewInvoice={handleViewInvoice}
                  onEditInvoice={handleEditInvoice}
                  onDeleteInvoice={handleDeleteInvoice}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drafts">
          <Card>
            <CardHeader>
              <CardTitle>Brouillons de factures</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <InvoicesTable 
                  invoices={draftInvoices}
                  onViewInvoice={handleViewInvoice}
                  onEditInvoice={handleEditInvoice}
                  onDeleteInvoice={handleDeleteInvoice}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paid">
          <Card>
            <CardHeader>
              <CardTitle>Factures payées</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <InvoicesTable 
                  invoices={paidInvoices}
                  onViewInvoice={handleViewInvoice}
                  onEditInvoice={handleEditInvoice}
                  onDeleteInvoice={handleDeleteInvoice}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue">
          <Card>
            <CardHeader>
              <CardTitle>Factures en retard</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <InvoicesTable 
                  invoices={overdueInvoices}
                  onViewInvoice={handleViewInvoice}
                  onEditInvoice={handleEditInvoice}
                  onDeleteInvoice={handleDeleteInvoice}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <InvoiceViewDialog 
        open={viewDialogOpen} 
        onOpenChange={setViewDialogOpen} 
        invoice={selectedInvoice} 
      />
      
      <InvoiceFormDialog 
        open={formDialogOpen} 
        onOpenChange={setFormDialogOpen} 
        invoice={isEditing ? selectedInvoice : null} 
        onSuccess={handleInvoiceFormSuccess}
      />
      
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Supprimer la facture"
        description="Êtes-vous sûr de vouloir supprimer cette facture ? Cette action ne peut pas être annulée."
      />
    </div>
  );
};

interface InvoicesTableProps {
  invoices: Invoice[];
  onViewInvoice: (invoice: Invoice) => void;
  onEditInvoice: (invoice: Invoice, e?: React.MouseEvent) => void;
  onDeleteInvoice: (invoice: Invoice, e?: React.MouseEvent) => void;
}

const InvoicesTable: React.FC<InvoicesTableProps> = ({ 
  invoices, 
  onViewInvoice,
  onEditInvoice,
  onDeleteInvoice
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="success">Payée</Badge>;
      case 'pending':
        return <Badge variant="secondary">En attente</Badge>;
      case 'overdue':
        return <Badge variant="destructive">En retard</Badge>;
      case 'draft':
        return <Badge variant="outline">Brouillon</Badge>;
      case 'sent':
        return <Badge variant="primary">Envoyée</Badge>;
      case 'cancelled':
        return <Badge variant="warning">Annulée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Numéro</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Date d'émission</TableHead>
          <TableHead>Montant</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-4">
              Aucune facture trouvée
            </TableCell>
          </TableRow>
        ) : (
          invoices.map((invoice) => (
            <TableRow key={invoice.id} className="cursor-pointer hover:bg-muted/50" onClick={() => onViewInvoice(invoice)}>
              <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
              <TableCell>{invoice.clientName}</TableCell>
              <TableCell>{formatDate(invoice.issueDate)}</TableCell>
              <TableCell>{formatCurrency(invoice.total, invoice.currency)}</TableCell>
              <TableCell>{getStatusBadge(invoice.status)}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={(e) => {
                    e.stopPropagation();
                    onViewInvoice(invoice);
                  }}>
                    Voir
                  </Button>
                  <Button variant="ghost" size="sm" onClick={(e) => onEditInvoice(invoice, e)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={(e) => onDeleteInvoice(invoice, e)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default InvoicesPage;
