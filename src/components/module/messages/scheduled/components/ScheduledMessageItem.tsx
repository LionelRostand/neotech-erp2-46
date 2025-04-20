
import React from 'react';
import { 
  Clock, 
  MoreVertical,
  Flag, 
  Paperclip,
  Mail
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { formatMessageDate } from '../../inbox/utils/messageUtils';
import { Message, MessagePriority } from '../../types/message-types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Add truncateText function implementation directly in this file
const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

interface ScheduledMessageItemProps {
  message: Message;
  onViewDetails: (message: Message) => void;
  onCancelSchedule: (message: Message) => void;
  onEditMessage: (message: Message) => void;
}

const ScheduledMessageItem: React.FC<ScheduledMessageItemProps> = ({ 
  message, 
  onViewDetails,
  onCancelSchedule,
  onEditMessage
}) => {
  const {
    subject,
    content,
    sender,
    recipients,
    scheduledAt,
    hasAttachments,
    priority,
  } = message;
  
  // Get sender initials
  const senderInitials = getInitials(sender);
  
  // Format date
  const formattedDate = formatMessageDate(scheduledAt);
  
  // Calculate scheduled time
  const scheduledTime = scheduledAt?.toDate ? scheduledAt.toDate() : new Date(scheduledAt);
  const now = new Date();
  const isUpcoming = scheduledTime > now;
  const timeDiff = Math.floor((scheduledTime.getTime() - now.getTime()) / (1000 * 60));
  
  // Format recipients
  const recipientsText = recipients.length > 1 
    ? `${recipients[0]} +${recipients.length - 1}` 
    : recipients[0];
  
  return (
    <div className="p-4 rounded-md border border-gray-200 bg-white hover:border-primary/20 hover:shadow-sm transition-all duration-200">
      <div className="flex items-start space-x-4">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary/10 text-primary text-sm">
            {senderInitials}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 max-w-[70%]">
              <h3 className="text-sm font-medium truncate">
                {subject}
              </h3>
              {priority === 'high' && (
                <Flag className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />
              )}
              {hasAttachments && (
                <Paperclip className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
              )}
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Ouvrir le menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewDetails(message)}>
                  Voir les détails
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEditMessage(message)}>
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onCancelSchedule(message)}
                  className="text-red-500"
                >
                  Annuler l'envoi
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="flex items-center space-x-2 mt-1">
            <Mail className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-xs text-gray-500 truncate">
              À: {recipientsText}
            </span>
          </div>
          
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {truncateText(content?.replace(/<[^>]*>/g, '') || '', 140)}
          </p>
          
          <div className="flex items-center space-x-1 mt-2 text-xs">
            <Clock className={`h-3.5 w-3.5 ${isUpcoming ? 'text-primary' : 'text-gray-400'}`} />
            <span className={`${isUpcoming ? 'text-primary font-medium' : 'text-gray-500'}`}>
              {isUpcoming 
                ? timeDiff < 60 
                  ? `Dans ${timeDiff} minutes` 
                  : formattedDate
                : `Programmé pour ${formattedDate}`
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduledMessageItem;
