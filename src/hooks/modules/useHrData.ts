
import { useState, useEffect, useCallback } from 'react';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Employee } from '@/types/employee';
import { Department } from '@/components/module/submodules/departments/types';
import { toast } from 'sonner';

export const useHrData = () => {
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

  const fetchEmployees = useCallback(async () => {
    try {
      console.log('Fetching employees from Firestore...');
      const data = await fetchCollectionData<Employee>(COLLECTIONS.HR.EMPLOYEES);
      console.log(`Fetched ${data.length} employees from Firestore`);
      setEmployees(data);
      return data;
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError(err as Error);
      return [];
    }
  }, []);

  // Fonction dédiée pour récupérer les départements
  const fetchDepartments = useCallback(async () => {
    try {
      console.log('Fetching departments from Firestore...');
      const data = await fetchCollectionData<Department>(COLLECTIONS.HR.DEPARTMENTS);
      console.log(`Fetched ${data.length} departments from Firestore`);
      
      // Déduplications des départements basée sur leur ID
      const uniqueDepartments = new Map<string, Department>();
      data.forEach(dept => {
        if (dept && dept.id && !uniqueDepartments.has(dept.id)) {
          uniqueDepartments.set(dept.id, dept);
        }
      });
      
      const uniqueData = Array.from(uniqueDepartments.values());
      console.log(`Après déduplication: ${uniqueData.length} départements (avant: ${data.length})`);
      
      setDepartments(uniqueData);
      return uniqueData;
    } catch (err) {
      console.error('Error fetching departments:', err);
      setError(err as Error);
      return [];
    }
  }, []);

  const fetchAllHrData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching all HR data...');
      const [
        employeesData,
        payslipsData,
        contractsData,
        departmentsData,
        leaveRequestsData,
        attendanceData,
        absenceRequestsData,
        documentsData,
        timeSheetsData,
        evaluationsData,
        trainingsData,
        reportsData,
        alertsData
      ] = await Promise.all([
        fetchEmployees(),
        fetchCollectionData(COLLECTIONS.HR.PAYSLIPS),
        fetchCollectionData(COLLECTIONS.HR.CONTRACTS),
        fetchDepartments(), // Utiliser notre nouvelle fonction
        fetchCollectionData(COLLECTIONS.HR.LEAVE_REQUESTS),
        fetchCollectionData(COLLECTIONS.HR.ATTENDANCE),
        fetchCollectionData(COLLECTIONS.HR.ABSENCE_REQUESTS),
        fetchCollectionData(COLLECTIONS.HR.DOCUMENTS),
        fetchCollectionData(COLLECTIONS.HR.TIMESHEET),
        fetchCollectionData(COLLECTIONS.HR.EVALUATIONS),
        fetchCollectionData(COLLECTIONS.HR.TRAININGS),
        fetchCollectionData(COLLECTIONS.HR.REPORTS),
        fetchCollectionData(COLLECTIONS.HR.ALERTS)
      ]);
      
      setPayslips(payslipsData);
      setContracts(contractsData);
      // Les départements sont déjà définis par fetchDepartments()
      setLeaveRequests(leaveRequestsData);
      setAttendance(attendanceData);
      setAbsenceRequests(absenceRequestsData);
      setHrDocuments(documentsData);
      setTimeSheets(timeSheetsData);
      setEvaluations(evaluationsData);
      setTrainings(trainingsData);
      setHrReports(reportsData);
      setHrAlerts(alertsData);
      
      console.log('All HR data fetched successfully');
    } catch (err) {
      console.error('Error fetching HR data:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchEmployees, fetchDepartments]);
  
  // Initial data fetch
  useEffect(() => {
    fetchAllHrData();
  }, [fetchAllHrData]);
  
  const refetchEmployees = async () => {
    console.log('Manually refetching employee data...');
    setIsLoading(true);
    try {
      const refreshedEmployees = await fetchEmployees();
      console.log(`Données employés actualisées: ${refreshedEmployees.length} employés`);
      return refreshedEmployees;
    } catch (err) {
      console.error('Error refetching employees:', err);
      toast.error('Erreur lors de l\'actualisation des données employés');
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  const refetchDepartments = async () => {
    console.log('Manually refetching department data...');
    setIsLoading(true);
    try {
      const refreshedDepartments = await fetchDepartments();
      console.log(`Données départements actualisées: ${refreshedDepartments.length} départements`);
      return refreshedDepartments;
    } catch (err) {
      console.error('Error refetching departments:', err);
      toast.error('Erreur lors de l\'actualisation des données départements');
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    employees,
    payslips,
    contracts,
    departments,
    leaveRequests,
    attendance,
    absenceRequests,
    hrDocuments,
    timeSheets,
    evaluations,
    trainings,
    hrReports, 
    hrAlerts,
    isLoading,
    error,
    refetchEmployees,
    refetchDepartments,
    fetchAllHrData
  };
};
