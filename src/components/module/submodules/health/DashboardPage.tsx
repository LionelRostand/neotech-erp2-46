
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Activity, 
  Users, 
  Calendar, 
  BedDouble, 
  CreditCard 
} from 'lucide-react';
import StatsCard from './components/StatsCard';
import PatientsChart from './components/PatientsChart';
import AppointmentsTable from './components/AppointmentsTable';

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Tableau de bord médical</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Patients" 
          value="2,543" 
          change="+12.5%" 
          icon={<Users className="h-8 w-8 text-blue-500" />} 
        />
        <StatsCard 
          title="Rendez-vous" 
          value="87" 
          change="+3.2%" 
          icon={<Calendar className="h-8 w-8 text-green-500" />} 
        />
        <StatsCard 
          title="Occupation" 
          value="76%" 
          change="-2.1%" 
          icon={<BedDouble className="h-8 w-8 text-purple-500" />} 
        />
        <StatsCard 
          title="Facturation" 
          value="32,450 €" 
          change="+8.9%" 
          icon={<CreditCard className="h-8 w-8 text-amber-500" />} 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Activité médicale</CardTitle>
          </CardHeader>
          <CardContent>
            <PatientsChart />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Prochains rendez-vous</CardTitle>
          </CardHeader>
          <CardContent>
            <AppointmentsTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
