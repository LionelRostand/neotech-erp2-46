
import { useState } from 'react';
import { Message } from '../../types/message-types';
import { useSafeFirestore } from '@/hooks/use-safe-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { useToast } from '@/hooks/use-toast';

export const useScheduledMessageOperations = () => {
  const [messageToCancel, setMessageToCancel] = useState<Message | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const scheduledCollection = useSafeFirestore(COLLECTIONS.MESSAGES.SCHEDULED);
  const { toast } = useToast();

  const handleCancelMessage = (message: Message) => {
    setMessageToCancel(message);
    setShowCancelDialog(true);
  };

  const confirmCancelMessage = async () => {
    if (!messageToCancel) return;
    
    try {
      await scheduledCollection.remove(messageToCancel.id);
      
      toast({
        title: "Envoi annulé",
        description: "Le message programmé a été annulé et supprimé."
      });
    } catch (error) {
      console.error("Erreur lors de l'annulation du message:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'annuler le message. Veuillez réessayer."
      });
    } finally {
      setShowCancelDialog(false);
      setMessageToCancel(null);
    }
  };

  const handleSendNow = (messageId: string) => {
    // Simuler l'envoi immédiat
    toast({
      title: "Message envoyé",
      description: "Le message a été envoyé immédiatement."
    });
  };

  return {
    messageToCancel,
    showCancelDialog,
    setShowCancelDialog,
    handleCancelMessage,
    confirmCancelMessage,
    handleSendNow
  };
};
