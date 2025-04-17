
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
  department: z.string().optional(),
  position: z.string().optional(),
  contract: z.string(),
  hireDate: z.string().optional(),
  birthDate: z.string().optional(),
  manager: z.string().optional(),
  managerId: z.string().optional(),
  status: z.enum(['active', 'inactive', 'onLeave', 'Actif', 'En congé', 'Suspendu', 'Inactif']),
  professionalEmail: z.string().email({ message: 'Email professionnel invalide' }).optional().or(z.literal('')),
  company: z.string().optional(),
  photo: z.string().optional(),
  photoMeta: photoMetaSchema,
  forceManager: z.boolean().default(false),
  isManager: z.boolean().optional(),
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;
