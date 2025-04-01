
import React, { useEffect } from 'react';

/**
 * This patch ensures Leaflet CSS is loaded for map components
 */
const LeafletCssPatch: React.FC = () => {
  useEffect(() => {
    // Add Leaflet CSS if not already present
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';
    
    // Check if the CSS is already loaded
    const existingLink = document.querySelector('link[href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"]');
    if (!existingLink) {
      document.head.appendChild(link);
      console.log('Leaflet CSS patch applied');
    }
  }, []);
  
  return null;
};

export default LeafletCssPatch;
