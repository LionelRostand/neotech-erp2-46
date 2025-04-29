
import { useEffect } from 'react';
import { useSidebarContext } from './SidebarContext';

export const useSidebar = () => {
  const context = useSidebarContext();
  
  // Listen for the focus event from Welcome page
  useEffect(() => {
    const handleFocusInstalledApps = () => {
      context.setFocusedSection('applications');
      
      // Scroll applications section into view if needed
      setTimeout(() => {
        const appsSection = document.getElementById('applications-section');
        if (appsSection) {
          appsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    };
    
    window.addEventListener('focusInstalledApps', handleFocusInstalledApps);
    
    return () => {
      window.removeEventListener('focusInstalledApps', handleFocusInstalledApps);
    };
  }, [context]);

  return context;
};
