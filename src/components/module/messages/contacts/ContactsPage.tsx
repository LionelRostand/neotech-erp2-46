
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

const ContactsPage: React.FC = () => {
  const { contacts, setContacts, loading, filterContacts } = useContacts();
  const [search, setSearch] = useState('');
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { toast } = useToast();

  const filteredContacts = React.useMemo(() => {
    return filterContacts(search, contacts);
  }, [contacts, search, filterContacts]);

  const handleSaveContact = (contact: Contact, isNew: boolean) => {
    if (isNew) {
      setContacts(prevContacts => [...prevContacts, contact]);
    } else {
      setContacts(prevContacts => 
        prevContacts.map(c => c.id === contact.id ? contact : c)
      );
    }
    
    toast({
      title: isNew ? "Contact créé" : "Contact modifié",
      description: isNew ? "Le contact a été créé avec succès" : "Le contact a été modifié avec succès",
    });
  };

  const handleDeleteContact = () => {
    if (selectedContact) {
      setContacts(prevContacts => 
        prevContacts.filter(c => c.id !== selectedContact.id)
      );
      
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <ContactsToolbar 
            search={search}
            onSearchChange={setSearch}
            onCreateContact={() => setOpenCreateDialog(true)}
          />
          
          <ContactsTable 
            contacts={filteredContacts} 
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
