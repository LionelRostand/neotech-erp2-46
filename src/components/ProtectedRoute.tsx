
import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { usePermissions } from '@/hooks/usePermissions';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  moduleId?: string;
  requiredPermission?: 'view' | 'create' | 'edit' | 'delete';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  moduleId, 
  requiredPermission = 'view' 
}) => {
  const params = useParams();
  const { loading, isAdmin, checkPermission, hasPermission } = usePermissions(moduleId);
  const { userData } = useAuth();
  const [hasAccess, setHasAccess] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const checkAccess = async () => {
      // If user is admin by role or email, grant access
      if (isAdmin || userData?.email === 'admin@neotech-consulting.com') {
        setHasAccess(true);
        return;
      }

      if (moduleId) {
        // Si la permission est déjà en cache
        if (hasPermission[`${moduleId}.${requiredPermission}`] !== undefined) {
          setHasAccess(hasPermission[`${moduleId}.${requiredPermission}`]);
          return;
        }

        // Sinon on la vérifie
        const result = await checkPermission(moduleId, requiredPermission);
        setHasAccess(result);
      }
    };

    if (!loading) {
      checkAccess();
    }
  }, [moduleId, requiredPermission, loading, isAdmin, checkPermission, hasPermission, userData?.email]);

  if (loading || hasAccess === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasAccess) {
    // Redirection vers la page d'accès refusé
    return <Navigate to="/access-denied" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
