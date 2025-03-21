
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useFirestore } from '@/hooks/use-firestore';
import { 
  SalonInvoice, 
  SalonPayment, 
  InvoiceStatus, 
  PaymentMethod,
  InvoiceItem,
  PaymentSummary
} from '../../types/salon-types';

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
  
  // Get Firestore hooks
  const invoicesCollection = useFirestore(INVOICES_COLLECTION);
  const paymentsCollection = useFirestore(PAYMENTS_COLLECTION);
  
  // Mock data for development
  const mockInvoices: SalonInvoice[] = [
    {
      id: '1',
      number: 'FACT-2023-0001',
      clientId: 'client1',
      clientName: 'Marie Dubois',
      date: '2023-09-01',
      dueDate: '2023-09-15',
      status: 'paid',
      items: [
        { id: 'item1', type: 'service', name: 'Coupe femme', quantity: 1, unitPrice: 45, total: 45, serviceId: 'service1', stylistId: 'stylist1', stylistName: 'Jean Martin' }
      ],
      subtotal: 45,
      taxRate: 20,
      taxAmount: 9,
      discount: 0,
      total: 54,
      createdAt: '2023-09-01T10:00:00Z',
      updatedAt: '2023-09-01T10:00:00Z',
      payments: [
        { id: 'payment1', invoiceId: '1', amount: 54, method: 'credit_card', date: '2023-09-01', status: 'completed', createdAt: '2023-09-01T10:05:00Z' }
      ]
    },
    {
      id: '2',
      number: 'FACT-2023-0002',
      clientId: 'client2',
      clientName: 'Thomas Bernard',
      date: '2023-09-05',
      dueDate: '2023-09-20',
      status: 'pending',
      items: [
        { id: 'item2', type: 'service', name: 'Coloration', quantity: 1, unitPrice: 65, total: 65, serviceId: 'service2', stylistId: 'stylist2', stylistName: 'Sophie Petit' },
        { id: 'item3', type: 'product', name: 'Shampooing professionnel', quantity: 1, unitPrice: 18, total: 18, productId: 'product1' }
      ],
      subtotal: 83,
      taxRate: 20,
      taxAmount: 16.6,
      discount: 0,
      total: 99.6,
      createdAt: '2023-09-05T14:30:00Z',
      updatedAt: '2023-09-05T14:30:00Z',
      payments: []
    },
    {
      id: '3',
      number: 'FACT-2023-0003',
      clientId: 'client3',
      clientName: 'Lucie Martin',
      date: '2023-08-15',
      dueDate: '2023-08-30',
      status: 'overdue',
      items: [
        { id: 'item4', type: 'service', name: 'Balayage', quantity: 1, unitPrice: 90, total: 90, serviceId: 'service3', stylistId: 'stylist1', stylistName: 'Jean Martin' }
      ],
      subtotal: 90,
      taxRate: 20,
      taxAmount: 18,
      discount: 5,
      total: 103,
      createdAt: '2023-08-15T11:20:00Z',
      updatedAt: '2023-08-15T11:20:00Z',
      payments: [
        { id: 'payment2', invoiceId: '3', amount: 50, method: 'cash', date: '2023-08-15', status: 'completed', createdAt: '2023-08-15T11:25:00Z' }
      ]
    }
  ];
  
  // Load invoices
  const loadInvoices = async () => {
    try {
      setIsLoadingInvoices(true);
      
      // In a real app, we would fetch from Firestore
      // const data = await invoicesCollection.getAll();
      // setInvoices(data as SalonInvoice[]);
      
      // For now, use mock data
      setInvoices(mockInvoices);
      
      // Calculate summary data
      calculateSummaryData(mockInvoices);
    } catch (error) {
      console.error('Error loading invoices:', error);
      toast.error('Erreur lors du chargement des factures');
    } finally {
      setIsLoadingInvoices(false);
    }
  };
  
  // Calculate summary data for dashboard
  const calculateSummaryData = (invoicesData: SalonInvoice[]) => {
    const summary: PaymentSummary = {
      total: 0,
      paid: 0,
      pending: 0,
      overdue: 0,
      todaySales: 0,
      pendingInvoices: 0,
      overdueInvoices: 0
    };
    
    const today = new Date().toISOString().split('T')[0];
    
    invoicesData.forEach(invoice => {
      summary.total += invoice.total;
      
      if (invoice.status === 'paid') {
        summary.paid += invoice.total;
      } else if (invoice.status === 'pending') {
        summary.pending += invoice.total;
        summary.pendingInvoices += 1;
      } else if (invoice.status === 'overdue') {
        summary.overdue += invoice.total;
        summary.overdueInvoices += 1;
      }
      
      if (invoice.date === today) {
        summary.todaySales += invoice.total;
      }
    });
    
    setSummaryData(summary);
  };
  
  // Create invoice
  const createInvoice = async (invoice: Omit<SalonInvoice, 'id' | 'createdAt' | 'updatedAt' | 'payments'>) => {
    try {
      // In a real app, we would add to Firestore
      // const result = await invoicesCollection.add(invoice);
      
      // For now, simulate adding to mock data
      const newInvoice: SalonInvoice = {
        ...invoice,
        id: `${invoices.length + 1}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        payments: []
      };
      
      const updatedInvoices = [...invoices, newInvoice];
      setInvoices(updatedInvoices);
      calculateSummaryData(updatedInvoices);
      
      toast.success('Facture créée avec succès');
      return newInvoice;
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Erreur lors de la création de la facture');
      throw error;
    }
  };
  
  // Record payment
  const recordPayment = async (payment: Omit<SalonPayment, 'id' | 'createdAt'>) => {
    try {
      // In a real app, we would add to Firestore and update the invoice
      // const result = await paymentsCollection.add(payment);
      // await updateInvoiceAfterPayment(payment.invoiceId, payment.amount);
      
      // For now, simulate adding to mock data
      const newPayment: SalonPayment = {
        ...payment,
        id: `payment${payments.length + 1}`,
        createdAt: new Date().toISOString()
      };
      
      const updatedPayments = [...payments, newPayment];
      setPayments(updatedPayments);
      
      // Update the invoice with the payment
      const updatedInvoices = invoices.map(invoice => {
        if (invoice.id === payment.invoiceId) {
          const updatedPayments = [...invoice.payments, newPayment];
          const totalPaid = updatedPayments.reduce((sum, p) => sum + p.amount, 0);
          
          let status: InvoiceStatus = invoice.status;
          if (totalPaid >= invoice.total) {
            status = 'paid';
          } else if (status === 'overdue') {
            status = 'pending';
          }
          
          return {
            ...invoice,
            payments: updatedPayments,
            status,
            updatedAt: new Date().toISOString()
          };
        }
        return invoice;
      });
      
      setInvoices(updatedInvoices);
      calculateSummaryData(updatedInvoices);
      
      toast.success('Paiement enregistré avec succès');
      return newPayment;
    } catch (error) {
      console.error('Error recording payment:', error);
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
  
  // Check overdue invoices
  const checkOverdueInvoices = () => {
    const today = new Date();
    const updatedInvoices = invoices.map(invoice => {
      if (invoice.status === 'pending') {
        const dueDate = new Date(invoice.dueDate);
        if (dueDate < today) {
          return { ...invoice, status: 'overdue' as InvoiceStatus, updatedAt: new Date().toISOString() };
        }
      }
      return invoice;
    });
    
    setInvoices(updatedInvoices);
    calculateSummaryData(updatedInvoices);
  };
  
  // Get invoice by ID
  const getInvoiceById = (id: string) => {
    return invoices.find(invoice => invoice.id === id) || null;
  };
  
  // Generate PDF invoice
  const generatePdfInvoice = async (invoiceId: string) => {
    const invoice = getInvoiceById(invoiceId);
    if (!invoice) {
      toast.error('Facture non trouvée');
      return;
    }
    
    // In a real app, we would generate a PDF
    toast.success('Génération du PDF en cours...');
    
    // Simulate PDF generation with timeout
    setTimeout(() => {
      toast.success('PDF généré avec succès');
      // Here we would normally open/download the PDF
    }, 1500);
  };
  
  // Load data on mount
  useEffect(() => {
    loadInvoices();
  }, []);
  
  // Check for overdue invoices periodically
  useEffect(() => {
    if (invoices.length > 0) {
      checkOverdueInvoices();
    }
  }, [invoices]);
  
  return {
    invoices,
    payments,
    summaryData,
    isLoadingInvoices,
    isLoadingPayments,
    selectedInvoiceId,
    setSelectedInvoiceId,
    createInvoice,
    recordPayment,
    generateInvoiceNumber,
    generatePdfInvoice,
    getInvoiceById
  };
};
