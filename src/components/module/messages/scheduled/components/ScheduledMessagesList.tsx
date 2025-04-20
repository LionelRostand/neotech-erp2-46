
import React from 'react';
import { Message } from '../../types/message-types';
import ScheduledMessageItem from './ScheduledMessageItem';
import ScheduledEmptyState from './ScheduledEmptyState';

interface ScheduledMessagesListProps {
  messages: Message[];
  onEditMessage: (message: Message) => void;
  onSendNow: (message: Message) => void;
  onCancelMessage: (message: Message) => void;
  onCreateNewMessage?: () => void;
}

const ScheduledMessagesList: React.FC<ScheduledMessagesListProps> = ({
  messages,
  onEditMessage,
  onSendNow,
  onCancelMessage,
  onCreateNewMessage
}) => {
  if (!messages || messages.length === 0) {
    return <ScheduledEmptyState onCreateNewMessage={onCreateNewMessage} />;
  }

  return (
    <div className="space-y-4">
      {messages.map(message => (
        <ScheduledMessageItem
          key={message.id}
          message={message}
          onViewDetails={onSendNow} // Using onSendNow as the view details handler
          onCancelSchedule={onCancelMessage}
          onEditMessage={onEditMessage}
        />
      ))}
    </div>
  );
};

export default ScheduledMessagesList;
