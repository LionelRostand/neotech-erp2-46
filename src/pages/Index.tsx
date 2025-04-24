
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import DataTable from '@/components/DataTable';
import { LineChart, ShoppingBag, Users, Package, ArrowUp, ShoppingCart } from 'lucide-react';

const Index = () => {
  const dummyTransactions = [
    { 
      id: '1234', 
      date: '15 Juin 2023', 
      client: 'Société ABC', 
      amount: '€2,500.00', 
      status: 'success', 
      statusText: 'Payée' 
    },
    { 
      id: '1235', 
      date: '14 Juin 2023', 
      client: 'Entreprise XYZ', 
      amount: '€1,890.50', 
      status: 'warning', 
      statusText: 'En attente' 
    },
    { 
      id: '1236', 
      date: '13 Juin 2023', 
      client: 'Groupe 123', 
      amount: '€3,200.00', 
      status: 'success', 
      statusText: 'Payée' 
    },
    { 
      id: '1237', 
      date: '12 Juin 2023', 
      client: 'Tech Solutions', 
      amount: '€650.75', 
      status: 'danger', 
      statusText: 'Annulée' 
    },
    { 
      id: '1238', 
      date: '11 Juin 2023', 
      client: 'Service Pro', 
      amount: '€1,450.00', 
      status: 'success', 
      statusText: 'Payée' 
    },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
        <p className="text-gray-500">Bienvenue sur votre espace NEOTECH-ERP</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Chiffre d'affaires" 
          value="€125,430" 
          icon={<LineChart className="text-primary" size={20} />} 
          description="+12% par rapport au mois dernier"
        />
        <StatCard 
          title="Commandes" 
          value="345" 
          icon={<ShoppingBag className="text-primary" size={20} />} 
          description="+8% par rapport au mois dernier"
        />
        <StatCard 
          title="Clients" 
          value="2,340" 
          icon={<Users className="text-primary" size={20} />} 
          description="120 nouveaux ce mois-ci"
        />
        <StatCard 
          title="Produits" 
          value="650" 
          icon={<Package className="text-primary" size={20} />} 
          description="45 ajoutés ce mois-ci"
        />
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
          data={dummyTransactions}
        />
      </div>
    </DashboardLayout>
  );
};

export default Index;
