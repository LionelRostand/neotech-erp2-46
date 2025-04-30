
import { useState, useEffect } from 'react';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, onSnapshot } from 'firebase/firestore';

/**
 * Hook to fetch HR module data (employees and departments) with optimized Firebase requests
 */
export const useHrModuleData = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);
  
  // Cache timeout in milliseconds (5 minutes)
  const CACHE_TIMEOUT = 5 * 60 * 1000;

  useEffect(() => {
    // Only fetch if data hasn't been fetched yet or cache has expired
    if (!lastFetched || (Date.now() - lastFetched > CACHE_TIMEOUT)) {
      setIsLoading(true);
      
      const fetchData = async () => {
        try {
          // Use getDocs (one-time fetch) instead of onSnapshot (real-time listener)
          const employeesQuery = query(collection(db, COLLECTIONS.HR.EMPLOYEES));
          const departmentsQuery = query(collection(db, COLLECTIONS.HR.DEPARTMENTS));
          
          const [employeesSnapshot, departmentsSnapshot] = await Promise.all([
            getDocs(employeesQuery),
            getDocs(departmentsQuery)
          ]);
          
          const employeesData = employeesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          const departmentsData = departmentsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          setEmployees(employeesData);
          setDepartments(departmentsData);
          setLastFetched(Date.now());
        } catch (err) {
          console.error("Error fetching HR module data:", err);
          setError(err);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchData();
    }
  }, [lastFetched]);
  
  // Add a manual refresh function
  const refreshData = () => {
    setLastFetched(null); // This will trigger a re-fetch
  };
  
  return {
    employees,
    departments,
    isLoading,
    error,
    refreshData
  };
};
