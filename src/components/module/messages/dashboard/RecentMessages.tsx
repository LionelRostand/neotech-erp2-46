
import React from 'react';
import { useFirebaseCollection } from '@/hooks/useFirebaseCollection';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Check, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Message {
  id: string;
  subject: string;
  sender: string;
  timestamp: any;
  read: boolean;
  type: string;
}

export const RecentMessages: React.FC = () => {
  // Use the inbox collection to get recent messages, ensure path is not empty
  const inboxPath = COLLECTIONS.MESSAGES?.INBOX || 'message_inbox';
  const { data: messages = [], isLoading } = useFirebaseCollection<Message>(inboxPath);
  
  // Get the 5 most recent messages
  const recentMessages = messages
    .slice()
    .sort((a, b) => {
      const dateA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date();
      const dateB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date();
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

  if (recentMessages.length === 0) {
    return (
      <div className="py-6 text-center text-muted-foreground">
        <p>Aucun message récent.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recentMessages.map(message => {
        const timestamp = message.timestamp?.toDate ? message.timestamp.toDate() : new Date();
        const formattedDate = format(timestamp, 'PPp', { locale: fr });
        
        const initials = message.sender
          .split(' ')
          .map(part => part[0])
          .join('')
          .toUpperCase()
          .substring(0, 2);
          
        return (
          <div key={message.id} className="flex items-start gap-3 pb-3 border-b">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <p className="font-medium truncate">{message.subject}</p>
                {message.read ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Badge variant="secondary" className="text-xs">Nouveau</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate">De: {message.sender}</p>
              <div className="flex items-center gap-1 mt-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{formattedDate}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
