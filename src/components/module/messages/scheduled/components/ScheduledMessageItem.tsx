
import React from 'react';
import { Message, Contact } from '../../types/message-types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Edit, Send, Ban } from 'lucide-react';
import { formatScheduledDate, getRecipientsList } from '../utils/messageUtils';

interface ScheduledMessageItemProps {
  message: Message;
  contacts: Record<string, Contact>;
  onEdit: (messageId: string) => void;
  onSendNow: (messageId: string) => void;
  onCancel: (message: Message) => void;
}

const ScheduledMessageItem: React.FC<ScheduledMessageItemProps> = ({
  message,
  contacts,
  onEdit,
  onSendNow,
  onCancel
}) => {
  return (
    <div className="p-4 hover:bg-gray-50">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <div className="bg-amber-100 text-amber-800 rounded-full h-10 w-10 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="font-medium text-base mb-1">
              {message.subject}
            </div>
            
            <div className="flex flex-wrap gap-y-1 gap-x-4 text-sm">
              <div className="flex items-center text-muted-foreground">
                <span className="font-medium mr-1">À:</span>
                {getRecipientsList(message.recipients, contacts) || 'Aucun destinataire'}
              </div>
              
              <div className="flex items-center text-blue-600">
                <Calendar className="h-4 w-4 mr-1" />
                {message.scheduledAt && formatScheduledDate(message.scheduledAt)}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {message.priority === 'high' && (
                <Badge variant="destructive" className="px-1">
                  Priorité haute
                </Badge>
              )}
              
              {message.priority === 'urgent' && (
                <Badge variant="destructive" className="px-1">
                  Urgent
                </Badge>
              )}
              
              {message.tags && message.tags.map(tag => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
              
              {message.hasAttachments && (
                <Badge variant="secondary">
                  Pièces jointes
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 lg:justify-end">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEdit(message.id)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Modifier
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onSendNow(message.id)}
          >
            <Send className="h-4 w-4 mr-1" />
            Envoyer maintenant
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onCancel(message)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Ban className="h-4 w-4 mr-1" />
            Annuler
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScheduledMessageItem;
