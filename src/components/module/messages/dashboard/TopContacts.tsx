
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';

interface TopContactProps {
  contacts: Array<{id: string; name: string; count: number}>;
  isLoading?: boolean;
}

const TopContacts: React.FC<TopContactProps> = ({ contacts, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 animate-pulse">
            <div className="h-10 w-10 rounded-full bg-gray-200"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="h-6 w-6 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!contacts || contacts.length === 0) {
    return <p className="text-muted-foreground text-center py-4">Aucun contact trouvé</p>;
  }

  return (
    <div className="space-y-4">
      {contacts.map((contact) => (
        <div key={contact.id} className="flex items-center space-x-4">
          <Avatar>
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(contact.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium">{contact.name}</p>
            <p className="text-xs text-muted-foreground">
              {contact.count} message{contact.count > 1 ? 's' : ''}
            </p>
          </div>
          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
            {contact.count}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopContacts;
