
import React from 'react';
import { useFirebaseCollection } from '@/hooks/useFirebaseCollection';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Mail, Phone } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  lastContact?: any;
}

export const RecentContacts: React.FC = () => {
  // Use the contacts collection to get recent contacts
  const contactsPath = COLLECTIONS.MESSAGES?.CONTACTS || 'message_contacts';
  const { data: contacts, isLoading } = useFirebaseCollection<Contact>(contactsPath);
  
  // Get the 5 most recent contacts
  const recentContacts = contacts
    .slice()
    .sort((a, b) => {
      const dateA = a.lastContact?.toDate ? a.lastContact.toDate() : new Date(0);
      const dateB = b.lastContact?.toDate ? b.lastContact.toDate() : new Date(0);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-24">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (recentContacts.length === 0) {
    return (
      <div className="py-6 text-center text-muted-foreground">
        <p>Aucun contact récent.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recentContacts.map(contact => {
        const initials = contact.name
          .split(' ')
          .map(part => part[0])
          .join('')
          .toUpperCase()
          .substring(0, 2);
          
        return (
          <div key={contact.id} className="flex items-start gap-3 pb-3 border-b">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium">{contact.name}</p>
              {contact.company && (
                <p className="text-sm text-muted-foreground">{contact.company}</p>
              )}
              <div className="flex flex-col mt-1 gap-1">
                {contact.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground truncate">{contact.email}</span>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{contact.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
