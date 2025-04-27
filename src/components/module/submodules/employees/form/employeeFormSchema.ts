
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
  professionalEmail: z.string().optional(),
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
}).transform((data) => {
  // Générer l'email professionnel à partir du prénom, nom et entreprise
  const firstName = data.firstName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const lastName = data.lastName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const company = data.company.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '');
  
  data.professionalEmail = `${firstName}.${lastName}@${company}.com`;
  
  return data;
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;
