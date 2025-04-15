
import { z } from "zod";

export const dataSettingsSchema = z.object({
  automaticBackups: z.boolean(),
  backupFrequency: z.string(),
  retentionPeriod: z.string(),
  exportFormat: z.string(),
  enableDataSync: z.boolean(),
  archiveOldData: z.boolean()
});

export type DataSettingsFormData = z.infer<typeof dataSettingsSchema>;
