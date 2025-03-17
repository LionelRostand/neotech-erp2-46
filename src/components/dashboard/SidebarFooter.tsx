
import React from 'react';
import { cn } from "@/lib/utils";
import { Settings, ChevronRight, Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import NavLink from './NavLink';

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
}: SidebarFooterProps) => (
  <div className="p-4 border-t border-gray-100">
    {/* PARAMETRES GENERAUX menu option */}
    <NavLink
      icon={<Settings size={20} />}
      label="PARAMETRES GENERAUX"
      href="/settings"
      isActive={isSettingsActive}
      onClick={() => onNavigate('/settings')}
      showLabelWhenCollapsed={false}
    />

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

export default SidebarFooter;
