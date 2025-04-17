
import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { RecruitmentPost } from '@/types/recruitment';

/**
 * Hook to fetch recruitment post data from Firebase
 */
export const useRecruitmentFirebaseData = () => {
  const [recruitmentPosts, setRecruitmentPosts] = useState<RecruitmentPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Make sure we have a valid collection path
    if (!COLLECTIONS.HR.RECRUITMENT) {
      console.error('Invalid collection path: COLLECTIONS.HR.RECRUITMENT is undefined or empty');
      setError(new Error('Configuration error: Invalid collection path'));
      setLoading(false);
      return;
    }
    
    const recruitmentRef = collection(db, COLLECTIONS.HR.RECRUITMENT);
    const q = query(recruitmentRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const posts: RecruitmentPost[] = [];
        snapshot.forEach((doc) => {
          posts.push({
            id: doc.id,
            ...doc.data()
          } as RecruitmentPost);
        });
        setRecruitmentPosts(posts);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching recruitment posts:', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { recruitmentPosts, loading, error };
};

export default useRecruitmentFirebaseData;
