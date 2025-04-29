
import { useState, useEffect, useCallback } from 'react';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Employee } from '@/types/employee';
import { Department } from '@/components/module/submodules/departments/types';
import { toast } from 'sonner';

export const useHrData = () => {
  // Define all state variables at the beginning
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payslips, setPayslips] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [absenceRequests, setAbsenceRequests] = useState<any[]>([]);
  const [hrDocuments, setHrDocuments] = useState<any[]>([]);
  const [timeSheets, setTimeSheets] = useState<any[]>([]);
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [trainings, setTrainings] = useState<any[]>([]);
  const [hrReports, setHrReports] = useState<any[]>([]);
  const [hrAlerts, setHrAlerts] = useState<any[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Safely fetch a collection with default fallback
  const safeFetchCollection = async <T>(
    collectionPath: string, 
    setDataFn: React.Dispatch<React.SetStateAction<T[]>>
  ) => {
    try {
      // Ensure collection path is not empty
      const safePath = collectionPath || 'default_collection';
      const data = await fetchCollectionData<T>(safePath);
      // Ensure we always set an array, even if data is undefined
      setDataFn(data || []);
      return data || [];
    } catch (err) {
      console.error(`Error fetching ${collectionPath}:`, err);
      setError(err as Error);
      // Always return an empty array in case of error
      return [];
    }
  };

  const fetchAllHrData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        safeFetchCollection(COLLECTIONS.HR.EMPLOYEES, setEmployees),
        safeFetchCollection(COLLECTIONS.HR.PAYSLIPS, setPayslips),
        safeFetchCollection(COLLECTIONS.HR.CONTRACTS, setContracts),
        safeFetchCollection(COLLECTIONS.HR.DEPARTMENTS, setDepartments),
        safeFetchCollection(COLLECTIONS.HR.LEAVE_REQUESTS, setLeaveRequests),
        safeFetchCollection(COLLECTIONS.HR.ATTENDANCE, setAttendance),
        safeFetchCollection(COLLECTIONS.HR.ABSENCE_REQUESTS, setAbsenceRequests),
        safeFetchCollection(COLLECTIONS.HR.DOCUMENTS, setHrDocuments),
        safeFetchCollection(COLLECTIONS.HR.TIMESHEET, setTimeSheets),
        safeFetchCollection(COLLECTIONS.HR.EVALUATIONS, setEvaluations),
        safeFetchCollection(COLLECTIONS.HR.TRAININGS, setTrainings),
        safeFetchCollection(COLLECTIONS.HR.REPORTS, setHrReports),
        safeFetchCollection(COLLECTIONS.HR.ALERTS, setHrAlerts)
      ]);
      
      console.log('All HR data fetched successfully');
    } catch (err) {
      console.error('Error fetching HR data:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Initial data fetch - only called once
  useEffect(() => {
    fetchAllHrData();
  }, [fetchAllHrData]);
  
  // Always return the same structure, with default empty arrays for all properties
  return {
    employees: employees || [],
    payslips: payslips || [],
    contracts: contracts || [],
    departments: departments || [],
    leaveRequests: leaveRequests || [],
    attendance: attendance || [],
    absenceRequests: absenceRequests || [],
    hrDocuments: hrDocuments || [],
    timeSheets: timeSheets || [],
    evaluations: evaluations || [],
    trainings: trainings || [],
    hrReports: hrReports || [], 
    hrAlerts: hrAlerts || [],
    isLoading,
    error,
    fetchAllHrData
  };
};
