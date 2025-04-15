
import { z } from "zod";

export const generalSettingsSchema = z.object({
  showProfilePhotos: z.boolean(),
  compactMode: z.boolean(),
  defaultDepartment: z.string(),
  defaultRole: z.string(),
  includeConfidentialData: z.boolean()
});

export type GeneralSettingsFormData = z.infer<typeof generalSettingsSchema>;
