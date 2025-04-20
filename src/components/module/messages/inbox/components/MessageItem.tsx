
import React from 'react';
import { 
  Archive, 
  Clock, 
  Flag, 
  Star, 
  Paperclip,
  Circle,
  File
} from 'lucide-react';
import { formatMessageDate } from '../utils/messageUtils';
import { Message, MessageStatus, MessagePriority } from '../../types/message-types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';

interface MessageItemProps {
  message: Message;
  onClick?: () => void;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, onClick }) => {
  const {
    subject = '',
    sender = '',
    content = '',
    status = 'received',
    createdAt,
    hasAttachments = false,
    priority = 'normal',
    isRead = false,
    isFavorite = false
  } = message || {};
  
  // Get initials from sender name, safely handling undefined values
  const senderInitials = sender ? getInitials(sender) : '??';
  
  // Format date, handling undefined values
  const formattedDate = createdAt ? formatMessageDate(createdAt) : '';
  
  // Determine if message is unread
  const unread = status === 'received' && !isRead;
  
  // Safely handle content that might be undefined or null
  const safeContent = content || '';
  // Extract plain text from HTML content, safely handling undefined
  const plainTextContent = safeContent.replace(/<[^>]*>/g, '');
  
  return (
    <div
      className={`
        p-4 rounded-md border transition-all duration-200 cursor-pointer
        ${unread ? 'bg-primary/5 border-primary/10' : 'bg-white border-gray-200'}
        hover:border-primary/20 hover:shadow-sm
      `}
      onClick={onClick}
    >
      <div className="flex items-start space-x-4">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary/10 text-primary text-sm">
            {senderInitials}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 max-w-[70%]">
              <h3 className={`text-sm font-medium ${unread ? 'font-semibold' : ''} truncate`}>
                {sender}
              </h3>
              {unread && (
                <Circle className="h-2 w-2 fill-primary text-primary flex-shrink-0" />
              )}
              {priority === 'high' && (
                <Flag className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />
              )}
              {hasAttachments && (
                <Paperclip className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
              )}
              {isFavorite && (
                <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400 flex-shrink-0" />
              )}
            </div>
            
            <span className="text-xs text-gray-500">{formattedDate}</span>
          </div>
          
          <h4 className={`text-sm mt-0.5 ${unread ? 'font-medium' : ''} truncate`}>
            {subject}
          </h4>
          
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {plainTextContent}
          </p>
          
          <div className="flex items-center space-x-3 mt-2">
            {status === 'scheduled' && (
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Clock className="h-3.5 w-3.5" />
                <span>Programmé</span>
              </div>
            )}
            
            {hasAttachments && (
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <File className="h-3.5 w-3.5" />
                <span>Pièce(s) jointe(s)</span>
              </div>
            )}
            
            {status === 'archived' && (
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Archive className="h-3.5 w-3.5" />
                <span>Archivé</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
