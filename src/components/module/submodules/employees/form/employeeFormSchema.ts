
import { z } from 'zod';

// Définition du schéma de validation pour le formulaire employé
export const employeeFormSchema = z.object({
  // Informations personnelles
  firstName: z.string().min(1, { message: "Le prénom est requis" }),
  lastName: z.string().min(1, { message: "Le nom est requis" }),
  birthDate: z.string().optional(),
  email: z.string().email({ message: "Email personnel invalide" }).min(1, { message: "L'email personnel est requis" }),
  phone: z.string().optional(),
  
  // Adresse
  streetNumber: z.string().optional(),
  streetName: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  region: z.string().optional(),
  country: z.string().optional(),
  
  // Informations professionnelles
  position: z.string().optional(),
  professionalEmail: z.string().email({ message: "Email professionnel invalide" }).optional(),
  department: z.string().optional(),
  company: z.string().optional(),
  managerId: z.string().optional(),
  
  // Contrat et statut
  contract: z.string().default('cdi'),
  hireDate: z.string().optional(),
  status: z.enum(['active', 'inactive', 'onLeave', 'Actif', 'En congé', 'Suspendu', 'Inactif']).default('active'),
  
  // Permissions et rôles
  isManager: z.boolean().default(false),
  forceManager: z.boolean().default(false),
  
  // Photo
  photo: z.string().optional(),
  photoMeta: z.any().optional(),
  
  // Adresse professionnelle
  workAddress: z.any().optional(),
});

// Type dérivé du schéma
export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;
