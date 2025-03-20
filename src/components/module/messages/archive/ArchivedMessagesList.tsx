
import React from 'react';
import { Message, Contact } from '../types/message-types';
import { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArchiveRestore, 
  Calendar, 
  Paperclip, 
  MoreHorizontal, 
  Loader2 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface ArchivedMessagesListProps {
  messages: Message[];
  contacts: Record<string, Contact>;
  onRestoreMessage: (messageId: string) => void;
  isLoading: boolean;
  isRestoring: Record<string, boolean>;
}

const ArchivedMessagesList: React.FC<ArchivedMessagesListProps> = ({
  messages,
  contacts,
  onRestoreMessage,
  isLoading,
  isRestoring
}) => {
  const formatMessageDate = (timestamp: Timestamp | Date | string | number) => {
    let date: Date;
    
    // Check if timestamp is a Firebase Timestamp object
    if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp && typeof timestamp.toDate === 'function') {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else if (typeof timestamp === 'string' || typeof timestamp === 'number') {
      date = new Date(timestamp);
    } else {
      // Fallback to current date if timestamp is invalid
      date = new Date();
      console.warn('Invalid timestamp format:', timestamp);
    }
    
    return format(date, 'dd MMM yyyy', { locale: fr });
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
          Aucun message archivé trouvé
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y h-full overflow-y-auto">
      {messages.map((message) => {
        const contact = contacts[message.sender];
        const textContent = extractTextFromHtml(message.content);
        const isRestoringMessage = isRestoring[message.id];
        
        return (
          <div
            key={message.id}
            className="flex items-start p-4 gap-3 hover:bg-gray-50"
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
                <div className="font-medium truncate" style={{ maxWidth: 'calc(100% - 90px)' }}>
                  {contact 
                    ? `${contact.firstName} ${contact.lastName}` 
                    : 'Contact inconnu'
                  }
                </div>
                <div className="flex items-center text-xs text-muted-foreground whitespace-nowrap">
                  <Calendar className="h-3 w-3 mr-1" />
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
                {message.category && (
                  <Badge variant="outline" className="px-1 text-[10px]">
                    {message.category}
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
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8"
                onClick={() => onRestoreMessage(message.id)}
                disabled={isRestoringMessage}
              >
                {isRestoringMessage ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                ) : (
                  <ArchiveRestore className="h-4 w-4 mr-1" />
                )}
                <span className="hidden sm:inline">Restaurer</span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onRestoreMessage(message.id)}>
                    <ArchiveRestore className="h-4 w-4 mr-2" />
                    Restaurer
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Calendar className="h-4 w-4 mr-2" />
                    Voir les détails
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ArchivedMessagesList;
