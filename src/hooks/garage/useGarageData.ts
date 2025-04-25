
import { useQuery } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { GarageClient, Vehicle, Mechanic, Repair, GarageAppointment, Service, Supplier, Inventory } from '@/components/module/submodules/garage/types/garage-types';
import { toast } from 'sonner';

// Données de test
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
    notes: 'Entretien standard'
  },
  {
    id: 'apt2',
    clientId: 'client2',
    vehicleId: 'vehicle2',
    date: '2025-05-02',
    time: '11:00',
    duration: 90,
    status: 'pending',
    notes: 'Changement de pneus'
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

export const useGarageData = () => {
  // Clients
  const { data: clients = defaultClients, isLoading: isLoadingClients } = useQuery({
    queryKey: ['garage', 'clients'],
    queryFn: () => fetchCollectionData<GarageClient>(COLLECTIONS.GARAGE.CLIENTS)
  });

  // Vehicles
  const { data: vehicles = defaultVehicles, isLoading: isLoadingVehicles } = useQuery({
    queryKey: ['garage', 'vehicles'],
    queryFn: () => fetchCollectionData<Vehicle>(COLLECTIONS.GARAGE.VEHICLES)
  });

  // Mechanics
  const { data: mechanics = defaultMechanics, isLoading: isLoadingMechanics } = useQuery({
    queryKey: ['garage', 'mechanics'],
    queryFn: () => fetchCollectionData<Mechanic>(COLLECTIONS.GARAGE.MECHANICS)
  });

  // Appointments
  const { data: appointments = defaultAppointments, isLoading: isLoadingAppointments } = useQuery({
    queryKey: ['garage', 'appointments'],
    queryFn: () => fetchCollectionData<GarageAppointment>(COLLECTIONS.GARAGE.APPOINTMENTS)
  });

  // Services
  const { data: services = defaultServices, isLoading: isLoadingServices } = useQuery({
    queryKey: ['garage', 'services'],
    queryFn: () => fetchCollectionData<Service>(COLLECTIONS.GARAGE.SERVICES)
  });

  // Calculate overall loading state
  const isLoading = isLoadingClients || isLoadingVehicles || isLoadingMechanics || 
                   isLoadingAppointments || isLoadingServices;

  return {
    clients,
    vehicles,
    mechanics,
    appointments,
    services,
    isLoading
  };
};
