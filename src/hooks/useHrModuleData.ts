
import { useEffect, useState, useRef } from 'react';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { db } from '@/lib/firebase';
import { collection, getDocs, query } from 'firebase/firestore';
import { Company } from '@/components/module/submodules/companies/types';
import { Employee } from '@/types/employee';

/**
 * Hook to fetch HR module data with optimized Firebase requests and safe data handling
 */
export const useHrModuleData = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Use a ref for cache management to prevent state updates triggering rerenders
  const cacheRef = useRef({
    lastFetched: null as number | null,
    fetchInProgress: false,
    // Cache timeout in milliseconds (10 minutes)
    CACHE_TIMEOUT: 10 * 60 * 1000
  });

  useEffect(() => {
    // Function to fetch data with caching
    const fetchDataIfNeeded = async () => {
      // Skip if already fetching or cache is still valid
      if (cacheRef.current.fetchInProgress) {
        return;
      }
      
      const now = Date.now();
      const cacheValid = cacheRef.current.lastFetched && 
                        (now - cacheRef.current.lastFetched < cacheRef.current.CACHE_TIMEOUT);
      
      // Return if cache is valid and data is already loaded
      if (cacheValid && employees.length > 0 && departments.length > 0) {
        return;
      }
      
      // Set loading state and mark fetch in progress
      setIsLoading(true);
      cacheRef.current.fetchInProgress = true;
      
      try {
        console.log('Fetching HR data from Firebase...');
        
        // Use getDocs for one-time fetch instead of real-time listeners
        const employeesQuery = query(collection(db, COLLECTIONS.HR.EMPLOYEES || 'hr_employees'));
        const departmentsQuery = query(collection(db, COLLECTIONS.HR.DEPARTMENTS || 'hr_departments'));
        const leaveRequestsQuery = query(collection(db, COLLECTIONS.HR.LEAVES || 'hr_leaves'));
        
        // Fetch data in parallel with try/catch for each request
        try {
          const [employeesSnapshot, departmentsSnapshot, leaveRequestsSnapshot] = await Promise.all([
            getDocs(employeesQuery).catch(e => {
              console.error("Error fetching employees:", e);
              return { docs: [] };
            }),
            getDocs(departmentsQuery).catch(e => {
              console.error("Error fetching departments:", e);
              return { docs: [] };
            }),
            getDocs(leaveRequestsQuery).catch(e => {
              console.error("Error fetching leave requests:", e);
              return { docs: [] };
            })
          ]);
          
          // Process employee data safely
          const employeesData = employeesSnapshot.docs ? employeesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) : [];
          
          // Process department data safely
          const departmentsData = departmentsSnapshot.docs ? departmentsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) : [];
          
          // Process leave requests data safely
          const leaveRequestsData = leaveRequestsSnapshot.docs ? leaveRequestsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) : [];
          
          // Update state with data
          setEmployees(employeesData);
          setDepartments(departmentsData);
          setLeaveRequests(leaveRequestsData);
          
          // Update cache timestamp
          cacheRef.current.lastFetched = Date.now();
          setError(null);
        } catch (err) {
          console.error("Error in Promise.all:", err);
          throw err;
        }
      } catch (err) {
        console.error("Error fetching HR module data:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
        // Make sure we set empty arrays even on error to avoid undefined
        setEmployees([]);
        setDepartments([]);
        setLeaveRequests([]);
      } finally {
        setIsLoading(false);
        cacheRef.current.fetchInProgress = false;
      }
    };
    
    // Call fetch function
    fetchDataIfNeeded();
  }, []); // Only run on mount, cache management is handled inside
  
  // Processing companies from employees (moved out of useEffect to simplify)
  useEffect(() => {
    if (Array.isArray(employees) && employees.length > 0) {
      // Create a map to ensure unique companies
      const companiesMap = new Map<string, Company>();
      
      employees.forEach(emp => {
        if (emp?.company) {
          const companyId = typeof emp.company === 'string' ? emp.company : (emp.company.id || 'default');
          
          if (!companiesMap.has(companyId)) {
            // Create a company object safely
            companiesMap.set(companyId, {
              id: companyId,
              name: typeof emp.company === 'string' ? 'Entreprise' : (emp.company.name || 'Entreprise'),
              address: {
                street: '',
                city: '',
                postalCode: '',
                country: ''
              },
              siret: '',
              logo: '',
              logoUrl: '',
              phone: '',
              email: '',
              website: '',
              industry: '',
              size: '',
              status: 'active',
              employeesCount: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
          }
        }
      });
      
      // Convert map to array
      setCompanies(Array.from(companiesMap.values()));
    } else {
      setCompanies([]);
    }
  }, [employees]);
  
  // Add a manual refresh function
  const refreshData = () => {
    // Reset cache timestamp to trigger a new fetch
    cacheRef.current.lastFetched = null;
    // Force a new fetch
    setEmployees([]);
    setDepartments([]);
    setLeaveRequests([]);
    setIsLoading(true);
  };
  
  return {
    employees: employees || [],
    departments: departments || [],
    companies: companies || [],
    leaveRequests: leaveRequests || [],
    attendance: [],
    absenceRequests: [],
    hrDocuments: [],
    timeSheets: [],
    evaluations: [],
    trainings: [],
    hrReports: [],
    hrAlerts: [],
    isLoading,
    error,
    refreshData
  };
};
