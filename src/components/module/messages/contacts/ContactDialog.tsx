
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Contact } from '../types/message-types';
import { useContactForm } from './dialog/useContactForm';
import ContactFormFields from './dialog/ContactFormFields';
import ContactFormActions from './dialog/ContactFormActions';
import ContactAvatar from './dialog/ContactAvatar';

interface ContactDialogProps {
  contact?: Contact;
  isOpen: boolean;
  onClose: () => void;
  onSave: (contact: Contact) => void;
}

const ContactDialog: React.FC<ContactDialogProps> = ({
  contact,
  isOpen,
  onClose,
  onSave
}) => {
  const isNewContact = !contact?.id;
  const dialogTitle = isNewContact ? 'Nouveau contact' : 'Modifier le contact';
  
  const { form, isSubmitting, onSubmit } = useContactForm({
    contact,
    onSave,
    onClose
  });
  
  const handleFormSubmit = (data: Contact) => {
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="details" className="mt-4">
          <TabsList className="mb-4">
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="avatar">Avatar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <form onSubmit={form.handleSubmit(handleFormSubmit)}>
              <ContactFormFields form={form} />
              <ContactFormActions 
                isSubmitting={isSubmitting} 
                onCancel={onClose} 
                isNewContact={isNewContact}
              />
            </form>
          </TabsContent>
          
          <TabsContent value="avatar">
            <ContactAvatar contact={contact} />
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={onClose}>
                Fermer
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDialog;
