
import React, { useEffect, useRef } from "react";
import { MapPin, Package, Container } from "lucide-react";
import 'leaflet/dist/leaflet.css';

export interface UnifiedTrackingItem {
  id: string; // eventId
  refId: string; // packageId or containerId
  type: "package" | "container";
  label: string; // description
  status: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  locationText: string;
}

interface UnifiedTrackingMapProps {
  items: UnifiedTrackingItem[];
}

const UnifiedTrackingMap: React.FC<UnifiedTrackingMapProps> = ({ items }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;
    const initMap = async () => {
      const L = (await import("leaflet")).default;

      // Clean up previous instance
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      // Default paris coordinates
      let center: [number, number] = [48.852969, 2.349903];
      let zoom = 11;

      if (items.length > 0) {
        center[0] = items[0].latitude;
        center[1] = items[0].longitude;
        zoom = 5.5;
      }

      const map = L.map(mapRef.current).setView(center, zoom);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png", {
        attribution:
          'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
        minZoom: 1,
        maxZoom: 20,
      }).addTo(map);

      const markers: any[] = [];

      items.forEach((item) => {
        // Icon: different color for package/container
        const iconHtml =
          item.type === "package"
            ? '<div class="bg-blue-500 text-white p-1 rounded-full flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" class="lucide lucide-package"><path d="m12.89 1.45 8 4A2 2 0 0 1 22 7.24v9.53a2 2 0 0 1-1.11 1.79l-8 4a2 2 0 0 1-1.79 0l-8-4a2 2 0 0 1-1.1-1.8V7.24a2 2 0 0 1 1.11-1.79l8-4a2 2 0 0 1 1.78 0Z"></path><path d="M2.32 6.16 12 11l9.68-4.84"></path><path d="M12 22.76V11"></path></svg></div>'
            : '<div class="bg-green-500 text-white p-1 rounded-full flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" class="lucide lucide-container"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18"/><path d="M7 6v12"/><path d="M17 6v12"/></svg></div>';

        const markerIcon = L.divIcon({
          className: "tracking-marker",
          html: iconHtml,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -16],
        });

        const marker = L.marker([item.latitude, item.longitude], { icon: markerIcon }).addTo(map);
        const title = item.type === "package" ? "Colis" : "Conteneur";

        marker.bindPopup(`
          <div class="p-2">
            <div class="font-bold">${title} – ${item.refId}</div>
            <div class="text-xs mb-1">${item.label}</div>
            <div class="text-sm">${item.locationText}</div>
            <div class="text-xs text-gray-500">${new Date(item.timestamp).toLocaleString("fr-FR")}</div>
          </div>
        `);
        markers.push(marker);
      });

      markersRef.current = markers;
      if (markers.length) {
        const group = L.featureGroup(markers);
        try {
          map.fitBounds(group.getBounds().pad(0.25));
        } catch {}
      }
    };

    initMap();
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersRef.current = [];
      }
    };
  }, [items]);

  // style classique avec min-h- pour mobile, hauteur forcée sinon 400px
  return (
    <div
      className="w-full min-h-[400px] h-[400px] rounded-md overflow-hidden relative"
      ref={mapRef}
      id="map"
      style={{ height: "400px" }}
    />
  );
};

export default UnifiedTrackingMap;
