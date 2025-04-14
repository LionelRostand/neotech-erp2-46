import { useEffect, useState, useCallback } from 'react';
import { collection, getDocs, query, orderBy, where, getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { Employee } from '@/types/employee';

/**
 * Hook pour récupérer les données du module RH
 */
export const useHrData = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payslips, setPayslips] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [departments, setDepartments] = useState([]);
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
  const [error, setError] = useState(null);

  // Function to fetch HR data
  const fetchHrData = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('Début de récupération des données RH...');
      
      // Récupérer les employés depuis la collection des employés
      const employeesRef = collection(db, COLLECTIONS.HR.EMPLOYEES);
      const employeesQuery = query(employeesRef);
      const employeesSnapshot = await getDocs(employeesQuery);
      console.log(`Employés récupérés: ${employeesSnapshot.docs.length}`);
      
      // Convertir les documents en objets employés
      const allEmployees = employeesSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
        } as unknown as Employee;
      });
      
      // Utiliser une Map pour éliminer les doublons par ID
      const uniqueEmployeesMap = new Map<string, Employee>();
      
      allEmployees.forEach(employee => {
        if (!uniqueEmployeesMap.has(employee.id)) {
          uniqueEmployeesMap.set(employee.id, employee);
        }
      });
      
      const uniqueEmployees = Array.from(uniqueEmployeesMap.values());
      console.log(`Total d'employés uniques après déduplication: ${uniqueEmployees.length} (avant: ${allEmployees.length})`);
      
      // Vérification finale pour LIONEL DJOSSA après déduplication
      const lionelAfterDedup = uniqueEmployees.some(emp => 
        emp.firstName?.toLowerCase().includes('lionel') && 
        emp.lastName?.toLowerCase().includes('djossa')
      );
      
      console.log(`LIONEL DJOSSA présent après déduplication: ${lionelAfterDedup}`);
      
      // Trier par nom de famille
      const sortedEmployees = uniqueEmployees.sort((a, b) => 
        (a.lastName || '').localeCompare(b.lastName || '') || 0
      );
      
      setEmployees(sortedEmployees);

      // Récupérer les autres données
      const payslipsRef = collection(db, COLLECTIONS.HR.PAYSLIPS);
      const payslipsSnapshot = await getDocs(payslipsRef);
      setPayslips(payslipsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const contractsRef = collection(db, COLLECTIONS.HR.CONTRACTS);
      const contractsSnapshot = await getDocs(contractsRef);
      setContracts(contractsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // Déduplication des départements
      const departmentsRef = collection(db, COLLECTIONS.HR.DEPARTMENTS);
      const departmentsSnapshot = await getDocs(departmentsRef);
      const allDepartments = departmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Utiliser une Map pour éliminer les doublons par ID
      const uniqueDepartmentsMap = new Map();
      allDepartments.forEach(dept => {
        if (!uniqueDepartmentsMap.has(dept.id)) {
          uniqueDepartmentsMap.set(dept.id, dept);
        }
      });
      
      setDepartments(Array.from(uniqueDepartmentsMap.values()));

      const leaveRequestsRef = collection(db, COLLECTIONS.HR.LEAVE_REQUESTS);
      const leaveRequestsSnapshot = await getDocs(leaveRequestsRef);
      setLeaveRequests(leaveRequestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const attendanceRef = collection(db, COLLECTIONS.HR.ATTENDANCE);
      const attendanceSnapshot = await getDocs(attendanceRef);
      setAttendance(attendanceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const absenceRequestsRef = collection(db, COLLECTIONS.HR.ABSENCE_REQUESTS);
      const absenceRequestsSnapshot = await getDocs(absenceRequestsRef);
      setAbsenceRequests(absenceRequestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const hrDocumentsRef = collection(db, COLLECTIONS.HR.DOCUMENTS);
      const hrDocumentsSnapshot = await getDocs(hrDocumentsRef);
      setHrDocuments(hrDocumentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const timeSheetCollection = COLLECTIONS.HR.TIMESHEET;
      const timeSheetsRef = collection(db, timeSheetCollection);
      const timeSheetsSnapshot = await getDocs(timeSheetsRef);
      setTimeSheets(timeSheetsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const evaluationsRef = collection(db, COLLECTIONS.HR.EVALUATIONS);
      const evaluationsSnapshot = await getDocs(evaluationsRef);
      setEvaluations(evaluationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const trainingsRef = collection(db, COLLECTIONS.HR.TRAININGS);
      const trainingsSnapshot = await getDocs(trainingsRef);
      setTrainings(trainingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const hrReportsRef = collection(db, COLLECTIONS.HR.REPORTS);
      const hrReportsSnapshot = await getDocs(hrReportsRef);
      setHrReports(hrReportsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const hrAlertsRef = collection(db, COLLECTIONS.HR.ALERTS);
      const hrAlertsSnapshot = await getDocs(hrAlertsRef);
      setHrAlerts(hrAlertsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching HR data:', error);
      setError(error);
      toast.error('Erreur lors du chargement des données RH');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchHrData();
  }, [fetchHrData]);

  // Function to refetch employees data
  const refetchEmployees = useCallback(async () => {
    try {
      console.log('Actualisation des données employés...');
      setIsLoading(true);
      
      const employeesRef = collection(db, COLLECTIONS.HR.EMPLOYEES);
      const employeesQuery = query(employeesRef);
      const employeesSnapshot = await getDocs(employeesQuery);
      
      const allEmployees = employeesSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
        } as unknown as Employee;
      });
      
      // Utiliser une Map pour éliminer les doublons par ID
      const uniqueEmployeesMap = new Map<string, Employee>();
      
      allEmployees.forEach(employee => {
        if (!uniqueEmployeesMap.has(employee.id)) {
          uniqueEmployeesMap.set(employee.id, employee);
        }
      });
      
      const uniqueEmployees = Array.from(uniqueEmployeesMap.values());
      
      // Trier par nom de famille
      const sortedEmployees = uniqueEmployees.sort((a, b) => 
        (a.lastName || '').localeCompare(b.lastName || '') || 0
      );
      
      setEmployees(sortedEmployees);
      console.log(`Données employés actualisées: ${sortedEmployees.length} employés`);
      
      return sortedEmployees;
    } catch (error) {
      console.error('Erreur lors de l\'actualisation des données employés:', error);
      toast.error('Erreur lors de l\'actualisation des données employés');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

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
    refetchEmployees
  };
};
