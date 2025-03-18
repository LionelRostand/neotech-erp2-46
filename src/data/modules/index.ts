
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

// Export all modules as an array
export const modules: AppModule[] = [
  employeesModule,
  freightModule,
  projectsModule,
  academyModule,
  restaurantModule,
  garageModule,
  transportModule,
  healthModule,
  accountingModule,
  ecommerceModule,
  websiteModule,
  vehicleRentalsModule,
  messagesModule,
  eventsModule,
  libraryModule,
  documentsModule,
  crmModule,
  companiesModule
];

// Re-export types
export * from '../types/modules';
