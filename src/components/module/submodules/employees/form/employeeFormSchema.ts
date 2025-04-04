
import * as z from 'zod';

// Schéma pour la validation du formulaire
export const employeeFormSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Format d'email invalide").or(z.string().length(0)),
  phone: z.string().optional(),
  address: z.string().optional(),
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
