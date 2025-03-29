
import { z } from "zod";

export const employeeFormSchema = z.object({
  firstName: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
  lastName: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Email invalide" }),
  phone: z.string().optional(),
  address: z.string().optional(),
  department: z.string(),
  position: z.string(),
  contract: z.string(),
  hireDate: z.string(),
  manager: z.string().optional(),
  status: z.string(),
  company: z.string().optional(), // Ajout du champ entreprise
  professionalEmail: z.string().email({ message: "Email professionnel invalide" }).optional(),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" }).optional(),
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;
