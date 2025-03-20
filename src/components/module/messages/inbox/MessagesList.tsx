
import React from 'react';
import { Message, Contact } from '../types/message-types';
import MessageItem from './components/MessageItem';
import MessageSkeleton from './components/MessageSkeleton';
import EmptyState from './components/EmptyState';
import { formatMessageDate, getInitials, truncateText, extractTextFromHtml } from './utils/messageUtils';

interface MessagesListProps {
  messages: Message[];
  contacts: Record<string, Contact>;
  selectedMessageId: string | undefined;
  onSelectMessage: (message: Message) => void;
  onToggleFavorite: (messageId: string) => void;
  onArchiveMessage: (messageId: string) => void;
  isLoading: boolean;
}

const MessagesList: React.FC<MessagesListProps> = ({
  messages,
  contacts,
  selectedMessageId,
  onSelectMessage,
  onToggleFavorite,
  onArchiveMessage,
  isLoading
}) => {
  if (isLoading) {
    return <MessageSkeleton />;
  }

  if (messages.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="divide-y h-full overflow-y-auto">
      {messages.map((message) => {
        const contact = contacts[message.sender];
        const isSelected = message.id === selectedMessageId;
        
        return (
          <MessageItem
            key={message.id}
            message={message}
            contact={contact}
            isSelected={isSelected}
            onSelectMessage={onSelectMessage}
            onToggleFavorite={onToggleFavorite}
            onArchiveMessage={onArchiveMessage}
            formatMessageDate={formatMessageDate}
            getInitials={getInitials}
            truncateText={truncateText}
            extractTextFromHtml={extractTextFromHtml}
          />
        );
      })}
    </div>
  );
};

export default MessagesList;
