
import React from 'react';
import { SubModule } from '@/data/types/modules';
import SalonDashboard from '../salon/SalonDashboard';
import SalonInventory from '../salon/inventory/SalonInventory';
import SalonProducts from '../salon/products/SalonProducts';
import SalonLoyalty from '../salon/loyalty/SalonLoyalty';
import SalonReports from '../salon/reports/SalonReports';
import SalonBooking from '../salon/booking/SalonBooking';
import SalonBilling from '../salon/billing/SalonBilling';
import { useLocation } from 'react-router-dom';

interface SalonRendererProps {
  submoduleId: string;
  submodule: SubModule;
}

export const SalonRenderer: React.FC<SalonRendererProps> = ({ submoduleId }) => {
  const location = useLocation();
  console.info("SalonRenderer: location path is", location.pathname);
  
  // Extract submodule name from path (e.g., /modules/salon/billing -> billing)
  const submoduleName = location.pathname.split('/').pop();
  console.info("Extracted submodule name from path:", submoduleName);
  
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
      return <SalonBooking />;
    case 'salon-billing':
      return <SalonBilling />;
    default:
      return (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Ce module est en cours de développement
        </div>
      );
  }
};
