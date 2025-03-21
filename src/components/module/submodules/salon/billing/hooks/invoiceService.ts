
import { toast } from 'sonner';
import { SalonInvoice, InvoiceStatus, PaymentSummary } from '../../types/salon-types';
import { generateInvoiceNumber, calculateSummaryData } from './billingUtils';

// Create invoice
export const createInvoice = async (
  invoice: Omit<SalonInvoice, 'id' | 'createdAt' | 'updatedAt' | 'payments'>, 
  currentInvoices: SalonInvoice[],
  callbacks: {
    setInvoices: (invoices: SalonInvoice[]) => void,
    setSummaryData: (summary: PaymentSummary) => void
  }
): Promise<SalonInvoice> => {
  try {
    // In a real app, we would add to Firestore
    // const result = await invoicesCollection.add(invoice);
    
    // For now, simulate adding to mock data
    const newInvoice: SalonInvoice = {
      ...invoice,
      id: `${currentInvoices.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      payments: []
    };
    
    const updatedInvoices = [...currentInvoices, newInvoice];
    callbacks.setInvoices(updatedInvoices);
    
    const summaryData = calculateSummaryData(updatedInvoices);
    callbacks.setSummaryData(summaryData);
    
    toast.success('Facture créée avec succès');
    return newInvoice;
  } catch (error) {
    console.error('Error creating invoice:', error);
    toast.error('Erreur lors de la création de la facture');
    throw error;
  }
};

// Get invoice by ID
export const getInvoiceById = (invoices: SalonInvoice[], id: string): SalonInvoice | null => {
  return invoices.find(invoice => invoice.id === id) || null;
};

// Check overdue invoices
export const checkOverdueInvoices = (
  invoices: SalonInvoice[],
  callbacks: {
    setInvoices: (invoices: SalonInvoice[]) => void,
    setSummaryData: (summary: PaymentSummary) => void
  }
): void => {
  const today = new Date();
  const updatedInvoices = invoices.map(invoice => {
    if (invoice.status === 'pending') {
      const dueDate = new Date(invoice.dueDate);
      if (dueDate < today) {
        return { 
          ...invoice, 
          status: 'overdue' as InvoiceStatus, 
          updatedAt: new Date().toISOString() 
        };
      }
    }
    return invoice;
  });
  
  callbacks.setInvoices(updatedInvoices);
  const summaryData = calculateSummaryData(updatedInvoices);
  callbacks.setSummaryData(summaryData);
};

// Load invoices
export const loadInvoices = async (
  mockInvoices: SalonInvoice[],
  callbacks: {
    setIsLoadingInvoices: (isLoading: boolean) => void,
    setInvoices: (invoices: SalonInvoice[]) => void,
    setSummaryData: (summary: PaymentSummary) => void
  }
): Promise<void> => {
  try {
    callbacks.setIsLoadingInvoices(true);
    
    // In a real app, we would fetch from Firestore
    // const data = await invoicesCollection.getAll();
    // setInvoices(data as SalonInvoice[]);
    
    // For now, use mock data
    callbacks.setInvoices(mockInvoices);
    
    // Calculate summary data
    const summaryData = calculateSummaryData(mockInvoices);
    callbacks.setSummaryData(summaryData);
  } catch (error) {
    console.error('Error loading invoices:', error);
    toast.error('Erreur lors du chargement des factures');
  } finally {
    callbacks.setIsLoadingInvoices(false);
  }
};
