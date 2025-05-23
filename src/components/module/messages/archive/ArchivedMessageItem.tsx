
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Message } from '../types/message-types';
import { Archive, Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface ArchivedMessageItemProps {
  message: Message;
  onRestoreMessage: () => void;
  isRestoring: boolean;
}

const ArchivedMessageItem: React.FC<ArchivedMessageItemProps> = ({ 
  message, 
  onRestoreMessage,
  isRestoring
}) => {
  // Ensure message has all required properties with defaults
  const safeMessage = {
    id: message?.id || 'unknown',
    sender: message?.sender || { email: '', name: 'Contact inconnu' },
    subject: message?.subject || 'Sans objet',
    content: message?.content || 'Aucun contenu',
    createdAt: message?.createdAt || new Date(),
    ...message
  };

  // Get sender name safely
  const senderName = typeof safeMessage.sender === 'object' && safeMessage.sender ? 
                     safeMessage.sender.name || 'Contact inconnu' : 
                     'Contact inconnu';

  const getDate = () => {
    try {
      if (safeMessage.createdAt instanceof Date) {
        return formatDate(safeMessage.createdAt);
      }
      
      if (safeMessage.createdAt && typeof safeMessage.createdAt.toDate === 'function') {
        return formatDate(safeMessage.createdAt.toDate());
      }
      
      return formatDate(new Date());
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date inconnue';
    }
  };

  return (
    <Card className="hover:bg-muted/30 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{senderName}</span>
              <span className="text-xs text-muted-foreground">
                {getDate()}
              </span>
            </div>
            <div className="text-sm font-medium">{safeMessage.subject}</div>
            <div className="text-sm text-muted-foreground line-clamp-2">{safeMessage.content}</div>
          </div>
          
          <Button 
            size="sm" 
            variant="outline" 
            onClick={onRestoreMessage}
            disabled={isRestoring}
          >
            {isRestoring ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Restauration...
              </>
            ) : (
              <>
                <Archive className="h-4 w-4 mr-2" />
                Restaurer
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArchivedMessageItem;
