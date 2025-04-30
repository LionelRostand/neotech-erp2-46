
import { useState, useEffect, useRef } from 'react';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { db } from '@/lib/firebase';
import { collection, getDocs, query } from 'firebase/firestore';

/**
 * Hook to fetch HR module data (employees and departments) with optimized Firebase requests
 * Added advanced caching to prevent excessive requests
 */
export const useHrModuleData = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Use a ref for cache management to prevent state updates triggering rerenders
  const cacheRef = useRef({
    lastFetched: null,
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
        const employeesQuery = query(collection(db, COLLECTIONS.HR.EMPLOYEES));
        const departmentsQuery = query(collection(db, COLLECTIONS.HR.DEPARTMENTS));
        
        // Fetch data in parallel
        const [employeesSnapshot, departmentsSnapshot] = await Promise.all([
          getDocs(employeesQuery),
          getDocs(departmentsQuery)
        ]);
        
        // Process employee data
        const employeesData = employeesSnapshot.docs ? employeesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) : [];
        
        // Process department data
        const departmentsData = departmentsSnapshot.docs ? departmentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) : [];
        
        // Update state with data
        setEmployees(employeesData);
        setDepartments(departmentsData);
        
        // Update cache timestamp
        cacheRef.current.lastFetched = Date.now();
        setError(null);
      } catch (err) {
        console.error("Error fetching HR module data:", err);
        setError(err);
        // Make sure we set empty arrays even on error to avoid undefined
        setEmployees([]);
        setDepartments([]);
      } finally {
        setIsLoading(false);
        cacheRef.current.fetchInProgress = false;
      }
    };
    
    // Call fetch function
    fetchDataIfNeeded();
  }, []); // Only run on mount, cache management is handled inside
  
  // Add a manual refresh function
  const refreshData = () => {
    // Reset cache timestamp to trigger a new fetch
    cacheRef.current.lastFetched = null;
    // Force a new fetch
    setEmployees([]);
    setDepartments([]);
    setIsLoading(true);
  };
  
  return {
    employees: employees || [],
    departments: departments || [],
    isLoading,
    error,
    refreshData
  };
};
