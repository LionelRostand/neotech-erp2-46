
import React from 'react';
import { Card } from '@/components/ui/card';
import EmployeesDashboardCards from './employees/dashboard/EmployeesDashboardCards';
import StatCard from '@/components/StatCard';
import { UsersIcon, Activity, ChartBar, CalendarClock } from 'lucide-react';
import { useEmployeeData } from '@/hooks/useEmployeeData';

const EmployeesDashboard: React.FC = () => {
  const { employees, departments, isLoading } = useEmployeeData();

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Tableau de bord RH</h1>
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 bg-gray-200 rounded-lg" />
            ))}
          </div>
          <div className="h-80 bg-gray-200 rounded-lg" />
        </div>
      </div>
    );
  }

  // Get today's date in French format
  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tableau de bord RH</h1>
      </div>

      {/* Stats Cards Section */}
      <EmployeesDashboardCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Recent Activity Section */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Activité Récente</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Activity className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Mise à jour de la structure organisationnelle</h3>
                <p className="text-sm text-gray-500">Aujourd'hui à {new Date().toLocaleTimeString('fr-FR')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <UsersIcon className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium">Nouvelles demandes de congés en attente</h3>
                <p className="text-sm text-gray-500">Hier</p>
              </div>
            </div>
          </div>
        </Card>

        {/* HR Calendar */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Calendrier RH</h2>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">Réunion d'équipe</h3>
                  <p className="text-sm text-gray-600">10:00 - 11:30</p>
                </div>
                <div className="bg-blue-100 p-1 rounded">
                  <CalendarClock className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">Entretiens d'embauche</h3>
                  <p className="text-sm text-gray-600">14:00 - 17:00</p>
                </div>
                <div className="bg-purple-100 p-1 rounded">
                  <UsersIcon className="h-4 w-4 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EmployeesDashboard;
