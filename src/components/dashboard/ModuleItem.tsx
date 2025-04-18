
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

const getModuleColor = (moduleId: number) => {
  // Add specific colors based on module ID
  switch (moduleId) {
    case 1: // Employees/RH
      return 'bg-purple-100 hover:bg-purple-200 text-purple-900';
    case 2: // Companies
      return 'bg-blue-100 hover:bg-blue-200 text-blue-900';
    case 3: // Accounting
      return 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900';
    case 4: // Projects
      return 'bg-amber-100 hover:bg-amber-200 text-amber-900';
    case 5: // CRM
      return 'bg-rose-100 hover:bg-rose-200 text-rose-900';
    case 6: // Restaurant
      return 'bg-orange-100 hover:bg-orange-200 text-orange-900';
    case 7: // Garage
      return 'bg-slate-100 hover:bg-slate-200 text-slate-900';
    case 8: // Transport
      return 'bg-cyan-100 hover:bg-cyan-200 text-cyan-900';
    case 9: // Health
      return 'bg-red-100 hover:bg-red-200 text-red-900';
    case 10: // Vehicle Rentals
      return 'bg-indigo-100 hover:bg-indigo-200 text-indigo-900';
    case 11: // Freight
      return 'bg-teal-100 hover:bg-teal-200 text-teal-900';
    case 12: // Salon
      return 'bg-pink-100 hover:bg-pink-200 text-pink-900';
    case 13: // Website
      return 'bg-violet-100 hover:bg-violet-200 text-violet-900';
    case 14: // E-commerce
      return 'bg-lime-100 hover:bg-lime-200 text-lime-900';
    case 15: // Academy
      return 'bg-fuchsia-100 hover:bg-fuchsia-200 text-fuchsia-900';
    case 16: // Events
      return 'bg-sky-100 hover:bg-sky-200 text-sky-900';
    case 17: // Messages
      return 'bg-yellow-100 hover:bg-yellow-200 text-yellow-900';
    case 18: // Documents
      return 'bg-neutral-100 hover:bg-neutral-200 text-neutral-900';
    default:
      return 'bg-gray-100 hover:bg-gray-200 text-gray-900';
  }
};

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
  const moduleColor = getModuleColor(module.id);
  
  if (!hasSubmodules) {
    return (
      <div 
        onClick={() => onNavigate(module.href)}
        className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md cursor-pointer mb-1 ${
          isActive ? moduleColor : 'text-gray-600 hover:bg-gray-50'
        }`}
      >
        <span className="mr-3">{module.icon}</span>
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
              isActive ? moduleColor : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="mr-3">{module.icon}</span>
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
              submodules={module.submodules || []}
              location={location}
              onNavigate={onNavigate}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ModuleItem;

