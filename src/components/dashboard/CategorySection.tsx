
import React from 'react';
import { cn } from "@/lib/utils";
import { AppModule } from '@/data/types/modules';
import NavLink from './NavLink';
import ModuleSubmenu from './ModuleSubmenu';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useSidebar } from './useSidebar';

interface CategorySectionProps {
  category: string;
  modules: AppModule[];
  onNavigate: (href: string) => void;
}

const CategorySection = ({ category, modules, onNavigate }: CategorySectionProps) => {
  const { focusedSection } = useSidebar();
  
  if (modules.length === 0) return null;
  
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'business':
        return 'BUSINESS';
      case 'services':
        return 'SERVICES SPÉCIALISÉS';
      case 'digital':
        return 'DIGITAL';
      case 'communication':
        return 'COMMUNICATION';
      default:
        return category.toUpperCase();
    }
  };

  const getCategoryStyles = (category: string) => {
    if (category === 'services') {
      return 'text-red-600 font-semibold';
    }
    return 'text-gray-500';
  };

  return (
    <div className="mt-4">
      <div className={cn(
        "px-4 py-2 text-xs font-medium uppercase tracking-wider",
        getCategoryStyles(category)
      )}>
        {getCategoryLabel(category)}
      </div>
      
      {modules.map(module => (
        <Accordion type="single" collapsible key={module.id}>
          <AccordionItem value={module.name.toLowerCase()} className="border-none">
            <NavLink
              key={module.id}
              icon={module.icon}
              label={module.name}
              href={`/modules/${module.route}`}
              isActive={module.isActive}
              onClick={() => onNavigate(`/modules/${module.route}`)}
              className={cn(
                "w-full",
                focusedSection === module.route && "ring-2 ring-primary ring-opacity-50"
              )}
              showSubmenu={module.submodules && module.submodules.length > 0}
            >
              {module.submodules && module.submodules.length > 0 && (
                <ModuleSubmenu
                  submodules={module.submodules}
                  isActive={module.isActive}
                  parentRoute={module.route}
                  onNavigate={onNavigate}
                />
              )}
            </NavLink>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  );
};

export default CategorySection;
