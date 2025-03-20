
import React from 'react';
import { Message, Contact } from '../types/message-types';
import ArchivedMessageItem from './components/ArchivedMessageItem';
import ArchivedMessageSkeleton from './components/ArchivedMessageSkeleton';
import ArchivedEmptyState from './components/ArchivedEmptyState';

interface ArchivedMessagesListProps {
  messages: Message[];
  contacts: Record<string, Contact>;
  onRestoreMessage: (messageId: string) => void;
  isLoading: boolean;
  isRestoring: Record<string, boolean>;
}

const ArchivedMessagesList: React.FC<ArchivedMessagesListProps> = ({
  messages,
  contacts,
  onRestoreMessage,
  isLoading,
  isRestoring
}) => {
  console.log("Rendering ArchivedMessagesList", { 
    messagesCount: messages?.length, 
    isLoading,
    hasContacts: Object.keys(contacts).length > 0
  });

  if (isLoading) {
    return <ArchivedMessageSkeleton count={7} />;
  }

  if (!messages || messages.length === 0) {
    return <ArchivedEmptyState />;
  }

  return (
    <div className="divide-y h-full overflow-y-auto">
      {messages.map((message) => {
        const contact = message.sender ? contacts[message.sender] : undefined;
        const isRestoringMessage = message.id ? isRestoring[message.id] : false;
        
        return (
          <ArchivedMessageItem
            key={message.id || `message-${Math.random()}`}
            message={message}
            contact={contact}
            onRestoreMessage={onRestoreMessage}
            isRestoring={isRestoringMessage}
          />
        );
      })}
    </div>
  );
};

export default ArchivedMessagesList;
