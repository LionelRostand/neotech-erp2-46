
import React from 'react';
import { SubModule } from '@/data/types/modules';

interface ModuleSubmenuProps {
  submodules: SubModule[];
  location: { pathname: string };
  onNavigate: (href: string) => void;
}

const ModuleSubmenu: React.FC<ModuleSubmenuProps> = ({ 
  submodules, 
  location, 
  onNavigate 
}) => {
  if (!submodules || submodules.length === 0) return null;
  
  return (
    <div className="pl-8 space-y-1 mt-1">
      {submodules.map((submodule) => (
        <div key={submodule.id} className="flex">
          <div
            className={`flex items-center px-2 py-1.5 text-sm rounded-md w-full cursor-pointer ${
              location.pathname === submodule.href 
                ? 'bg-gray-100 text-gray-900 font-medium' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
            onClick={() => onNavigate(submodule.href)}
          >
            <span className="mr-2 text-gray-500">{submodule.icon}</span>
            <span className="whitespace-nowrap">{submodule.name}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ModuleSubmenu;
