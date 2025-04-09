
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, FileDown } from 'lucide-react';
import { InvoicesTable } from './components/InvoicesTable';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from 'react-router-dom';
import { useInvoices } from './hooks/useInvoices';
import { PaginationComponent } from './components/PaginationComponent';

const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
  { value: "cancelled", label: "Cancelled" },
  { value: "pending", label: "Pending" },
];

const currencyOptions = [
  { value: "EUR", label: "EUR" },
  { value: "USD", label: "USD" },
  { value: "GBP", label: "GBP" },
  { value: "CAD", label: "CAD" },
];

const InvoicesPage = () => {
  const navigate = useNavigate();
  const { invoices, isLoading, reload } = useInvoices();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currencyFilter, setCurrencyFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleAddInvoice = () => {
    navigate('/accounting/invoices/new');
  };

  const handleViewInvoice = (invoiceId: string) => {
    navigate(`/accounting/invoices/${invoiceId}`);
  };

  const handleEditInvoice = (invoiceId: string) => {
    navigate(`/accounting/invoices/edit/${invoiceId}`);
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    toast({
      title: "Supprimer la facture",
      description: "Fonctionnalité à venir",
    });
  };

  const handleExportInvoices = () => {
    toast({
      title: "Exporter les factures",
      description: "Fonctionnalité à venir",
    });
  };

  const filteredInvoices = invoices?.filter((invoice) => {
    const searchRegex = new RegExp(searchQuery, 'i');
    const statusMatch = statusFilter === 'all' ? true : invoice.status === statusFilter;
    const currencyMatch = currencyFilter === 'all' ? true : invoice.currency === currencyFilter;

    return (
      searchRegex.test(invoice.invoiceNumber) &&
      statusMatch &&
      currencyMatch
    );
  });

  const totalItems = filteredInvoices?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedInvoices = () => {
    if (!filteredInvoices) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredInvoices.slice(startIndex, endIndex);
  };

  const isLoadingData = isLoading;

  return (
    <div className="container mx-auto py-10">
      <div className="mb-4 flex justify-between items-center">
        <CardTitle className="text-2xl font-bold">Factures</CardTitle>
        <Button
          onClick={() => handleAddInvoice()}
        >
          <Plus className="mr-2 h-4 w-4" /> Nouvelle Facture
        </Button>
      </div>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Rechercher & Filtrer</CardTitle>
          <CardDescription>
            Rechercher, filtrer et gérer vos factures.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="col-span-4 sm:col-span-1">
              <Input
                type="search"
                placeholder="Rechercher par #facture..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="col-span-4 sm:col-span-1">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-4 sm:col-span-1">
              <Select value={currencyFilter} onValueChange={setCurrencyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par devise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les devises</SelectItem>
                  {currencyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-4 sm:col-span-1 flex items-end">
              <Button variant="outline" onClick={handleExportInvoices}>
                <FileDown className="mr-2 h-4 w-4" />
                Exporter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Factures</CardTitle>
          <CardDescription>
            Visualisez et gérez vos factures.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InvoicesTable
            invoices={paginatedInvoices()}
            isLoading={isLoadingData}
            onView={handleViewInvoice}
            onEdit={handleEditInvoice}
            onDelete={handleDeleteInvoice}
          />
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mt-4">
        <Select
          value={String(itemsPerPage)}
          onValueChange={(value) => setItemsPerPage(Number(value))}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Par page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 par page</SelectItem>
            <SelectItem value="10">10 par page</SelectItem>
            <SelectItem value="20">20 par page</SelectItem>
            <SelectItem value="50">50 par page</SelectItem>
          </SelectContent>
        </Select>
        <PaginationComponent
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default InvoicesPage;
