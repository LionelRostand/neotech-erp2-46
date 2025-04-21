
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirebaseCollection } from '@/hooks/useFirebaseCollection';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Message, MessageMetrics } from '../types/message-types';
import MessageMetricsCards from './MessageMetricsCards';
import ActivityChart from './ActivityChart';
import TopContacts from './TopContacts';
import { FirebaseErrorAlert } from '@/components/ui/FirebaseErrorAlert';

const MessagesDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<MessageMetrics | null>(null);
  
  // Ensure we use fallback collection paths
  const inboxPath = COLLECTIONS.MESSAGES.MESSAGES || 'messages';
  const archivePath = COLLECTIONS.MESSAGES.MESSAGES ? `${COLLECTIONS.MESSAGES.MESSAGES}_archive` : 'messages_archive';
  const contactsPath = COLLECTIONS.MESSAGES.CONTACTS || 'contacts';
  const scheduledPath = COLLECTIONS.MESSAGES.SCHEDULED || 'scheduled_messages';
  
  const { data: inboxMessages, isLoading: isLoadingInbox, error: inboxError } = 
    useFirebaseCollection<Message>(inboxPath);
  
  const { data: archivedMessages, isLoading: isLoadingArchived, error: archivedError } = 
    useFirebaseCollection<Message>(archivePath);
  
  // Récupération des contacts depuis Firestore
  const { data: contacts, isLoading: isLoadingContacts, error: contactsError } = 
    useFirebaseCollection(contactsPath);
  
  const { data: scheduledMessages, isLoading: isLoadingScheduled, error: scheduledError } = 
    useFirebaseCollection<Message>(scheduledPath);
  
  const isLoading = isLoadingInbox || isLoadingArchived || isLoadingContacts || isLoadingScheduled;
  const error = inboxError || archivedError || contactsError || scheduledError;
  
  // Calcul des métriques
  useEffect(() => {
    if (isLoading) return;
    
    const totalMessages = inboxMessages.length + archivedMessages.length + scheduledMessages.length;
    const unreadMessages = inboxMessages.filter(msg => !msg.isRead).length;
    const archivedMessagesCount = archivedMessages.length;
    const scheduledMessagesCount = scheduledMessages.length;
    const sentMessagesCount = inboxMessages.filter(msg => msg.status === 'sent').length;
    const receivedMessagesCount = inboxMessages.filter(msg => msg.status === 'received').length;

    // Group messages by category
    const messagesByCategory: Record<string, number> = inboxMessages.reduce((acc: Record<string, number>, msg) => {
      const category = msg.category || 'other';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    // Group messages by priority
    const messagesByPriority: Record<string, number> = inboxMessages.reduce((acc: Record<string, number>, msg) => {
      acc[msg.priority] = (acc[msg.priority] || 0) + 1;
      return acc;
    }, {});

    // Calculate daily activity (example: count messages created each day)
    const dailyActivity = inboxMessages.reduce((acc: Array<{date: string; count: number}>, msg) => {
      const date = msg.createdAt?.toDate().toLocaleDateString() || 'N/A';
      const existingEntry = acc.find(entry => entry.date === date);

      if (existingEntry) {
        existingEntry.count += 1;
      } else {
        acc.push({ date, count: 1 });
      }

      return acc;
    }, []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Find top contacts (example: most frequent recipients)
    const topContacts = contacts
      .filter(contact => contact && typeof contact === 'object')
      .map(contact => ({
        id: contact.id || '',
        name: contact.firstName && contact.lastName ? 
              `${contact.firstName} ${contact.lastName}` : 
              'Unknown Contact',
        count: inboxMessages.filter(msg => 
          msg.recipients && Array.isArray(msg.recipients) && 
          msg.recipients.includes(contact.id || '')
        ).length
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    const messagesSentToday = inboxMessages.filter(msg => {
      const today = new Date();
      const createdAt = msg.createdAt?.toDate();
      return createdAt && createdAt.toDateString() === today.toDateString();
    }).length;
    
    const contactsCount = contacts.length;

    setMetrics({
      totalMessages,
      unreadMessages,
      archivedMessages: archivedMessagesCount,
      scheduledMessages: scheduledMessagesCount,
      sentMessagesCount,
      receivedMessagesCount,
      messagesByCategory,
      messagesByPriority,
      dailyActivity,
      topContacts,
      messagesSentToday,
      contactsCount
    });
  }, [inboxMessages, archivedMessages, scheduledMessages, contacts, isLoading]);
  
  if (error) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Tableau de bord des messages</CardTitle>
          </CardHeader>
          <CardContent>
            <FirebaseErrorAlert error={error} />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Tableau de bord</h2>
      
      {isLoading ? (
        <div className="space-y-4">
          <div>Chargement des métriques...</div>
          <div>Chargement des messages en cours...</div>
          <div>Chargement des contacts en cours...</div>
          <div>Chargement des messages planifiés...</div>
        </div>
      ) : (
        <>
          {metrics && <MessageMetricsCards metrics={metrics} />}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Activité des messages</CardTitle>
              </CardHeader>
              <CardContent>
                {metrics?.dailyActivity && <ActivityChart data={metrics.dailyActivity} />}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Contacts fréquents</CardTitle>
              </CardHeader>
              <CardContent>
                {metrics?.topContacts && <TopContacts contacts={metrics.topContacts} />}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default MessagesDashboard;
