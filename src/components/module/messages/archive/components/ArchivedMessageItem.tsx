
import React from 'react';
import { Message, Contact } from '../../types/message-types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArchiveRestoreIcon, 
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

// Update the Message and Contact interfaces to include missing properties
interface ExtendedMessage extends Message {
  content?: string;
  createdAt?: any;
  category?: string;
  tags?: string[];
  hasAttachments?: boolean;
}

interface ExtendedContact extends Contact {
  firstName?: string;
  lastName?: string;
}

// Helper functions
const getInitials = (firstName?: string, lastName?: string): string => {
  if (!firstName && !lastName) return '?';
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`;
};

const truncateText = (text?: string, maxLength: number = 100): string => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

const extractTextFromHtml = (html?: string): string => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
};

const formatMessageDate = (date?: any): string => {
  if (!date) return '';
  const messageDate = date?.toDate ? date.toDate() : new Date(date);
  return messageDate.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

interface ArchivedMessageItemProps {
  message: ExtendedMessage;
  contact: ExtendedContact | undefined;
  onRestoreMessage: (messageId: string) => void;
  isRestoring: boolean;
}

const ArchivedMessageItem: React.FC<ArchivedMessageItemProps> = ({
  message,
  contact,
  onRestoreMessage,
  isRestoring
}) => {
  const textContent = extractTextFromHtml(message.content);
  
  return (
    <div className="flex items-start p-4 gap-3 hover:bg-gray-50">
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
              ? `${contact.firstName || ''} ${contact.lastName || ''}` 
              : 'Contact inconnu'
            }
          </div>
          <div className="flex items-center text-xs text-muted-foreground whitespace-nowrap">
            <Calendar className="h-3 w-3 mr-1" />
            {formatMessageDate(message.createdAt || message.timestamp)}
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
          
          {message.hasAttachments || (message.attachments && message.attachments.length > 0) && (
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
          disabled={isRestoring}
        >
          {isRestoring ? (
            <Loader2 className="h-4 w-4 animate-spin mr-1" />
          ) : (
            <ArchiveRestoreIcon className="h-4 w-4 mr-1" />
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
              <ArchiveRestoreIcon className="h-4 w-4 mr-2" />
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
};

export default ArchivedMessageItem;
