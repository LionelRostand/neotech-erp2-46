
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
  ecommerceModule
];

// Re-export types
export * from '../types/modules';
