
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Package } from 'lucide-react';
import NavLink from './NavLink';
import { useLocation } from 'react-router-dom';
import DashboardSubmenu from './DashboardSubmenu';
import { AppModule } from '@/data/types/modules';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import CategorySection from './CategorySection';
import { SidebarProvider } from './SidebarContext';
import { useSidebar } from './useSidebar';
import { CategoryService } from './CategoryService';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';

interface SidebarNavigationProps {
  installedModules: AppModule[];
  onNavigate: (href: string) => void;
}

const SidebarContent = ({ installedModules, onNavigate }: SidebarNavigationProps) => {
  const location = useLocation();
  const { focusedSection } = useSidebar();
  const { isAdmin } = useAuth();
  const { checkPermission } = usePermissions();
  const [canManageApps, setCanManageApps] = useState<boolean>(isAdmin || false);
  
  const businessModules = CategoryService.getModulesByCategory(installedModules, 'business');
  const serviceModules = CategoryService.getModulesByCategory(installedModules, 'services');
  const digitalModules = CategoryService.getModulesByCategory(installedModules, 'digital');
  const communicationModules = CategoryService.getModulesByCategory(installedModules, 'communication');
  
  const isOnDashboardRoute = 
    location.pathname === '/' || 
    location.pathname === '/dashboard/performance' || 
    location.pathname === '/dashboard/analytics';

  // Utilisation d'un effet pour vérifier les permissions de manière asynchrone
  useEffect(() => {
    const checkApplicationsPermission = async () => {
      if (isAdmin) {
        setCanManageApps(true);
        return;
      }
      
      try {
        const hasPermission = await checkPermission('applications', 'modify');
        setCanManageApps(hasPermission);
      } catch (error) {
        console.error("Erreur lors de la vérification des permissions:", error);
        setCanManageApps(false);
      }
    };
    
    checkApplicationsPermission();
  }, [isAdmin, checkPermission]);

  return (
    <nav className="flex-1 p-4 space-y-1 overflow-y-auto flex flex-col">
      <Accordion 
        type="single" 
        collapsible 
        defaultValue={isOnDashboardRoute ? "dashboard" : undefined}
        className="border-none"
      >
        <AccordionItem value="dashboard" className="border-none">
          <div className={cn("nav-link group flex items-center px-4 py-2 text-sm font-medium rounded-md my-1 transition-colors relative cursor-pointer",
            isOnDashboardRoute ? "bg-neotech-primary text-white" : "text-gray-700 hover:bg-gray-100"
          )}>
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

      {canManageApps && (
        <NavLink
          icon={<Package size={18} />}
          label="Gérer les applications"
          href="/applications"
          isActive={location.pathname === '/applications'}
          onClick={() => onNavigate('/applications')}
          className={`mt-2 ${focusedSection === 'applications' ? 'ring-2 ring-neotech-primary ring-opacity-50' : ''}`}
          showLabelWhenCollapsed={true}
        />
      )}
      
      <div className="mt-2" id="applications-section">
        <CategorySection 
          category="business" 
          modules={businessModules} 
          onNavigate={onNavigate} 
        />
        
        <CategorySection 
          category="services" 
          modules={serviceModules} 
          onNavigate={onNavigate} 
        />
        
        <CategorySection 
          category="digital" 
          modules={digitalModules} 
          onNavigate={onNavigate} 
        />
        
        <CategorySection 
          category="communication" 
          modules={communicationModules} 
          onNavigate={onNavigate} 
        />
        
        {installedModules.length === 0 && (
          <div className="text-sm text-gray-500 px-4 py-2 italic">
            Aucune application installée
          </div>
        )}
      </div>
      
      <div className="flex-grow min-h-8"></div>
    </nav>
  );
};

const SidebarNavigation = (props: SidebarNavigationProps) => {
  return (
    <SidebarProvider installedModules={props.installedModules}>
      <SidebarContent {...props} />
    </SidebarProvider>
  );
};

export default SidebarNavigation;
