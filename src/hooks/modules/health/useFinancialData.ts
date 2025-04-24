
import { useCollectionData } from '@/hooks/useCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { orderBy } from 'firebase/firestore';
import type { InsuranceClaim, BillingRecord } from '@/components/module/submodules/health/types/health-types';

export const useFinancialData = () => {
  // Fetch insurance claims
  const { 
    data: insurance, 
    isLoading: isInsuranceLoading, 
    error: insuranceError 
  } = useCollectionData<InsuranceClaim>(
    COLLECTIONS.HEALTH.INSURANCE,
    [orderBy('date', 'desc')]
  );

  // Fetch billing records
  const { 
    data: billing, 
    isLoading: isBillingLoading, 
    error: billingError 
  } = useCollectionData<BillingRecord>(
    COLLECTIONS.HEALTH.BILLING,
    [orderBy('date', 'desc')]
  );

  const isLoading = isInsuranceLoading || isBillingLoading;
  const error = insuranceError || billingError;

  return {
    insurance,
    billing,
    isLoading,
    error
  };
};
