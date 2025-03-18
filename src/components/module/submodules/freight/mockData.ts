
import { Carrier, Route, Shipment } from '@/types/freight';

// Mock carriers data
export const mockCarriers: Carrier[] = [
  { 
    id: 'c1', 
    name: 'DHL Express', 
    code: 'DHL', 
    type: 'international',
    contactName: 'Jean Dupont',
    contactEmail: 'jean.dupont@dhl.com',
    contactPhone: '+33 1 23 45 67 89',
    trackingUrlTemplate: 'https://www.dhl.com/fr-fr/home/tracking/tracking-express.html?submit=1&tracking-id={tracking_number}',
    active: true
  },
  { 
    id: 'c2', 
    name: 'FedEx', 
    code: 'FEDEX', 
    type: 'international',
    contactName: 'Marie Martin',
    contactEmail: 'marie.martin@fedex.com',
    contactPhone: '+33 1 23 45 67 90',
    trackingUrlTemplate: 'https://www.fedex.com/apps/fedextrack/?action=track&trackingnumber={tracking_number}',
    active: true
  },
  { 
    id: 'c3', 
    name: 'UPS', 
    code: 'UPS', 
    type: 'international',
    contactName: 'Paul Bernard',
    contactEmail: 'paul.bernard@ups.com',
    contactPhone: '+33 1 23 45 67 91',
    trackingUrlTemplate: 'https://www.ups.com/track?tracknum={tracking_number}',
    active: true
  },
  { 
    id: 'c4', 
    name: 'Chronopost', 
    code: 'CHRONO', 
    type: 'national',
    contactName: 'Sophie Petit',
    contactEmail: 'sophie.petit@chronopost.fr',
    contactPhone: '+33 1 23 45 67 92',
    trackingUrlTemplate: 'https://www.chronopost.fr/tracking-no-cms/suivi-page?listeNumerosLT={tracking_number}',
    active: true
  },
  { 
    id: 'c5', 
    name: 'La Poste - Colissimo', 
    code: 'COLISSIMO', 
    type: 'national',
    contactName: 'Thomas Leroy',
    contactEmail: 'thomas.leroy@laposte.fr',
    contactPhone: '+33 1 23 45 67 93',
    trackingUrlTemplate: 'https://www.laposte.fr/outils/suivre-vos-envois?code={tracking_number}',
    active: true
  },
  { 
    id: 'c6', 
    name: 'Transport Express Local', 
    code: 'TEL', 
    type: 'local',
    contactName: 'Julie Moreau',
    contactEmail: 'julie.moreau@tel.fr',
    contactPhone: '+33 1 23 45 67 94',
    active: true
  }
];

// Mock routes data
export const mockRoutes: Route[] = [
  {
    id: 'r1',
    name: 'Paris - Lyon',
    origin: 'Paris',
    destination: 'Lyon',
    distance: 465,
    estimatedTime: 4.5,
    transportType: 'road',
    active: true
  },
  {
    id: 'r2',
    name: 'Marseille - Paris',
    origin: 'Marseille',
    destination: 'Paris',
    distance: 775,
    estimatedTime: 7,
    transportType: 'road',
    active: true
  },
  {
    id: 'r3',
    name: 'Paris - Anvers',
    origin: 'Paris',
    destination: 'Anvers',
    distance: 340,
    estimatedTime: 3.5,
    transportType: 'road',
    active: true
  },
  {
    id: 'r4',
    name: 'Le Havre - Rotterdam',
    origin: 'Le Havre',
    destination: 'Rotterdam',
    distance: 650,
    estimatedTime: 48,
    transportType: 'sea',
    active: true
  },
  {
    id: 'r5',
    name: 'Lyon - Milan',
    origin: 'Lyon',
    destination: 'Milan',
    distance: 335,
    estimatedTime: 3.75,
    transportType: 'road',
    active: true
  }
];

// Mock shipments data
export const mockShipments: Shipment[] = [
  {
    id: 's1',
    reference: 'EXP-1024',
    origin: 'Paris',
    destination: 'Lyon',
    customer: 'Logistique Express',
    carrier: 'c4',
    carrierName: 'Chronopost',
    shipmentType: 'local',
    status: 'delivered',
    trackingNumber: 'CHR7891234560',
    createdAt: '2023-10-12T10:00:00Z',
    scheduledDate: '2023-10-15T08:00:00Z',
    estimatedDeliveryDate: '2023-10-16T18:00:00Z',
    actualDeliveryDate: '2023-10-16T17:32:00Z',
    routeId: 'r1',
    lines: [
      {
        id: 'sl1',
        productName: 'Ordinateurs portables',
        quantity: 5,
        weight: 2,
        packageType: 'box'
      },
      {
        id: 'sl2',
        productName: 'Moniteurs 24"',
        quantity: 3,
        weight: 5,
        packageType: 'box'
      }
    ],
    totalWeight: 25,
    notes: 'Livraison à l\'accueil du bâtiment principal'
  },
  {
    id: 's2',
    reference: 'EXP-1023',
    origin: 'Marseille',
    destination: 'Paris',
    customer: 'TransportPlus',
    carrier: 'c6',
    carrierName: 'Transport Express Local',
    shipmentType: 'local',
    status: 'in_transit',
    trackingNumber: 'TEL7891234561',
    createdAt: '2023-10-13T11:30:00Z',
    scheduledDate: '2023-10-14T09:00:00Z',
    estimatedDeliveryDate: '2023-10-15T14:00:00Z',
    routeId: 'r2',
    lines: [
      {
        id: 'sl3',
        productName: 'Fournitures de bureau',
        quantity: 20,
        weight: 0.5,
        packageType: 'box'
      }
    ],
    totalWeight: 10
  },
  {
    id: 's3',
    reference: 'EXP-1022',
    origin: 'Paris',
    destination: 'Anvers',
    customer: 'Cargo International',
    carrier: 'c1',
    carrierName: 'DHL Express',
    shipmentType: 'international',
    status: 'in_transit',
    trackingNumber: 'DHL7891234562',
    createdAt: '2023-10-11T14:45:00Z',
    scheduledDate: '2023-10-12T10:00:00Z',
    estimatedDeliveryDate: '2023-10-14T18:00:00Z',
    routeId: 'r3',
    lines: [
      {
        id: 'sl4',
        productName: 'Serveurs informatiques',
        quantity: 2,
        weight: 15,
        packageType: 'crate'
      },
      {
        id: 'sl5',
        productName: 'Équipements réseau',
        quantity: 8,
        weight: 1.2,
        packageType: 'box'
      }
    ],
    totalWeight: 39.6,
    notes: 'Matériel sensible, manipuler avec précaution'
  },
  {
    id: 's4',
    reference: 'EXP-1021',
    origin: 'Le Havre',
    destination: 'Rotterdam',
    customer: 'MariTrans',
    carrier: 'c2',
    carrierName: 'FedEx',
    shipmentType: 'export',
    status: 'delivered',
    trackingNumber: 'FDX7891234563',
    createdAt: '2023-10-08T09:15:00Z',
    scheduledDate: '2023-10-10T06:00:00Z',
    estimatedDeliveryDate: '2023-10-12T12:00:00Z',
    actualDeliveryDate: '2023-10-12T11:20:00Z',
    routeId: 'r4',
    lines: [
      {
        id: 'sl6',
        productName: 'Pièces automobiles',
        quantity: 150,
        weight: 0.8,
        packageType: 'box'
      }
    ],
    totalWeight: 120
  },
  {
    id: 's5',
    reference: 'EXP-1020',
    origin: 'Lyon',
    destination: 'Milan',
    customer: 'AirCargo',
    carrier: 'c3',
    carrierName: 'UPS',
    shipmentType: 'export',
    status: 'delayed',
    trackingNumber: 'UPS7891234564',
    createdAt: '2023-10-07T16:30:00Z',
    scheduledDate: '2023-10-09T11:00:00Z',
    estimatedDeliveryDate: '2023-10-10T17:00:00Z',
    routeId: 'r5',
    lines: [
      {
        id: 'sl7',
        productName: 'Produits pharmaceutiques',
        quantity: 30,
        weight: 0.3,
        packageType: 'bag'
      },
      {
        id: 'sl8',
        productName: 'Documentation technique',
        quantity: 50,
        weight: 0.1,
        packageType: 'bag'
      }
    ],
    totalWeight: 14,
    notes: 'Retard dû aux conditions météorologiques'
  }
];
