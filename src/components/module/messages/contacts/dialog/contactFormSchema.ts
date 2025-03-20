
import { z } from 'zod';

// Validation du formulaire avec Zod
export const contactFormSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Format d'email invalide"),
  phone: z.string().optional(),
  company: z.string().optional(),
  position: z.string().optional(),
  notes: z.string().optional(),
  tags: z.string().optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
