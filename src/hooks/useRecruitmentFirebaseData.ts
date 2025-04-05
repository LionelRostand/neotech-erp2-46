
import { useState, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { RecruitmentPost } from '@/hooks/useRecruitmentData';
import { COLLECTIONS } from '@/lib/firebase-collections';

export const useRecruitmentFirebaseData = () => {
  const [recruitmentPosts, setRecruitmentPosts] = useState<RecruitmentPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log('Fetching recruitment data from Firebase...');
    try {
      const collectionRef = collection(db, COLLECTIONS.HR.RECRUITMENT);
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
      
      return () => {
        console.log('Unsubscribing from recruitment collection');
        unsubscribe();
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      console.error('Error setting up recruitment listener:', error);
      setError(error);
      setIsLoading(false);
    }
  }, []);

  return {
    recruitmentPosts,
    isLoading,
    error
  };
};
