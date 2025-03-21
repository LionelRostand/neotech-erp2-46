
import { toast } from 'sonner';
import { SalonPayment, SalonInvoice } from '../../types/salon-types';
import { calculateSummary } from './invoiceService';

// Record payment
export const recordPayment = async (
  payment: Omit<SalonPayment, 'id' | 'createdAt'>,
  invoices: SalonInvoice[],
  payments: SalonPayment[],
  setters: {
    setInvoices: (invoices: SalonInvoice[]) => void,
    setPayments: (payments: SalonPayment[]) => void,
    setSummaryData: (summary: any) => void
  }
) => {
  try {
    const now = new Date().toISOString();
    const paymentId = `payment-${payments.length + 1}`;
    
    const newPayment: SalonPayment = {
      ...payment,
      id: paymentId,
      createdAt: now
    };
    
    // Find invoice to update
    const updatedInvoices = invoices.map(invoice => {
      if (invoice.id === payment.invoiceId) {
        // Add payment to invoice
        const updatedInvoice = {
          ...invoice,
          payments: [...invoice.payments, newPayment],
          updatedAt: now
        };
        
        // Check if invoice is fully paid
        const totalPaid = [...invoice.payments, newPayment].reduce((sum, p) => sum + p.amount, 0);
        if (totalPaid >= invoice.total) {
          updatedInvoice.status = 'paid';
        }
        
        return updatedInvoice;
      }
      return invoice;
    });
    
    // Update state
    setters.setInvoices(updatedInvoices);
    setters.setPayments([...payments, newPayment]);
    
    // Update summary
    const summary = calculateSummary(updatedInvoices);
    setters.setSummaryData(summary);
    
    toast.success('Paiement enregistré avec succès');
    return newPayment;
  } catch (error) {
    console.error('Error recording payment:', error);
    toast.error('Erreur lors de l\'enregistrement du paiement');
    throw error;
  }
};
