
import React, { useEffect, useRef } from 'react';

// This patch helps initialize a Leaflet map when needed
export const GeolocationMapPatch = () => {
  const mapInitRef = useRef(false);
  
  useEffect(() => {
    if (mapInitRef.current) return;
    
    const initializeLeaflet = async () => {
      try {
        // Make sure Leaflet CSS is loaded
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css';
        link.integrity = 'sha512-Rksm5RenBEKSKFjgI3a41vrjkw4EVPlJ3+OiI65vTjIdo9brlAacEuKOiQ5OFh7cOI1bkDwLqdLw3Zg0cRJAAQ==';
        link.crossOrigin = '';
        document.head.appendChild(link);
        
        mapInitRef.current = true;
      } catch (error) {
        console.error("Error initializing Leaflet:", error);
      }
    };
    
    initializeLeaflet();
  }, []);
  
  return null;
};

export default GeolocationMapPatch;
