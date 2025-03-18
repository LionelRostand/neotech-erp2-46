
import * as z from 'zod';

export const employeeFormSchema = z.object({
  firstName: z.string().min(2, { message: 'Le prénom doit contenir au moins 2 caractères.' }),
  lastName: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères.' }),
  email: z.string().email({ message: 'Veuillez saisir une adresse email valide.' }),
  phone: z.string().min(10, { message: 'Le numéro de téléphone doit contenir au moins 10 caractères.' }),
  address: z.string().min(5, { message: 'L\'adresse doit contenir au moins 5 caractères.' }),
  department: z.string().min(2, { message: 'Le département doit contenir au moins 2 caractères.' }),
  position: z.string().min(2, { message: 'Le poste doit contenir au moins 2 caractères.' }),
  contract: z.string().min(2, { message: 'Le type de contrat doit contenir au moins 2 caractères.' }),
  hireDate: z.string().min(8, { message: 'La date d\'embauche doit être au format JJ/MM/AAAA.' }),
  manager: z.string().optional(),
  status: z.enum(['Actif', 'Inactif']),
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;
