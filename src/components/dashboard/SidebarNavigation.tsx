
import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { AppWindow, LayoutDashboard, ChevronDown, ChevronUp } from 'lucide-react';
import NavLink from './NavLink';
import { useLocation } from 'react-router-dom';

interface SidebarNavigationProps {
  installedModules: any[];
  onNavigate: (href: string) => void;
}

const SidebarNavigation = ({ installedModules, onNavigate }: SidebarNavigationProps) => {
  const location = useLocation();
  const [showModules, setShowModules] = useState(true);

  // Check if we're on any of the installed module routes
  const isOnModuleRoute = installedModules.some(module => 
    location.pathname.startsWith(module.href)
  );

  const toggleModules = () => {
    setShowModules(!showModules);
  };

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
      
      {/* Menu APPLICATIONS with submenu of installed modules */}
      <div className="relative mt-4">
        <NavLink
          icon={<AppWindow size={20} />}
          label="APPLICATIONS"
          href="/applications"
          isActive={location.pathname === '/applications' || isOnModuleRoute}
          onClick={() => onNavigate('/applications')}
          extraContent={
            installedModules.length > 0 && (
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleModules();
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
              >
                {showModules ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            )
          }
        />
        
        {/* Installed modules as submenu */}
        {installedModules.length > 0 && showModules && (
          <div className="pl-8 mt-1 space-y-1 border-l border-gray-100 ml-4">
            {installedModules.map((module) => (
              <NavLink
                key={module.id}
                icon={module.icon}
                label={module.name}
                href={module.href}
                isActive={location.pathname.startsWith(module.href)}
                onClick={() => onNavigate(module.href)}
                className="py-1"
                showLabelWhenCollapsed={false}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Spacer to push content to the bottom */}
      <div className="flex-grow min-h-8"></div>
    </nav>
  );
};

export default SidebarNavigation;
