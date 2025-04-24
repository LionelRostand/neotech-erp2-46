
import React, { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { usePermissions } from '@/hooks/usePermissions';
import { Loader2 } from 'lucide-react';

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
  const { loading, isAdmin, checkPermission } = usePermissions();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      if (isAdmin) {
        setHasAccess(true);
        return;
      }

      if (moduleId) {
        // Check permission
        const result = await checkPermission(moduleId, requiredPermission);
        setHasAccess(result);
      }
    };

    if (!loading) {
      checkAccess();
    }
  }, [moduleId, requiredPermission, loading, isAdmin, checkPermission]);

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
