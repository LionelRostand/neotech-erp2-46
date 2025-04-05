
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppModule } from '@/data/types/modules';
import { useLocation } from 'react-router-dom';
import { CategoryService } from './CategoryService';

interface SidebarContextType {
  expandedModules: {[key: number]: boolean};
  toggleModuleSubmenus: (moduleId: number) => void;
  expandedCategories: {[key: string]: boolean};
  toggleCategory: (category: string) => void;
  focusedSection: string | null;
  setFocusedSection: (section: string | null) => void;
  isActiveModule: (moduleId: number) => boolean;
}

const SidebarContext = createContext<SidebarContextType | null>(null);

export const useSidebarContext = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebarContext must be used within a SidebarProvider');
  }
  return context;
};

interface SidebarProviderProps {
  children: React.ReactNode;
  installedModules: AppModule[];
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children, installedModules }) => {
  const location = useLocation();
  const [expandedModules, setExpandedModules] = useState<{[key: number]: boolean}>({});
  const [focusedSection, setFocusedSection] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<{[key: string]: boolean}>({
    'business': true,
    'services': false,
    'digital': false,
    'communication': false
  });

  // Business modules
  const businessModules = CategoryService.getModulesByCategory(installedModules, 'business');
  const serviceModules = CategoryService.getModulesByCategory(installedModules, 'services');
  const digitalModules = CategoryService.getModulesByCategory(installedModules, 'digital');
  const communicationModules = CategoryService.getModulesByCategory(installedModules, 'communication');

  // Find the current active module
  const activeModule = installedModules.find(module => 
    location.pathname.startsWith(module.href)
  );

  // Initialize expanded state for active module on route change
  useEffect(() => {
    if (activeModule) {
      // Only update if the active module isn't already expanded
      setExpandedModules(prev => {
        if (prev[activeModule.id]) {
          return prev; // No change needed, already expanded
        }
        return {
          ...prev,
          [activeModule.id]: true
        };
      });
      
      // Expand the category containing the active module
      setExpandedCategories(prev => {
        const updates = { ...prev };
        let categoryChanged = false;
        
        if (CategoryService.isModuleInCategory(activeModule, businessModules) && !prev.business) {
          updates.business = true;
          categoryChanged = true;
        } else if (CategoryService.isModuleInCategory(activeModule, serviceModules) && !prev.services) {
          updates.services = true;
          categoryChanged = true;
        } else if (CategoryService.isModuleInCategory(activeModule, digitalModules) && !prev.digital) {
          updates.digital = true;
          categoryChanged = true;
        } else if (CategoryService.isModuleInCategory(activeModule, communicationModules) && !prev.communication) {
          updates.communication = true;
          categoryChanged = true;
        }

        // Only return a new object if something changed, to prevent unnecessary rerenders
        return categoryChanged ? updates : prev;
      });
    }
  }, [
    location.pathname, 
    activeModule, 
    businessModules, 
    serviceModules, 
    digitalModules, 
    communicationModules
  ]);

  // Function to toggle submenu expansion
  const toggleModuleSubmenus = (moduleId: number) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  // Function to toggle category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Function to check if a module is active
  const isActiveModule = (moduleId: number) => {
    return activeModule?.id === moduleId;
  };

  const value = {
    expandedModules,
    toggleModuleSubmenus,
    expandedCategories,
    toggleCategory,
    focusedSection,
    setFocusedSection,
    isActiveModule,
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};
