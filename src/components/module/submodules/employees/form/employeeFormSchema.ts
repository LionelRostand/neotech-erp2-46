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
  photoMeta: photoMetaSchema.optional(),
  forceManager: z.boolean().default(false),
  isManager: z.boolean().default(false),
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;
