
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

export interface GarageUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
}

export const useGarageUsers = () => {
  const [users, setUsers] = useState<GarageUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Récupérer tous les utilisateurs
        const usersRef = collection(db, COLLECTIONS.USERS);
        const snapshot = await getDocs(usersRef);
        
        // Convertir les données des documents
        const usersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          firstName: doc.data().firstName || '',
          lastName: doc.data().lastName || '',
          email: doc.data().email || '',
          role: doc.data().role || 'Utilisateur'
        })) as GarageUser[];
        
        setUsers(usersData);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
        toast.error("Erreur lors du chargement des utilisateurs");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading };
};
