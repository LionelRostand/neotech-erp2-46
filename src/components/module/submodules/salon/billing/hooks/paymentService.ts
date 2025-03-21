
import { toast } from 'sonner';
import { SalonInvoice, SalonPayment, InvoiceStatus, PaymentSummary } from '../../types/salon-types';
import { calculateSummaryData } from './billingUtils';

// Record payment
export const recordPayment = async (
  payment: Omit<SalonPayment, 'id' | 'createdAt'>,
  currentInvoices: SalonInvoice[],
  currentPayments: SalonPayment[],
  callbacks: {
    setInvoices: (invoices: SalonInvoice[]) => void,
    setPayments: (payments: SalonPayment[]) => void,
    setSummaryData: (summary: PaymentSummary) => void
  }
): Promise<SalonPayment> => {
  try {
    // In a real app, we would add to Firestore and update the invoice
    // const result = await paymentsCollection.add(payment);
    // await updateInvoiceAfterPayment(payment.invoiceId, payment.amount);
    
    // For now, simulate adding to mock data
    const newPayment: SalonPayment = {
      ...payment,
      id: `payment${currentPayments.length + 1}`,
      createdAt: new Date().toISOString()
    };
    
    const updatedPayments = [...currentPayments, newPayment];
    callbacks.setPayments(updatedPayments);
    
    // Update the invoice with the payment
    const updatedInvoices = currentInvoices.map(invoice => {
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
    
    callbacks.setInvoices(updatedInvoices);
    const summaryData = calculateSummaryData(updatedInvoices);
    callbacks.setSummaryData(summaryData);
    
    toast.success('Paiement enregistré avec succès');
    return newPayment;
  } catch (error) {
    console.error('Error recording payment:', error);
    toast.error('Erreur lors de l\'enregistrement du paiement');
    throw error;
  }
};
