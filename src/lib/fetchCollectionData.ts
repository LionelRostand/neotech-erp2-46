
import { collection, getDocs, query, QueryConstraint } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { COLLECTIONS } from '@/lib/firebase-collections';

/**
 * Utility function to fetch data from any Firestore collection
 * with improved error handling and default values
 * @param collectionPath Path to the collection
 * @param constraints Query constraints
 * @returns Promise with the collection data
 */
export async function fetchCollectionData<T>(
  collectionPath: string, 
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  try {
    // Check for empty or invalid collection path
    if (!collectionPath || collectionPath.trim() === '') {
      const errorMessage = 'Empty collection path provided';
      console.error(errorMessage);
      toast.error(`Erreur: ${errorMessage}`);
      return [] as T[];
    }
    
    console.log(`Fetching from collection path: ${collectionPath}`);
    
    // Verify database connection
    if (!db) {
      console.error('Firestore instance is not initialized');
      toast.error('La base de données n\'est pas initialisée');
      return [] as T[];
    }
    
    try {
      const collectionRef = collection(db, collectionPath);
      const q = constraints.length > 0 ? query(collectionRef, ...constraints) : query(collectionRef);
      
      console.log(`Executing query on collection: ${collectionPath}`);
      const querySnapshot = await getDocs(q);
      
      console.log(`Received ${querySnapshot.docs.length} documents from ${collectionPath}`);
      
      // If no data found, return default sample data for garage collections
      if (querySnapshot.docs.length === 0) {
        console.log(`No data found in collection ${collectionPath}, returning default sample data if available`);
        const defaultData = getDefaultData<T>(collectionPath);
        if (defaultData.length > 0) {
          console.log(`Returning ${defaultData.length} default items for ${collectionPath}`);
          return defaultData;
        }
      }
      
      return querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as T[];
    } catch (dbErr: any) {
      console.error(`Database error fetching data from ${collectionPath}:`, dbErr);
      
      // Provide more specific error message based on error type
      if (dbErr.code === 'permission-denied') {
        toast.error('Erreur: Permissions insuffisantes pour accéder aux données');
      } else if (dbErr.code === 'unavailable') {
        toast.error('Erreur: La base de données est temporairement indisponible');
      } else {
        toast.error(`Erreur de base de données: ${dbErr.message}`);
      }
      
      // Return default data in case of database error
      const defaultData = getDefaultData<T>(collectionPath);
      if (defaultData.length > 0) {
        console.log(`Returning ${defaultData.length} default items for ${collectionPath} due to error`);
        return defaultData;
      }
      
      return [] as T[];
    }
  } catch (err: any) {
    console.error(`Error fetching data from ${collectionPath}:`, err);
    toast.error(`Erreur lors du chargement des données: ${err.message}`);
    
    // Return default data in case of general error
    const defaultData = getDefaultData<T>(collectionPath);
    if (defaultData.length > 0) {
      console.log(`Returning ${defaultData.length} default items for ${collectionPath} due to error`);
      return defaultData;
    }
    
    return [] as T[];
  }
}

/**
 * Provides default sample data for collections
 * @param collectionPath Path to the collection
 * @returns Array of default data items
 */
function getDefaultData<T>(collectionPath: string): T[] {
  // Sample data for garage clients
  if (collectionPath === COLLECTIONS.GARAGE.CLIENTS) {
    return [
      {
        id: 'client1',
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@example.com',
        phone: '01 23 45 67 89',
        address: '15 Rue de Paris, 75001 Paris',
        vehicles: ['vehicle1', 'vehicle2'],
        status: 'active',
        createdAt: new Date().toISOString()
      },
      {
        id: 'client2',
        firstName: 'Marie',
        lastName: 'Martin',
        email: 'marie.martin@example.com',
        phone: '01 23 45 67 90',
        address: '25 Avenue Victor Hugo, 75016 Paris',
        vehicles: ['vehicle3'],
        status: 'active',
        createdAt: new Date().toISOString()
      },
      {
        id: 'client3',
        firstName: 'Pierre',
        lastName: 'Bernard',
        email: 'pierre.bernard@example.com',
        phone: '01 23 45 67 91',
        address: '8 Rue de Rivoli, 75004 Paris',
        vehicles: [],
        status: 'inactive',
        createdAt: new Date().toISOString()
      }
    ] as unknown as T[];
  }

  // Sample data for garage vehicles
  if (collectionPath === COLLECTIONS.GARAGE.VEHICLES) {
    return [
      {
        id: 'vehicle1',
        make: 'Renault',
        model: 'Clio',
        year: 2018,
        licensePlate: 'AB-123-CD',
        vin: 'VF1RB08C5BT123456',
        clientId: 'client1',
        status: 'active',
        lastService: new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString()
      },
      {
        id: 'vehicle2',
        make: 'Peugeot',
        model: '308',
        year: 2020,
        licensePlate: 'EF-456-GH',
        vin: 'VF3LCBHMGBS123456',
        clientId: 'client1',
        status: 'active',
        lastService: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString()
      },
      {
        id: 'vehicle3',
        make: 'Citroën',
        model: 'C3',
        year: 2019,
        licensePlate: 'IJ-789-KL',
        vin: 'VF7SXBHZMBS123456',
        clientId: 'client2',
        status: 'active',
        lastService: new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString()
      }
    ] as unknown as T[];
  }

  // Sample data for garage mechanics
  if (collectionPath === COLLECTIONS.GARAGE.MECHANICS) {
    return [
      {
        id: 'mechanic1',
        firstName: 'Thomas',
        lastName: 'Leroy',
        email: 'thomas.leroy@garage.com',
        phone: '01 23 45 67 92',
        specialization: ['Moteur', 'Électronique'],
        status: 'available',
        hireDate: new Date(new Date().setFullYear(new Date().getFullYear() - 3)).toISOString()
      },
      {
        id: 'mechanic2',
        firstName: 'Sophie',
        lastName: 'Moreau',
        email: 'sophie.moreau@garage.com',
        phone: '01 23 45 67 93',
        specialization: ['Transmission', 'Freinage'],
        status: 'in_service',
        hireDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString()
      },
      {
        id: 'mechanic3',
        firstName: 'Lucas',
        lastName: 'Petit',
        email: 'lucas.petit@garage.com',
        phone: '01 23 45 67 94',
        specialization: ['Carrosserie', 'Peinture'],
        status: 'on_break',
        hireDate: new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString()
      }
    ] as unknown as T[];
  }

  // Sample data for garage services
  if (collectionPath === COLLECTIONS.GARAGE.SERVICES) {
    return [
      {
        id: 'service1',
        name: 'Vidange',
        description: 'Changement d\'huile et du filtre à huile',
        price: 89.99,
        duration: '1h00',
        status: 'active'
      },
      {
        id: 'service2',
        name: 'Révision complète',
        description: 'Vérification générale du véhicule',
        price: 199.99,
        duration: '3h00',
        status: 'active'
      },
      {
        id: 'service3',
        name: 'Changement de freins',
        description: 'Remplacement des plaquettes et des disques de frein',
        price: 249.99,
        duration: '2h00',
        status: 'active'
      },
      {
        id: 'service4',
        name: 'Changement de pneus',
        description: 'Remplacement et équilibrage des pneus',
        price: 79.99,
        duration: '1h30',
        status: 'pending'
      },
      {
        id: 'service5',
        name: 'Nettoyage complet',
        description: 'Nettoyage intérieur et extérieur du véhicule',
        price: 69.99,
        duration: '2h00',
        status: 'completed'
      }
    ] as unknown as T[];
  }

  // Sample data for garage suppliers
  if (collectionPath === COLLECTIONS.GARAGE.SUPPLIERS) {
    return [
      {
        id: 'supplier1',
        name: 'AutoPieces SA',
        contactName: 'Michel Fournier',
        email: 'contact@autopieces.com',
        phone: '01 23 45 67 95',
        address: '45 Rue de l\'Industrie, 69100 Villeurbanne',
        type: 'Pièces détachées',
        status: 'active',
        createdAt: new Date().toISOString()
      },
      {
        id: 'supplier2',
        name: 'PneuExpress',
        contactName: 'Sylvie Dubois',
        email: 'contact@pneuexpress.com',
        phone: '01 23 45 67 96',
        address: '12 Avenue du Commerce, 59000 Lille',
        type: 'Pneumatiques',
        status: 'active',
        createdAt: new Date().toISOString()
      },
      {
        id: 'supplier3',
        name: 'HuileMaster',
        contactName: 'Philippe Lambert',
        email: 'contact@huilemaster.com',
        phone: '01 23 45 67 97',
        address: '78 Boulevard de l\'Atelier, 33000 Bordeaux',
        type: 'Lubrifiants',
        status: 'inactive',
        createdAt: new Date().toISOString()
      }
    ] as unknown as T[];
  }

  // Sample data for garage inventory
  if (collectionPath === COLLECTIONS.GARAGE.INVENTORY) {
    return [
      {
        id: 'item1',
        name: 'Filtre à huile universel',
        category: 'Filtres',
        reference: 'FH-2023',
        quantity: 25,
        minQuantity: 10,
        price: 12.99,
        supplierRef: 'supplier1',
        location: 'A1-01',
        status: 'in_stock'
      },
      {
        id: 'item2',
        name: 'Plaquettes de frein Renault',
        category: 'Freinage',
        reference: 'PF-RN-2023',
        quantity: 8,
        minQuantity: 5,
        price: 49.99,
        supplierRef: 'supplier1',
        location: 'B2-05',
        status: 'low_stock'
      },
      {
        id: 'item3',
        name: 'Huile moteur 5W30 (5L)',
        category: 'Lubrifiants',
        reference: 'HM-5W30-5L',
        quantity: 12,
        minQuantity: 8,
        price: 39.99,
        supplierRef: 'supplier3',
        location: 'C3-10',
        status: 'in_stock'
      },
      {
        id: 'item4',
        name: 'Pneu 205/55 R16',
        category: 'Pneumatiques',
        reference: 'PN-205-55-16',
        quantity: 0,
        minQuantity: 4,
        price: 89.99,
        supplierRef: 'supplier2',
        location: 'D4-15',
        status: 'out_of_stock'
      },
      {
        id: 'item5',
        name: 'Batterie 12V 60Ah',
        category: 'Électricité',
        reference: 'BAT-12V-60',
        quantity: 3,
        minQuantity: 5,
        price: 79.99,
        supplierRef: 'supplier1',
        location: 'E5-20',
        status: 'low_stock'
      }
    ] as unknown as T[];
  }

  // Sample data for garage appointments
  if (collectionPath === COLLECTIONS.GARAGE.APPOINTMENTS) {
    return [
      {
        id: 'appointment1',
        clientId: 'client1',
        vehicleId: 'vehicle1',
        mechanicId: 'mechanic1',
        serviceId: 'service1',
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        duration: 60,
        status: 'confirmed',
        notes: 'Client régulier'
      },
      {
        id: 'appointment2',
        clientId: 'client2',
        vehicleId: 'vehicle3',
        mechanicId: 'mechanic2',
        serviceId: 'service3',
        date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
        time: '14:00',
        duration: 120,
        status: 'pending',
        notes: 'Première visite pour ce véhicule'
      },
      {
        id: 'appointment3',
        clientId: 'client1',
        vehicleId: 'vehicle2',
        mechanicId: 'mechanic3',
        serviceId: 'service2',
        date: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0],
        time: '10:30',
        duration: 180,
        status: 'confirmed',
        notes: 'Demander confirmation la veille'
      }
    ] as unknown as T[];
  }

  // Return empty array for other collections
  return [] as T[];
}
