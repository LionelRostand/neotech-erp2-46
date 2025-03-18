
import { AppModule } from '../types/modules';
import { employeesModule } from './employees';
import { freightModule } from './freight';
import { projectsModule } from './projects';
import { academyModule } from './academy';
import { restaurantModule } from './restaurant';
import { garageModule } from './garage';
import { transportModule } from './transport';
import { healthModule } from './health';
import { accountingModule } from './accounting';
import { ecommerceModule } from './ecommerce';
import { websiteModule } from './website';
import { vehicleRentalsModule } from './vehicle-rentals';
import { messagesModule } from './messages';
import { eventsModule } from './events';
import { libraryModule } from './library';
import { documentsModule } from './documents';
import { crmModule } from './crm';
import { companiesModule } from './companies';

// Assigner les catégories aux modules
// Puisque nous ne pouvons pas modifier directement les fichiers individuels des modules,
// nous allons ajouter la propriété category ici
const modulesWithCategories: AppModule[] = [
  // Catégorie GESTION D'ENTREPRISE
  { ...employeesModule, category: 'business' },
  { ...companiesModule, category: 'business' },
  { ...accountingModule, category: 'business' },
  { ...projectsModule, category: 'business' },
  { ...crmModule, category: 'business' },
  
  // Catégorie SERVICES SPÉCIALISÉS
  { ...restaurantModule, category: 'services' },
  { ...garageModule, category: 'services' },
  { ...transportModule, category: 'services' },
  { ...healthModule, category: 'services' },
  { ...vehicleRentalsModule, category: 'services' },
  { ...freightModule, category: 'services' },
  { ...libraryModule, category: 'services' },
  
  // Catégorie PRÉSENCE NUMÉRIQUE
  { ...websiteModule, category: 'digital' },
  { ...ecommerceModule, category: 'digital' },
  { ...academyModule, category: 'digital' },
  { ...eventsModule, category: 'digital' },
  
  // Catégorie COMMUNICATION
  { ...messagesModule, category: 'communication' },
  { ...documentsModule, category: 'communication' }
];

// Export all modules as an array
export const modules: AppModule[] = modulesWithCategories;

// Re-export types
export * from '../types/modules';
