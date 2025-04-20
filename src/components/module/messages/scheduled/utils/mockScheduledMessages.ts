
import { Message } from '../../types/message-types';
import { Timestamp } from 'firebase/firestore';

export const generateMockScheduledMessages = (contactIds: string[]): Message[] => {
  const today = new Date();
  
  return Array.from({ length: 8 }, (_, i) => {
    const scheduledDate = new Date();
    
    // Répartir les dates programmées sur les prochains jours
    scheduledDate.setDate(today.getDate() + i % 7 + 1);
    scheduledDate.setHours(9 + i % 8, (i * 15) % 60);
    
    return {
      id: `mock-scheduled-${i+1}`,
      subject: [
        'Proposition commerciale à envoyer',
        'Suivi de projet - Rapport hebdomadaire',
        'Invitation à la conférence annuelle',
        'Rappel: Échéance de paiement',
        'Lancement de produit - Annonce'
      ][i % 5],
      content: `<p>Bonjour,</p><p>Ce message est programmé pour être envoyé automatiquement. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p><p>Cordialement,<br />L'équipe NeoTech</p>`,
      sender: 'current-user-id',
      recipients: [contactIds[i % contactIds.length]],
      status: 'scheduled' as any,
      priority: ['normal', 'high'][i % 2] as any,
      category: ['general', 'commercial', 'administrative'][i % 3] as any,
      tags: i % 3 === 0 ? ['automatique', 'important'] : i % 2 === 0 ? ['suivi'] : [],
      hasAttachments: i % 3 === 0,
      isArchived: false, // Add the missing property
      isScheduled: true,
      scheduledAt: Timestamp.fromDate(scheduledDate),
      createdAt: Timestamp.fromDate(today),
      updatedAt: Timestamp.fromDate(today),
    };
  });
};
