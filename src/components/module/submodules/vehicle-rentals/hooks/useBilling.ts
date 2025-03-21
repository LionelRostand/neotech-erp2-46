
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useFirestore } from '@/hooks/use-firestore';

// Define types for billing management
type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
type PaymentMethod = 'stripe' | 'paypal' | 'bank_transfer' | 'cash' | 'check' | 'other';
type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  total: number;
}

interface Invoice {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  reservationId: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface Payment {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  date: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Collection name constants
const INVOICES_COLLECTION = 'rental_invoices';
const PAYMENTS_COLLECTION = 'rental_payments';

export const useBilling = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);
  
  // Get Firestore hooks
  const invoicesCollection = useFirestore(INVOICES_COLLECTION);
  const paymentsCollection = useFirestore(PAYMENTS_COLLECTION);
  
  // Load invoices
  const loadInvoices = async () => {
    try {
      setIsLoadingInvoices(true);
      const data = await invoicesCollection.getAll();
      setInvoices(data as Invoice[]);
    } catch (error) {
      console.error('Error loading invoices:', error);
      toast.error('Erreur lors du chargement des factures');
    } finally {
      setIsLoadingInvoices(false);
    }
  };
  
  // Load payments
  const loadPayments = async () => {
    try {
      setIsLoadingPayments(true);
      const data = await paymentsCollection.getAll();
      setPayments(data as Payment[]);
    } catch (error) {
      console.error('Error loading payments:', error);
      toast.error('Erreur lors du chargement des paiements');
    } finally {
      setIsLoadingPayments(false);
    }
  };
  
  // Create invoice
  const createInvoice = async (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const result = await invoicesCollection.add(invoice);
      toast.success('Facture créée avec succès');
      await loadInvoices();
      return result;
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Erreur lors de la création de la facture');
      throw error;
    }
  };
  
  // Update invoice
  const updateInvoice = async (id: string, data: Partial<Invoice>) => {
    try {
      await invoicesCollection.update(id, data);
      toast.success('Facture mise à jour avec succès');
      await loadInvoices();
    } catch (error) {
      console.error('Error updating invoice:', error);
      toast.error('Erreur lors de la mise à jour de la facture');
      throw error;
    }
  };
  
  // Delete invoice
  const deleteInvoice = async (id: string) => {
    try {
      await invoicesCollection.remove(id);
      toast.success('Facture supprimée avec succès');
      await loadInvoices();
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast.error('Erreur lors de la suppression de la facture');
      throw error;
    }
  };
  
  // Create payment
  const createPayment = async (payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const result = await paymentsCollection.add(payment);
      
      // Update associated invoice status to 'paid'
      if (payment.invoiceId) {
        await invoicesCollection.update(payment.invoiceId, { 
          status: 'paid',
          updatedAt: new Date().toISOString()
        });
      }
      
      toast.success('Paiement enregistré avec succès');
      await loadPayments();
      await loadInvoices();
      return result;
    } catch (error) {
      console.error('Error creating payment:', error);
      toast.error('Erreur lors de l\'enregistrement du paiement');
      throw error;
    }
  };
  
  // Generate invoice number
  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const nextNumber = (invoices.length + 1).toString().padStart(4, '0');
    return `FACT-${year}-${nextNumber}`;
  };
  
  // Calculate overdue status
  const calculateOverdueStatus = () => {
    const today = new Date();
    invoices.forEach(invoice => {
      if (invoice.status === 'sent') {
        const dueDate = new Date(invoice.dueDate);
        if (dueDate < today) {
          updateInvoice(invoice.id, { status: 'overdue' });
        }
      }
    });
  };
  
  // Load data on mount
  useEffect(() => {
    loadInvoices();
    loadPayments();
  }, []);
  
  // Calculate overdue status periodically
  useEffect(() => {
    if (invoices.length > 0) {
      calculateOverdueStatus();
    }
  }, [invoices]);
  
  return {
    invoices,
    payments,
    isLoadingInvoices,
    isLoadingPayments,
    loadInvoices,
    loadPayments,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    createPayment,
    generateInvoiceNumber,
  };
};
