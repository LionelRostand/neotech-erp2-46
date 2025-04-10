import { useState, useEffect } from 'react';
import { getAllDocuments } from '@/hooks/firestore/read-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';

export const useRecruitmentFirebaseData = () => {
  const [recruitments, setRecruitments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Use RECRUITMENTS instead of RECRUITMENT
        const data = await getAllDocuments(COLLECTIONS.HR.RECRUITMENTS);
        setRecruitments(data);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch recruitments:", error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  return { recruitments, isLoading, error };
};

