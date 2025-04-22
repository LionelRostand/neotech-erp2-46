
import React, { useState } from 'react';
import { useInvoicesData } from './hooks/useInvoicesData';
import { InvoicesTable } from './components/InvoicesTable';

export const InvoicesPage = () => {
  const { invoices, isLoading, error } = useInvoicesData();

  const handleViewInvoice = (id: string) => {
    console.log('View invoice:', id);
  };

  const handleEditInvoice = (id: string) => {
    console.log('Edit invoice:', id);
  };

  const handleDeleteInvoice = (id: string) => {
    console.log('Delete invoice:', id);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Factures</h1>
        {/* Button removed as per request */}
      </div>

      <InvoicesTable 
        invoices={invoices} 
        isLoading={isLoading} 
        onView={handleViewInvoice}
        onEdit={handleEditInvoice}
        onDelete={handleDeleteInvoice}
      />
    </div>
  );
};

export default InvoicesPage;
