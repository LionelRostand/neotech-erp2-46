
import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import NavLink from './NavLink';
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
  
  return (
    <div key={module.id}>
      <NavLink
        icon={module.icon}
        label={module.name}
        href={module.href}
        isActive={location.pathname.startsWith(module.href)}
        onClick={() => onNavigate(module.href)}
        className="py-1"
        showLabelWhenCollapsed={false}
        extraContent={
          hasSubmodules && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleModuleSubmenus(module.id);
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
            >
              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )
        }
      />
      
      {hasSubmodules && (
        <ModuleSubmenu
          submodules={module.submodules || []}
          isExpanded={isExpanded}
          location={location}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
};

export default ModuleItem;
