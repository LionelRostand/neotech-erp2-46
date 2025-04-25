
export interface GarageClient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
  createdAt: string;
  // Champs utiles pour les autres sous-menus
  vehicles?: string[]; // IDs des véhicules du client
  appointments?: string[]; // IDs des rendez-vous
  services?: string[]; // IDs des services
  repairs?: string[]; // IDs des réparations
  invoices?: string[]; // IDs des factures
  preferredMechanic?: string; // ID du mécanicien préféré
}
