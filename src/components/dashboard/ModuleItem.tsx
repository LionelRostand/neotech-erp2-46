
import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import ModuleSubmenu from './ModuleSubmenu';
import { AppModule } from '@/data/types/modules';

interface ModuleItemProps {
  module: AppModule;
  isExpanded: boolean;
  toggleModuleSubmenus: (moduleId: number) => void;
  location: { pathname: string };
  onNavigate: (href: string) => void;
}

const ModuleItem: React.FC<ModuleItemProps> = ({ 
  module, 
  isExpanded, 
  toggleModuleSubmenus, 
  location, 
  onNavigate 
}) => {
  const hasSubmodules = module.submodules && module.submodules.length > 0;
  const isActive = location.pathname.startsWith(module.href);
  
  return (
    <SidebarMenuItem>
      <SidebarMenuButton 
        isActive={isActive}
        onClick={() => onNavigate(module.href)}
        className="relative"
      >
        {module.icon}
        <span>{module.name}</span>
        
        {hasSubmodules && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleModuleSubmenus(module.id);
            }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {isExpanded ? 
              <ChevronUp className="h-4 w-4" /> : 
              <ChevronDown className="h-4 w-4" />
            }
          </button>
        )}
      </SidebarMenuButton>
      
      {hasSubmodules && (
        <ModuleSubmenu
          submodules={module.submodules || []}
          isExpanded={isExpanded}
          location={location}
          onNavigate={onNavigate}
        />
      )}
    </SidebarMenuItem>
  );
};

export default ModuleItem;
