
import React, { useCallback, useMemo, useState } from "react";
import UnifiedTrackingSearch from "./UnifiedTrackingSearch";
import UnifiedTrackingMap, { UnifiedTrackingItem } from "./UnifiedTrackingMap";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Package, Container } from "lucide-react";
import useFreightData from "@/hooks/modules/useFreightData";
import { formatAddress } from "./utils/locationUtils";

const UnifiedTrackingPage: React.FC = () => {
  const { shipments, containers, tracking, trackingEvents, loading } = useFreightData();
  const [isLoading, setIsLoading] = useState(false);
  const [foundItems, setFoundItems] = useState<UnifiedTrackingItem[]>([]);
  const [searchDone, setSearchDone] = useState(false);
  const { toast } = useToast();

  // Combine events and containers/latest-locations logic
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
        // Try use arrival for geocoding: we only check if arrival is a string like "Paris" for demo
        // In a real app, you'd use a geo API for coordinates from city names!
        // We will locate it in Paris for demo if "arrival" includes "paris"
        let lat = 48.8566, lon = 2.3522;
        let locText = c.arrival || c.destination || c.location || c.origin;
        if (locText && typeof locText === "string" && locText.toLowerCase().includes("london")) {
          lat = 51.5074; lon = -0.1278;
        }
        if (locText && typeof locText === "string" && locText.toLowerCase().includes("berlin")) {
          lat = 52.52; lon = 13.40;
        }
        if (locText && typeof locText === "string" && locText.toLowerCase().includes("tokyo")) {
          lat = 35.6762; lon = 139.6503;
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
      }, 800);
    },
    [containers, tracking, trackingEvents]
  );

  return (
    <div>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-500" />
            Suivi en temps réel - Colis & Conteneurs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UnifiedTrackingSearch onResult={handleSearch} isLoading={isLoading || loading} />
        </CardContent>
      </Card>
      {(!searchDone || isLoading) && (
        <div className="flex items-center justify-center h-40">
          {isLoading ? <div>Chargement en cours...</div> : <div>Saisissez une référence pour démarrer.</div>}
        </div>
      )}
      {searchDone && foundItems.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Carte des événements trouvés</CardTitle>
            </CardHeader>
            <CardContent>
              <UnifiedTrackingMap items={foundItems} />
            </CardContent>
          </Card>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Liste des événements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-gray-200">
                {foundItems.map((item) => (
                  <li key={item.id} className="py-3 flex gap-4 items-start">
                    <span>
                      {item.type === "package" ? (
                        <Package className="h-5 w-5 text-blue-500" />
                      ) : (
                        <Container className="h-5 w-5 text-green-500" />
                      )}
                    </span>
                    <div>
                      <div className="font-bold">
                        {item.type === "package" ? "Colis" : "Conteneur"} – {item.refId}
                      </div>
                      <div className="text-xs mb-1">{item.label}</div>
                      <div className="text-sm text-muted-foreground">{item.locationText}</div>
                      <div className="text-xs text-gray-500">{new Date(item.timestamp).toLocaleString("fr-FR")}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </>
      )}
      {searchDone && foundItems.length === 0 && (
        <div className="bg-red-500 text-white p-4 rounded-md">
          <div className="font-medium">
            Aucun résultat
          </div>
          <div className="text-sm">
            Aucun colis ou conteneur trouvé avec cette référence.
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedTrackingPage;
