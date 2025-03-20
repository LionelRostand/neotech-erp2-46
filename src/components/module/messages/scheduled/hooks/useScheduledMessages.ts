
import { useScheduledMessagesData } from './useScheduledMessagesData';
import { useScheduledMessagesFilter } from './useScheduledMessagesFilter';
import { useScheduledMessageOperations } from './useScheduledMessageOperations';

export const useScheduledMessages = () => {
  const { 
    messages, 
    setMessages, 
    contacts, 
    isLoading 
  } = useScheduledMessagesData();
  
  const {
    filteredMessages,
    searchTerm,
    setSearchTerm,
    filter,
    setFilter
  } = useScheduledMessagesFilter(messages, contacts);
  
  const {
    messageToCancel,
    showCancelDialog,
    setShowCancelDialog,
    handleCancelMessage,
    confirmCancelMessage,
    handleSendNow
  } = useScheduledMessageOperations(messages, setMessages);

  const handleEditMessage = (messageId: string) => {
    // Rediriger vers la page de composition avec les données pré-remplies
    window.location.href = `/modules/messages/compose?edit=${messageId}`;
  };

  const handleCreateNewMessage = () => {
    window.location.href = '/modules/messages/compose';
  };

  return {
    messages,
    filteredMessages, 
    isLoading,
    contacts,
    searchTerm,
    setSearchTerm,
    filter,
    setFilter,
    messageToCancel,
    showCancelDialog,
    setShowCancelDialog,
    handleCancelMessage,
    confirmCancelMessage,
    handleSendNow,
    handleEditMessage,
    handleCreateNewMessage
  };
};
