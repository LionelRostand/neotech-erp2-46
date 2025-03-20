
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { useScheduledMessages } from './hooks/useScheduledMessages';
import ScheduledMessagesToolbar from './components/ScheduledMessagesToolbar';
import ScheduledMessagesList from './components/ScheduledMessagesList';
import CancelMessageDialog from './components/CancelMessageDialog';

const ScheduledPage: React.FC = () => {
  const {
    filteredMessages,
    contacts,
    isLoading,
    searchTerm,
    setSearchTerm,
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <ScheduledMessagesToolbar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onFilterChange={setFilter}
            onCreateNewMessage={handleCreateNewMessage}
          />
        </CardHeader>
        <CardContent>
          <ScheduledMessagesList
            messages={filteredMessages}
            contacts={contacts}
            isLoading={isLoading}
            onEditMessage={handleEditMessage}
            onSendNow={handleSendNow}
            onCancelMessage={handleCancelMessage}
            onCreateNewMessage={handleCreateNewMessage}
          />
          
          <div className="text-sm text-muted-foreground mt-4 flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Les messages programmés sont envoyés automatiquement à la date et l'heure spécifiées.
          </div>
        </CardContent>
      </Card>
      
      <CancelMessageDialog
        open={showCancelDialog}
        message={messageToCancel}
        onOpenChange={setShowCancelDialog}
        onConfirm={confirmCancelMessage}
      />
    </div>
  );
};

export default ScheduledPage;
