
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGarageData } from '@/hooks/garage/useGarageData';
import TodaysAppointments from './dashboard/TodaysAppointments';
import UnpaidInvoices from './dashboard/UnpaidInvoices';
import LowStockItems from './dashboard/LowStockItems';
import { Car, Calendar, Wrench, Receipt, Users, Package, Truck, BadgePercent } from 'lucide-react';
import StatCard from '@/components/StatCard';

const GarageDashboard = () => {
  const { 
    vehicles, 
    appointments, 
    repairs, 
    invoices, 
    suppliers, 
    clients, 
    inventory, 
    loyalty, 
    isLoading 
  } = useGarageData();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  // Obtenir la date d'aujourd'hui au format ISO (YYYY-MM-DD)
  const today = new Date().toISOString().split('T')[0];

  // Filtrer les données pour obtenir des statistiques pertinentes
  const activeVehicles = vehicles.filter(v => v?.status === 'active' || v?.status === 'available');
  
  const todayAppointments = appointments.filter(a => {
    // Si la date est au format ISO, on peut comparer directement
    if (a?.date === today) return true;
    
    // Si la date est un timestamp ou une date complète, on vérifie juste le jour
    if (a?.date) {
      try {
        const appointmentDate = new Date(a.date);
        const todayDate = new Date();
        return (
          appointmentDate.getDate() === todayDate.getDate() &&
          appointmentDate.getMonth() === todayDate.getMonth() &&
          appointmentDate.getFullYear() === todayDate.getFullYear()
        );
      } catch (e) {
        return false;
      }
    }
    
    return false;
  });
  
  const ongoingRepairs = repairs.filter(r => 
    r?.status === 'in_progress' || 
    r?.status === 'ongoing' || 
    r?.status === 'started'
  );
  
  const unpaidInvoices = invoices.filter(i => 
    i?.status === 'unpaid' || 
    i?.status === 'overdue' || 
    i?.status === 'pending' || 
    i?.status === 'sent'
  );
  
  const activeClients = clients.filter(c => c?.status === 'active' || !c?.status);
  
  const lowStockItems = inventory.filter(item => {
    if (item?.status === 'low_stock') return true;
    if (item?.quantity !== undefined && item?.minQuantity !== undefined) {
      return item.quantity <= item.minQuantity;
    }
    if (item?.quantity !== undefined) return item.quantity < 5;
    return false;
  });
  
  const activeSuppliers = suppliers.filter(s => s?.status === 'active' || !s?.status);
  const activePrograms = loyalty.filter(p => p?.status === 'active' || !p?.status);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Véhicules"
          value={activeVehicles.length.toString()}
          icon={<Car className="h-4 w-4" />}
          description="En maintenance active"
          className="bg-blue-50 hover:bg-blue-100"
        />
        <StatCard
          title="RDV du jour"
          value={todayAppointments.length.toString()}
          icon={<Calendar className="h-4 w-4" />}
          description="Planifiés aujourd'hui"
          className="bg-purple-50 hover:bg-purple-100"
        />
        <StatCard
          title="Réparations"
          value={ongoingRepairs.length.toString()}
          icon={<Wrench className="h-4 w-4" />}
          description="En cours"
          className="bg-emerald-50 hover:bg-emerald-100"
        />
        <StatCard
          title="Factures impayées"
          value={unpaidInvoices.length.toString()}
          icon={<Receipt className="h-4 w-4" />}
          description="En attente"
          className="bg-red-50 hover:bg-red-100"
        />

        <StatCard
          title="Clients actifs"
          value={activeClients.length.toString()}
          icon={<Users className="h-4 w-4" />}
          description="Base clients"
          className="bg-amber-50 hover:bg-amber-100"
        />
        <StatCard
          title="Stock faible"
          value={lowStockItems.length.toString()}
          icon={<Package className="h-4 w-4" />}
          description="Articles à commander"
          className="bg-orange-50 hover:bg-orange-100"
        />
        <StatCard
          title="Fournisseurs"
          value={activeSuppliers.length.toString()}
          icon={<Truck className="h-4 w-4" />}
          description="Partenaires actifs"
          className="bg-cyan-50 hover:bg-cyan-100"
        />
        <StatCard
          title="Prog. Fidélité"
          value={activePrograms.length.toString()}
          icon={<BadgePercent className="h-4 w-4" />}
          description="Programmes actifs"
          className="bg-indigo-50 hover:bg-indigo-100"
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
