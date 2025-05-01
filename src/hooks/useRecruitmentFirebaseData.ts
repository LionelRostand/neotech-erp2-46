
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
      // Vérification que le chemin de collection existe
      if (!COLLECTIONS.HR.RECRUITMENT) {
        throw new Error('Collection path for recruitment is not defined');
      }
      
      const collectionRef = collection(db, COLLECTIONS.HR.RECRUITMENT);
      const q = query(collectionRef);
      
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot) {
            console.log('No snapshot returned from Firebase');
            setRecruitmentPosts([]);
            setIsLoading(false);
            return;
          }

          const posts = snapshot.docs.map(doc => {
            if (!doc || !doc.data) {
              console.log('Invalid document in snapshot');
              return null;
            }

            const data = doc.data();
            // Format dates if they exist in timestamp format
            const formattedData: any = { ...data };
            if (data.openDate instanceof Date) {
              formattedData.openDate = data.openDate.toLocaleDateString('fr-FR');
            } else if (data.openDate && typeof data.openDate === 'string') {
              try {
                const date = new Date(data.openDate);
                formattedData.openDate = isNaN(date.getTime()) 
                  ? data.openDate 
                  : date.toLocaleDateString('fr-FR');
              } catch (e) {
                formattedData.openDate = data.openDate;
              }
            }
            
            if (data.applicationDeadline instanceof Date) {
              formattedData.applicationDeadline = data.applicationDeadline.toLocaleDateString('fr-FR');
            } else if (data.applicationDeadline && typeof data.applicationDeadline === 'string') {
              try {
                const date = new Date(data.applicationDeadline);
                formattedData.applicationDeadline = isNaN(date.getTime()) 
                  ? data.applicationDeadline 
                  : date.toLocaleDateString('fr-FR');
              } catch (e) {
                formattedData.applicationDeadline = data.applicationDeadline;
              }
            }
            
            return {
              id: doc.id,
              ...formattedData
            };
          }).filter(Boolean) as RecruitmentPost[]; // Filter out any null values
          
          console.log(`Retrieved ${posts.length} recruitment posts from Firebase`);
          setRecruitmentPosts(posts);
          setIsLoading(false);
        },
        (err: Error) => {
          console.error('Error fetching recruitment data:', err);
          setError(err);
          setRecruitmentPosts([]); // Ensure we always set an empty array, not undefined
          setIsLoading(false);
        }
      );
      
      return () => {
        console.log('Unsubscribing from recruitment collection');
        unsubscribe();
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      console.error('Error setting up recruitment listener:', error);
      setError(error);
      setRecruitmentPosts([]); // Ensure we always set an empty array, not undefined
      setIsLoading(false);
      return () => {}; // Empty cleanup function if setup fails
    }
  }, []);

  useEffect(() => {
    const unsubscribe = fetchData();
    return unsubscribe;
  }, [fetchData]);

  const refreshData = useCallback(() => {
    // Re-fetch data
    const unsubscribe = fetchData();
    return unsubscribe;
  }, [fetchData]);

  return {
    recruitmentPosts: recruitmentPosts || [], // Ensure we always return an array, not undefined
    isLoading,
    error,
    refreshData
  };
};

export default useRecruitmentFirebaseData;
