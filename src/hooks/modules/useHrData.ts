
import { useEffect, useState, useCallback } from 'react';
import { Employee } from '@/types/employee';
import { PaySlip } from '@/types/payslip';
import { getDocs } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Department } from '@/components/module/submodules/departments/types';

/**
 * Hook pour accéder aux données RH
 */
export const useHrData = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // États pour stocker les données RH
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payslips, setPayslips] = useState<PaySlip[]>([]);
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

  // Fonction pour charger les données
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Fetching HR data from Firestore...");
      
      // Récupérer les employés
      const employeesData = await getDocs(COLLECTIONS.HR.EMPLOYEES);
      console.log("Raw employees data from Firestore:", employeesData);
      setEmployees(employeesData);
      
      // Récupérer les fiches de paie
      const payslipsData = await getDocs(COLLECTIONS.HR.PAYSLIPS);
      setPayslips(payslipsData);
      
      // Récupérer les contrats
      const contractsData = await getDocs(COLLECTIONS.HR.CONTRACTS);
      setContracts(contractsData);
      
      // Récupérer les départements
      const departmentsData = await getDocs(COLLECTIONS.HR.DEPARTMENTS);
      setDepartments(departmentsData);
      
      // Récupérer les demandes de congés
      const leaveRequestsData = await getDocs(COLLECTIONS.HR.LEAVE_REQUESTS);
      setLeaveRequests(leaveRequestsData);
      
      // Récupérer les présences
      const attendanceData = await getDocs(COLLECTIONS.HR.ATTENDANCE);
      setAttendance(attendanceData);
      
      // Récupérer les demandes d'absence
      const absenceRequestsData = await getDocs(COLLECTIONS.HR.ABSENCE_REQUESTS);
      setAbsenceRequests(absenceRequestsData);
      
      // Récupérer les documents RH
      const hrDocumentsData = await getDocs(COLLECTIONS.HR.DOCUMENTS);
      setHrDocuments(hrDocumentsData);
      
      // Récupérer les feuilles de temps
      const timeSheetsData = await getDocs(COLLECTIONS.HR.TIMESHEET);
      setTimeSheets(timeSheetsData);
      
      // Récupérer les évaluations
      const evaluationsData = await getDocs(COLLECTIONS.HR.EVALUATIONS);
      setEvaluations(evaluationsData);
      
      // Récupérer les formations
      const trainingsData = await getDocs(COLLECTIONS.HR.TRAININGS);
      setTrainings(trainingsData);
      
      // Récupérer les rapports RH
      const hrReportsData = await getDocs(COLLECTIONS.HR.REPORTS);
      setHrReports(hrReportsData);
      
      // Récupérer les alertes RH
      const hrAlertsData = await getDocs(COLLECTIONS.HR.ALERTS);
      setHrAlerts(hrAlertsData);
      
      console.log("HR data fetched successfully!");
      
    } catch (err: any) {
      console.error("Error fetching HR data:", err);
      setError(err.message || "Une erreur est survenue lors du chargement des données RH");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fonction pour rafraîchir les employés uniquement
  const refetchEmployees = useCallback(async () => {
    try {
      console.log("Refetching employees data...");
      const employeesData = await getDocs(COLLECTIONS.HR.EMPLOYEES);
      console.log("Raw employees data from refetch:", employeesData);
      setEmployees(employeesData);
      return true;
    } catch (err: any) {
      console.error("Error refetching employees data:", err);
      return false;
    }
  }, []);

  // Charger les données au montage du composant
  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
    refetchData: fetchData, // Exposer la fonction pour recharger toutes les données
  };
};

