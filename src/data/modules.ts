
// Importation de tous les modules
import { employeesModule } from './modules/employees';
import { freightModule } from './modules/freight';
import { projectsModule } from './modules/projects';
import { accountingModule } from './modules/accounting';
import { messagesModule } from './modules/messages';
import { companiesModule } from './modules/companies';
import { crmModule } from './modules/crm';
import { healthModule } from './modules/health';
import { documentsModule } from './modules/documents';
import { transportModule } from './modules/transport';
import { garageModule } from './modules/garage';
import { websiteModule } from './modules/website';
// Import of rentalsModule is missing, commenting it out for now
// import { rentalsModule } from './modules/rentals';

// Export des modules sous forme de tableau pour l'application
export const modules = [
  employeesModule,
  freightModule,
  projectsModule,
  accountingModule,
  messagesModule,
  companiesModule,
  crmModule,
  healthModule,
  documentsModule,
  // rentalsModule, // Commenting out as the module is missing
  transportModule,
  garageModule,
  websiteModule,
];
