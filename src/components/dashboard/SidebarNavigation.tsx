
import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { AppWindow, LayoutDashboard, ChevronDown, ChevronUp, BarChart, Activity, LineChart } from 'lucide-react';
import NavLink from './NavLink';
import { useLocation } from 'react-router-dom';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AppModule, SubModule } from '@/data/types/modules';

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
  React.useEffect(() => {
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
        {showDashboardSubmenus && (
          <div className="pl-8 mt-1 space-y-1 border-l border-gray-100 ml-4">
            <NavLink
              icon={<LayoutDashboard size={16} />}
              label="Vue générale"
              href="/dashboard"
              isActive={location.pathname === '/dashboard'}
              onClick={() => onNavigate('/dashboard')}
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
        )}
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
        {installedModules.length > 0 && showModules && (
          <div className="pl-8 mt-1 space-y-1 border-l border-gray-100 ml-4">
            {installedModules.map((module) => (
              <div key={module.id}>
                {/* Module link */}
                <NavLink
                  icon={module.icon}
                  label={module.name}
                  href={module.href}
                  isActive={location.pathname.startsWith(module.href)}
                  onClick={() => onNavigate(module.href)}
                  className="py-1"
                  showLabelWhenCollapsed={false}
                  extraContent={
                    module.submodules && module.submodules.length > 0 && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleModuleSubmenus(module.id);
                        }}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                      >
                        {expandedModules[module.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    )
                  }
                />
                
                {/* Submodules */}
                {module.submodules && module.submodules.length > 0 && expandedModules[module.id] && (
                  <div className="pl-6 mt-1 space-y-1 border-l border-gray-50 ml-2">
                    {module.submodules.map((submodule) => (
                      <NavLink
                        key={submodule.id}
                        icon={submodule.icon}
                        label={submodule.name}
                        href={submodule.href}
                        isActive={location.pathname === submodule.href}
                        onClick={() => onNavigate(submodule.href)}
                        className="py-0.5 text-xs"
                        showLabelWhenCollapsed={false}
                      />
                    ))}
                  </div>
                )}
              </div>
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
