
import React from 'react';
import NavLink from './NavLink';
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
    <div className="pl-6 mt-1 space-y-1 border-l border-gray-50 ml-2">
      {submodules.map((submodule) => (
        <NavLink
          key={submodule.id}
          icon={submodule.icon}
          label={submodule.name}
          href={submodule.href}
          isActive={location.pathname === submodule.href}
          onClick={() => onNavigate(submodule.href)}
          className="py-0.5 text-xs"
          showLabelWhenCollapsed={false}
        />
      ))}
    </div>
  );
};

export default ModuleSubmenu;
