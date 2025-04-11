
import * as z from 'zod';
import { EmployeeAddress } from '@/types/employee';

// Schéma pour l'adresse détaillée - aligned with EmployeeAddress interface
export const addressSchema = z.object({
  street: z.string().min(1, "La rue est requise"),
  city: z.string().min(1, "La ville est requise"),
  postalCode: z.string().min(1, "Le code postal est requis"),
  country: z.string().default('France'),
  streetNumber: z.string().optional(),
  department: z.string().optional(),
  state: z.string().optional(),
});

// Type for addressSchema
export type AddressSchemaType = z.infer<typeof addressSchema>;

// Schéma pour la validation du formulaire
export const employeeFormSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Format d'email invalide").or(z.string().length(0)),
  phone: z.string().optional(),
  address: z.union([
    z.string(),
    addressSchema
  ]).optional(),
  department: z.string().optional(),
  position: z.string().optional(),
  contract: z.string(),
  hireDate: z.string().optional(),
  manager: z.string().optional(),
  status: z.union([
    z.literal('active'),
    z.literal('inactive'),
    z.literal('onLeave'),
    z.literal('Actif')
  ]),
  professionalEmail: z.string().email("Format d'email professionnel invalide").or(z.string().length(0)),
  company: z.string().optional(),
});

// Type dérivé du schéma
export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;
