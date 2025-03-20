
import React from 'react';
import { Contact } from '../types/message-types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import ContactAvatar from './dialog/ContactAvatar';
import ContactFormFields from './dialog/ContactFormFields';
import ContactFormActions from './dialog/ContactFormActions';
import { useContactForm } from './dialog/useContactForm';

interface ContactDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  contact: Contact | null;
  onSave: (contact: Contact, isNew: boolean) => void;
}

const ContactDialog: React.FC<ContactDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  contact, 
  onSave 
}) => {
  const {
    form,
    isSubmitting,
    isNewContact,
    onSubmit
  } = useContactForm(contact, onSave, onOpenChange);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isNewContact ? "Créer un nouveau contact" : "Modifier le contact"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ContactAvatar 
              firstName={form.watch('firstName')}
              lastName={form.watch('lastName')}
              avatar={contact?.avatar}
            />

            <ContactFormFields />

            <ContactFormActions 
              isSubmitting={isSubmitting}
              isNewContact={isNewContact}
              onCancel={() => onOpenChange(false)}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDialog;
