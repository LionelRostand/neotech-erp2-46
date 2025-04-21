
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
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearch = useCallback(
    (reference: string) => {
      console.log("Recherche démarrée pour:", reference);
      console.log("Données disponibles - Conteneurs:", containers.length, "Tracking:", tracking.length);
      
      setIsLoading(true);
      setSearchDone(false);
      setFoundItems([]);
      setSearchQuery(reference);

      // Normaliser la référence pour la recherche (insensible à la casse, suppression des espaces)
      const normalizedReference = reference.toLowerCase().trim();
      
      // Recherche flexible: inclut tous les éléments qui contiennent la référence dans n'importe quel champ pertinent
      
      // Recherche dans les colis
      console.log("Recherche dans les colis...");
      const matchingPackages = tracking.filter((p: any) => {
        const trackingNum = (p.trackingNumber || "").toLowerCase();
        const ref = (p.reference || "").toLowerCase();
        const id = (p.id || "").toLowerCase();
        
        return trackingNum.includes(normalizedReference) || 
               ref.includes(normalizedReference) || 
               id.includes(normalizedReference);
      });
      
      console.log("Colis correspondants trouvés:", matchingPackages.length);

      // Pour chaque colis, obtenir son dernier événement avec localisation
      let packageItems: UnifiedTrackingItem[] = [];
      matchingPackages.forEach((p: any) => {
        console.log("Traitement du colis:", p.id, "Réf:", p.reference || p.trackingNumber);
        
        const events = trackingEvents
          .filter((ev: any) => ev.packageId === p.id && ev.location)
          .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        
        console.log("Événements trouvés pour ce colis:", events.length);
        
        if (events.length > 0) {
          const e = events[0];
          packageItems.push({
            id: e.id,
            refId: p.reference || p.trackingNumber,
            type: "package",
            label: e.description || "Dernier événement",
            status: e.status,
            latitude: e.location.latitude,
            longitude: e.location.longitude,
            timestamp: e.timestamp,
            locationText: formatAddress(e.location)
          });
        } else {
          console.log("Aucun événement avec localisation trouvé pour ce colis");
        }
      });

      // Recherche dans les conteneurs avec correspondance flexible
      console.log("Recherche dans les conteneurs...");
      const matchingContainers = containers.filter((c: any) => {
        // Vérifier tous les champs pertinents d'un conteneur
        const number = (c.number || "").toLowerCase();
        const id = (c.id || "").toLowerCase();
        const ref = (c.reference || "").toLowerCase();
        const booking = (c.bookingNumber || "").toLowerCase();
        
        return number.includes(normalizedReference) || 
               id.includes(normalizedReference) || 
               ref.includes(normalizedReference) || 
               booking.includes(normalizedReference);
      });
      
      console.log("Conteneurs correspondants trouvés:", matchingContainers.length);

      // Pour les conteneurs, placer les marqueurs selon les coordonnées disponibles
      let containerItems: UnifiedTrackingItem[] = [];
      matchingContainers.forEach((c: any) => {
        console.log("Traitement du conteneur:", c.id, "Numéro:", c.number);
        
        let lat = 48.8566, lon = 2.3522; // Paris par défaut
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
          refId: c.number || c.reference || c.id,
          type: "container",
          label: c.status || "Aucun statut",
          status: c.status,
          latitude: lat,
          longitude: lon,
          timestamp: c.arrivalDate || c.departureDate || "",
          locationText: locText || "",
        });
      });
      
      // Recherche dans les shipments également
      console.log("Recherche dans les expéditions...");
      const matchingShipments = shipments.filter((s: any) => {
        const ref = (s.reference || "").toLowerCase();
        const id = (s.id || "").toLowerCase();
        return ref.includes(normalizedReference) || id.includes(normalizedReference);
      });
      
      console.log("Expéditions correspondantes trouvées:", matchingShipments.length);
      
      // Ajouter les shipments aux résultats
      let shipmentItems: UnifiedTrackingItem[] = [];
      matchingShipments.forEach((s: any) => {
        console.log("Traitement de l'expédition:", s.id, "Référence:", s.reference);
        
        // Par défaut, utiliser l'origine ou la destination comme emplacement
        let lat = 48.8566, lon = 2.3522; // Paris par défaut
        let locText = s.currentLocation || s.destination || s.origin;
        
        if (locText && typeof locText === "string") {
          const lowerLoc = locText.toLowerCase();
          // Logique simplifiée pour démonstration
          if (lowerLoc.includes("london")) {
            lat = 51.5074; lon = -0.1278;
          } else if (lowerLoc.includes("berlin")) {
            lat = 52.52; lon = 13.40;
          } else if (lowerLoc.includes("tokyo")) {
            lat = 35.6762; lon = 139.6503;
          } else if (lowerLoc.includes("new york")) {
            lat = 40.7128; lon = -74.0060;
          }
        }
        
        shipmentItems.push({
          id: s.id,
          refId: s.reference || s.id,
          type: "shipment",
          label: s.status || "Expédition",
          status: s.status,
          latitude: lat,
          longitude: lon,
          timestamp: s.estimatedArrival || s.departureDate || s.createdAt || "",
          locationText: locText || "",
        });
      });

      // Combiner tous les résultats
      const all = [...packageItems, ...containerItems, ...shipmentItems];
      console.log("Total des éléments trouvés:", all.length);
      
      // Simule un délai pour l'expérience utilisateur
      setTimeout(() => {
        setFoundItems(all);
        setIsLoading(false);
        setSearchDone(true);
        if (all.length === 0) {
          toast({
            title: "Aucun résultat",
            description: `Aucun colis, conteneur ou expédition trouvé avec la référence "${reference}".`,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Résultats trouvés",
            description: `${all.length} élément(s) trouvé(s) pour "${reference}".`,
          });
        }
      }, 800);
    },
    [containers, tracking, trackingEvents, shipments, toast]
  );

  return { isLoading, foundItems, searchDone, handleSearch, loading, searchQuery };
}
