
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

// Structure représentant les permissions pour un sous-module du garage
export interface SubmodulePermission {
  id: string;          // ID du sous-module (ex: "garage-clients")
  name: string;        // Nom du sous-module (ex: "Clients")
  permissions: {
    view: boolean;     // Permission de voir
    create: boolean;   // Permission de créer
    edit: boolean;     // Permission de modifier
    delete: boolean;   // Permission de supprimer
  };
}

// Structure représentant les permissions d'un utilisateur
export interface UserGaragePermissions {
  userId: string;
  submodules: SubmodulePermission[];
}

export const GARAGE_SUBMODULES = [
  { id: "garage-clients", name: "Clients" },
  { id: "garage-vehicles", name: "Véhicules" },
  { id: "garage-appointments", name: "Rendez-vous" },
  { id: "garage-repairs", name: "Réparations" },
  { id: "garage-invoices", name: "Factures" },
  { id: "garage-suppliers", name: "Fournisseurs" },
  { id: "garage-inventory", name: "Inventaire" },
  { id: "garage-loyalty", name: "Programme de fidélité" }
];

export const useGaragePermissionsManager = () => {
  const [permissions, setPermissions] = useState<UserGaragePermissions[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Charger toutes les permissions
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setLoading(true);
        // Accéder à la collection des permissions du garage
        const permissionsRef = collection(db, 'garage_permissions');
        const snapshot = await getDocs(permissionsRef);
        
        if (snapshot.empty) {
          console.log('Aucune permission trouvée');
          setPermissions([]);
          return;
        }
        
        // Transformer les documents en objets UserGaragePermissions
        const userPermissions = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            userId: doc.id,
            submodules: GARAGE_SUBMODULES.map(submodule => {
              const submoduleData = data.submodules?.find(
                (s: any) => s.id === submodule.id
              );
              
              return {
                id: submodule.id,
                name: submodule.name,
                permissions: submoduleData?.permissions || {
                  view: false,
                  create: false,
                  edit: false,
                  delete: false
                }
              };
            })
          };
        });
        
        setPermissions(userPermissions);
      } catch (error) {
        console.error('Erreur lors du chargement des permissions:', error);
        toast.error('Erreur lors du chargement des permissions');
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  // Récupérer les permissions d'un utilisateur spécifique
  const getUserPermissions = (userId: string): SubmodulePermission[] => {
    const userPermissions = permissions.find(p => p.userId === userId);
    
    if (!userPermissions) {
      // Retourner des permissions par défaut si l'utilisateur n'en a pas encore
      return GARAGE_SUBMODULES.map(submodule => ({
        id: submodule.id,
        name: submodule.name,
        permissions: {
          view: false,
          create: false,
          edit: false,
          delete: false
        }
      }));
    }
    
    return userPermissions.submodules;
  };

  // Mettre à jour la permission d'un utilisateur pour un sous-module spécifique
  const updatePermission = (
    userId: string,
    submoduleId: string,
    permissionType: 'view' | 'create' | 'edit' | 'delete',
    value: boolean
  ) => {
    setPermissions(prevPermissions => {
      // Chercher si l'utilisateur a déjà des permissions
      const userIndex = prevPermissions.findIndex(p => p.userId === userId);
      
      if (userIndex === -1) {
        // Créer de nouvelles permissions pour cet utilisateur
        const newUserPermissions: UserGaragePermissions = {
          userId,
          submodules: GARAGE_SUBMODULES.map(submodule => ({
            id: submodule.id,
            name: submodule.name,
            permissions: {
              view: submodule.id === submoduleId && permissionType === 'view' ? value : false,
              create: submodule.id === submoduleId && permissionType === 'create' ? value : false,
              edit: submodule.id === submoduleId && permissionType === 'edit' ? value : false,
              delete: submodule.id === submoduleId && permissionType === 'delete' ? value : false
            }
          }))
        };
        
        return [...prevPermissions, newUserPermissions];
      } else {
        // Mettre à jour les permissions existantes
        return prevPermissions.map(userPerm => {
          if (userPerm.userId !== userId) return userPerm;
          
          return {
            ...userPerm,
            submodules: userPerm.submodules.map(submodule => {
              if (submodule.id !== submoduleId) return submodule;
              
              return {
                ...submodule,
                permissions: {
                  ...submodule.permissions,
                  [permissionType]: value
                }
              };
            })
          };
        });
      }
    });
  };

  // Sauvegarder toutes les permissions dans Firestore
  const saveAllPermissions = async () => {
    try {
      setSaving(true);
      
      // Sauvegarder chaque ensemble de permissions d'utilisateur
      await Promise.all(permissions.map(async (userPermission) => {
        const userPermissionRef = doc(db, 'garage_permissions', userPermission.userId);
        await setDoc(userPermissionRef, {
          submodules: userPermission.submodules
        }, { merge: true });
      }));
      
      toast.success('Permissions sauvegardées avec succès');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des permissions:', error);
      toast.error('Erreur lors de la sauvegarde des permissions');
    } finally {
      setSaving(false);
    }
  };

  return {
    permissions,
    loading,
    saving,
    getUserPermissions,
    updatePermission,
    saveAllPermissions
  };
};
