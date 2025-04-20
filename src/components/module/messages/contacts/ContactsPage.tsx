
import React, { useState } from 'react';
import { Contact } from '../types/message-types';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import ContactDialog from './ContactDialog';
import DeleteContactDialog from './DeleteContactDialog';
import ContactsTable from './components/ContactsTable';
import ContactsToolbar from './components/ContactsToolbar';
import { useContacts } from './hooks/useContacts';
import { Loader2 } from 'lucide-react';

const ContactsPage: React.FC = () => {
  const { contacts, loading, setSearch } = useContacts();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { toast } = useToast();

  const handleSaveContact = (contact: Contact, isNew: boolean) => {
    toast({
      title: isNew ? "Contact créé" : "Contact modifié",
      description: isNew ? "Le contact a été créé avec succès" : "Le contact a été modifié avec succès",
    });
  };

  const handleDeleteContact = () => {
    if (selectedContact) {
      toast({
        title: "Contact supprimé",
        description: "Le contact a été supprimé avec succès",
      });
      
      setOpenDeleteDialog(false);
      setSelectedContact(null);
    }
  };

  const handleOpenDeleteDialog = (contact: Contact) => {
    setSelectedContact(contact);
    setOpenDeleteDialog(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <ContactsToolbar 
            search=""
            onSearchChange={setSearch}
            onCreateContact={() => setOpenCreateDialog(true)}
          />
          
          <ContactsTable 
            contacts={contacts} 
            onDeleteContact={handleOpenDeleteDialog}
          />
        </CardContent>
      </Card>

      <ContactDialog 
        isOpen={openCreateDialog} 
        onOpenChange={setOpenCreateDialog} 
        contact={selectedContact}
        onSave={handleSaveContact}
      />
      
      <DeleteContactDialog
        isOpen={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        contact={selectedContact}
        onConfirm={handleDeleteContact}
      />
    </div>
  );
};

export default ContactsPage;
