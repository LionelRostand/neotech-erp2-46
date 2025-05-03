
import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { RecruitmentPost } from '@/types/recruitment';
import { toast } from 'sonner';

export const useRecruitmentFirebaseData = () => {
  const [recruitmentPosts, setRecruitmentPosts] = useState<RecruitmentPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Create a reference to the recruitment posts collection
      const recruitmentCollectionRef = collection(db, COLLECTIONS.HR.RECRUITMENT);
      
      // Create a query to order by creation date (newest first)
      const q = query(recruitmentCollectionRef, orderBy('createdAt', 'desc'));
      
      // Get the documents
      const querySnapshot = await getDocs(q);
      
      // Transform the data
      const posts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as RecruitmentPost));

      console.log('Retrieved recruitment posts:', posts.length);
      
      // Update state with the retrieved data
      setRecruitmentPosts(posts);
    } catch (err) {
      console.error('Error fetching recruitment data:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch recruitment data'));
      toast.error('Erreur lors du chargement des données de recrutement');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Calculate stats for the recruitment dashboard
  const stats = {
    openPositions: recruitmentPosts.filter(post => post.status === 'Ouverte').length,
    inProgressPositions: recruitmentPosts.filter(post => post.status === 'En cours').length,
    interviewsPositions: recruitmentPosts.filter(post => post.status === 'Entretiens').length,
    closedPositions: recruitmentPosts.filter(post => post.status === 'Fermée').length,
    applicationsThisMonth: 0, // This would require additional data processing
    interviewsScheduled: 0, // This would require additional data processing
  };

  return {
    recruitmentPosts,
    isLoading,
    error,
    stats,
    refetch: fetchData
  };
};
