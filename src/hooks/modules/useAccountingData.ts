
import { useCollectionData } from '../useCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { orderBy } from 'firebase/firestore';

/**
 * Hook to fetch data for the Accounting module
 */
export const useAccountingData = () => {
  // Fetch transactions
  const { 
    data: transactions, 
    isLoading: isTransactionsLoading, 
    error: transactionsError 
  } = useCollectionData(
    COLLECTIONS.ACCOUNTING.TRANSACTIONS,
    [orderBy('date', 'desc')]
  );

  // Fetch invoices
  const { 
    data: invoices, 
    isLoading: isInvoicesLoading, 
    error: invoicesError 
  } = useCollectionData(
    COLLECTIONS.ACCOUNTING.INVOICES,
    [orderBy('issueDate', 'desc')]
  );

  // Fetch payments
  const { 
    data: payments, 
    isLoading: isPaymentsLoading, 
    error: paymentsError 
  } = useCollectionData(
    COLLECTIONS.ACCOUNTING.PAYMENTS,
    [orderBy('date', 'desc')]
  );

  // Check if any data is still loading
  const isLoading = isTransactionsLoading || isInvoicesLoading || isPaymentsLoading;

  // Combine all possible errors
  const error = transactionsError || invoicesError || paymentsError;

  return {
    transactions,
    invoices,
    payments,
    isLoading,
    error
  };
};
