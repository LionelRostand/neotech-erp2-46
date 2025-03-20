
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { AccountingPermission, AccountingUserPermission } from '../../../projects/types/project-types';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';

interface User {
  id: string;
  displayName: string;
  email: string;
  role?: string;
}

export const useAccountingPermissions = (accountingSubmodules: { id: string; name: string }[]) => {
  const [users, setUsers] = useState<User[]>([]);
  const [userPermissions, setUserPermissions] = useState<AccountingUserPermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const usersFirestore = useFirestore(COLLECTIONS.USERS);
  const permissionsFirestore = useFirestore(COLLECTIONS.ACCOUNTING_PERMISSIONS);

  // Récupérer les utilisateurs et leurs permissions
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Récupérer les utilisateurs
        const usersData = await usersFirestore.getAll() as User[];
        setUsers(usersData);

        // Récupérer les permissions
        const permissionsData = await permissionsFirestore.getAll();
        
        // Convertir les données récupérées au type AccountingUserPermission[]
        const typedPermissionsData: AccountingUserPermission[] = [];
        
        // Si nous avons des données, essayer de les mapper au type correct
        if (permissionsData && permissionsData.length > 0) {
          for (const item of permissionsData) {
            // Vérifier si l'élément a la structure requise et mapper correctement id à userId
            if (item && typeof item === 'object' && 'id' in item && 'permissions' in item) {
              // Vérifier que permissions est un tableau
              const permissions = Array.isArray(item.permissions) 
                ? item.permissions 
                : [];
              
              // S'assurer que chaque permission a la structure correcte
              const validPermissions: AccountingPermission[] = permissions
                .filter((p: any) => p && typeof p === 'object' && 'moduleId' in p)
                .map((p: any) => ({
                  moduleId: p.moduleId,
                  canView: Boolean(p.canView),
                  canCreate: Boolean(p.canCreate),
                  canEdit: Boolean(p.canEdit),
                  canDelete: Boolean(p.canDelete)
                }));
                
              // Créer une AccountingUserPermission correctement typée en utilisant id comme userId
              typedPermissionsData.push({
                userId: item.id as string,
                permissions: validPermissions
              });
            }
          }
        }

        // Si aucune permission trouvée ou si elles n'ont pas la bonne structure, créer des permissions par défaut pour chaque utilisateur
        if (typedPermissionsData.length === 0) {
          const defaultPermissions: AccountingUserPermission[] = usersData.map(user => ({
            userId: user.id,
            permissions: accountingSubmodules.map(submodule => ({
              moduleId: submodule.id,
              canView: true,
              canCreate: false,
              canEdit: false,
              canDelete: false,
            })),
          }));
          setUserPermissions(defaultPermissions);
        } else {
          setUserPermissions(typedPermissionsData);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        toast.error("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Mettre à jour l'état des permissions
  const updatePermission = (userId: string, moduleId: string, permissionType: keyof Omit<AccountingPermission, 'moduleId'>, value: boolean) => {
    setUserPermissions(prev => {
      return prev.map(userPerm => {
        if (userPerm.userId === userId) {
          const updatedPermissions = userPerm.permissions.map(perm => {
            if (perm.moduleId === moduleId) {
              return { ...perm, [permissionType]: value };
            }
            return perm;
          });
          return { ...userPerm, permissions: updatedPermissions };
        }
        return userPerm;
      });
    });
  };

  // Définir toutes les permissions d'un type pour un utilisateur
  const setAllPermissionsOfType = (userId: string, permissionType: keyof Omit<AccountingPermission, 'moduleId'>, value: boolean) => {
    setUserPermissions(prev => {
      return prev.map(userPerm => {
        if (userPerm.userId === userId) {
          const updatedPermissions = userPerm.permissions.map(perm => ({
            ...perm,
            [permissionType]: value
          }));
          return { ...userPerm, permissions: updatedPermissions };
        }
        return userPerm;
      });
    });
  };

  // Enregistrer les permissions dans la base de données
  const savePermissions = async () => {
    setSaving(true);
    try {
      // Pour chaque utilisateur, mettre à jour ou créer ses permissions
      for (const userPerm of userPermissions) {
        await permissionsFirestore.set(userPerm.userId, {
          permissions: userPerm.permissions,
          updatedAt: new Date()
        });
      }
      toast.success("Permissions enregistrées avec succès");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des permissions:", error);
      toast.error("Erreur lors de l'enregistrement des permissions");
    } finally {
      setSaving(false);
    }
  };

  return {
    users,
    userPermissions,
    loading,
    saving,
    searchTerm,
    setSearchTerm,
    updatePermission,
    setAllPermissionsOfType,
    savePermissions
  };
};
