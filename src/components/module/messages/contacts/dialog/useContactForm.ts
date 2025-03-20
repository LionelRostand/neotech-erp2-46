
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Contact } from '../../types/message-types';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Timestamp } from 'firebase/firestore';
import { contactFormSchema, ContactFormValues } from './contactFormSchema';

export const useContactForm = (
  contact: Contact | null,
  onSave: (contact: Contact, isNew: boolean) => void,
  onOpenChange: (open: boolean) => void
) => {
  const { add, update } = useFirestore(COLLECTIONS.CONTACTS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isNewContact = !contact;

  // Initialiser le formulaire avec react-hook-form et zod
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: contact?.firstName || '',
      lastName: contact?.lastName || '',
      email: contact?.email || '',
      phone: contact?.phone || '',
      company: contact?.company || '',
      position: contact?.position || '',
      notes: contact?.notes || '',
      tags: contact?.tags?.join(', ') || '',
    },
  });

  // Mettre à jour les valeurs par défaut lorsque le contact change
  useEffect(() => {
    if (contact) {
      form.reset({
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phone: contact.phone || '',
        company: contact.company || '',
        position: contact.position || '',
        notes: contact.notes || '',
        tags: contact.tags?.join(', ') || '',
      });
    } else {
      form.reset({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        position: '',
        notes: '',
        tags: '',
      });
    }
  }, [contact, form]);

  const onSubmit = async (values: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      const now = Timestamp.now();
      const contactData: Omit<Contact, 'id'> = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        company: values.company,
        position: values.position,
        notes: values.notes,
        tags: values.tags ? values.tags.split(',').map(tag => tag.trim()) : [],
        isActive: true,
        createdAt: contact?.createdAt || now,
        updatedAt: now,
      };

      let savedContact: Contact;

      if (isNewContact) {
        // Créer un nouveau contact
        savedContact = await add(contactData) as Contact;
      } else {
        // Mettre à jour un contact existant
        savedContact = await update(contact.id, contactData) as Contact;
        savedContact = { ...savedContact, id: contact.id };
      }

      onSave(savedContact, isNewContact);
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du contact:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    isNewContact,
    onSubmit
  };
};
