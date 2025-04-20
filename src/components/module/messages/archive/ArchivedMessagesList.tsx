
import React from 'react';
import { Message } from '../types/message-types';
import ArchivedMessageItem from './components/ArchivedMessageItem';
import ArchivedMessageSkeleton from './components/ArchivedMessageSkeleton';

interface ArchivedMessagesListProps {
  messages: Message[];
  isLoading?: boolean;
  onRestoreMessage: (message: Message) => void;
  contacts?: Record<string, { name: string; email: string }>;
}

const ArchivedMessagesList: React.FC<ArchivedMessagesListProps> = ({
  messages,
  isLoading = false,
  onRestoreMessage,
  contacts = {}
}) => {
  // Afficher des skeletons pendant le chargement
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <ArchivedMessageSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Si aucun message n'est trouvé
  if (messages.length === 0) {
    return <div className="text-center py-10 text-muted-foreground">Aucun message archivé trouvé</div>;
  }

  // Fonction pour récupérer le contact par ID
  const getContactById = (contactId: string) => {
    return contacts[contactId] || { name: 'Contact inconnu', email: '' };
  };

  // Fonction pour obtenir le nom de contact pour l'affichage
  const getContactDisplayName = (message: Message) => {
    if (!message.recipients || message.recipients.length === 0) {
      return 'Aucun destinataire';
    }

    const recipientId = message.recipients[0];
    const contact = getContactById(recipientId);
    
    if (message.recipients.length > 1) {
      return `${contact.name} et ${message.recipients.length - 1} autre(s)`;
    }
    
    return contact.name;
  };

  return (
    <div className="space-y-2">
      {messages.map(message => (
        <ArchivedMessageItem
          key={message.id}
          message={message}
          contact={getContactDisplayName(message)}
          onRestoreMessage={() => onRestoreMessage(message)}
          isRestoring={false}
        />
      ))}
    </div>
  );
};

export default ArchivedMessagesList;
