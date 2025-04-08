
import { TrackingEvent, PackageStatus } from '@/types/freight';

export function formatPackageStatus(status: string): string {
  const statusLabels: Record<string, string> = {
    registered: 'Enregistré',
    processing: 'En traitement',
    in_transit: 'En transit',
    out_for_delivery: 'En cours de livraison',
    delivered: 'Livré',
    delayed: 'Retardé',
    exception: 'Problème',
    returned: 'Retourné',
    lost: 'Perdu'
  };
  
  return statusLabels[status] || status;
}

export function getPackageTrackingEvents(packageId: string): TrackingEvent[] {
  // Ces données devraient normalement venir de la base de données
  const mockEvents: TrackingEvent[] = [
    {
      id: "event1",
      packageId,
      timestamp: new Date().toISOString(),
      status: "in_transit",
      location: {
        latitude: 48.8566,
        longitude: 2.3522,
        address: "12 Rue de Rivoli",
        city: "Paris",
        country: "France",
        postalCode: "75001"
      },
      description: "Colis en transit à Paris",
      isNotified: true
    },
    {
      id: "event2",
      packageId,
      timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      status: "processing",
      location: {
        latitude: 51.5074,
        longitude: -0.1278,
        address: "10 Downing Street",
        city: "London",
        country: "United Kingdom",
        postalCode: "SW1A 2AA"
      },
      description: "Colis traité à Londres",
      isNotified: true
    },
    {
      id: "event3",
      packageId,
      timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      status: "registered",
      location: {
        latitude: 51.5074,
        longitude: -0.1278,
        address: "1 London Bridge St",
        city: "London",
        country: "United Kingdom",
        postalCode: "SE1 9BG"
      },
      description: "Colis enregistré à Londres",
      isNotified: true
    }
  ];
  
  return mockEvents;
}

export function getTrackingEventsByTrackingNumber(trackingNumber: string): TrackingEvent[] {
  // Dans une vraie application, cette fonction rechercherait dans la base de données
  // les événements de suivi associés à un numéro de suivi
  return getPackageTrackingEvents("mock-package-id");
}
