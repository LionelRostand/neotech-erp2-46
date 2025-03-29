
/**
 * Configure Leaflet icons correctly
 */
export const configureLeafletIcons = async () => {
  try {
    // Dynamic import to avoid SSR issues
    const L = await import('leaflet');
    
    // Fix Leaflet icon paths issue
    L.Icon.Default.imagePath = 'https://unpkg.com/leaflet@1.9.4/dist/images/';
    
    // Create custom default icon
    const DefaultIcon = L.Icon.extend({
      options: {
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      }
    });
    
    L.Marker.prototype.options.icon = new DefaultIcon();
    
    return L;
  } catch (error) {
    console.error("Error configuring Leaflet icons:", error);
    throw error;
  }
};
