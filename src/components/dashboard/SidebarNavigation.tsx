
import React, { useState, useEffect } from 'react';
import { AppWindow, LayoutDashboard, ChevronDown, ChevronUp } from 'lucide-react';
import NavLink from './NavLink';
import { useLocation } from 'react-router-dom';
import DashboardSubmenu from './DashboardSubmenu';
import ModulesList from './ModulesList';
import { AppModule } from '@/data/types/modules';

interface SidebarNavigationProps {
  installedModules: AppModule[];
  onNavigate: (href: string) => void;
}

const SidebarNavigation = ({ installedModules, onNavigate }: SidebarNavigationProps) => {
  const location = useLocation();
  const [showModules, setShowModules] = useState(true);
  const [showDashboardSubmenus, setShowDashboardSubmenus] = useState(true);
  const [expandedModules, setExpandedModules] = useState<{[key: number]: boolean}>({});

  // Check if we're on any of the installed module routes
  const isOnModuleRoute = installedModules.some(module => 
    location.pathname.startsWith(module.href)
  );

  // Find the current active module
  const activeModule = installedModules.find(module => 
    location.pathname.startsWith(module.href)
  );

  // Check if we're on any of the dashboard routes
  const isOnDashboardRoute = 
    location.pathname === '/dashboard' || 
    location.pathname === '/dashboard/performance' || 
    location.pathname === '/dashboard/analytics';

  const toggleModules = () => {
    setShowModules(!showModules);
  };

  const toggleDashboardSubmenus = () => {
    setShowDashboardSubmenus(!showDashboardSubmenus);
  };

  const toggleModuleSubmenus = (moduleId: number) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  // Initialize expanded state for active module
  useEffect(() => {
    if (activeModule && !expandedModules[activeModule.id]) {
      setExpandedModules(prev => ({
        ...prev,
        [activeModule.id]: true
      }));
    }
  }, [activeModule, expandedModules]);

  return (
    <nav className="flex-1 p-4 space-y-1 overflow-y-auto flex flex-col">
      {/* Dashboard Link with submenu */}
      <div className="relative">
        <NavLink
          icon={<LayoutDashboard size={20} />}
          label="Dashboard"
          href="/dashboard"
          isActive={isOnDashboardRoute}
          onClick={() => onNavigate('/dashboard')}
          extraContent={
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleDashboardSubmenus();
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
            >
              {showDashboardSubmenus ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          }
        />
        
        {/* Dashboard submenus */}
        <DashboardSubmenu 
          showDashboardSubmenus={showDashboardSubmenus}
          location={location}
          onNavigate={onNavigate}
        />
      </div>
      
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
        <ModulesList 
          installedModules={installedModules}
          expandedModules={expandedModules}
          toggleModuleSubmenus={toggleModuleSubmenus}
          showModules={showModules}
          location={location}
          onNavigate={onNavigate}
        />
      </div>
      
      {/* Spacer to push content to the bottom */}
      <div className="flex-grow min-h-8"></div>
    </nav>
  );
};

export default SidebarNavigation;
