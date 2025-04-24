
import React from 'react';
import { Button } from '@/components/ui/button';
import { Message } from '../types/message-types';
import { RestoreIcon, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ArchivedMessageItemProps {
  message: Message;
  onRestore: (message: Message) => void;
  onView: (message: Message) => void;
}

const ArchivedMessageItem: React.FC<ArchivedMessageItemProps> = ({ 
  message, 
  onRestore,
  onView 
}) => {
  const timestamp = message.timestamp?.toDate 
    ? message.timestamp.toDate() 
    : new Date();
  
  const formattedDate = format(timestamp, 'Pp', { locale: fr });

  return (
    <div className="py-3 px-4 hover:bg-gray-50 rounded transition-colors">
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
        
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onView(message)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onRestore(message)}
          >
            <RestoreIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArchivedMessageItem;
