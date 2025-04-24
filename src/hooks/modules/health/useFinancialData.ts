
import { useCollectionData } from '@/hooks/useCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { orderBy } from 'firebase/firestore';
import type { Insurance, Invoice } from '@/components/module/submodules/health/types/health-types';

export const useFinancialData = () => {
  // Fetch insurance
  const { 
    data: insurance, 
    isLoading: isInsuranceLoading, 
    error: insuranceError 
  } = useCollectionData<Insurance>(
    COLLECTIONS.HEALTH.INSURANCE
  );

  // Fetch billing
  const {
    data: billing,
    isLoading: isBillingLoading,
    error: billingError
  } = useCollectionData<Invoice>(
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
