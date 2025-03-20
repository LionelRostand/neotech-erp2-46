
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Contact } from '../../types/message-types';
import DataTable from '@/components/DataTable';
import { Column } from '@/components/DataTable';
import ContactsTableActions from './ContactsTableActions';

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
      cell: ({ row }) => (
        <ContactsTableActions 
          contact={row.original} 
          onDeleteContact={onDeleteContact}
          onSendMessage={() => navigate(`/modules/messages/compose?to=${row.original.id}`)}
        />
      ),
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
