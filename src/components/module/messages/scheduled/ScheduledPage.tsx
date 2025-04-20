
import React from 'react';
import { useScheduledMessages } from './hooks/useScheduledMessages';
import ScheduledMessagesList from './components/ScheduledMessagesList';
import ScheduledMessagesToolbar from './components/ScheduledMessagesToolbar';
import ScheduledEmptyState from './components/ScheduledEmptyState';
import CancelMessageDialog from './components/CancelMessageDialog';
import { Message } from '../types/message-types';

const ScheduledPage: React.FC = () => {
  const {
    filteredMessages,
    isLoading,
    error,
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
  } = useScheduledMessages();

  // Gérer le changement de filtre (cast string to filter type)
  const handleFilterChange = (value: string) => {
    setFilter(value as 'all' | 'upcoming');
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-md border border-red-100">
        <h3 className="text-lg font-medium text-red-800">Erreur</h3>
        <p className="text-red-700 mt-1">
          Impossible de charger les messages programmés : {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Messages programmés</h1>
      </div>

      <ScheduledMessagesToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filter={filter}
        onFilterChange={handleFilterChange}
        onCreateMessage={handleCreateNewMessage}
      />

      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-pulse rounded-md bg-slate-100 h-96 w-full"></div>
        </div>
      ) : filteredMessages.length === 0 ? (
        <ScheduledEmptyState 
          onCreateNewMessage={handleCreateNewMessage}
        />
      ) : (
        <ScheduledMessagesList
          messages={filteredMessages}
          onCancelMessage={handleCancelMessage}
          onSendNow={handleSendNow}
          onEditMessage={handleEditMessage}
        />
      )}

      {/* Boîte de dialogue de confirmation d'annulation */}
      {messageToCancel && (
        <CancelMessageDialog
          open={showCancelDialog}
          message={messageToCancel}
          onClose={() => setShowCancelDialog(false)}
          onConfirm={confirmCancelMessage}
        />
      )}
    </div>
  );
};

export default ScheduledPage;
