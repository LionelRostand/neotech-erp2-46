
import { z } from 'zod';

// Define a schema for photo metadata
const photoMetaSchema = z.object({
  data: z.string(),
  fileName: z.string(),
  fileType: z.string(),
  fileSize: z.number(),
  updatedAt: z.string()
}).optional();

export const employeeFormSchema = z.object({
  firstName: z.string().min(1, { message: 'Le prénom est requis' }),
  lastName: z.string().min(1, { message: 'Le nom est requis' }),
  email: z.string().email({ message: 'Email invalide' }),
  phone: z.string().optional(),
  streetNumber: z.string().optional(),
  streetName: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  region: z.string().optional(),
  company: z.string().min(1, { message: 'L\'entreprise est requise' }),
  department: z.string().min(1, { message: 'Le département est requis' }),
  position: z.string().optional(),
  contract: z.string(),
  hireDate: z.string().optional(),
  birthDate: z.string().optional(),
  managerId: z.string().optional(),
  status: z.enum(['active', 'inactive', 'onLeave', 'Actif', 'En congé', 'Suspendu', 'Inactif']),
  photo: z.string().optional(),
  photoMeta: photoMetaSchema,
  professionalEmail: z.string().email({ message: 'Email professionnel invalide' }).optional().or(z.literal('')),
  forceManager: z.boolean().default(false),
  isManager: z.boolean().optional(),
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;
