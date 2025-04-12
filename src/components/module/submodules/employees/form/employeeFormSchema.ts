import { z } from 'zod';

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
  manager: z.string().optional(),
  status: z.string(),
  professionalEmail: z.string().email({ message: 'Email professionnel invalide' }).optional().or(z.literal('')),
  company: z.string().optional(),
  photo: z.any().optional(), // Accepte les données de la photo
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;
