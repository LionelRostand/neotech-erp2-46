
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import DataTable from '@/components/DataTable';
import { LineChart, ShoppingBag, Users, Package, ArrowUp, ShoppingCart } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const { stats, transactions, loading } = useDashboardData();
  const [installedModules, setInstalledModules] = useState<number[]>([]);

  useEffect(() => {
    const loadInstalledModules = () => {
      const savedModules = localStorage.getItem('installedModules');
      if (savedModules) {
        setInstalledModules(JSON.parse(savedModules));
      }
    };
    
    loadInstalledModules();
    
    window.addEventListener('modulesChanged', loadInstalledModules);
    return () => {
      window.removeEventListener('modulesChanged', loadInstalledModules);
    };
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
        <p className="text-gray-500">Bienvenue sur votre espace NEOTECH-ERP</p>
        {installedModules.length === 0 && (
          <p className="text-sm mt-2 text-amber-600">
            Aucun module n'est installé. Rendez-vous dans "Gérer les applications" pour installer des modules.
          </p>
        )}
      </div>

      {installedModules.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {loading ? (
              <>
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
              </>
            ) : (
              <>
                <StatCard 
                  title="Chiffre d'affaires" 
                  value={`€${stats.revenue.toLocaleString()}`} 
                  icon={<LineChart className="text-primary" size={20} />} 
                  description="+12% par rapport au mois dernier"
                />
                <StatCard 
                  title="Commandes" 
                  value={stats.orders.toString()} 
                  icon={<ShoppingBag className="text-primary" size={20} />} 
                  description="+8% par rapport au mois dernier"
                />
                <StatCard 
                  title="Clients" 
                  value={stats.clients.toString()} 
                  icon={<Users className="text-primary" size={20} />} 
                  description="120 nouveaux ce mois-ci"
                />
                <StatCard 
                  title="Produits" 
                  value={stats.products.toString()} 
                  icon={<Package className="text-primary" size={20} />} 
                  description="45 ajoutés ce mois-ci"
                />
              </>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Ventes mensuelles</h2>
                <div className="text-xs font-medium text-green-500 bg-green-50 px-2 py-1 rounded-full flex items-center">
                  <ArrowUp size={12} className="mr-1" />
                  +12.5%
                </div>
              </div>
              <div className="aspect-[16/9] flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <ShoppingCart size={32} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-500 text-sm">Graphique des ventes mensuelles</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Stock par catégorie</h2>
                <div className="text-xs font-medium text-blue-500 bg-blue-50 px-2 py-1 rounded-full">
                  8 catégories
                </div>
              </div>
              <div className="aspect-[16/9] flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <Package size={32} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-500 text-sm">Graphique du stock par catégorie</p>
                </div>
              </div>
            </div>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <DataTable 
              title="Dernières transactions"
              data={loading ? [] : transactions}
              loading={loading}
            />
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Aucun module installé</h3>
          <p className="mt-2 text-sm text-gray-500">
            Commencez par installer des modules depuis la section "Gérer les applications"
          </p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Index;
