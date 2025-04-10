
import { useState, useEffect } from 'react';
import { collection, query, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

// Définir les types pour les objets de permission
export interface EmployeePermission {
  id: string;
  employeeId: string;
  module: string;
  read: boolean;
  write: boolean;
  delete: boolean;
  admin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const useEmployeesPermissions = () => {
  const [permissions, setPermissions] = useState<EmployeePermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Charger les permissions depuis Firestore
  useEffect(() => {
    const fetchPermissions = async () => {
      setLoading(true);
      try {
        // Utiliser le chemin direct à la collection
        const permissionsRef = collection(db, 'user_permissions');
        const q = query(permissionsRef);
        
        // Configurer un abonnement en temps réel
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const permissionsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
            updatedAt: doc.data().updatedAt?.toDate() || new Date()
          })) as EmployeePermission[];
          
          setPermissions(permissionsData);
          setLoading(false);
        }, (err) => {
          console.error("Error fetching permissions:", err);
          setError(err);
          setLoading(false);
          toast({
            title: "Erreur",
            description: "Impossible de charger les permissions des employés.",
            variant: "destructive",
          });
        });
        
        return unsubscribe;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Une erreur inconnue est survenue');
        console.error("Error setting up permissions listener:", error);
        setError(error);
        setLoading(false);
        return () => {};
      }
    };
    
    fetchPermissions();
  }, [toast]);

  // Ajouter une nouvelle permission
  const addPermission = async (permission: Omit<EmployeePermission, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Utiliser le chemin direct à la collection
      const permissionsRef = collection(db, 'user_permissions');
      
      const newPermission = {
        ...permission,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const docRef = await addDoc(permissionsRef, newPermission);
      
      toast({
        title: "Succès",
        description: "La permission a été ajoutée avec succès.",
      });
      
      return { id: docRef.id, ...newPermission };
    } catch (err) {
      console.error("Error adding permission:", err);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la permission.",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Mettre à jour une permission existante
  const updatePermission = async (id: string, updates: Partial<EmployeePermission>) => {
    try {
      // Utiliser le chemin direct au document
      const permissionRef = doc(db, 'user_permissions', id);
      
      await updateDoc(permissionRef, {
        ...updates,
        updatedAt: new Date()
      });
      
      toast({
        title: "Succès",
        description: "La permission a été mise à jour avec succès.",
      });
      
      return true;
    } catch (err) {
      console.error("Error updating permission:", err);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la permission.",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Supprimer une permission
  const deletePermission = async (id: string) => {
    try {
      // Utiliser le chemin direct au document
      const permissionRef = doc(db, 'user_permissions', id);
      
      await deleteDoc(permissionRef);
      
      toast({
        title: "Succès",
        description: "La permission a été supprimée avec succès.",
      });
      
      return true;
    } catch (err) {
      console.error("Error deleting permission:", err);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la permission.",
        variant: "destructive",
      });
      throw err;
    }
  };

  return {
    permissions,
    loading,
    error,
    addPermission,
    updatePermission,
    deletePermission
  };
};
