
import React from 'react';
import { useLocation } from 'react-router-dom';
import CategoryHeader from './CategoryHeader';
import ModulesList from './ModulesList';
import { AppModule } from '@/data/types/modules';
import { useSidebarContext } from './SidebarContext';

interface CategorySectionProps {
  category: string;
  modules: AppModule[];
  onNavigate: (href: string) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({ 
  category, 
  modules, 
  onNavigate 
}) => {
  const location = useLocation();
  const { expandedCategories, toggleCategory, expandedModules, toggleModuleSubmenus } = useSidebarContext();
  
  return (
    <div>
      <CategoryHeader 
        category={category} 
        isExpanded={expandedCategories[category] || false} 
        onToggle={() => toggleCategory(category)}
        hasModules={modules.length > 0}
      />
      
      {expandedCategories[category] && (
        <ModulesList 
          installedModules={modules}
          expandedModules={expandedModules}
          toggleModuleSubmenus={toggleModuleSubmenus}
          showModules={true}
          location={location}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
};

export default CategorySection;
