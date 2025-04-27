
import { useState, useEffect } from 'react';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import type { Employee } from '@/types/employee';
import type { Department } from '@/components/module/submodules/departments/types';
import type { TimeReport } from '@/types/timesheet';
import { toast } from 'sonner';

export const useHrModuleData = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [timeSheets, setTimeSheets] = useState<TimeReport[]>([]);
  const [payslips, setPayslips] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Check if HR collection exists in COLLECTIONS before trying to access its properties
        if (COLLECTIONS.HR) {
          const employeesData = await fetchCollectionData<Employee>(COLLECTIONS.HR.EMPLOYEES);
          const departmentsData = await fetchCollectionData<Department>(COLLECTIONS.HR.DEPARTMENTS);
          const companiesData = await fetchCollectionData(COLLECTIONS.COMPANIES);
          const timeSheetsData = await fetchCollectionData<TimeReport>(COLLECTIONS.HR.TIMESHEET);
          const payslipsData = await fetchCollectionData(COLLECTIONS.HR.PAYSLIPS);
          const contractsData = await fetchCollectionData(COLLECTIONS.HR.CONTRACTS);
          const leaveRequestsData = await fetchCollectionData(COLLECTIONS.HR.LEAVE_REQUESTS);
          
          setEmployees(employeesData);
          setDepartments(departmentsData);
          setCompanies(companiesData);
          setTimeSheets(timeSheetsData);
          setPayslips(payslipsData);
          setContracts(contractsData);
          setLeaveRequests(leaveRequestsData);
        } else {
          console.error("HR collection is not defined in COLLECTIONS");
          toast.error("La collection HR n'est pas définie");
        }
      } catch (err) {
        console.error('Error fetching HR data:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        toast.error('Erreur lors du chargement des données RH');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    employees,
    departments,
    companies,
    timeSheets,
    payslips,
    contracts,
    leaveRequests,
    isLoading,
    error
  };
};
