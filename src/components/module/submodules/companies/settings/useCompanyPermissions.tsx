
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { CompanyPermission, CompanyUserPermission } from '../types';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';

interface User {
  id: string;
  displayName: string;
  email: string;
  role?: string;
}

export const useCompanyPermissions = (companySubmodules: { id: string; name: string }[]) => {
  const [users, setUsers] = useState<User[]>([]);
  const [userPermissions, setUserPermissions] = useState<CompanyUserPermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const usersFirestore = useFirestore(COLLECTIONS.USERS);
  const permissionsFirestore = useFirestore(COLLECTIONS.USER_PERMISSIONS);

  // Fetch users and their permissions
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch users
        const usersData = await usersFirestore.getAll() as User[];
        setUsers(usersData);

        // Fetch permissions
        const permissionsData = await permissionsFirestore.getAll();
        
        // Fix: Convert the fetched data to CompanyUserPermission[] type
        const typedPermissionsData: CompanyUserPermission[] = [];
        
        // If we have data, try to map it to the correct type
        if (permissionsData && permissionsData.length > 0) {
          for (const item of permissionsData) {
            // Check if the item has the required structure and properly map id to userId
            if (item && typeof item === 'object' && 'id' in item && 'permissions' in item) {
              // Verify that permissions is an array
              const permissions = Array.isArray(item.permissions) 
                ? item.permissions 
                : [];
              
              // Make sure each permission has the correct structure
              const validPermissions: CompanyPermission[] = permissions
                .filter((p: any) => p && typeof p === 'object' && 'moduleId' in p)
                .map((p: any) => ({
                  moduleId: p.moduleId,
                  canView: Boolean(p.canView),
                  canCreate: Boolean(p.canCreate),
                  canEdit: Boolean(p.canEdit),
                  canDelete: Boolean(p.canDelete)
                }));
                
              // Create a properly typed CompanyUserPermission using id as userId
              typedPermissionsData.push({
                userId: item.id as string,
                permissions: validPermissions
              });
            }
          }
        }

        // If no permissions found or they don't have the right structure, create default permissions for each user
        if (typedPermissionsData.length === 0) {
          const defaultPermissions: CompanyUserPermission[] = usersData.map(user => ({
            userId: user.id,
            permissions: companySubmodules.map(submodule => ({
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
        console.error("Error fetching data:", error);
        toast.error("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update permission state
  const updatePermission = (userId: string, moduleId: string, permissionType: keyof Omit<CompanyPermission, 'moduleId'>, value: boolean) => {
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

  // Set all permissions of a type for a user
  const setAllPermissionsOfType = (userId: string, permissionType: keyof Omit<CompanyPermission, 'moduleId'>, value: boolean) => {
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

  // Save permissions to database
  const savePermissions = async () => {
    setSaving(true);
    try {
      // For each user, update or create their permissions
      for (const userPerm of userPermissions) {
        await permissionsFirestore.set(userPerm.userId, {
          permissions: userPerm.permissions,
          updatedAt: new Date()
        });
      }
      toast.success("Permissions enregistrées avec succès");
    } catch (error) {
      console.error("Error saving permissions:", error);
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
