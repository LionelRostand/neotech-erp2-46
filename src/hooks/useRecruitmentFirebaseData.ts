
import { useState, useEffect } from 'react';
import { getAllDocuments } from '@/hooks/firestore/read-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';

export const useRecruitmentFirebaseData = () => {
  const [recruitmentPosts, setRecruitmentPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getAllDocuments(COLLECTIONS.HR.RECRUITMENTS);
        setRecruitmentPosts(data);
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
  
  const refreshData = async () => {
    try {
      setIsLoading(true);
      const data = await getAllDocuments(COLLECTIONS.HR.RECRUITMENTS);
      setRecruitmentPosts(data);
      setError(null);
    } catch (error) {
      console.error("Failed to refresh recruitments:", error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return { recruitmentPosts, isLoading, error, refreshData };
};
