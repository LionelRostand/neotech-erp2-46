
import React from 'react';
import { Contact } from '../../types/message-types';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';

interface ContactsTableActionsProps {
  contact: Contact;
  onDeleteContact: (contact: Contact) => void;
  onSendMessage: () => void;
}

const ContactsTableActions: React.FC<ContactsTableActionsProps> = ({ 
  contact, 
  onDeleteContact,
  onSendMessage 
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Ouvrir le menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={onSendMessage}>
          Envoyer un message
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onDeleteContact(contact)}>
          Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ContactsTableActions;
