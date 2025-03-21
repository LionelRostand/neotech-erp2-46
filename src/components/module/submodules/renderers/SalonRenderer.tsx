
import React from 'react';
import { SubModule } from '@/data/types/modules';
import SalonDashboard from '../salon/SalonDashboard';
import SalonInventory from '../salon/inventory/SalonInventory';
import SalonProducts from '../salon/products/SalonProducts';
import SalonLoyalty from '../salon/loyalty/SalonLoyalty';
import SalonReports from '../salon/reports/SalonReports';

interface SalonRendererProps {
  submoduleId: string;
  submodule: SubModule;
}

export const SalonRenderer: React.FC<SalonRendererProps> = ({ submoduleId }) => {
  switch (submoduleId) {
    case 'salon-dashboard':
      return <SalonDashboard />;
    case 'salon-inventory':
      return <SalonInventory />;
    case 'salon-products':
      return <SalonProducts />;
    case 'salon-loyalty':
      return <SalonLoyalty />;
    case 'salon-reports':
      return <SalonReports />;
    case 'salon-booking':
      return (
        <div className="p-6 space-y-6">
          <h2 className="text-2xl font-bold">Réservation Web & Mobile</h2>
          <p className="text-muted-foreground">
            Plateforme de réservation en ligne pour vos clients. Cette fonctionnalité 
            permet à vos clients de prendre rendez-vous via votre site web ou application mobile.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-yellow-800">
            <p className="font-medium">Module en cours de développement</p>
            <p className="text-sm">Cette fonctionnalité sera bientôt disponible.</p>
          </div>
        </div>
      );
    default:
      return (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Ce module est en cours de développement
        </div>
      );
  }
};
