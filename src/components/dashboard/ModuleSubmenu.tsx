
import React from 'react';
import { SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '@/components/ui/sidebar';
import { SubModule } from '@/data/types/modules';

interface ModuleSubmenuProps {
  submodules: SubModule[];
  isExpanded: boolean;
  location: { pathname: string };
  onNavigate: (href: string) => void;
}

const ModuleSubmenu: React.FC<ModuleSubmenuProps> = ({ 
  submodules, 
  isExpanded, 
  location, 
  onNavigate 
}) => {
  if (!submodules || submodules.length === 0 || !isExpanded) return null;
  
  return (
    <SidebarMenuSub>
      {submodules.map((submodule) => (
        <SidebarMenuSubItem key={submodule.id}>
          <SidebarMenuSubButton 
            isActive={location.pathname === submodule.href}
            onClick={() => onNavigate(submodule.href)}
          >
            {submodule.icon}
            <span>{submodule.name}</span>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
      ))}
    </SidebarMenuSub>
  );
};

export default ModuleSubmenu;
