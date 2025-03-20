
import * as z from 'zod';

export const memberFormSchema = z.object({
  firstName: z.string().min(2, {
    message: "Le prénom doit contenir au moins 2 caractères.",
  }),
  lastName: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  email: z.string().email({
    message: "Veuillez saisir une adresse email valide.",
  }),
  phone: z.string().optional(),
  address: z.string().optional(),
  subscriptionType: z.enum(["free", "basic", "premium"], {
    message: "Veuillez sélectionner un type d'abonnement valide.",
  }),
  status: z.enum(["active", "pending", "expired", "suspended"], {
    message: "Veuillez sélectionner un statut valide.",
  }),
  notes: z.string().optional(),
});

export type MemberFormValues = z.infer<typeof memberFormSchema>;
