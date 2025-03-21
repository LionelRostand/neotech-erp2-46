
import { SalonInvoice, SalonPayment, PaymentSummary } from '../../types/salon-types';

// Generate invoice number
export const generateInvoiceNumber = (invoicesCount: number): string => {
  const year = new Date().getFullYear();
  const nextNumber = (invoicesCount + 1).toString().padStart(4, '0');
  return `FACT-${year}-${nextNumber}`;
};

// Calculate summary data for dashboard
export const calculateSummaryData = (invoicesData: SalonInvoice[]): PaymentSummary => {
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
  
  return summary;
};

// Generate PDF invoice
export const generatePdfInvoice = async (invoice: SalonInvoice | null): Promise<void> => {
  if (!invoice) {
    throw new Error('Facture non trouvée');
  }
  
  // In a real app, we would generate a PDF
  console.log('Generating PDF for invoice:', invoice.number);
  
  // Simulate PDF generation with timeout
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('PDF generated successfully');
      resolve();
    }, 1500);
  });
};
