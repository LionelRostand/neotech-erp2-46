
import * as z from "zod";

export const taxRateSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  rate: z.number().min(0, "Le taux doit être positif").max(100, "Le taux ne peut pas dépasser 100%"),
  description: z.string().optional(),
  isDefault: z.boolean().default(false),
});

export type TaxRateFormValues = z.infer<typeof taxRateSchema>;
