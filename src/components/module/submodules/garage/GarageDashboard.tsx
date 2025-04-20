
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGarageData } from '@/hooks/garage/useGarageData';
import TodaysAppointments from './dashboard/TodaysAppointments';
import UnpaidInvoices from './dashboard/UnpaidInvoices';
import LowStockItems from './dashboard/LowStockItems';
import { Car, CalendarCheck, Receipt, ShoppingCart } from 'lucide-react';
import StatCard from '@/components/StatCard';

const GarageDashboard = () => {
  const { vehicles, appointments, repairs, invoices, inventory, isLoading } = useGarageData();
  
  const todaysAppointments = appointments.filter(a => {
    const today = new Date().toISOString().split('T')[0];
    return a.date === today;
  });

  const unpaidInvoices = invoices.filter(invoice => invoice.status === 'overdue' || invoice.status === 'sent');
  const lowStockItems = inventory.filter(item => item.status === 'low_stock' || item.quantity <= item.minQuantity);
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Véhicules actifs"
          value={vehicles.filter(v => v.status === 'active').length.toString()}
          icon={<Car className="h-4 w-4" />}
          description="En maintenance active"
        />
        <StatCard
          title="Rendez-vous aujourd'hui"
          value={todaysAppointments.length.toString()}
          icon={<CalendarCheck className="h-4 w-4" />}
          description="Planifiés pour aujourd'hui"
        />
        <StatCard
          title="Factures impayées"
          value={unpaidInvoices.length.toString()}
          icon={<Receipt className="h-4 w-4" />}
          description="En attente de paiement"
        />
        <StatCard
          title="Articles en stock faible"
          value={lowStockItems.length.toString()}
          icon={<ShoppingCart className="h-4 w-4" />}
          description="Nécessitent réapprovisionnement"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Rendez-vous du jour</CardTitle>
          </CardHeader>
          <CardContent>
            <TodaysAppointments />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Factures impayées</CardTitle>
          </CardHeader>
          <CardContent>
            <UnpaidInvoices />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stock faible</CardTitle>
          </CardHeader>
          <CardContent>
            <LowStockItems />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GarageDashboard;
