
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
            // Format dates if they exist in timestamp format
            const formattedData: any = { ...data };
            
            // Ensure all required fields are present
            return {
              id: doc.id,
              position: data.position || "Position non spécifiée",
              department: data.department || "Département non spécifié",
              location: data.location || "Localisation non spécifiée",
              status: data.status || "Open",
              priority: data.priority || "Medium",
              description: data.description || "",
              requirements: Array.isArray(data.requirements) ? data.requirements : [],
              responsibilities: Array.isArray(data.responsibilities) ? data.responsibilities : [],
              posting_date: data.posting_date || new Date().toISOString(),
              hiring_manager: data.hiring_manager || "",
              contact_email: data.contact_email || "",
              created_at: data.created_at || new Date().toISOString(),
              updated_at: data.updated_at || new Date().toISOString(),
              
              // Additional fields required by components
              openDate: data.openDate || data.posting_date || new Date().toISOString(),
              hiringManagerId: data.hiringManagerId || "",
              hiringManagerName: data.hiringManagerName || data.hiring_manager || "Non spécifié", 
              contractType: data.contractType || "Non spécifié",
              applicationDeadline: data.applicationDeadline || data.closing_date,
              applicationCount: data.applicationCount || data.applications_count || 0,
              salary: data.salary,
              requirements_text: data.requirements_text || "",
              ...formattedData
            };
          }) as RecruitmentPost[];
          
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
