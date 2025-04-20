
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFirestore } from "@/hooks/use-firestore";
import { COLLECTIONS } from "@/lib/firebase-collections";
import { contactFormSchema } from "./contactFormSchema";
import { Contact } from "../../types/message-types";
import { useToast } from "@/hooks/use-toast";

export function useContactForm(initialData: Contact | null, onSave?: (contact: Contact, isNew: boolean) => void) {
  const { add, update } = useFirestore(COLLECTIONS.MESSAGES.CONTACTS);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(contactFormSchema),
    defaultValues: initialData || {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      position: "",
      isActive: true
    }
  });

  async function onSubmit(data: any) {
    setIsSubmitting(true);
    try {
      const contactData = {
        ...data,
        updatedAt: new Date()
      };

      const isNew = !initialData?.id;

      if (initialData?.id) {
        await update(initialData.id, contactData);
        toast({
          title: "Contact mis à jour",
          description: `${data.firstName} ${data.lastName} a été mis à jour.`
        });
      } else {
        const newContactData = {
          ...contactData,
          createdAt: new Date()
        };
        await add(newContactData);
        toast({
          title: "Contact ajouté",
          description: `${data.firstName} ${data.lastName} a été ajouté.`
        });
      }

      if (onSave) {
        onSave({
          id: initialData?.id || 'new-id', // This will be replaced with the actual ID from Firebase
          ...contactData,
          createdAt: initialData?.createdAt || new Date(),
          isActive: initialData?.isActive !== undefined ? initialData.isActive : true
        }, isNew);
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du contact :", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'enregistrer le contact."
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    form,
    isSubmitting,
    onSubmit: form.handleSubmit(onSubmit)
  };
}
