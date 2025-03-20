
import React from 'react';
import { Message, Contact } from '../../types/message-types';
import ScheduledMessageItem from './ScheduledMessageItem';
import ScheduledEmptyState from './ScheduledEmptyState';

interface ScheduledMessagesListProps {
  messages: Message[];
  contacts: Record<string, Contact>;
  isLoading: boolean;
  onEditMessage: (messageId: string) => void;
  onSendNow: (messageId: string) => void;
  onCancelMessage: (message: Message) => void;
  onCreateNewMessage: () => void;
}

const ScheduledMessagesList: React.FC<ScheduledMessagesListProps> = ({
  messages,
  contacts,
  isLoading,
  onEditMessage,
  onSendNow,
  onCancelMessage,
  onCreateNewMessage
}) => {
  if (isLoading) {
    return (
      <div className="p-8 text-center">
        Chargement des messages programmés...
      </div>
    );
  }

  if (messages.length === 0) {
    return <ScheduledEmptyState onCreateNewMessage={onCreateNewMessage} />;
  }

  return (
    <div className="border rounded-md divide-y">
      {messages.map(message => (
        <ScheduledMessageItem
          key={message.id}
          message={message}
          contacts={contacts}
          onEdit={onEditMessage}
          onSendNow={onSendNow}
          onCancel={onCancelMessage}
        />
      ))}
    </div>
  );
};

export default ScheduledMessagesList;
