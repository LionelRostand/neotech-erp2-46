
import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import ModuleSubmenu from './ModuleSubmenu';
import { AppModule } from '@/data/types/modules';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

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
  
  if (!hasSubmodules) {
    return (
      <div 
        onClick={() => onNavigate(module.href)}
        className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md cursor-pointer mb-1 ${
          isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`}
      >
        <span className="mr-3 text-gray-500">{module.icon}</span>
        <span>{module.name}</span>
      </div>
    );
  }
  
  return (
    <div className="mb-1">
      <Accordion 
        type="single" 
        collapsible 
        value={isExpanded ? `module-${module.id}` : undefined}
        onValueChange={(value) => {
          if (value === `module-${module.id}` || value === "") {
            toggleModuleSubmenus(module.id);
          }
        }}
        className="border-none"
      >
        <AccordionItem value={`module-${module.id}`} className="border-none">
          <div 
            className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
              isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <span className="mr-3 text-gray-500">{module.icon}</span>
            <span 
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(module.href);
              }}
            >
              {module.name}
            </span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleModuleSubmenus(module.id);
              }}
              className="p-1 rounded-full hover:bg-gray-200"
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
          
          <AccordionContent className="pb-0 pt-1 px-0">
            <ModuleSubmenu
              module={module}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ModuleItem;
