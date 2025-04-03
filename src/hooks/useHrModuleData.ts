
import { useCollectionData } from './useCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { orderBy, query, where } from 'firebase/firestore';
import type { Employee } from '@/types/employee';
import type { DocumentData } from 'firebase/firestore';

/**
 * Hook centralisé pour récupérer toutes les données liées au module Employés/RH
 * directement depuis Firebase
 */
export const useHrModuleData = () => {
  // Récupération des employés
  const { 
    data: employees, 
    isLoading: isEmployeesLoading, 
    error: employeesError 
  } = useCollectionData<Employee>(
    COLLECTIONS.HR.EMPLOYEES,
    [orderBy('lastName')]
  );

  // Récupération des fiches de paie
  const { 
    data: payslips, 
    isLoading: isPayslipsLoading, 
    error: payslipsError 
  } = useCollectionData(
    COLLECTIONS.HR.PAYSLIPS,
    [orderBy('date', 'desc')]
  );

  // Récupération des demandes de congés
  const { 
    data: leaveRequests, 
    isLoading: isLeaveRequestsLoading, 
    error: leaveRequestsError 
  } = useCollectionData(
    COLLECTIONS.HR.LEAVE_REQUESTS,
    [orderBy('startDate')]
  );

  // Récupération des contrats
  const { 
    data: contracts, 
    isLoading: isContractsLoading, 
    error: contractsError 
  } = useCollectionData(
    COLLECTIONS.HR.CONTRACTS,
    [orderBy('startDate', 'desc')]
  );

  // Récupération des départements
  const { 
    data: departments, 
    isLoading: isDepartmentsLoading, 
    error: departmentsError 
  } = useCollectionData(
    COLLECTIONS.HR.DEPARTMENTS,
    [orderBy('name')]
  );

  // Récupération des évaluations
  const { 
    data: evaluations, 
    isLoading: isEvaluationsLoading, 
    error: evaluationsError 
  } = useCollectionData(
    COLLECTIONS.HR.EVALUATIONS,
    [orderBy('date', 'desc')]
  );

  // Récupération des formations
  const { 
    data: trainings, 
    isLoading: isTrainingsLoading, 
    error: trainingsError 
  } = useCollectionData(
    COLLECTIONS.HR.TRAININGS,
    [orderBy('startDate')]
  );

  // Récupération des badges
  const { 
    data: badges, 
    isLoading: isBadgesLoading, 
    error: badgesError 
  } = useCollectionData(
    COLLECTIONS.HR.BADGES,
    [orderBy('date', 'desc')]
  );

  // Récupération des présences
  const { 
    data: attendance, 
    isLoading: isAttendanceLoading, 
    error: attendanceError 
  } = useCollectionData(
    COLLECTIONS.HR.ATTENDANCE,
    [orderBy('date', 'desc')]
  );

  // Récupération des feuilles de temps
  const { 
    data: timeSheets, 
    isLoading: isTimeSheetsLoading, 
    error: timeSheetsError 
  } = useCollectionData(
    COLLECTIONS.HR.TIME_SHEETS,
    [orderBy('weekStartDate', 'desc')]
  );

  // Récupération des demandes d'absence
  const { 
    data: absenceRequests, 
    isLoading: isAbsenceRequestsLoading, 
    error: absenceRequestsError 
  } = useCollectionData(
    COLLECTIONS.HR.ABSENCE_REQUESTS,
    [orderBy('startDate')]
  );

  // Récupération des documents RH
  const { 
    data: hrDocuments, 
    isLoading: isHrDocumentsLoading, 
    error: hrDocumentsError 
  } = useCollectionData(
    COLLECTIONS.HR.DOCUMENTS,
    [orderBy('uploadDate', 'desc')]
  );

  // Récupération des entreprises
  const { 
    data: companies, 
    isLoading: isCompaniesLoading, 
    error: companiesError 
  } = useCollectionData(
    COLLECTIONS.COMPANIES,
    [orderBy('name')]
  );

  // Récupération des recrutements
  const { 
    data: recruitmentPosts, 
    isLoading: isRecruitmentLoading, 
    error: recruitmentError 
  } = useCollectionData(
    COLLECTIONS.HR.RECRUITMENT,
    [orderBy('openDate', 'desc')]
  );

  // Récupération des rapports
  const { 
    data: hrReports, 
    isLoading: isReportsLoading, 
    error: reportsError 
  } = useCollectionData(
    COLLECTIONS.HR.REPORTS,
    [orderBy('createdDate', 'desc')]
  );

  // Récupération des alertes
  const { 
    data: hrAlerts, 
    isLoading: isAlertsLoading, 
    error: alertsError 
  } = useCollectionData(
    COLLECTIONS.HR.ALERTS,
    [orderBy('createdDate', 'desc')]
  );

  // Vérifier si des données sont en cours de chargement
  const isLoading = 
    isEmployeesLoading || 
    isPayslipsLoading || 
    isLeaveRequestsLoading || 
    isContractsLoading || 
    isDepartmentsLoading ||
    isEvaluationsLoading ||
    isTrainingsLoading ||
    isBadgesLoading ||
    isAttendanceLoading ||
    isTimeSheetsLoading ||
    isAbsenceRequestsLoading ||
    isHrDocumentsLoading ||
    isCompaniesLoading ||
    isRecruitmentLoading ||
    isReportsLoading ||
    isAlertsLoading;

  // Combiner toutes les erreurs potentielles
  const error = 
    employeesError || 
    payslipsError || 
    leaveRequestsError || 
    contractsError || 
    departmentsError ||
    evaluationsError ||
    trainingsError ||
    badgesError ||
    attendanceError ||
    timeSheetsError ||
    absenceRequestsError ||
    hrDocumentsError ||
    companiesError ||
    recruitmentError ||
    reportsError ||
    alertsError;

  return {
    employees: employees || [],
    payslips: payslips || [],
    leaveRequests: leaveRequests || [],
    contracts: contracts || [],
    departments: departments || [],
    evaluations: evaluations || [],
    trainings: trainings || [],
    badges: badges || [],
    attendance: attendance || [],
    timeSheets: timeSheets || [],
    absenceRequests: absenceRequests || [],
    hrDocuments: hrDocuments || [],
    companies: companies || [],
    recruitmentPosts: recruitmentPosts || [],
    hrReports: hrReports || [],
    hrAlerts: hrAlerts || [],
    isLoading,
    error
  };
};
