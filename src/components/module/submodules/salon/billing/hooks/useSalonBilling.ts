
import { useState, useEffect } from 'react';
import { 
  SalonInvoice, 
  SalonPayment, 
  PaymentSummary
} from '../../types/salon-types';

// Import services and utilities
import { mockInvoices } from './mockData';
import { generateInvoiceNumber, generatePdfInvoice } from './billingUtils';
import { createInvoice, getInvoiceById, checkOverdueInvoices, loadInvoices } from './invoiceService';
import { recordPayment } from './paymentService';

// Collection name constants
const INVOICES_COLLECTION = 'salon_invoices';
const PAYMENTS_COLLECTION = 'salon_payments';

export const useSalonBilling = () => {
  const [invoices, setInvoices] = useState<SalonInvoice[]>([]);
  const [payments, setPayments] = useState<SalonPayment[]>([]);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [summaryData, setSummaryData] = useState<PaymentSummary>({
    total: 0,
    paid: 0,
    pending: 0,
    overdue: 0,
    todaySales: 0,
    pendingInvoices: 0,
    overdueInvoices: 0
  });
  
  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      await loadInvoices(
        mockInvoices, 
        {
          setIsLoadingInvoices,
          setInvoices,
          setSummaryData
        }
      );
    };
    
    loadData();
  }, []);
  
  // Check for overdue invoices periodically
  useEffect(() => {
    if (invoices.length > 0) {
      checkOverdueInvoices(
        invoices, 
        {
          setInvoices,
          setSummaryData
        }
      );
    }
  }, [invoices]);
  
  // Create invoice wrapper
  const createInvoiceWrapper = async (invoice: Omit<SalonInvoice, 'id' | 'createdAt' | 'updatedAt' | 'payments'>) => {
    return createInvoice(
      invoice, 
      invoices, 
      {
        setInvoices,
        setSummaryData
      }
    );
  };
  
  // Record payment wrapper
  const recordPaymentWrapper = async (payment: Omit<SalonPayment, 'id' | 'createdAt'>) => {
    return recordPayment(
      payment, 
      invoices, 
      payments, 
      {
        setInvoices,
        setPayments,
        setSummaryData
      }
    );
  };
  
  // Generate PDF invoice wrapper
  const generatePdfInvoiceWrapper = async (invoiceId: string) => {
    try {
      const invoice = getInvoiceById(invoices, invoiceId);
      
      if (!invoice) {
        throw new Error('Invoice not found');
      }
      
      await generatePdfInvoice(invoice);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  };
  
  return {
    invoices,
    payments,
    summaryData,
    isLoadingInvoices,
    isLoadingPayments,
    selectedInvoiceId,
    setSelectedInvoiceId,
    createInvoice: createInvoiceWrapper,
    recordPayment: recordPaymentWrapper,
    generateInvoiceNumber: () => generateInvoiceNumber(invoices.length),
    generatePdfInvoice: generatePdfInvoiceWrapper,
    getInvoiceById: (id: string) => getInvoiceById(invoices, id)
  };
};
