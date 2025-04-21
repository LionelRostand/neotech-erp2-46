
import React from 'react';
import { Message } from '../types/message-types';
import ArchivedMessageItem from './ArchivedMessageItem';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

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
  // Ensure messages is always an array
  const safeMessages = Array.isArray(messages) ? messages : [];
  
  // State for message being restored
  const [restoringMessageId, setRestoringMessageId] = React.useState<string | null>(null);

  const handleRestore = (message: Message) => {
    setRestoringMessageId(message.id);
    
    // Simulate restoration process
    setTimeout(() => {
      onRestoreMessage(message);
      setRestoringMessageId(null);
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement des messages archivés...</span>
      </div>
    );
  }

  if (safeMessages.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">Aucun message archivé trouvé.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {safeMessages.map(message => {
        // Get display name for the contact
        const contactName = message.senderName || 'Contact inconnu';
        const isRestoring = restoringMessageId === message.id;
        
        return (
          <ArchivedMessageItem 
            key={message.id} 
            message={message} 
            onRestoreMessage={() => handleRestore(message)}
            isRestoring={isRestoring}
          />
        );
      })}
    </div>
  );
};

export default ArchivedMessagesList;
