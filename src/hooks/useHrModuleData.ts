
import { useState, useEffect } from 'react';
import { useHrData } from './modules/useHrData';

/**
 * Hook to access all HR module data in one place
 */
export const useHrModuleData = () => {
  // Get all HR data from the base hook
  const {
    employees = [],
    departments = [],
    contracts = [],
    payslips = [],
    leaveRequests = [],
    attendance = [],
    absenceRequests = [],
    hrDocuments = [],
    timeSheets = [],
    evaluations = [],
    trainings = [],
    hrReports = [],
    hrAlerts = [],
    isLoading = true,
    error = null
  } = useHrData() || {};

  // Provide safe defaults if the data is null or undefined
  return {
    employees: employees || [],
    departments: departments || [],
    contracts: contracts || [],
    payslips: payslips || [],
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
    // Add a list of companies from a fake data source
    companies: []
  };
};
