
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Package, ChevronRight, UserCheck, Building, TrendingUp, Users } from 'lucide-react';
import StatCard from '@/components/StatCard';
import { modules } from '@/data/modules';

const WelcomePage = () => {
  const { user } = useAuth();
  const [installedModules, setInstalledModules] = useState<number[]>([]);
  
  useEffect(() => {
    // Charger les modules installés depuis le localStorage
    const savedModules = localStorage.getItem('installedModules');
    if (savedModules) {
      setInstalledModules(JSON.parse(savedModules));
    }
  }, []);
  
  const handleInstallFirst = () => {
    // Simuler l'installation du premier module (Finance - ID 1)
    const updatedModules = [...installedModules, 1];
    localStorage.setItem('installedModules', JSON.stringify(updatedModules));
    setInstalledModules(updatedModules);
    
    toast.success('Module Finance installé avec succès');
  };
  
  const handleBrowseApplications = () => {
    // Déclencher un événement personnalisé pour mettre en évidence la section des applications dans la barre latérale
    window.dispatchEvent(new CustomEvent('focusInstalledApps'));
    
    // Rediriger vers la page des applications
    window.location.href = '/applications';
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Bienvenue, {user?.firstName}!</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Votre compte" 
            value="Actif" 
            icon={<UserCheck size={18} className="text-green-500" />} 
            description={<span>Connecté en tant que <strong>{user?.role}</strong></span>}
          />
          <StatCard 
            title="Entreprise" 
            value="NEOTECH" 
            icon={<Building size={18} className="text-blue-500" />} 
            description="Licence Entreprise"
          />
          <StatCard 
            title="Modules installés" 
            value={installedModules.length.toString()} 
            icon={<Package size={18} className="text-purple-500" />} 
            description={`Sur ${modules.length} disponibles`}
          />
          <StatCard 
            title="Utilisateurs" 
            value="2" 
            icon={<Users size={18} className="text-orange-500" />} 
            description="Accès administrateur"
          />
        </div>
        
        {installedModules.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Commencez avec NEOTECH-ERP</CardTitle>
              <CardDescription>
                Installez votre premier module pour commencer à travailler
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Votre système NEOTECH-ERP est prêt à l'emploi. Pour commencer, nous vous recommandons 
                d'installer le module Finance, qui inclut les fonctionnalités essentielles de comptabilité 
                et de facturation.
              </p>
              <div className="flex gap-3">
                <Button onClick={handleInstallFirst}>
                  Installer le module Finance
                </Button>
                <Button variant="outline" onClick={handleBrowseApplications}>
                  Parcourir tous les modules
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Votre ERP est configuré</CardTitle>
              <CardDescription>
                Continuez à personnaliser votre système avec plus de modules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Vous avez installé {installedModules.length} module(s). Vous pouvez continuer à explorer 
                notre catalogue pour découvrir des fonctionnalités supplémentaires adaptées à vos besoins.
              </p>
              <Button onClick={handleBrowseApplications}>
                Gérer mes applications
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default WelcomePage;
