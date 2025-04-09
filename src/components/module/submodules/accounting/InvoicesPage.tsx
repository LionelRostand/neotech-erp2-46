
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InvoicesTable } from './components/InvoicesTable';
import { PlusCircle, FileText, Download } from 'lucide-react';
import { useInvoicesData } from './hooks/useInvoicesData';
import InvoiceFormDialog from './components/InvoiceFormDialog';
import InvoiceViewDialog from './components/InvoiceViewDialog';
import DeleteInvoiceDialog from './components/DeleteInvoiceDialog';
import { exportToExcel } from '@/utils/exportUtils';
import { useToast } from '@/hooks/use-toast';

const InvoicesPage = () => {
  const { invoices, isLoading, error } = useInvoicesData();
  const { toast } = useToast();

  // États pour gérer les différentes boîtes de dialogue
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  // Filtrer les factures en fonction des critères de recherche et de filtrage
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Updated to check for "all" value which should include all statuses
    const matchesStatus = statusFilter === 'all' ? true : invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Ouvrir la boîte de dialogue pour ajouter une nouvelle facture
  const handleAddInvoice = () => {
    setSelectedInvoice(null);
    setIsAddDialogOpen(true);
  };

  // Ouvrir la boîte de dialogue pour visualiser une facture
  const handleViewInvoice = (id: string) => {
    const invoice = invoices.find(inv => inv.id === id);
    setSelectedInvoice(invoice);
    setIsViewDialogOpen(true);
  };

  // Ouvrir la boîte de dialogue pour modifier une facture
  const handleEditInvoice = (id: string) => {
    const invoice = invoices.find(inv => inv.id === id);
    setSelectedInvoice(invoice);
    setIsEditDialogOpen(true);
  };

  // Ouvrir la boîte de dialogue pour supprimer une facture
  const handleDeleteInvoice = (id: string) => {
    const invoice = invoices.find(inv => inv.id === id);
    setSelectedInvoice(invoice);
    setIsDeleteDialogOpen(true);
  };

  // Fonction pour réinitialiser les filtres
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  // Fonction pour rafraîchir la liste après une opération
  const refreshList = () => {
    // La liste sera mise à jour automatiquement grâce au hook useInvoicesData
    toast({
      title: "Liste mise à jour",
      description: "La liste des factures a été mise à jour avec succès."
    });
  };

  // Fonction pour exporter les factures vers Excel
  const handleExportToExcel = () => {
    try {
      // Préparer les données pour l'export en transformant les données
      const exportData = filteredInvoices.map(invoice => ({
        'Numéro': invoice.invoiceNumber,
        'Client': invoice.clientName,
        'Date Émission': invoice.issueDate,
        'Date Échéance': invoice.dueDate,
        'Montant HT': invoice.subtotal || 0,
        'TVA': invoice.taxAmount || 0,
        'Montant Total': invoice.total,
        'Statut': getStatusLabel(invoice.status),
        'Devise': invoice.currency
      }));
      
      // Exporter vers Excel
      exportToExcel(
        exportData,
        'Factures',
        `Factures_${new Date().toISOString().split('T')[0]}`
      );
      
      toast({
        title: "Export réussi",
        description: "Les factures ont été exportées avec succès vers Excel."
      });
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      toast({
        title: "Erreur d'exportation",
        description: "Une erreur s'est produite lors de l'exportation des factures.",
        variant: "destructive"
      });
    }
  };

  // Fonction pour traduire les statuts
  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'draft': return 'Brouillon';
      case 'sent': return 'Envoyée';
      case 'paid': return 'Payée';
      case 'overdue': return 'En retard';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des Factures</h1>
        <div className="flex gap-2">
          <Button onClick={handleAddInvoice}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Nouvelle Facture
          </Button>
          <Button variant="outline" onClick={handleExportToExcel}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          {/* Filtres */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Rechercher par numéro ou client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-64">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="sent">Envoyée</SelectItem>
                  <SelectItem value="paid">Payée</SelectItem>
                  <SelectItem value="overdue">En retard</SelectItem>
                  <SelectItem value="cancelled">Annulée</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="ghost" onClick={resetFilters}>
              Réinitialiser
            </Button>
          </div>

          {/* Tableau des factures */}
          <InvoicesTable
            invoices={filteredInvoices}
            isLoading={isLoading}
            onView={handleViewInvoice}
            onEdit={handleEditInvoice}
            onDelete={handleDeleteInvoice}
          />

          {/* Affiche un message si aucune facture ne correspond aux filtres */}
          {!isLoading && filteredInvoices.length === 0 && (
            <div className="py-8 text-center">
              <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-lg font-medium">Aucune facture trouvée</p>
              <p className="text-muted-foreground">
                {invoices.length > 0
                  ? "Aucune facture ne correspond à vos critères de recherche."
                  : "Commencez par créer votre première facture."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Boîtes de dialogue */}
      <InvoiceFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={refreshList}
      />

      <InvoiceFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSuccess={refreshList}
        invoice={selectedInvoice}
      />

      <InvoiceViewDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        invoice={selectedInvoice}
      />

      {selectedInvoice && (
        <DeleteInvoiceDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          invoiceId={selectedInvoice.id}
          invoiceNumber={selectedInvoice.invoiceNumber}
          onSuccess={refreshList}
        />
      )}
    </div>
  );
};

export default InvoicesPage;
