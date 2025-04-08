
import { TrackingEvent, PackageStatus, Package } from '@/types/freight';

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

// Mock packages data for demonstration
const mockPackages: Package[] = [
  {
    id: "pkg1",
    reference: "TRK123456789",
    description: "Colis express international",
    weight: 2.5,
    weightUnit: "kg",
    dimensions: {
      length: 30,
      width: 20,
      height: 15,
      unit: "cm"
    },
    declaredValue: 150,
    currency: "EUR",
    contents: "Documents et échantillons",
    packageType: "box",
    carrierId: "carrier1",
    carrierName: "DHL",
    trackingNumber: "TRK123456789",
    status: "shipped",  // Changed from "in_transit" to "shipped"
    labelGenerated: true,
    labelUrl: "https://example.com/label/TRK123456789",
    createdAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    documents: []
  },
  {
    id: "pkg2",
    reference: "PKG987654321",
    description: "Colis standard",
    weight: 5,
    weightUnit: "kg",
    dimensions: {
      length: 40,
      width: 30,
      height: 25,
      unit: "cm"
    },
    packageType: "box",
    carrierId: "carrier2",
    carrierName: "FedEx",
    trackingNumber: "PKG987654321",
    status: "delivered",
    labelGenerated: true,
    createdAt: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
    documents: []
  },
  {
    id: "pkg3",
    reference: "TRK202301001",
    description: "Documents urgents",
    weight: 0.5,
    weightUnit: "kg",
    packageType: "envelope",
    carrierId: "carrier3",
    carrierName: "UPS",
    trackingNumber: "TRK202301001",
    status: "ready",  // Changed from "processing" to "ready"
    labelGenerated: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    documents: []
  },
  {
    id: "pkg4",
    reference: "PKG202302002",
    description: "Colis fragile",
    weight: 3.5,
    weightUnit: "kg",
    dimensions: {
      length: 50,
      width: 40,
      height: 20,
      unit: "cm"
    },
    declaredValue: 350,
    currency: "EUR",
    contents: "Équipement électronique",
    packageType: "fragile",
    shipmentId: "ship123",
    carrierId: "carrier4",
    carrierName: "La Poste",
    trackingNumber: "PKG202302002",
    status: "ready",
    labelGenerated: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    documents: []
  }
];

// Function to get a package by its tracking number
export function getPackageByTrackingNumber(trackingNumber: string): Package | undefined {
  return mockPackages.find(
    pkg => pkg.trackingNumber === trackingNumber || pkg.reference === trackingNumber
  );
}
