
import { toast } from 'sonner';
import { SalonInvoice, PaymentSummary } from '../../types/salon-types';
import { mockInvoices } from './mockData';

// Get invoice by ID
export const getInvoiceById = (invoices: SalonInvoice[], id: string) => {
  return invoices.find(invoice => invoice.id === id);
};

// Load invoices
export const loadInvoices = async (
  initialData: SalonInvoice[],
  setters: {
    setIsLoadingInvoices: (loading: boolean) => void,
    setInvoices: (invoices: SalonInvoice[]) => void,
    setSummaryData: (data: PaymentSummary) => void
  }
) => {
  const { setIsLoadingInvoices, setInvoices, setSummaryData } = setters;
  
  try {
    setIsLoadingInvoices(true);
    
    // In a real-world application, we would fetch from a backend
    // For this demo, we'll use the mock data
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    
    setInvoices(initialData);
    
    // Calculate summary
    const summary = calculateSummary(initialData);
    setSummaryData(summary);
    
    setIsLoadingInvoices(false);
  } catch (error) {
    console.error('Error loading invoices:', error);
    toast.error('Erreur lors du chargement des factures');
    setIsLoadingInvoices(false);
  }
};

// Create invoice
export const createInvoice = async (
  invoice: Omit<SalonInvoice, 'id' | 'createdAt' | 'updatedAt' | 'payments'>,
  currentInvoices: SalonInvoice[],
  setters: {
    setInvoices: (invoices: SalonInvoice[]) => void,
    setSummaryData: (data: PaymentSummary) => void
  }
) => {
  try {
    const now = new Date().toISOString();
    const newId = `invoice-${currentInvoices.length + 1}`;
    
    const newInvoice: SalonInvoice = {
      ...invoice,
      id: newId,
      payments: [],
      createdAt: now,
      updatedAt: now
    };
    
    // In a real app, we would save to a backend
    const updatedInvoices = [...currentInvoices, newInvoice];
    setters.setInvoices(updatedInvoices);
    
    // Update summary
    const summary = calculateSummary(updatedInvoices);
    setters.setSummaryData(summary);
    
    toast.success('Facture créée avec succès');
    return newInvoice;
  } catch (error) {
    console.error('Error creating invoice:', error);
    toast.error('Erreur lors de la création de la facture');
    throw error;
  }
};

// Check and update overdue invoices
export const checkOverdueInvoices = (
  invoices: SalonInvoice[],
  setters: {
    setInvoices: (invoices: SalonInvoice[]) => void,
    setSummaryData: (data: PaymentSummary) => void
  }
) => {
  const today = new Date();
  let updated = false;
  
  const updatedInvoices = invoices.map(invoice => {
    if (invoice.status === 'sent') {
      const dueDate = new Date(invoice.dueDate);
      if (dueDate < today) {
        updated = true;
        return { ...invoice, status: 'overdue' as const, updatedAt: new Date().toISOString() };
      }
    }
    return invoice;
  });
  
  if (updated) {
    setters.setInvoices(updatedInvoices);
    
    // Update summary
    const summary = calculateSummary(updatedInvoices);
    setters.setSummaryData(summary);
  }
};

// Calculate summary data
export const calculateSummary = (invoices: SalonInvoice[]): PaymentSummary => {
  const today = new Date().toISOString().split('T')[0];
  
  let total = 0;
  let paid = 0;
  let pending = 0;
  let overdue = 0;
  let todaySales = 0;
  let pendingInvoices = 0;
  let overdueInvoices = 0;
  
  invoices.forEach(invoice => {
    // Calculate total
    total += invoice.total;
    
    // Calculate based on status
    if (invoice.status === 'paid') {
      paid += invoice.total;
    } else if (invoice.status === 'sent') {
      pending += invoice.total;
      pendingInvoices++;
    } else if (invoice.status === 'overdue') {
      overdue += invoice.total;
      overdueInvoices++;
    }
    
    // Calculate today's sales
    if (invoice.date === today) {
      todaySales += invoice.total;
    }
    
    // Adjust for partial payments
    const totalPaid = invoice.payments.reduce((sum, payment) => sum + payment.amount, 0);
    if (totalPaid > 0 && totalPaid < invoice.total) {
      paid += totalPaid;
      
      if (invoice.status === 'sent') {
        pending -= totalPaid;
      } else if (invoice.status === 'overdue') {
        overdue -= totalPaid;
      }
    }
  });
  
  return {
    total,
    paid,
    pending,
    overdue,
    todaySales,
    pendingInvoices,
    overdueInvoices
  };
};
