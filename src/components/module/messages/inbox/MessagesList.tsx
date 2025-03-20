
import React from 'react';
import { Message, Contact } from '../types/message-types';
import { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Paperclip, Archive } from 'lucide-react';

interface MessagesListProps {
  messages: Message[];
  contacts: Record<string, Contact>;
  selectedMessageId: string | undefined;
  onSelectMessage: (message: Message) => void;
  onToggleFavorite: (messageId: string) => void;
  onArchiveMessage: (messageId: string) => void;
  isLoading: boolean;
}

const MessagesList: React.FC<MessagesListProps> = ({
  messages,
  contacts,
  selectedMessageId,
  onSelectMessage,
  onToggleFavorite,
  onArchiveMessage,
  isLoading
}) => {
  const formatMessageDate = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return format(date, 'HH:mm', { locale: fr });
    }
    
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();
    
    if (isYesterday) {
      return 'Hier';
    }
    
    // Si dans la même semaine, afficher le jour
    const sixDaysAgo = new Date(now);
    sixDaysAgo.setDate(now.getDate() - 6);
    
    if (date > sixDaysAgo) {
      return format(date, 'EEEE', { locale: fr });
    }
    
    // Sinon afficher la date complète
    return format(date, 'dd/MM/yyyy', { locale: fr });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const extractTextFromHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  if (isLoading) {
    return (
      <div className="divide-y">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-start p-4 gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
            </div>
            <Skeleton className="h-3 w-10" />
          </div>
        ))}
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <p className="text-sm text-gray-500">
          Aucun message trouvé
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y h-full overflow-y-auto">
      {messages.map((message) => {
        const contact = contacts[message.sender];
        const isSelected = message.id === selectedMessageId;
        const textContent = extractTextFromHtml(message.content);
        
        return (
          <div
            key={message.id}
            className={`
              flex items-start p-3 gap-3 cursor-pointer
              ${isSelected ? 'bg-gray-100' : message.status === 'unread' ? 'bg-blue-50' : ''}
              ${message.status === 'unread' ? 'font-medium' : ''}
              hover:bg-gray-50
            `}
            onClick={() => onSelectMessage(message)}
          >
            <div className="flex-shrink-0 mt-1">
              {contact ? (
                <Avatar>
                  <AvatarImage src={contact.avatar} />
                  <AvatarFallback>
                    {getInitials(contact.firstName, contact.lastName)}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Avatar>
                  <AvatarFallback>?</AvatarFallback>
                </Avatar>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <div className="font-medium truncate" style={{ maxWidth: 'calc(100% - 70px)' }}>
                  {contact 
                    ? `${contact.firstName} ${contact.lastName}` 
                    : 'Contact inconnu'
                  }
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatMessageDate(message.createdAt)}
                </div>
              </div>
              
              <div className="text-sm font-medium truncate mb-1">
                {message.subject}
              </div>
              
              <div className="text-xs text-muted-foreground truncate">
                {truncateText(textContent, 80)}
              </div>
              
              <div className="flex items-center mt-2 gap-2">
                {message.priority === 'high' && (
                  <Badge variant="destructive" className="px-1 text-[10px]">
                    Priorité haute
                  </Badge>
                )}
                
                {message.priority === 'urgent' && (
                  <Badge variant="destructive" className="px-1 text-[10px]">
                    Urgent
                  </Badge>
                )}
                
                {message.tags && message.tags.length > 0 && (
                  <div className="flex gap-1">
                    {message.tags.slice(0, 2).map(tag => (
                      <Badge key={tag} variant="outline" className="px-1 text-[10px]">
                        {tag}
                      </Badge>
                    ))}
                    {message.tags.length > 2 && (
                      <Badge variant="outline" className="px-1 text-[10px]">
                        +{message.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
                
                {message.hasAttachments && (
                  <Paperclip className="h-3 w-3 text-muted-foreground" />
                )}
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-2 ml-1" onClick={e => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onToggleFavorite(message.id)}
              >
                <Star 
                  className={`h-4 w-4 ${message.isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} 
                />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onArchiveMessage(message.id)}
              >
                <Archive className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessagesList;
