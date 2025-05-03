
import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { RecruitmentPost } from '@/types/recruitment';

// Get all recruitment posts
export const getRecruitmentPosts = async (): Promise<RecruitmentPost[]> => {
  try {
    const recruitmentCollectionRef = collection(db, COLLECTIONS.HR.RECRUITMENT);
    const querySnapshot = await getDocs(recruitmentCollectionRef);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as RecruitmentPost));
  } catch (error) {
    console.error("Error fetching recruitment posts:", error);
    throw error;
  }
};

// Get a specific recruitment post by ID
export const getRecruitmentPost = async (id: string): Promise<RecruitmentPost | null> => {
  try {
    const recruitmentRef = doc(db, COLLECTIONS.HR.RECRUITMENT, id);
    const docSnap = await getDoc(recruitmentRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as RecruitmentPost;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching recruitment post with ID ${id}:`, error);
    throw error;
  }
};

// Update the status of a recruitment post
export const updateRecruitmentStatus = async (id: string, status: string): Promise<void> => {
  try {
    const recruitmentRef = doc(db, COLLECTIONS.HR.RECRUITMENT, id);
    
    await updateDoc(recruitmentRef, { 
      status,
      updatedAt: new Date()
    });
    
    console.log(`Updated recruitment post ${id} status to ${status}`);
  } catch (error) {
    console.error(`Error updating recruitment post status:`, error);
    throw error;
  }
};

// Update a recruitment post
export const updateRecruitment = async (id: string, data: Partial<RecruitmentPost>): Promise<void> => {
  try {
    const recruitmentRef = doc(db, COLLECTIONS.HR.RECRUITMENT, id);
    
    await updateDoc(recruitmentRef, { 
      ...data,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error(`Error updating recruitment post:`, error);
    throw error;
  }
};
