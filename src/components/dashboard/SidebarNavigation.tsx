
import React, { useState, useEffect } from 'react';
import { AppWindow, LayoutDashboard } from 'lucide-react';
import NavLink from './NavLink';
import { useLocation } from 'react-router-dom';
import DashboardSubmenu from './DashboardSubmenu';
import ModulesList from './ModulesList';
import { AppModule } from '@/data/types/modules';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface SidebarNavigationProps {
  installedModules: AppModule[];
  onNavigate: (href: string) => void;
}

const SidebarNavigation = ({ installedModules, onNavigate }: SidebarNavigationProps) => {
  const location = useLocation();
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
      <Accordion 
        type="single" 
        collapsible 
        defaultValue={isOnDashboardRoute ? "dashboard" : undefined}
        className="border-none"
      >
        <AccordionItem value="dashboard" className="border-none">
          <div className={`nav-link group flex items-center px-4 py-2 text-sm font-medium rounded-md my-1 transition-colors relative cursor-pointer ${
            isOnDashboardRoute ? "bg-neotech-primary text-white" : "text-gray-700 hover:bg-gray-100"
          }`}>
            <span className="transition-transform duration-300 group-hover:scale-110 mr-3">
              <LayoutDashboard size={20} />
            </span>
            <AccordionTrigger className={cn(
              "flex-1 flex items-center justify-between py-0 hover:no-underline",
              isOnDashboardRoute ? "text-white" : "text-gray-700"
            )}>
              <span className="transition-opacity duration-300">
                Dashboard
              </span>
            </AccordionTrigger>
          </div>
          
          <AccordionContent className="pb-1 pt-1">
            <DashboardSubmenu 
              showDashboardSubmenus={true}
              location={location}
              onNavigate={onNavigate}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      {/* Menu APPLICATIONS with submenu of installed modules */}
      <Accordion 
        type="single" 
        collapsible 
        defaultValue={isOnModuleRoute || location.pathname === '/applications' ? "applications" : undefined}
        className="border-none mt-4"
      >
        <AccordionItem value="applications" className="border-none">
          <div className={`nav-link group flex items-center px-4 py-2 text-sm font-medium rounded-md my-1 transition-colors relative cursor-pointer ${
            location.pathname === '/applications' || isOnModuleRoute ? "bg-neotech-primary text-white" : "text-gray-700 hover:bg-gray-100"
          }`}>
            <span className="transition-transform duration-300 group-hover:scale-110 mr-3">
              <AppWindow size={20} />
            </span>
            <AccordionTrigger 
              className={cn(
                "flex-1 flex items-center justify-between py-0 hover:no-underline",
                (location.pathname === '/applications' || isOnModuleRoute) ? "text-white" : "text-gray-700"
              )}
              disabled={installedModules.length === 0}
              onClick={(e) => {
                if (installedModules.length === 0) {
                  e.preventDefault();
                  e.stopPropagation();
                  onNavigate('/applications');
                }
              }}
            >
              <span className="transition-opacity duration-300">
                APPLICATIONS
              </span>
            </AccordionTrigger>
          </div>
          
          <AccordionContent className="pb-1 pt-1">
            <ModulesList 
              installedModules={installedModules}
              expandedModules={expandedModules}
              toggleModuleSubmenus={toggleModuleSubmenus}
              showModules={true}
              location={location}
              onNavigate={onNavigate}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      {/* Spacer to push content to the bottom */}
      <div className="flex-grow min-h-8"></div>
    </nav>
  );
  
  function toggleModuleSubmenus(moduleId: number) {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  }
};

export default SidebarNavigation;
