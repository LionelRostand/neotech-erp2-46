
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { modules } from '@/data/appModules';
import NavLink from './dashboard/NavLink';
import SidebarHeader from './dashboard/SidebarHeader';
import SidebarNavigation from './dashboard/SidebarNavigation';
import SidebarFooter from './dashboard/SidebarFooter';
import TopBar from './dashboard/TopBar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [installedModules, setInstalledModules] = useState<number[]>([]);
  
  // Load installed modules from localStorage on load
  useEffect(() => {
    const loadInstalledModules = () => {
      const savedModules = localStorage.getItem('installedModules');
      if (savedModules) {
        setInstalledModules(JSON.parse(savedModules));
      }
    };
    
    // Load on startup
    loadInstalledModules();
    
    // Configure event listener for module changes
    const handleModulesChanged = () => loadInstalledModules();
    window.addEventListener('modulesChanged', handleModulesChanged);
    
    // Clean up listener on unmount
    return () => {
      window.removeEventListener('modulesChanged', handleModulesChanged);
    };
  }, []);

  // Add a class to the body when the sidebar is collapsed
  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.remove('sidebar-collapsed');
    } else {
      document.body.classList.add('sidebar-collapsed');
    }
  }, [sidebarOpen]);

  const handleNavigation = (href: string) => {
    navigate(href);
  };
  
  // Filter installed modules
  const installedModuleDetails = modules.filter(module => 
    installedModules.includes(module.id)
  );

  return (
    <div className="flex min-h-screen w-full bg-neotech-background">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out transform bg-white border-r border-gray-100 shadow-sm",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo - Clickable to go to Welcome page */}
          <SidebarHeader 
            sidebarOpen={sidebarOpen} 
            onClick={() => navigate('/welcome')} 
          />

          {/* Navigation */}
          <SidebarNavigation 
            installedModules={installedModuleDetails} 
            onNavigate={handleNavigation} 
          />

          {/* Collapse button and company info */}
          <SidebarFooter 
            sidebarOpen={sidebarOpen} 
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
            onNavigate={handleNavigation}
            isSettingsActive={location.pathname === '/settings'}
          />
        </div>
      </aside>

      {/* Main content */}
      <main 
        className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          sidebarOpen ? "ml-64" : "ml-20"
        )}
      >
        {/* Top bar */}
        <TopBar />

        {/* Page content */}
        <div className="p-6 animate-fade-up">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
