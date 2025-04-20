
import React from 'react';
import { Message, Contact } from '../../types/message-types';
import ScheduledMessageItem from './ScheduledMessageItem';
import ScheduledEmptyState from './ScheduledEmptyState';

interface ScheduledMessagesListProps {
  messages: Message[] | undefined;
  isLoading: boolean;
  onEditMessage: (message: Message) => void;
  onSendNow: (message: Message) => void;
  onCancelMessage: (message: Message) => void;
  onCreateNewMessage: () => void;
}

const ScheduledMessagesList: React.FC<ScheduledMessagesListProps> = ({
  messages,
  isLoading,
  onEditMessage,
  onSendNow,
  onCancelMessage,
  onCreateNewMessage
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="p-4 rounded-md border border-gray-200 animate-pulse">
            <div className="flex items-start space-x-4">
              <div className="h-10 w-10 rounded-full bg-gray-200"></div>
              <div className="flex-1">
                <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 w-1/2 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 w-full bg-gray-200 rounded mb-2"></div>
                <div className="h-3 w-1/3 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

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
