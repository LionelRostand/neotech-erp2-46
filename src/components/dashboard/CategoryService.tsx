
import { AppModule } from '@/data/types/modules';

// Service to handle category-related functionality
export const CategoryService = {
  // Get modules by category
  getModulesByCategory: (modules: AppModule[], category: string): AppModule[] => {
    return modules.filter(m => m.category === category);
  },
  
  // Get active module in category
  getActiveModuleInCategory: (modules: AppModule[], pathname: string): AppModule | undefined => {
    return modules.find(module => pathname.startsWith(module.href));
  },
  
  // Check if module is in category
  isModuleInCategory: (module: AppModule, categoryModules: AppModule[]): boolean => {
    return categoryModules.some(m => m.id === module.id);
  }
};
