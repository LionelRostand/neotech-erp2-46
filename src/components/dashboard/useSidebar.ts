
import { useEffect } from 'react';
import { useSidebarContext } from './SidebarContext';

export const useSidebar = () => {
  const context = useSidebarContext();
  
  // Add more functionality specific to useSidebar if needed
  const { 
    expandedModules, 
    toggleModuleSubmenus, 
    expandedCategories, 
    toggleCategory, 
    isActiveModule,
    focusedSection, 
    setFocusedSection 
  } = context;
  
  // For backwards compatibility, we extract the sidebarOpen state from context
  const sidebarOpen = true; // Default value
  const toggleSidebar = () => {
    // You might want to implement this based on your needs
    console.log("Toggle sidebar functionality");
  };
  
  return {
    ...context,
    sidebarOpen,
    toggleSidebar
  };
};
