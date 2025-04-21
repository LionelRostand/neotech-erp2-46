
import React, { useCallback, useMemo, useState } from "react";
import UnifiedTrackingSearch from "./UnifiedTrackingSearch";
import UnifiedTrackingMap, { UnifiedTrackingItem } from "./UnifiedTrackingMap";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Package, Container, Truck } from "lucide-react";
import useFreightData from "@/hooks/modules/useFreightData";
import { formatAddress } from "./utils/locationUtils";

const UnifiedTrackingPage: React.FC = () => {
  const { shipments, containers, tracking, trackingEvents, loading } = useFreightData();
  const [isLoading, setIsLoading] = useState(false);
  const [foundItems, setFoundItems] = useState<UnifiedTrackingItem[]>([]);
  const [searchDone, setSearchDone] = useState(false);
  const { toast } = useToast();

  const handleSearch = useCallback(
    (reference: string) => {
      setIsLoading(true);
      setSearchDone(false);
      setFoundItems([]);

      // Recherche colis (par numéro de tracking ou référence)
      const matchingPackages = tracking
        .filter((p: any) =>
          (p.trackingNumber ?? "").toLowerCase().includes(reference.toLowerCase()) ||
          (p.reference ?? "").toLowerCase().includes(reference.toLowerCase())
        );

      // Construction des points colis
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

      // Recherche conteneurs (par numéro/id)
      const matchingContainers = containers
        .filter((c: any) =>
          (c.number ?? "").toLowerCase().includes(reference.toLowerCase()) ||
          (c.id ?? "").toLowerCase().includes(reference.toLowerCase())
        );
      let containerItems: UnifiedTrackingItem[] = [];
      matchingContainers.forEach((c: any) => {
        // On tente de placer le conteneur à sa ville d'arrivée
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

      // Recherche expéditions (shipments) par référence OU trackingNumber
      const matchingShipments = shipments.filter((s: any) =>
        (s.reference ?? "").toLowerCase().includes(reference.toLowerCase()) ||
        (s.trackingNumber ?? "").toLowerCase().includes(reference.toLowerCase())
      );
      let shipmentItems: UnifiedTrackingItem[] = [];
      matchingShipments.forEach((s: any) => {
        // City to Lat/Lon (demo : code simple)
        const getCoords = (loc: string) => {
          if (!loc) return [48.8566, 2.3522];
          const lower = loc.toLowerCase();
          if (lower.includes("london")) return [51.5074, -0.1278];
          if (lower.includes("berlin")) return [52.52, 13.40];
          if (lower.includes("tokyo")) return [35.6762, 139.6503];
          if (lower.includes("paris")) return [48.8566, 2.3522];
          return [48.8566, 2.3522]; // fallback Paris
        };
        // On place l’expédition sur la ville de destination
        const [lat, lon] = getCoords(s.destination || s.origin);
        shipmentItems.push({
          id: s.id,
          refId: s.reference || s.trackingNumber,
          type: "shipment",
          label: s.status || "Statut inconnu",
          status: s.status,
          latitude: lat,
          longitude: lon,
          timestamp: s.estimatedDeliveryDate || s.scheduledDate || s.createdAt || "",
          locationText: s.destination || s.origin || "",
        });
      });

      // On fusionne tous les résultats
      const all: UnifiedTrackingItem[] = [
        ...packageItems,
        ...containerItems,
        ...shipmentItems
      ];

      setTimeout(() => {
        setFoundItems(all);
        setIsLoading(false);
        setSearchDone(true);
      }, 800);
    },
    [shipments, containers, tracking, trackingEvents]
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
                      ) : item.type === "container" ? (
                        <Container className="h-5 w-5 text-green-500" />
                      ) : (
                        <Truck className="h-5 w-5 text-purple-500" />
                      )}
                    </span>
                    <div>
                      <div className="font-bold">
                        {item.type === "package"
                          ? "Colis"
                          : item.type === "container"
                          ? "Conteneur"
                          : "Expédition"}{" "}
                        – {item.refId}
                      </div>
                      <div className="text-xs mb-1">{item.label}</div>
                      <div className="text-sm text-muted-foreground">{item.locationText}</div>
                      <div className="text-xs text-gray-500">
                        {item.timestamp
                          ? new Date(item.timestamp).toLocaleString("fr-FR")
                          : ""}
                      </div>
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

