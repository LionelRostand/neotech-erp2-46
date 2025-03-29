
import { useState, useEffect } from 'react';
import { getUserPermissions, checkUserPermission, ModulePermissions } from '@/components/module/submodules/employees/services/permissionService';
import { useAuth } from './useAuth';

export const usePermissions = (moduleId?: string) => {
  const { user, isOffline } = useAuth();
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState<{[key: string]: ModulePermissions} | null>(null);
  const [hasPermission, setHasPermission] = useState<{[key: string]: boolean}>({});
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userPermissions = await getUserPermissions(user.uid);
        
        if (userPermissions) {
          setPermissions(userPermissions.permissions);
          setIsAdmin(!!userPermissions.isAdmin);
        } else {
          setPermissions(null);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des permissions:', error);
        setPermissions(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [user?.uid]);

  const checkPermission = async (module: string, action: 'view' | 'create' | 'edit' | 'delete' | 'export' | 'modify') => {
    if (!user?.uid) return false;
    
    if (isOffline) {
      console.log('Mode hors ligne: utilisation des permissions en cache');
      // En mode hors ligne, on utilise les permissions déjà chargées
      if (isAdmin) return true;
      return !!permissions?.[module]?.[action];
    }

    try {
      const hasAccess = await checkUserPermission(user.uid, module, action);
      setHasPermission(prev => ({...prev, [`${module}.${action}`]: hasAccess}));
      return hasAccess;
    } catch (error) {
      console.error(`Erreur lors de la vérification de la permission ${module}.${action}:`, error);
      return false;
    }
  };

  // Vérifier si l'utilisateur peut accéder au module actuel
  useEffect(() => {
    if (moduleId && !loading && user?.uid) {
      checkPermission(moduleId, 'view').then(hasAccess => {
        if (!hasAccess && !isAdmin) {
          console.warn(`L'utilisateur n'a pas accès au module ${moduleId}`);
          // On pourrait rediriger l'utilisateur ou afficher un message
        }
      });
    }
  }, [moduleId, loading, user?.uid, isAdmin]);

  return {
    permissions,
    isAdmin,
    loading,
    checkPermission,
    hasPermission
  };
};
