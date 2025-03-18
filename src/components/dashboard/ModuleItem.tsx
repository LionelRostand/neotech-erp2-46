
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
  
  const handleClick = (e: React.MouseEvent) => {
    if (!hasSubmodules) {
      e.preventDefault();
      e.stopPropagation();
      onNavigate(module.href);
    }
  };
  
  return (
    <div className="mb-1">
      {hasSubmodules ? (
        <Accordion 
          type="single" 
          collapsible 
          value={isExpanded ? `module-${module.id}` : undefined}
          onValueChange={(value) => toggleModuleSubmenus(module.id)}
          className="border-none"
        >
          <AccordionItem value={`module-${module.id}`} className="border-none">
            <div 
              className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
                isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={handleClick}
            >
              <span className="mr-3 text-gray-500">{module.icon}</span>
              <AccordionTrigger className="flex-1 flex items-center py-0 hover:no-underline">
                <span>{module.name}</span>
              </AccordionTrigger>
            </div>
            
            <AccordionContent className="pb-0 pt-1 px-0">
              <ModuleSubmenu
                submodules={module.submodules || []}
                location={location}
                onNavigate={onNavigate}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : (
        <div 
          onClick={() => onNavigate(module.href)}
          className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
            isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <span className="mr-3 text-gray-500">{module.icon}</span>
          <span>{module.name}</span>
        </div>
      )}
    </div>
  );
};

export default ModuleItem;
