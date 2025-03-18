
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
  const [focusedSection, setFocusedSection] = useState<string | null>(null);

  // Check if we're on any of the installed module routes
  const isOnModuleRoute = installedModules.some(module => 
    location.pathname.startsWith(module.href)
  );

  // Find the current active module
  const activeModule = installedModules.find(module => 
    location.pathname.startsWith(module.href)
  );

  // Check if we're on the root route (/) or other dashboard routes
  const isOnDashboardRoute = 
    location.pathname === '/' || 
    location.pathname === '/dashboard/performance' || 
    location.pathname === '/dashboard/analytics';

  // Initialize expanded state for active module on route change
  useEffect(() => {
    if (activeModule) {
      setExpandedModules(prev => ({
        ...prev,
        [activeModule.id]: true
      }));
    }
  }, [location.pathname, activeModule]);

  // Listen for the focus event from Welcome page
  useEffect(() => {
    const handleFocusInstalledApps = () => {
      setFocusedSection('applications');
      
      // Scroll applications section into view if needed
      setTimeout(() => {
        const appsSection = document.getElementById('applications-section');
        if (appsSection) {
          appsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    };
    
    window.addEventListener('focusInstalledApps', handleFocusInstalledApps);
    
    return () => {
      window.removeEventListener('focusInstalledApps', handleFocusInstalledApps);
    };
  }, []);

  // Function to toggle submenu expansion
  const toggleModuleSubmenus = (moduleId: number) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  return (
    <nav className="flex-1 p-4 space-y-1 overflow-y-auto flex flex-col">
      {/* Dashboard Link with submenu - updated to point to / */}
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
      
      {/* Link to applications page to install more - Moved above APPLICATIONS section */}
      <NavLink
        icon={<AppWindow size={18} />}
        label="Gérer les applications"
        href="/applications"
        isActive={location.pathname === '/applications'}
        onClick={() => onNavigate('/applications')}
        className={`mt-2 ${focusedSection === 'applications' ? 'ring-2 ring-neotech-primary ring-opacity-50' : ''}`}
        showLabelWhenCollapsed={true}
      />
      
      {/* Display applications directly in the sidebar */}
      <div className="mt-2" id="applications-section">
        <div className={`px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider ${
          focusedSection === 'applications' ? 'bg-neotech-primary/10 rounded' : ''
        }`}>
          APPLICATIONS
        </div>
        
        <ModulesList 
          installedModules={installedModules}
          expandedModules={expandedModules}
          toggleModuleSubmenus={toggleModuleSubmenus}
          showModules={true}
          location={location}
          onNavigate={onNavigate}
        />
        
        {installedModules.length === 0 && (
          <div className="text-sm text-gray-500 px-4 py-2 italic">
            Aucune application installée
          </div>
        )}
      </div>
      
      {/* Spacer to push content to the bottom */}
      <div className="flex-grow min-h-8"></div>
    </nav>
  );
};

export default SidebarNavigation;
