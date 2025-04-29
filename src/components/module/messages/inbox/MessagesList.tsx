
import React from 'react';
import { Message } from '../types/message-types';
import MessageItem from './components/MessageItem';
import MessageSkeleton from './components/MessageSkeleton';
import EmptyState from './components/EmptyState';

export interface MessagesListProps {
  messages: Message[] | undefined;
  isLoading: boolean;
  filter: 'all' | 'unread' | 'read';
  searchTerm?: string;
  onSelectMessage?: (message: Message) => void;
}

const MessagesList: React.FC<MessagesListProps> = ({ 
  messages, 
  isLoading, 
  filter,
  searchTerm,
  onSelectMessage
}) => {
  // Filter messages based on filter and search term
  const filteredMessages = React.useMemo(() => {
    if (!messages) return [];
    
    let result = [...messages];
    
    // Apply status filter
    if (filter === 'unread') {
      result = result.filter(msg => !msg.isRead);
    } else if (filter === 'read') {
      result = result.filter(msg => msg.isRead);
    }
    
    // Apply search filter if a search term is provided
    if (searchTerm && searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        msg => msg.subject.toLowerCase().includes(term) || 
               msg.content.toLowerCase().includes(term)
      );
    }
    
    return result;
  }, [messages, filter, searchTerm]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <MessageSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!filteredMessages || filteredMessages.length === 0) {
    return <EmptyState searchTerm={searchTerm} />;
  }

  return (
    <div className="space-y-4">
      {filteredMessages.map(message => (
        <MessageItem 
          key={message.id} 
          message={message} 
          onClick={() => onSelectMessage && onSelectMessage(message)} 
        />
      ))}
    </div>
  );
};

export default MessagesList;
