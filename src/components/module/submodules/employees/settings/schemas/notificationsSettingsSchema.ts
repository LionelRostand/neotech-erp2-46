
import { z } from "zod";

export const notificationsSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  newEmployeeAlerts: z.boolean(),
  leaveRequestAlerts: z.boolean(),
  documentUpdates: z.boolean(),
  weeklyDigest: z.boolean(),
  managerApprovals: z.boolean()
});

export type NotificationsSettingsFormData = z.infer<typeof notificationsSettingsSchema>;
