
import { useState, useEffect } from 'react';
import { getUserPermissions, checkUserPermission, ModulePermissions } from '@/components/module/submodules/employees/services/permissionService';
import { useAuth } from './useAuth';

export const usePermissions = (moduleId?: string) => {
  const { currentUser, isOffline, isAdmin: authIsAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState<{[key: string]: ModulePermissions} | null>(null);
  const [hasPermission, setHasPermission] = useState<{[key: string]: boolean}>({});
  const [isAdmin, setIsAdmin] = useState(authIsAdmin);

  useEffect(() => {
    // Update isAdmin when authIsAdmin changes
    setIsAdmin(authIsAdmin);
  }, [authIsAdmin]);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!currentUser?.uid) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userPermissions = await getUserPermissions(currentUser.uid);
        
        if (userPermissions) {
          setPermissions(userPermissions.permissions);
          // Use both the permissions isAdmin flag and the auth isAdmin flag
          setIsAdmin(authIsAdmin || !!userPermissions.isAdmin);
        } else {
          setPermissions(null);
          // Still use the auth isAdmin flag if permissions couldn't be loaded
          setIsAdmin(authIsAdmin);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des permissions:', error);
        setPermissions(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [currentUser?.uid, authIsAdmin]);

  const checkPermission = async (module: string, action: 'view' | 'create' | 'edit' | 'delete' | 'export' | 'modify') => {
    if (!currentUser?.uid) return false;
    
    if (isAdmin) {
      return true; // Admin has all permissions
    }
    
    if (isOffline) {
      console.log('Mode hors ligne: utilisation des permissions en cache');
      // En mode hors ligne, on utilise les permissions déjà chargées
      return !!permissions?.[module]?.[action];
    }

    try {
      const hasAccess = await checkUserPermission(currentUser.uid, module, action);
      setHasPermission(prev => ({...prev, [`${module}.${action}`]: hasAccess}));
      return hasAccess;
    } catch (error) {
      console.error(`Erreur lors de la vérification de la permission ${module}.${action}:`, error);
      return false;
    }
  };

  // Vérifier si l'utilisateur peut accéder au module actuel
  useEffect(() => {
    if (moduleId && !loading && currentUser?.uid) {
      checkPermission(moduleId, 'view').then(hasAccess => {
        if (!hasAccess && !isAdmin) {
          console.warn(`L'utilisateur n'a pas accès au module ${moduleId}`);
          // On pourrait rediriger l'utilisateur ou afficher un message
        }
      });
    }
  }, [moduleId, loading, currentUser?.uid, isAdmin]);

  return {
    permissions,
    isAdmin,
    loading,
    checkPermission,
    hasPermission,
    isOffline // Add isOffline to the return object
  };
};
