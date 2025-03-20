
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Contact } from '../../types/message-types';
import DataTable from '@/components/DataTable';
import { Column } from '@/components/DataTable';
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

interface ContactsTableProps {
  contacts: Contact[];
  onDeleteContact: (contact: Contact) => void;
}

const ContactsTable: React.FC<ContactsTableProps> = ({ 
  contacts, 
  onDeleteContact 
}) => {
  const navigate = useNavigate();

  const columns: Column[] = [
    {
      key: 'firstName',
      header: 'Prénom',
    },
    {
      key: 'lastName',
      header: 'Nom',
    },
    {
      key: 'email',
      header: 'Email',
    },
    {
      key: 'phone',
      header: 'Téléphone',
    },
    {
      key: 'company',
      header: 'Entreprise',
    },
    {
      key: 'position',
      header: 'Poste',
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const contact = row.original;

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
              <DropdownMenuItem onClick={() => {
                navigate(`/modules/messages/compose?to=${contact.id}`);
              }}>
                Envoyer un message
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDeleteContact(contact)}>
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <DataTable 
      title="Liste des contacts" 
      columns={columns} 
      data={contacts} 
    />
  );
};

export default ContactsTable;
