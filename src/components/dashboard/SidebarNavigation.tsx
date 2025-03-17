
import React from 'react';
import { cn } from "@/lib/utils";
import { AppWindow, LayoutDashboard } from 'lucide-react';
import NavLink from './NavLink';
import { useLocation } from 'react-router-dom';

interface SidebarNavigationProps {
  installedModules: any[];
  onNavigate: (href: string) => void;
}

const SidebarNavigation = ({ installedModules, onNavigate }: SidebarNavigationProps) => {
  const location = useLocation();

  return (
    <nav className="flex-1 p-4 space-y-1 overflow-y-auto flex flex-col">
      {/* Dashboard Link - At the top */}
      <NavLink
        icon={<LayoutDashboard size={20} />}
        label="Dashboard"
        href="/dashboard"
        isActive={location.pathname === '/dashboard'}
        onClick={() => onNavigate('/dashboard')}
      />
      
      {/* Installed modules - After Dashboard */}
      {installedModules.length > 0 && (
        <>
          <div className="mt-4">
            <div className={cn(
              "uppercase text-xs font-semibold text-gray-500 px-4 py-2",
              "sidebar-collapsed-hide"
            )}>
              Modules installés
            </div>
            <div className="border-t border-gray-100 my-1"></div>
          </div>
          
          {installedModules.map((module) => (
            <NavLink
              key={module.id}
              icon={module.icon}
              label={module.name}
              href={module.href}
              isActive={location.pathname === module.href}
              onClick={() => onNavigate(module.href)}
            />
          ))}
        </>
      )}
      
      {/* Spacer to push APPLICATIONS to the middle */}
      <div className="flex-grow min-h-8"></div>
      
      {/* Menu APPLICATIONS - In the middle */}
      <NavLink
        icon={<AppWindow size={20} />}
        label="APPLICATIONS"
        href="/applications"
        isActive={location.pathname === '/applications'}
        onClick={() => onNavigate('/applications')}
      />
      
      {/* Spacer after APPLICATIONS */}
      <div className="flex-grow min-h-8"></div>
    </nav>
  );
};

export default SidebarNavigation;
