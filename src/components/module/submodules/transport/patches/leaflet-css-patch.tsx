
import React, { useEffect, useRef } from 'react';
import '../styles/leaflet-map.css';

// This patch helps initialize Leaflet CSS when needed
export const LeafletCssPatch = () => {
  const cssInitRef = useRef(false);
  
  useEffect(() => {
    if (cssInitRef.current) return;
    
    const initializeLeafletCss = async () => {
      try {
        // Make sure Leaflet CSS is loaded
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.integrity = 'sha512-Rksm5RenBEKSKFjgI3a41vrjkw4EVPlJ3+OiI65vTjIdo9brlAacEuKOiQ5OFh7cOI1bkDwLqdLw3Zg0cRJAAQ==';
        link.crossOrigin = '';
        document.head.appendChild(link);
        
        cssInitRef.current = true;
      } catch (error) {
        console.error("Error initializing Leaflet CSS:", error);
      }
    };
    
    initializeLeafletCss();
  }, []);
  
  return null;
};

export default LeafletCssPatch;
