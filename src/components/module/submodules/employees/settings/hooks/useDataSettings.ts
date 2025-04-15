
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { dataSettingsSchema, DataSettingsFormData } from "../schemas/dataSettingsSchema";

export const useDataSettings = () => {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const form = useForm<DataSettingsFormData>({
    resolver: zodResolver(dataSettingsSchema),
    defaultValues: {
      automaticBackups: true,
      backupFrequency: "daily",
      retentionPeriod: "30",
      exportFormat: "excel",
      enableDataSync: false,
      archiveOldData: false
    }
  });

  const onSubmit = async (data: DataSettingsFormData) => {
    setIsSaving(true);
    try {
      console.log("Saving data settings:", data);
      toast({
        title: "Paramètres enregistrés",
        description: "Les paramètres de gestion des données ont été mis à jour avec succès."
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
