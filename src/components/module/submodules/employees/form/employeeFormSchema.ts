
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
  birthDate: z.string().optional(),
  manager: z.string().optional(), // Conserver pour la compatibilité
  managerId: z.string().optional(), // ID du manager sélectionné
  status: z.enum(['active', 'inactive', 'onLeave', 'Actif', 'En congé', 'Suspendu', 'Inactif']),
  professionalEmail: z.string().email({ message: 'Email professionnel invalide' }).optional().or(z.literal('')),
  company: z.string().optional(),
  photo: z.any().optional(), // Accepte les données de la photo
  forceManager: z.boolean().default(false), // Champ pour forcer l'ajout aux managers
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;
