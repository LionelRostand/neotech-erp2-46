
import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
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
    <div className="mb-1">
      <div className="relative">
        <button 
          className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
            isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
          onClick={() => onNavigate(module.href)}
        >
          <span className="mr-3 text-gray-500">{module.icon}</span>
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
        </button>
      </div>
      
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
