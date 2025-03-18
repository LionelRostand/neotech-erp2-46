
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
        <div 
          onClick={() => {
            if (hasSubmodules) {
              toggleModuleSubmenus(module.id);
            } else {
              onNavigate(module.href);
            }
          }}
          className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
            isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <span className="mr-3 text-gray-500">{module.icon}</span>
          <span>{module.name}</span>
          
          {hasSubmodules && (
            <button 
              className="ml-auto text-gray-500 hover:text-gray-700 p-1"
              onClick={(e) => { 
                e.stopPropagation(); 
                toggleModuleSubmenus(module.id);
              }}
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>
      
      {hasSubmodules && isExpanded && (
        <ModuleSubmenu
          submodules={module.submodules || []}
          location={location}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
};

export default ModuleItem;
