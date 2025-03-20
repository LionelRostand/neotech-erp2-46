
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

interface TopContactsProps {
  contacts: {
    contactId: string;
    contactName: string;
    messagesCount: number;
  }[];
}

const TopContacts: React.FC<TopContactsProps> = ({ contacts }) => {
  // Trouver le nombre maximum de messages pour normaliser la barre de progression
  const maxMessages = Math.max(...contacts.map(c => c.messagesCount));

  // Fonction pour obtenir les initiales
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-4">
      {contacts.map(contact => (
        <div key={contact.contactId} className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={`/api/avatars/${contact.contactId}`} />
            <AvatarFallback>{getInitials(contact.contactName)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">{contact.contactName}</p>
              <span className="text-xs text-muted-foreground">{contact.messagesCount}</span>
            </div>
            <Progress value={(contact.messagesCount / maxMessages) * 100} className="h-2" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopContacts;
