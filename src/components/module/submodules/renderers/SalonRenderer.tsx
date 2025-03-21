
import React from 'react';
import { Submodule } from '@/data/types/modules';
import SalonDashboard from '../salon/SalonDashboard';
import SalonInventory from '../salon/inventory/SalonInventory';
import SalonProducts from '../salon/products/SalonProducts';
import SalonLoyalty from '../salon/loyalty/SalonLoyalty';
import SalonReports from '../salon/reports/SalonReports';

interface SalonRendererProps {
  submoduleId: string;
  submodule: Submodule;
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
    default:
      return (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Ce module est en cours de développement
        </div>
      );
  }
};
