
import { z } from 'zod';

const photoMetaSchema = z.object({
  fileName: z.string(),
  fileType: z.string(),
  fileSize: z.number(),
  updatedAt: z.string(),
  data: z.string().optional()
}).required();

export const employeeFormSchema = z.object({
  firstName: z.string().min(1, { message: 'Le prénom est requis' }),
  lastName: z.string().min(1, { message: 'Le nom est requis' }),
  email: z.string().email({ message: 'Email personnel invalide' }),
  professionalEmail: z.string().email({ message: 'Email professionnel invalide' }).optional().or(z.literal('')),
  phone: z.string().optional(),
  // Adresse personnelle
  streetNumber: z.string().optional(),
  streetName: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  region: z.string().optional(),
  country: z.string().optional(),
  // Adresse professionnelle
  workAddress: z.object({
    street: z.string(),
    city: z.string(),
    postalCode: z.string(),
    country: z.string()
  }).optional(),
  company: z.string().min(1, { message: 'L\'entreprise est requise' }).or(z.literal('no_company')),
  department: z.string().min(1, { message: 'Le département est requis' }).or(z.literal('no_department')),
  position: z.string().optional(),
  contract: z.string(),
  hireDate: z.string().optional(),
  birthDate: z.string().optional(),
  managerId: z.string().optional(),
  status: z.enum(['active', 'inactive', 'onLeave', 'Actif', 'En congé', 'Suspendu', 'Inactif']),
  photo: z.string().optional(),
  photoMeta: photoMetaSchema.optional(),
  forceManager: z.boolean().default(false),
  isManager: z.boolean().default(false),
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

// Provide a default form values object that can be used to initialize forms
export const getDefaultEmployeeFormValues = (): EmployeeFormValues => ({
  firstName: '',
  lastName: '',
  email: '',
  professionalEmail: '',
  phone: '',
  streetNumber: '',
  streetName: '',
  city: '',
  zipCode: '',
  region: '',
  country: '',
  company: 'no_company',
  department: 'no_department',
  position: '',
  contract: 'CDI', // Default contract type
  hireDate: new Date().toISOString().split('T')[0], // Current date as default
  birthDate: '',
  managerId: '',
  status: 'active' as const, // Default status
  photo: '',
  forceManager: false,
  isManager: false,
});
