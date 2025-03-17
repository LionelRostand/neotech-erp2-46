
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Home, ShoppingCart, Warehouse, PackageOpen, 
  LineChart, Users, Truck, Settings, 
  Search, Bell, Mail, User, Menu, ChevronRight,
  AppWindow
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { modules } from '@/data/appModules';

interface NavLinkProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive: boolean;
  onClick: () => void;
}

const NavLink = ({ icon, label, href, isActive, onClick }: NavLinkProps) => (
  <a
    href={href}
    className={cn(
      "nav-link group flex items-center px-4 py-2 text-sm font-medium rounded-md my-1 transition-colors",
      isActive ? "bg-neotech-primary text-white" : "text-gray-700 hover:bg-gray-100"
    )}
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
  >
    <span className="transition-transform duration-300 group-hover:scale-110 mr-3">
      {icon}
    </span>
    <span className="transition-opacity duration-300">{label}</span>
  </a>
);

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [installedModules, setInstalledModules] = useState<number[]>([]);
  
  // Charger les modules installés depuis le localStorage au chargement
  useEffect(() => {
    const loadInstalledModules = () => {
      const savedModules = localStorage.getItem('installedModules');
      if (savedModules) {
        setInstalledModules(JSON.parse(savedModules));
      }
    };
    
    // Charger au démarrage
    loadInstalledModules();
    
    // Configurer l'écouteur d'événements pour les changements de modules
    const handleModulesChanged = () => loadInstalledModules();
    window.addEventListener('modulesChanged', handleModulesChanged);
    
    // Nettoyer l'écouteur lors du démontage
    return () => {
      window.removeEventListener('modulesChanged', handleModulesChanged);
    };
  }, []);

  const handleNavigation = (href: string) => {
    navigate(href);
  };
  
  // Filtrer les modules installés
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
          <div 
            className={cn(
              "flex items-center py-6 px-6 border-b border-gray-100 cursor-pointer",
              !sidebarOpen && "justify-center"
            )}
            onClick={() => navigate('/welcome')}
          >
            <div className="w-8 h-8 rounded-lg bg-neotech-primary flex items-center justify-center text-white font-bold">
              N
            </div>
            <h2 className={cn(
              "ml-3 text-xl font-semibold transition-opacity duration-300",
              sidebarOpen ? "opacity-100" : "opacity-0 overflow-hidden w-0"
            )}>
              NEOTECH-ERP
            </h2>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {/* Menu APPLICATIONS */}
            <NavLink
              icon={<AppWindow size={20} />}
              label="APPLICATIONS"
              href="/applications"
              isActive={location.pathname === '/applications'}
              onClick={() => handleNavigation('/applications')}
            />
            
            {/* Séparateur */}
            {installedModuleDetails.length > 0 && (
              <div className="my-3">
                <div className="uppercase text-xs font-semibold text-gray-500 px-4 py-2">
                  Modules installés
                </div>
                <div className="border-t border-gray-100 my-1"></div>
              </div>
            )}
            
            {/* Modules installés */}
            {installedModuleDetails.map((module) => (
              <NavLink
                key={module.id}
                icon={module.icon}
                label={module.name}
                href={module.href}
                isActive={location.pathname === module.href}
                onClick={() => handleNavigation(module.href)}
              />
            ))}
            
            {/* PARAMETRES GENERAUX menu option */}
            <div className="mt-auto pt-4">
              <NavLink
                icon={<Settings size={20} />}
                label="PARAMETRES GENERAUX"
                href="/settings"
                isActive={location.pathname === '/settings'}
                onClick={() => handleNavigation('/settings')}
              />
            </div>
          </nav>

          {/* Collapse button and company info */}
          <div className="p-4 border-t border-gray-100">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-between"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <>
                  <span>Réduire</span>
                  <ChevronRight size={16} />
                </>
              ) : (
                <Menu size={16} />
              )}
            </Button>
            
            {/* Company info text */}
            <div className={cn(
              "mt-3 text-center text-xs text-gray-500 font-medium transition-opacity duration-300",
              sidebarOpen ? "opacity-100" : "opacity-0 overflow-hidden h-0"
            )}>
              NEOTECH-CONSULTING 2025
            </div>
          </div>
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
        <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center w-72">
              <div className="relative w-full">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-200 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-4 h-4 bg-neotech-primary text-white rounded-full text-xs flex items-center justify-center">
                  2
                </span>
              </Button>
              
              <Button variant="ghost" size="icon" className="relative">
                <Mail size={20} />
                <span className="absolute top-0 right-0 w-4 h-4 bg-neotech-primary text-white rounded-full text-xs flex items-center justify-center">
                  3
                </span>
              </Button>

              <div className="flex items-center pl-4 border-l border-gray-200">
                <div className="w-8 h-8 rounded-full bg-neotech-primary flex items-center justify-center text-white font-medium">
                  A
                </div>
                <span className="ml-2 font-medium text-sm">Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-6 animate-fade-up">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
