
import { useState } from 'react';
import { useScheduledMessagesData } from './useScheduledMessagesData';
import { useScheduledMessagesFilter } from './useScheduledMessagesFilter';
import { useScheduledMessageOperations } from './useScheduledMessageOperations';
import { Message } from '../../types/message-types';

export const useScheduledMessages = () => {
  // Ensure we have a valid collection path 
  const { 
    messages, 
    isLoading, 
    error,
    refetch,
    searchTerm,
    setSearchTerm,
    filter,
    setFilter
  } = useScheduledMessagesData();
  
  const {
    filteredMessages
  } = useScheduledMessagesFilter({ 
    messages: messages || [], 
    searchTerm, 
    filter 
  });
  
  const {
    messageToCancel,
    showCancelDialog,
    setShowCancelDialog,
    handleCancelMessage,
    confirmCancelMessage,
    handleSendNow
  } = useScheduledMessageOperations();

  const handleEditMessage = (message: Message) => {
    // Rediriger vers la page de composition avec les données pré-remplies
    window.location.href = `/modules/messages/compose?edit=${message.id}`;
  };

  const handleCreateNewMessage = () => {
    window.location.href = '/modules/messages/compose';
  };

  return {
    filteredMessages, 
    isLoading,
    error,
    refetch,
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
