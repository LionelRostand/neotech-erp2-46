
import React from 'react';
import { Button } from '@/components/ui/button';
import { Message } from '../types/message-types';
import { RestoreIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ArchivedMessagesListProps {
  messages: Message[];
  isLoading: boolean;
  onRestoreMessage: (message: Message) => void;
}

const ArchivedMessagesList: React.FC<ArchivedMessagesListProps> = ({ 
  messages, 
  isLoading, 
  onRestoreMessage 
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <p>Aucun message archivé.</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {messages.map(message => {
        const timestamp = message.timestamp?.toDate 
          ? message.timestamp.toDate() 
          : new Date();
        
        const formattedDate = format(timestamp, 'Pp', { locale: fr });
        
        return (
          <div key={message.id} className="py-4 hover:bg-gray-50 rounded transition-colors">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-medium">{message.subject}</h3>
                <p className="text-sm text-muted-foreground">
                  {message.type === 'sent' 
                    ? `À: ${message.recipientName || message.recipient || 'Inconnu'}` 
                    : `De: ${message.senderName || message.sender || 'Inconnu'}`}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{formattedDate}</p>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onRestoreMessage(message)}
                className="ml-2"
              >
                <RestoreIcon className="h-4 w-4 mr-1" />
                <span>Restaurer</span>
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ArchivedMessagesList;
