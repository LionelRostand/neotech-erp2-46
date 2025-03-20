
import React from 'react';
import { Message, Contact } from '../../types/message-types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Paperclip, Archive } from 'lucide-react';

interface MessageItemProps {
  message: Message;
  contact: Contact | undefined;
  isSelected: boolean;
  onSelectMessage: (message: Message) => void;
  onToggleFavorite: (messageId: string) => void;
  onArchiveMessage: (messageId: string) => void;
  formatMessageDate: (timestamp: any) => string;
  getInitials: (firstName: string, lastName: string) => string;
  truncateText: (text: string, maxLength: number) => string;
  extractTextFromHtml: (html: string) => string;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  contact,
  isSelected,
  onSelectMessage,
  onToggleFavorite,
  onArchiveMessage,
  formatMessageDate,
  getInitials,
  truncateText,
  extractTextFromHtml
}) => {
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
};

export default MessageItem;
