
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
  if (!contacts || contacts.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        Aucun contact à afficher
      </div>
    );
  }

  // Trouver le nombre maximum de messages pour normaliser la barre de progression
  const maxMessages = Math.max(...contacts.map(c => c.messagesCount || 0));

  // Fonction pour obtenir les initiales
  const getInitials = (name: string) => {
    if (!name) return '?';
    
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
              <p className="text-sm font-medium">{contact.contactName || 'Contact inconnu'}</p>
              <span className="text-xs text-muted-foreground">{contact.messagesCount || 0}</span>
            </div>
            <Progress 
              value={maxMessages > 0 ? ((contact.messagesCount || 0) / maxMessages) * 100 : 0} 
              className="h-2" 
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopContacts;
