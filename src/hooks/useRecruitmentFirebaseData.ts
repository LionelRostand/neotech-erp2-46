
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
          const posts = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              // Ensure required fields have default values if not present
              openDate: data.openDate || data.posting_date || '(Non spécifié)',
              hiringManagerId: data.hiringManagerId || 'unknown',
              hiringManagerName: data.hiringManagerName || data.hiring_manager || '(Non spécifié)',
              contractType: data.contractType || '(Non spécifié)',
              salary: data.salary || '(Non spécifié)',
              applicationCount: data.applicationCount || data.applications_count || 0,
              created_at: data.created_at || new Date().toISOString(),
              updated_at: data.updated_at || new Date().toISOString(),
              // Convert requirements to array if it's a string
              requirements: Array.isArray(data.requirements) 
                ? data.requirements 
                : typeof data.requirements === 'string' 
                  ? [data.requirements] 
                  : []
            } as RecruitmentPost;
          });
          
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
