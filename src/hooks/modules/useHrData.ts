
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

  // Fetch attendance
  const {
    data: attendance,
    isLoading: isAttendanceLoading,
    error: attendanceError
  } = useCollectionData(
    COLLECTIONS.HR.ATTENDANCE,
    [orderBy('date', 'desc')]
  );

  // Fetch absence requests
  const {
    data: absenceRequests,
    isLoading: isAbsenceRequestsLoading,
    error: absenceRequestsError
  } = useCollectionData(
    COLLECTIONS.HR.ABSENCE_REQUESTS,
    [orderBy('startDate')]
  );

  // Fetch HR documents
  const {
    data: hrDocuments,
    isLoading: isHrDocumentsLoading,
    error: hrDocumentsError
  } = useCollectionData(
    COLLECTIONS.HR.DOCUMENTS,
    [orderBy('uploadDate', 'desc')]
  );

  // Fetch time sheets
  const {
    data: timeSheets,
    isLoading: isTimeSheetsLoading,
    error: timeSheetsError
  } = useCollectionData(
    COLLECTIONS.HR.TIMESHEETS,
    [orderBy('startDate', 'desc')]
  );

  // Fetch evaluations
  const {
    data: evaluations,
    isLoading: isEvaluationsLoading,
    error: evaluationsError
  } = useCollectionData(
    COLLECTIONS.HR.EVALUATIONS,
    [orderBy('date', 'desc')]
  );

  // Fetch trainings
  const {
    data: trainings,
    isLoading: isTrainingsLoading,
    error: trainingsError
  } = useCollectionData(
    COLLECTIONS.HR.TRAININGS,
    [orderBy('date', 'desc')]
  );

  // Fetch HR reports
  const {
    data: hrReports,
    isLoading: isHrReportsLoading,
    error: hrReportsError
  } = useCollectionData(
    COLLECTIONS.HR.REPORTS,
    [orderBy('date', 'desc')]
  );

  // Fetch HR alerts
  const {
    data: hrAlerts,
    isLoading: isHrAlertsLoading,
    error: hrAlertsError
  } = useCollectionData(
    COLLECTIONS.HR.ALERTS,
    [orderBy('date', 'desc')]
  );

  // Check if any data is still loading
  const isLoading = 
    isEmployeesLoading || 
    isPayslipsLoading || 
    isLeaveRequestsLoading || 
    isContractsLoading || 
    isDepartmentsLoading ||
    isAttendanceLoading ||
    isAbsenceRequestsLoading ||
    isHrDocumentsLoading ||
    isTimeSheetsLoading ||
    isEvaluationsLoading ||
    isTrainingsLoading ||
    isHrReportsLoading ||
    isHrAlertsLoading;

  // Combine all possible errors
  const error = 
    employeesError || 
    payslipsError || 
    leaveRequestsError || 
    contractsError || 
    departmentsError ||
    attendanceError ||
    absenceRequestsError ||
    hrDocumentsError ||
    timeSheetsError ||
    evaluationsError ||
    trainingsError ||
    hrReportsError ||
    hrAlertsError;

  return {
    employees,
    payslips,
    leaveRequests,
    contracts,
    departments,
    attendance,
    absenceRequests,
    hrDocuments,
    timeSheets,
    evaluations,
    trainings,
    hrReports,
    hrAlerts,
    isLoading,
    error
  };
};
