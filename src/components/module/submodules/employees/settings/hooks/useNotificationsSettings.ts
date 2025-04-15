
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { notificationsSettingsSchema, NotificationsSettingsFormData } from "../schemas/notificationsSettingsSchema";

export const useNotificationsSettings = () => {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const form = useForm<NotificationsSettingsFormData>({
    resolver: zodResolver(notificationsSettingsSchema),
    defaultValues: {
      emailNotifications: true,
      newEmployeeAlerts: true,
      leaveRequestAlerts: true,
      documentUpdates: false,
      weeklyDigest: true,
      managerApprovals: true
    }
  });

  const onSubmit = async (data: NotificationsSettingsFormData) => {
    setIsSaving(true);
    try {
      console.log("Saving notification settings:", data);
      toast({
        title: "Paramètres enregistrés",
        description: "Les paramètres de notification ont été mis à jour avec succès."
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde des paramètres.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    form,
    isSaving,
    onSubmit
  };
};
