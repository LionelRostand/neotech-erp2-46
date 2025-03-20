
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { useScheduledMessages } from './hooks/useScheduledMessages';
import ScheduledMessagesToolbar from './components/ScheduledMessagesToolbar';
import ScheduledMessagesList from './components/ScheduledMessagesList';
import CancelMessageDialog from './components/CancelMessageDialog';
import { useToast } from '@/hooks/use-toast';

const ScheduledPage: React.FC = () => {
  const [autoSchedulingEnabled, setAutoSchedulingEnabled] = useState(true);
  const { toast } = useToast();
  
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

  // Handle toggling of auto scheduling
  const handleAutoSchedulingChange = (enabled: boolean) => {
    setAutoSchedulingEnabled(enabled);
    
    // Show toast notification for user feedback
    if (enabled) {
      toast({
        title: "Programmation automatique activée",
        description: "Les messages seront envoyés automatiquement à la date et l'heure programmées."
      });
    } else {
      toast({
        title: "Programmation automatique désactivée",
        description: "Les messages ne seront pas envoyés automatiquement. Envoi manuel requis."
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <ScheduledMessagesToolbar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onFilterChange={setFilter}
            onCreateNewMessage={handleCreateNewMessage}
            autoSchedulingEnabled={autoSchedulingEnabled}
            onAutoSchedulingChange={handleAutoSchedulingChange}
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
            {autoSchedulingEnabled 
              ? "Les messages programmés sont envoyés automatiquement à la date et l'heure spécifiées."
              : "La programmation automatique est désactivée. Les messages devront être envoyés manuellement."}
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
