
import { useCollectionData } from '../useCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { orderBy } from 'firebase/firestore';

/**
 * Hook to fetch data for the HR module
 */
export const useHrData = () => {
  // Fetch employees
  const { 
    data: employees, 
    isLoading: isEmployeesLoading, 
    error: employeesError 
  } = useCollectionData(
    COLLECTIONS.HR.EMPLOYEES,
    [orderBy('lastName')]
  );

  // Fetch payslips
  const { 
    data: payslips, 
    isLoading: isPayslipsLoading, 
    error: payslipsError 
  } = useCollectionData(
    COLLECTIONS.HR.PAYSLIPS,
    [orderBy('date', 'desc')]
  );

  // Fetch leave requests
  const { 
    data: leaveRequests, 
    isLoading: isLeaveRequestsLoading, 
    error: leaveRequestsError 
  } = useCollectionData(
    COLLECTIONS.HR.LEAVE_REQUESTS,
    [orderBy('startDate')]
  );

  // Fetch contracts
  const { 
    data: contracts, 
    isLoading: isContractsLoading, 
    error: contractsError 
  } = useCollectionData(
    COLLECTIONS.HR.CONTRACTS,
    [orderBy('startDate', 'desc')]
  );

  // Fetch departments
  const { 
    data: departments, 
    isLoading: isDepartmentsLoading, 
    error: departmentsError 
  } = useCollectionData(
    COLLECTIONS.HR.DEPARTMENTS,
    [orderBy('name')]
  );

  // Check if any data is still loading
  const isLoading = 
    isEmployeesLoading || 
    isPayslipsLoading || 
    isLeaveRequestsLoading || 
    isContractsLoading || 
    isDepartmentsLoading;

  // Combine all possible errors
  const error = 
    employeesError || 
    payslipsError || 
    leaveRequestsError || 
    contractsError || 
    departmentsError;

  return {
    employees,
    payslips,
    leaveRequests,
    contracts,
    departments,
    isLoading,
    error
  };
};
