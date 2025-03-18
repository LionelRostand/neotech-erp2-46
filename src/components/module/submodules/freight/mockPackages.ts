
import { Package, Carrier } from '@/types/freight';

export const mockPackages: Package[] = [
  {
    id: 'pkg-001',
    reference: 'PKG-2023-001',
    description: 'Documents commerciaux',
    weight: 1.2,
    weightUnit: 'kg',
    dimensions: {
      length: 30,
      width: 21,
      height: 5,
      unit: 'cm'
    },
    declaredValue: 150,
    currency: 'EUR',
    contents: 'Documents commerciaux et échantillons',
    packageType: 'envelope',
    shipmentId: 'ship-001',
    carrierId: 'car-001',
    carrierName: 'DHL Express',
    trackingNumber: 'DHX1234567890',
    status: 'shipped',
    labelGenerated: true,
    labelUrl: '/mock-label-001.pdf',
    createdAt: '2023-11-15T10:30:00Z',
    documents: [
      {
        id: 'doc-001',
        name: 'Facture commerciale',
        type: 'invoice',
        url: '/docs/invoice-001.pdf',
        createdAt: '2023-11-15T10:35:00Z'
      },
      {
        id: 'doc-002',
        name: 'Bon de livraison',
        type: 'delivery_note',
        url: '/docs/delivery-001.pdf',
        createdAt: '2023-11-15T10:36:00Z'
      }
    ]
  },
  {
    id: 'pkg-002',
    reference: 'PKG-2023-002',
    description: 'Échantillons produits',
    weight: 5.7,
    weightUnit: 'kg',
    dimensions: {
      length: 40,
      width: 30,
      height: 20,
      unit: 'cm'
    },
    declaredValue: 350,
    currency: 'EUR',
    contents: 'Échantillons produits textile',
    packageType: 'box',
    shipmentId: 'ship-002',
    carrierId: 'car-002',
    carrierName: 'UPS',
    trackingNumber: 'UPS98765432109',
    status: 'delivered',
    labelGenerated: true,
    labelUrl: '/mock-label-002.pdf',
    createdAt: '2023-11-17T14:45:00Z',
    documents: [
      {
        id: 'doc-003',
        name: 'Facture commerciale',
        type: 'invoice',
        url: '/docs/invoice-002.pdf',
        createdAt: '2023-11-17T14:50:00Z'
      },
      {
        id: 'doc-004',
        name: 'Documents douaniers',
        type: 'customs',
        url: '/docs/customs-002.pdf',
        createdAt: '2023-11-17T14:55:00Z'
      }
    ]
  },
  {
    id: 'pkg-003',
    reference: 'PKG-2023-003',
    description: 'Matériel informatique',
    weight: 8.3,
    weightUnit: 'kg',
    dimensions: {
      length: 50,
      width: 40,
      height: 30,
      unit: 'cm'
    },
    declaredValue: 1200,
    currency: 'EUR',
    contents: 'Équipement informatique - laptop, accessoires',
    packageType: 'box',
    shipmentId: 'ship-003',
    carrierId: 'car-003',
    carrierName: 'FedEx',
    trackingNumber: 'FDX5647839201',
    status: 'ready',
    labelGenerated: true,
    labelUrl: '/mock-label-003.pdf',
    createdAt: '2023-11-20T09:15:00Z',
    documents: [
      {
        id: 'doc-005',
        name: 'Facture commerciale',
        type: 'invoice',
        url: '/docs/invoice-003.pdf',
        createdAt: '2023-11-20T09:20:00Z'
      }
    ]
  },
  {
    id: 'pkg-004',
    reference: 'PKG-2023-004',
    description: 'Pièces détachées automobile',
    weight: 12.5,
    weightUnit: 'kg',
    dimensions: {
      length: 60,
      width: 40,
      height: 30,
      unit: 'cm'
    },
    declaredValue: 850,
    currency: 'EUR',
    contents: 'Pièces détachées pour véhicule',
    packageType: 'box',
    status: 'draft',
    labelGenerated: false,
    createdAt: '2023-11-22T16:30:00Z',
    documents: []
  }
];

export const mockCarriers: Carrier[] = [
  {
    id: 'car-001',
    name: 'DHL Express',
    code: 'DHL',
    type: 'international',
    contactName: 'Service Client DHL',
    contactEmail: 'service@dhl.com',
    contactPhone: '+33123456789',
    trackingUrlTemplate: 'https://www.dhl.com/fr-fr/home/tracking/tracking-express.html?submit=1&tracking-id={tracking_number}',
    active: true
  },
  {
    id: 'car-002',
    name: 'UPS',
    code: 'UPS',
    type: 'international',
    contactName: 'Support UPS',
    contactEmail: 'support@ups.com',
    contactPhone: '+33198765432',
    trackingUrlTemplate: 'https://www.ups.com/track?tracknum={tracking_number}',
    active: true
  },
  {
    id: 'car-003',
    name: 'FedEx',
    code: 'FEDEX',
    type: 'international',
    contactName: 'Service FedEx',
    contactEmail: 'service@fedex.com',
    contactPhone: '+33165432198',
    trackingUrlTemplate: 'https://www.fedex.com/apps/fedextrack/?action=track&trackingnumber={tracking_number}',
    active: true
  },
  {
    id: 'car-004',
    name: 'Chronopost',
    code: 'CHRONO',
    type: 'national',
    contactName: 'Support Chronopost',
    contactEmail: 'contact@chronopost.fr',
    contactPhone: '+33145678923',
    trackingUrlTemplate: 'https://www.chronopost.fr/tracking-no-cms/suivi-page?listeNumerosLT={tracking_number}',
    active: true
  },
  {
    id: 'car-005',
    name: 'La Poste - Colissimo',
    code: 'COLISSIMO',
    type: 'national',
    contactName: 'Service Client Colissimo',
    contactEmail: 'service.client@laposte.fr',
    contactPhone: '+33139876543',
    trackingUrlTemplate: 'https://www.laposte.fr/outils/suivre-vos-envois?code={tracking_number}',
    active: true
  }
];

export const packageTypes = [
  { value: 'envelope', label: 'Enveloppe' },
  { value: 'box', label: 'Carton' },
  { value: 'pallet', label: 'Palette' },
  { value: 'tube', label: 'Tube' },
  { value: 'bag', label: 'Sac' },
  { value: 'crate', label: 'Caisse' }
];
