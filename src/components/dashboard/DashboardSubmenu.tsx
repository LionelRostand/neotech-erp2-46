
import React from 'react';
import { LayoutDashboard, Activity, BarChart } from 'lucide-react';
import NavLink from './NavLink';

interface DashboardSubmenuProps {
  showDashboardSubmenus: boolean;
  location: { pathname: string };
  onNavigate: (href: string) => void;
}

const DashboardSubmenu: React.FC<DashboardSubmenuProps> = ({ 
  showDashboardSubmenus, 
  location, 
  onNavigate 
}) => {
  if (!showDashboardSubmenus) return null;
  
  return (
    <div className="pl-8 mt-1 space-y-1 border-l border-gray-100 ml-4">
      <NavLink
        icon={<LayoutDashboard size={16} />}
        label="Vue générale"
        href="/"
        isActive={location.pathname === '/' || location.pathname === '/dashboard'}
        onClick={() => onNavigate('/')}
        className="py-1"
        showLabelWhenCollapsed={false}
      />
      <NavLink
        icon={<Activity size={16} />}
        label="Performance"
        href="/dashboard/performance"
        isActive={location.pathname === '/dashboard/performance'}
        onClick={() => onNavigate('/dashboard/performance')}
        className="py-1"
        showLabelWhenCollapsed={false}
      />
      <NavLink
        icon={<BarChart size={16} />}
        label="Analytiques"
        href="/dashboard/analytics"
        isActive={location.pathname === '/dashboard/analytics'}
        onClick={() => onNavigate('/dashboard/analytics')}
        className="py-1"
        showLabelWhenCollapsed={false}
      />
    </div>
  );
};

export default DashboardSubmenu;
