
import { useState, useEffect, useCallback } from 'react';
import { useFirestore } from './useFirestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Employee } from '@/types/employee';
import { refreshEmployeesData } from '@/components/module/submodules/employees/services/employeeService';

export const useHrModuleData = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [payslips, setPayslips] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [absenceRequests, setAbsenceRequests] = useState([]);
  const [hrDocuments, setHrDocuments] = useState([]);
  const [timeSheets, setTimeSheets] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [hrReports, setHrReports] = useState([]);
  const [hrAlerts, setHrAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const employeesCollection = useFirestore(COLLECTIONS.HR.EMPLOYEES);
  const departmentsCollection = useFirestore(COLLECTIONS.HR.DEPARTMENTS);
  const companiesCollection = useFirestore(COLLECTIONS.HR.COMPANIES || 'companies');
  const payslipsCollection = useFirestore(COLLECTIONS.HR.PAYSLIPS);
  const contractsCollection = useFirestore(COLLECTIONS.HR.CONTRACTS);
  const leaveRequestsCollection = useFirestore(COLLECTIONS.HR.LEAVE_REQUESTS);
  const attendanceCollection = useFirestore(COLLECTIONS.HR.ATTENDANCE);
  const absenceRequestsCollection = useFirestore(COLLECTIONS.HR.ABSENCE_REQUESTS);
  const hrDocumentsCollection = useFirestore(COLLECTIONS.HR.DOCUMENTS);
  const timeSheetsCollection = useFirestore(COLLECTIONS.HR.TIMESHEET);
  const evaluationsCollection = useFirestore(COLLECTIONS.HR.EVALUATIONS);
  const trainingsCollection = useFirestore(COLLECTIONS.HR.TRAININGS);
  const hrReportsCollection = useFirestore(COLLECTIONS.HR.REPORTS);
  const hrAlertsCollection = useFirestore(COLLECTIONS.HR.ALERTS);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Récupération des employés
      const employeesData = await employeesCollection.getAll();
      setEmployees(employeesData as Employee[]);

      // Récupération des départements
      const departmentsData = await departmentsCollection.getAll();
      setDepartments(departmentsData);

      // Récupération des entreprises
      let companiesData = [];
      try {
        companiesData = await companiesCollection.getAll();
      } catch (err) {
        console.error('Erreur lors de la récupération des entreprises:', err);
        companiesData = [];
      }
      setCompanies(companiesData);

      // Récupération des fiches de paie
      let payslipsData = [];
      try {
        payslipsData = await payslipsCollection.getAll();
      } catch (err) {
        console.error('Erreur lors de la récupération des fiches de paie:', err);
        payslipsData = [];
      }
      setPayslips(payslipsData);

      // Récupération des contrats
      let contractsData = [];
      try {
        contractsData = await contractsCollection.getAll();
      } catch (err) {
        console.error('Erreur lors de la récupération des contrats:', err);
        contractsData = [];
      }
      setContracts(contractsData);

      // Récupération des demandes de congés
      let leaveRequestsData = [];
      try {
        leaveRequestsData = await leaveRequestsCollection.getAll();
      } catch (err) {
        console.error('Erreur lors de la récupération des demandes de congés:', err);
        leaveRequestsData = [];
      }
      setLeaveRequests(leaveRequestsData);

      // Récupération des présences
      let attendanceData = [];
      try {
        attendanceData = await attendanceCollection.getAll();
      } catch (err) {
        console.error('Erreur lors de la récupération des présences:', err);
        attendanceData = [];
      }
      setAttendance(attendanceData);

      // Récupération des demandes d'absence
      let absenceRequestsData = [];
      try {
        absenceRequestsData = await absenceRequestsCollection.getAll();
      } catch (err) {
        console.error('Erreur lors de la récupération des demandes d\'absence:', err);
        absenceRequestsData = [];
      }
      setAbsenceRequests(absenceRequestsData);

      // Récupération des documents RH
      let hrDocumentsData = [];
      try {
        hrDocumentsData = await hrDocumentsCollection.getAll();
      } catch (err) {
        console.error('Erreur lors de la récupération des documents RH:', err);
        hrDocumentsData = [];
      }
      setHrDocuments(hrDocumentsData);

      // Récupération des feuilles de temps
      let timeSheetsData = [];
      try {
        timeSheetsData = await timeSheetsCollection.getAll();
      } catch (err) {
        console.error('Erreur lors de la récupération des feuilles de temps:', err);
        timeSheetsData = [];
      }
      setTimeSheets(timeSheetsData);

      // Récupération des évaluations
      let evaluationsData = [];
      try {
        evaluationsData = await evaluationsCollection.getAll();
      } catch (err) {
        console.error('Erreur lors de la récupération des évaluations:', err);
        evaluationsData = [];
      }
      setEvaluations(evaluationsData);

      // Récupération des formations
      let trainingsData = [];
      try {
        trainingsData = await trainingsCollection.getAll();
      } catch (err) {
        console.error('Erreur lors de la récupération des formations:', err);
        trainingsData = [];
      }
      setTrainings(trainingsData);

      // Récupération des rapports RH
      let hrReportsData = [];
      try {
        hrReportsData = await hrReportsCollection.getAll();
      } catch (err) {
        console.error('Erreur lors de la récupération des rapports RH:', err);
        hrReportsData = [];
      }
      setHrReports(hrReportsData);

      // Récupération des alertes RH
      let hrAlertsData = [];
      try {
        hrAlertsData = await hrAlertsCollection.getAll();
      } catch (err) {
        console.error('Erreur lors de la récupération des alertes RH:', err);
        hrAlertsData = [];
      }
      setHrAlerts(hrAlertsData);
    } catch (err) {
      console.error('Erreur lors de la récupération des données RH:', err);
      setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
    } finally {
      setIsLoading(false);
    }
  }, [
    employeesCollection, 
    departmentsCollection, 
    companiesCollection,
    payslipsCollection,
    contractsCollection,
    leaveRequestsCollection,
    attendanceCollection,
    absenceRequestsCollection,
    hrDocumentsCollection,
    timeSheetsCollection,
    evaluationsCollection,
    trainingsCollection,
    hrReportsCollection,
    hrAlertsCollection
  ]);

  // Fonction pour rafraîchir les données des employés
  const refreshEmployees = useCallback(async () => {
    setIsLoading(true);
    try {
      // Utiliser la fonction du service pour récupérer les données fraîches
      const refreshedEmployees = await refreshEmployeesData();
      if (Array.isArray(refreshedEmployees)) {
        setEmployees(refreshedEmployees);
      }
    } catch (err) {
      console.error('Erreur lors du rafraîchissement des employés:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    employees,
    departments,
    companies,
    payslips,
    contracts,
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
    refreshEmployees
  };
};
