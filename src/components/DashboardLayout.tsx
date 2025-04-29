
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import SidebarNavigation from '@/components/dashboard/SidebarNavigation';
import SidebarHeader from '@/components/dashboard/SidebarHeader';
import SidebarFooter from '@/components/dashboard/SidebarFooter';
import DashboardNavbar from '@/components/DashboardNavbar';
import { useSidebarContext } from '@/components/dashboard/SidebarContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { expandedModules, toggleModuleSubmenus, expandedCategories, toggleCategory, isActiveModule } = useSidebarContext();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsActive, setSettingsActive] = useState(location.pathname.startsWith('/settings'));

  const handleNavigate = (href: string) => {
    navigate(href);
    setSettingsActive(href.startsWith('/settings'));
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-20 w-64 transform bg-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <SidebarHeader 
            sidebarOpen={sidebarOpen} 
            onClick={() => navigate('/')} 
          />
          <div className="flex-1 overflow-y-auto px-3 py-4">
            <SidebarNavigation 
              installedModules={[]}
              onNavigate={handleNavigate}
            />
          </div>
          <SidebarFooter 
            sidebarOpen={sidebarOpen} 
            onToggleSidebar={toggleSidebar}
            onNavigate={handleNavigate}
            isSettingsActive={settingsActive}
          />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardNavbar />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
      
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-10 bg-black bg-opacity-20 lg:hidden" 
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default DashboardLayout;
