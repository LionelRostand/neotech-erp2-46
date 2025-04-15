
import { useState, useEffect, useCallback } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { RecruitmentPost } from '@/types/recruitment';
import { COLLECTIONS } from '@/lib/firebase-collections';

export const useRecruitmentFirebaseData = () => {
  const [recruitmentPosts, setRecruitmentPosts] = useState<RecruitmentPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(() => {
    console.log('Fetching recruitment data from Firebase...');
    setIsLoading(true);
    try {
      const collectionRef = collection(db, COLLECTIONS.HR.RECRUITMENTS);
      const q = query(collectionRef);
      
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const posts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as RecruitmentPost[];
          
          console.log(`Retrieved ${posts.length} recruitment posts from Firebase`);
          setRecruitmentPosts(posts);
          setIsLoading(false);
        },
        (err: Error) => {
          console.error('Error fetching recruitment data:', err);
          setError(err);
          setIsLoading(false);
        }
      );
      
      return unsubscribe;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      console.error('Error setting up recruitment listener:', error);
      setError(error);
      setIsLoading(false);
      return () => {}; // Empty cleanup function if setup fails
    }
  }, []);

  useEffect(() => {
    const unsubscribe = fetchData();
    return unsubscribe;
  }, [fetchData]);

  return {
    recruitmentPosts,
    isLoading,
    error
  };
};
