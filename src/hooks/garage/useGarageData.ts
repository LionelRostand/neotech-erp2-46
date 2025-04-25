
import { useQuery } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { GarageClient, Vehicle, Mechanic, Repair, GarageAppointment, Service, Supplier, Inventory, Invoice, LoyaltyProgram } from '@/components/module/submodules/garage/types/garage-types';
import { toast } from 'sonner';

// Default data
const defaultClients: GarageClient[] = [
  {
    id: 'client1',
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@email.com',
    phone: '0612345678',
    status: 'active',
    createdAt: '2025-04-01',
    vehicles: ['vehicle1']
  },
  {
    id: 'client2',
    firstName: 'Marie',
    lastName: 'Martin',
    email: 'marie.martin@email.com',
    phone: '0687654321',
    status: 'active',
    createdAt: '2025-04-02',
    vehicles: ['vehicle2']
  }
];

const defaultVehicles: Vehicle[] = [
  {
    id: 'vehicle1',
    make: 'Renault',
    model: 'Clio',
    year: 2020,
    licensePlate: 'AB-123-CD',
    vin: 'VF1RFB00066123456',
    clientId: 'client1',
    status: 'active',
    mileage: 45000
  },
  {
    id: 'vehicle2',
    make: 'Peugeot',
    model: '308',
    year: 2019,
    licensePlate: 'EF-456-GH',
    vin: 'VF3LCRFJW12345678',
    clientId: 'client2',
    status: 'active',
    mileage: 62000
  }
];

const defaultMechanics: Mechanic[] = [
  {
    id: 'mechanic1',
    firstName: 'Pierre',
    lastName: 'Dubois',
    email: 'pierre.dubois@garage.com',
    phone: '0612345678',
    specialization: ['Mécanique générale', 'Diagnostic'],
    status: 'available',
    hireDate: '2024-01-15'
  }
];

const defaultAppointments: GarageAppointment[] = [
  {
    id: 'apt1',
    clientId: 'client1',
    vehicleId: 'vehicle1',
    mechanicId: 'mechanic1',
    date: '2025-05-02',
    time: '09:30',
    duration: 60,
    status: 'confirmed',
    notes: 'Entretien standard',
    clientName: 'Jean Dupont',
    vehicleMake: 'Renault',
    vehicleModel: 'Clio',
    service: 'Révision complète'
  },
  {
    id: 'apt2',
    clientId: 'client2',
    vehicleId: 'vehicle2',
    date: '2025-05-02',
    time: '11:00',
    duration: 90,
    status: 'pending',
    notes: 'Changement de pneus',
    clientName: 'Marie Martin',
    vehicleMake: 'Peugeot',
    vehicleModel: '308',
    service: 'Changement pneus'
  }
];

const defaultServices: Service[] = [
  {
    id: 'service1',
    name: 'Révision complète',
    description: 'Révision complète du véhicule',
    price: 299.99,
    duration: '120',
    status: 'active',
    category: 'Entretien'
  },
  {
    id: 'service2',
    name: 'Changement pneus',
    description: 'Changement des 4 pneus',
    price: 399.99,
    duration: '60',
    status: 'active',
    category: 'Pneumatiques'
  }
];

const defaultRepairs: Repair[] = [
  {
    id: 'repair1',
    vehicleId: 'vehicle1',
    mechanicId: 'mechanic1',
    description: 'Remplacement plaquettes de frein',
    status: 'in_progress',
    startDate: '2025-04-22',
    cost: 250,
    laborHours: 2
  },
  {
    id: 'repair2',
    vehicleId: 'vehicle2',
    mechanicId: 'mechanic1',
    description: 'Vidange moteur',
    status: 'pending',
    startDate: '2025-04-25',
    cost: 120,
    laborHours: 1
  }
];

const defaultInvoices: Invoice[] = [
  {
    id: 'invoice1',
    clientId: 'client1',
    vehicleId: 'vehicle1',
    date: '2025-04-20',
    dueDate: '2025-05-20',
    amount: 299.99,
    tax: 59.99,
    total: 359.98,
    status: 'unpaid',
    clientName: 'Jean Dupont',
    number: 'INV-2025-001'
  },
  {
    id: 'invoice2',
    clientId: 'client2',
    vehicleId: 'vehicle2',
    date: '2025-04-15',
    dueDate: '2025-05-15',
    amount: 399.99,
    tax: 79.99,
    total: 479.98,
    status: 'paid',
    paymentDate: '2025-04-18',
    clientName: 'Marie Martin',
    number: 'INV-2025-002'
  }
];

const defaultSuppliers: Supplier[] = [
  {
    id: 'supplier1',
    name: 'Pièces Auto Plus',
    contactName: 'Philippe Durant',
    email: 'contact@piecesautoplus.fr',
    phone: '0123456789',
    address: '15 rue des Pièces, 75001 Paris',
    status: 'active',
    createdAt: '2024-01-10'
  },
  {
    id: 'supplier2',
    name: 'Pneumatiques Express',
    contactName: 'Sophie Leroy',
    email: 'contact@pneumatiquesexpress.fr',
    phone: '0123456780',
    address: '23 avenue des Pneus, 69002 Lyon',
    status: 'active',
    createdAt: '2024-02-15'
  }
];

const defaultInventory: Inventory[] = [
  {
    id: 'item1',
    name: 'Huile moteur 5W30',
    category: 'Lubrifiants',
    reference: 'HM-5W30',
    quantity: 8,
    minQuantity: 5,
    price: 45.99,
    status: 'in_stock'
  },
  {
    id: 'item2',
    name: 'Filtre à huile universel',
    category: 'Filtres',
    reference: 'FH-UNIV',
    quantity: 3,
    minQuantity: 5,
    price: 12.99,
    status: 'low_stock'
  },
  {
    id: 'item3',
    name: 'Plaquettes de frein avant',
    category: 'Freinage',
    reference: 'PF-AV-R21',
    quantity: 1,
    minQuantity: 2,
    price: 65.50,
    status: 'low_stock'
  }
];

const defaultLoyalty: LoyaltyProgram[] = [
  {
    id: 'loyalty1',
    name: 'Programme Fidélité Or',
    description: 'Réduction sur les services après 5 visites',
    discountRate: 15,
    requiredVisits: 5,
    status: 'active',
    startDate: '2025-01-01',
    clients: ['client1']
  },
  {
    id: 'loyalty2',
    name: 'Programme Fidélité Argent',
    description: 'Réduction sur les pièces après 3 visites',
    discountRate: 10,
    requiredVisits: 3,
    status: 'active',
    startDate: '2025-01-01',
    clients: ['client2']
  }
];

export const useGarageData = () => {
  // Clients
  const { data: clients = defaultClients, isLoading: isLoadingClients } = useQuery({
    queryKey: ['garage', 'clients'],
    queryFn: () => fetchCollectionData<GarageClient>(COLLECTIONS.GARAGE.CLIENTS),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  // Vehicles
  const { data: vehicles = defaultVehicles, isLoading: isLoadingVehicles } = useQuery({
    queryKey: ['garage', 'vehicles'],
    queryFn: () => fetchCollectionData<Vehicle>(COLLECTIONS.GARAGE.VEHICLES),
    staleTime: 5 * 60 * 1000,
  });

  // Mechanics
  const { data: mechanics = defaultMechanics, isLoading: isLoadingMechanics } = useQuery({
    queryKey: ['garage', 'mechanics'],
    queryFn: () => fetchCollectionData<Mechanic>(COLLECTIONS.GARAGE.MECHANICS),
    staleTime: 5 * 60 * 1000,
  });

  // Appointments
  const { data: appointments = defaultAppointments, isLoading: isLoadingAppointments } = useQuery({
    queryKey: ['garage', 'appointments'],
    queryFn: () => fetchCollectionData<GarageAppointment>(COLLECTIONS.GARAGE.APPOINTMENTS),
    staleTime: 5 * 60 * 1000,
  });

  // Services
  const { data: services = defaultServices, isLoading: isLoadingServices } = useQuery({
    queryKey: ['garage', 'services'],
    queryFn: () => fetchCollectionData<Service>(COLLECTIONS.GARAGE.SERVICES),
    staleTime: 5 * 60 * 1000,
  });

  // Repairs
  const { data: repairs = defaultRepairs, isLoading: isLoadingRepairs } = useQuery({
    queryKey: ['garage', 'repairs'],
    queryFn: () => fetchCollectionData<Repair>(COLLECTIONS.GARAGE.REPAIRS),
    staleTime: 5 * 60 * 1000,
  });

  // Invoices
  const { data: invoices = defaultInvoices, isLoading: isLoadingInvoices } = useQuery({
    queryKey: ['garage', 'invoices'],
    queryFn: () => fetchCollectionData<Invoice>(COLLECTIONS.GARAGE.INVOICES),
    staleTime: 5 * 60 * 1000,
  });

  // Suppliers
  const { data: suppliers = defaultSuppliers, isLoading: isLoadingSuppliers } = useQuery({
    queryKey: ['garage', 'suppliers'],
    queryFn: () => fetchCollectionData<Supplier>(COLLECTIONS.GARAGE.SUPPLIERS),
    staleTime: 5 * 60 * 1000,
  });

  // Inventory
  const { data: inventory = defaultInventory, isLoading: isLoadingInventory } = useQuery({
    queryKey: ['garage', 'inventory'],
    queryFn: () => fetchCollectionData<Inventory>(COLLECTIONS.GARAGE.INVENTORY),
    staleTime: 5 * 60 * 1000,
  });

  // Loyalty Programs
  const { data: loyalty = defaultLoyalty, isLoading: isLoadingLoyalty } = useQuery({
    queryKey: ['garage', 'loyalty'],
    queryFn: () => fetchCollectionData<LoyaltyProgram>(COLLECTIONS.GARAGE.LOYALTY),
    staleTime: 5 * 60 * 1000,
  });

  // Calculate overall loading state
  const isLoading = 
    isLoadingClients || 
    isLoadingVehicles || 
    isLoadingMechanics || 
    isLoadingAppointments || 
    isLoadingServices ||
    isLoadingRepairs ||
    isLoadingInvoices ||
    isLoadingSuppliers ||
    isLoadingInventory ||
    isLoadingLoyalty;

  return {
    clients,
    vehicles,
    mechanics,
    appointments,
    services,
    repairs,
    invoices,
    suppliers,
    inventory,
    loyalty,
    isLoading
  };
};
