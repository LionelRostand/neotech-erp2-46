
import React, { useState } from 'react';
import { Message } from '../types/message-types';
import ArchivedMessageItem from './components/ArchivedMessageItem';
import ArchivedMessageSkeleton from './components/ArchivedMessageSkeleton';
import ArchivedEmptyState from './components/ArchivedEmptyState';

interface ArchivedMessagesListProps {
  messages: Message[] | undefined;
  isLoading: boolean;
  filter: 'all' | 'sent' | 'received';
}

const ArchivedMessagesList: React.FC<ArchivedMessagesListProps> = ({ 
  messages, 
  isLoading,
  filter 
}) => {
  const [restoringIds, setRestoringIds] = useState<string[]>([]);
  
  const handleRestoreMessage = (messageId: string) => {
    // Add the messageId to restoringIds to show loading state
    setRestoringIds(prev => [...prev, messageId]);
    
    // Simulate restoration process
    setTimeout(() => {
      // Remove the messageId from restoringIds after completion
      setRestoringIds(prev => prev.filter(id => id !== messageId));
      console.log(`Message ${messageId} restored`);
    }, 1000);
  };
  
  const filteredMessages = React.useMemo(() => {
    if (!messages) return [];
    
    if (filter === 'all') return messages;
    
    if (filter === 'sent') {
      return messages.filter(msg => msg.status === 'sent');
    }
    
    if (filter === 'received') {
      return messages.filter(msg => msg.status === 'received' || msg.status === 'read');
    }
    
    return messages;
  }, [messages, filter]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <ArchivedMessageSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!filteredMessages || filteredMessages.length === 0) {
    return <ArchivedEmptyState />;
  }

  return (
    <div className="space-y-4">
      {filteredMessages.map(message => (
        <ArchivedMessageItem 
          key={message.id} 
          message={message} 
          contact={undefined}
          onRestoreMessage={handleRestoreMessage}
          isRestoring={restoringIds.includes(message.id)}
        />
      ))}
    </div>
  );
};

export default ArchivedMessagesList;
