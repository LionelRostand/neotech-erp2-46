
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
import { documentsModule } from './documents';
import { crmModule } from './crm';
import { companiesModule } from './companies';
import { salonModule } from './salon';

// Export all modules as an array - now we can use the modules directly since they all have the category property
export const modules: AppModule[] = [
  employeesModule,
  companiesModule,
  accountingModule,
  projectsModule,
  crmModule,
  
  restaurantModule,
  garageModule,
  transportModule,
  healthModule,
  vehicleRentalsModule,
  freightModule,
  salonModule,
  
  websiteModule,
  ecommerceModule,
  academyModule,
  eventsModule,
  
  messagesModule,
  documentsModule
];

// Re-export types
export * from '../types/modules';
