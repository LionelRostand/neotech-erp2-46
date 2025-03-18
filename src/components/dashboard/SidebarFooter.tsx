
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Settings, ChevronRight, Menu, ChevronUp, ChevronDown, Lock, Mail, Shield, Check, X, Globe } from 'lucide-react';
import { Button } from "@/components/ui/button";
import NavLink from './NavLink';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useLocation } from 'react-router-dom';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface SidebarFooterProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onNavigate: (href: string) => void;
  isSettingsActive: boolean;
}

const SidebarFooter = ({ 
  sidebarOpen, 
  onToggleSidebar, 
  onNavigate, 
  isSettingsActive 
}: SidebarFooterProps) => {
  const [showSettingsSubmenus, setShowSettingsSubmenus] = useState(false);
  const location = useLocation();
  
  // Check if we're on any settings page
  const isOnSettingsPage = 
    location.pathname === '/settings/user-permissions' || 
    location.pathname === '/settings/translation' || 
    location.pathname === '/settings/smtp' || 
    location.pathname === '/settings/2fa';
  
  // Open submenu automatically if we're on a settings page
  useEffect(() => {
    if (isOnSettingsPage && !showSettingsSubmenus) {
      setShowSettingsSubmenus(true);
    }
  }, [isOnSettingsPage, showSettingsSubmenus]);
  
  return (
    <div className="p-4 border-t border-gray-100">
      {/* PARAMETRES GENERAUX menu with submenu */}
      <Accordion 
        type="single" 
        collapsible 
        defaultValue={isOnSettingsPage ? "settings" : undefined}
        value={showSettingsSubmenus ? "settings" : undefined}
        onValueChange={(value) => setShowSettingsSubmenus(value === "settings")}
      >
        <AccordionItem value="settings" className="border-none">
          <div className={cn(
            "nav-link group flex items-center px-4 py-2 text-sm font-medium rounded-md my-1 transition-colors relative cursor-pointer",
            isSettingsActive || isOnSettingsPage ? "bg-neotech-primary text-white" : "text-gray-700 hover:bg-gray-100"
          )}>
            <span className="transition-transform duration-300 group-hover:scale-110 mr-3">
              <Settings size={20} />
            </span>
            <AccordionTrigger className={cn(
              "flex-1 flex items-center justify-between py-0 hover:no-underline",
              (isSettingsActive || isOnSettingsPage) ? "text-white" : "text-gray-700"
            )}>
              <span className={cn(
                "transition-opacity duration-300",
                !sidebarOpen && "sidebar-collapsed-hide"
              )}>
                PARAMETRES GENERAUX
              </span>
            </AccordionTrigger>
          </div>
          
          <AccordionContent className="pb-1 pt-1">
            <div className="pl-8 space-y-1 border-l border-gray-100 ml-4">
              <NavLink
                icon={<Lock size={16} />}
                label="Droits utilisateurs"
                href="/settings/user-permissions"
                isActive={location.pathname === '/settings/user-permissions'}
                onClick={() => onNavigate('/settings/user-permissions')}
                className="py-1"
                showLabelWhenCollapsed={true}
              />
              <NavLink
                icon={<Globe size={16} />}
                label="Traduction"
                href="/settings/translation"
                isActive={location.pathname === '/settings/translation'}
                onClick={() => onNavigate('/settings/translation')}
                className="py-1"
                showLabelWhenCollapsed={true}
              />
              <NavLink
                icon={<Mail size={16} />}
                label="Configuration SMTP"
                href="/settings/smtp"
                isActive={location.pathname === '/settings/smtp'}
                onClick={() => onNavigate('/settings/smtp')}
                className="py-1"
                showLabelWhenCollapsed={true}
              />
              <NavLink
                icon={<Shield size={16} />}
                label="Authentification 2FA"
                href="/settings/2fa"
                isActive={location.pathname === '/settings/2fa'}
                onClick={() => onNavigate('/settings/2fa')}
                className="py-1"
                showLabelWhenCollapsed={true}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-3">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-between"
          onClick={onToggleSidebar}
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
      </div>
      
      {/* Company info text */}
      <div className={cn(
        "mt-3 text-center text-xs text-gray-500 font-medium transition-opacity duration-300",
        sidebarOpen ? "opacity-100" : "opacity-0 overflow-hidden h-0"
      )}>
        NEOTECH-CONSULTING 2025
      </div>
    </div>
  );
};

export default SidebarFooter;
