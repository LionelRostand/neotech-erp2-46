
import { useState } from 'react';
import { Message } from '../../types/message-types';
import { toast } from 'sonner';

export const useScheduledMessageOperations = () => {
  const [messageToCancel, setMessageToCancel] = useState<Message | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  
  // Gérer l'affichage de la boîte de dialogue d'annulation
  const handleCancelMessage = (message: Message) => {
    setMessageToCancel(message);
    setShowCancelDialog(true);
  };
  
  // Confirmer l'annulation d'un message programmé
  const confirmCancelMessage = async () => {
    if (!messageToCancel) return;
    
    try {
      // Simuler un appel API pour annuler le message
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('Message annulé avec succès');
      setShowCancelDialog(false);
      setMessageToCancel(null);
    } catch (error) {
      console.error('Erreur lors de l\'annulation du message:', error);
      toast.error('Erreur lors de l\'annulation du message');
    }
  };
  
  // Envoyer immédiatement un message programmé
  const handleSendNow = async (message: Message) => {
    try {
      // Simuler un appel API pour envoyer le message immédiatement
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast.success('Message envoyé avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      toast.error('Erreur lors de l\'envoi du message');
    }
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
