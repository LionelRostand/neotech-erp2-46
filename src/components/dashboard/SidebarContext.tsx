
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
      setExpandedModules(prev => ({
        ...prev,
        [activeModule.id]: true
      }));
      
      // Expand the category containing the active module
      if (CategoryService.isModuleInCategory(activeModule, businessModules)) {
        setExpandedCategories(prev => ({ ...prev, business: true }));
      } else if (CategoryService.isModuleInCategory(activeModule, serviceModules)) {
        setExpandedCategories(prev => ({ ...prev, services: true }));
      } else if (CategoryService.isModuleInCategory(activeModule, digitalModules)) {
        setExpandedCategories(prev => ({ ...prev, digital: true }));
      } else if (CategoryService.isModuleInCategory(activeModule, communicationModules)) {
        setExpandedCategories(prev => ({ ...prev, communication: true }));
      }
    }
  }, [location.pathname, activeModule, businessModules, serviceModules, digitalModules, communicationModules]);

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
