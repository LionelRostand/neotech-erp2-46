
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { generalSettingsSchema, GeneralSettingsFormData } from "../schemas/generalSettingsSchema";

export const useGeneralSettings = () => {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const form = useForm<GeneralSettingsFormData>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      showProfilePhotos: true,
      compactMode: false,
      defaultDepartment: "",
      defaultRole: "",
      includeConfidentialData: false
    }
  });

  const onSubmit = async (data: GeneralSettingsFormData) => {
    setIsSaving(true);
    try {
      // TODO: Implement API call to save settings
      console.log("Saving settings:", data);
      toast({
        title: "Paramètres enregistrés",
        description: "Les paramètres généraux ont été mis à jour avec succès."
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
