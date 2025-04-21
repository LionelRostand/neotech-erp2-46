
import { useState, useCallback } from "react";
import { UnifiedTrackingItem } from "@/components/module/submodules/freight/tracking/UnifiedTrackingMap";
import useFreightData from "@/hooks/modules/useFreightData";
import { useToast } from "@/hooks/use-toast";
import { formatAddress } from "@/components/module/submodules/freight/tracking/utils/locationUtils";

export function useUnifiedTracking() {
  const { shipments, containers, tracking, trackingEvents, loading } = useFreightData();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [searchDone, setSearchDone] = useState(false);
  const [foundItems, setFoundItems] = useState<UnifiedTrackingItem[]>([]);

  const handleSearch = useCallback(
    (reference: string) => {
      setIsLoading(true);
      setSearchDone(false);
      setFoundItems([]);

      // Find packages with matching reference (case-insensitive)
      const matchingPackages = tracking
        .filter((p: any) =>
          (p.trackingNumber ?? "").toLowerCase().includes(reference.toLowerCase()) ||
          (p.reference ?? "").toLowerCase().includes(reference.toLowerCase())
        );

      // For each package, get its latest event with location
      let packageItems: UnifiedTrackingItem[] = [];
      matchingPackages.forEach((p: any) => {
        const events = trackingEvents
          .filter((ev: any) => ev.packageId === p.id && ev.location)
          .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        if (events.length > 0) {
          const e = events[0];
          packageItems.push({
            id: e.id,
            refId: p.reference || p.trackingNumber,
            type: "package",
            label: e.description || "",
            status: e.status,
            latitude: e.location.latitude,
            longitude: e.location.longitude,
            timestamp: e.timestamp,
            locationText: formatAddress(e.location)
          });
        }
      });

      // Find containers with matching number or id (case-insensitive)
      const matchingContainers = containers
        .filter((c: any) =>
          (c.number ?? "").toLowerCase().includes(reference.toLowerCase()) ||
          (c.id ?? "").toLowerCase().includes(reference.toLowerCase())
        );
      // For demo: place container marker at arrival city if available
      let containerItems: UnifiedTrackingItem[] = [];
      matchingContainers.forEach((c: any) => {
        let lat = 48.8566, lon = 2.3522; // Paris default
        let locText = c.arrival || c.destination || c.location || c.origin;
        if (locText && typeof locText === "string") {
          const lowerLoc = locText.toLowerCase();
          if (lowerLoc.includes("london")) {
            lat = 51.5074; lon = -0.1278;
          } else if (lowerLoc.includes("berlin")) {
            lat = 52.52; lon = 13.40;
          } else if (lowerLoc.includes("tokyo")) {
            lat = 35.6762; lon = 139.6503;
          }
        }
        containerItems.push({
          id: c.id,
          refId: c.number || c.id,
          type: "container",
          label: c.status || "Aucun statut",
          status: c.status,
          latitude: lat,
          longitude: lon,
          timestamp: c.arrivalDate || c.departureDate || "",
          locationText: locText || "",
        });
      });
      // Combine
      const all = [...packageItems, ...containerItems];
      setTimeout(() => {
        setFoundItems(all);
        setIsLoading(false);
        setSearchDone(true);
        if (all.length === 0) {
          toast({
            title: "Aucun résultat",
            description: "Aucun colis ou conteneur trouvé avec cette référence.",
            variant: "destructive",
          });
        }
      }, 800);
    },
    [containers, tracking, trackingEvents, toast]
  );

  return { isLoading, foundItems, searchDone, handleSearch, loading };
}
