
import React, { useState, useEffect } from 'react';
import DashboardHeader from './dashboard/DashboardHeader';
import MetricsCards from './dashboard/MetricsCards';
import ActivitySection from './dashboard/ActivitySection';
import RecentItemsSection from './dashboard/RecentItemsSection';
import DashboardSkeleton from './dashboard/DashboardSkeleton';
import { useDashboardData } from './dashboard/useDashboardData';
import { AlertTriangle, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { restoreFirestoreConnectivity } from '@/hooks/firestore/network-operations';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

const CompaniesDashboard: React.FC = () => {
  const { metrics, loading, error } = useDashboardData();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const { currentUser, userData, loading: authLoading } = useAuth();
  
  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      toast.success("Connexion internet rétablie");
    };
    
    const handleOffline = () => {
      setIsOffline(true);
      toast.warning("Connexion internet perdue. Mode hors-ligne activé");
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  const handleReconnect = async () => {
    setIsReconnecting(true);
    try {
      const success = await restoreFirestoreConnectivity();
      if (success) {
        toast.success("Connexion à la base de données rétablie");
      } else {
        toast.error("Échec de reconnexion à la base de données");
      }
    } catch (err) {
      console.error("Erreur de reconnexion:", err);
      toast.error("Erreur lors de la tentative de reconnexion");
    } finally {
      setIsReconnecting(false);
    }
  };
  
  // Show network status banner if offline
  const renderNetworkStatus = () => {
    if (isOffline) {
      return (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <WifiOff className="h-5 w-5 text-amber-500" />
            </div>
            <div className="ml-3">
              <p className="text-amber-700">
                Vous êtes actuellement en mode hors-ligne. Certaines données peuvent ne pas être à jour.
              </p>
            </div>
            <div className="ml-auto">
              <Button 
                onClick={handleReconnect} 
                variant="outline" 
                size="sm"
                disabled={isReconnecting || !navigator.onLine}
              >
                {isReconnecting ? 'Reconnexion...' : 'Reconnecter'}
              </Button>
            </div>
          </div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-red-700">
                Erreur de connexion à la base de données. Certaines données peuvent ne pas être à jour.
              </p>
            </div>
            <div className="ml-auto">
              <Button 
                onClick={handleReconnect} 
                variant="outline" 
                size="sm"
                disabled={isReconnecting}
              >
                {isReconnecting ? 'Reconnexion...' : 'Réessayer'}
              </Button>
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  };
  
  if (loading || authLoading) {
    return <DashboardSkeleton />;
  }
  
  return (
    <div className="space-y-6">
      {renderNetworkStatus()}
      <DashboardHeader />
      
      <MetricsCards metrics={metrics} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ActivitySection />
        <RecentItemsSection />
      </div>
    </div>
  );
};

export default CompaniesDashboard;
