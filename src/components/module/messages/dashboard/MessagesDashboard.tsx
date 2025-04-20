
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFirebaseCollection } from '@/hooks/useFirebaseCollection';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Message, MessageMetrics } from '../types/message-types';
import { FirebaseErrorAlert } from '@/components/ui/FirebaseErrorAlert';
import MessageMetricsCards from './MessageMetricsCards';
import ActivityChart from './ActivityChart';
import TopContacts from './TopContacts';

const MessagesDashboard: React.FC = () => {
  const { data: inboxMessages, isLoading: loadingInbox, error: inboxError } = 
    useFirebaseCollection<Message>(COLLECTIONS.MESSAGES.INBOX);
  
  const { data: sentMessages, isLoading: loadingSent, error: sentError } = 
    useFirebaseCollection<Message>(COLLECTIONS.MESSAGES.SENT);
  
  const { data: scheduledMessages, isLoading: loadingScheduled, error: scheduledError } = 
    useFirebaseCollection<Message>(COLLECTIONS.MESSAGES.SCHEDULED);
  
  const { data: archivedMessages, isLoading: loadingArchived, error: archivedError } = 
    useFirebaseCollection<Message>(COLLECTIONS.MESSAGES.ARCHIVED);
  
  const { data: contactsData, isLoading: loadingContacts, error: contactsError } = 
    useFirebaseCollection(COLLECTIONS.CONTACTS.CONTACTS);
  
  const { data: metricsData, isLoading: loadingMetrics, error: metricsError } = 
    useFirebaseCollection<MessageMetrics>(COLLECTIONS.MESSAGES.METRICS);

  // Handle loading state
  const isLoading = loadingInbox || loadingSent || loadingScheduled || loadingArchived || loadingMetrics || loadingContacts;
  
  // Handle error state
  const error = inboxError || sentError || scheduledError || archivedError || metricsError || contactsError;
  
  // Calculate metrics
  const metrics: MessageMetrics = metricsData?.[0] || {
    totalMessages: (inboxMessages?.length || 0) + (sentMessages?.length || 0) + (archivedMessages?.length || 0),
    unreadMessages: inboxMessages?.filter(msg => !msg.isRead)?.length || 0,
    archivedMessages: archivedMessages?.length || 0,
    scheduledMessages: scheduledMessages?.length || 0,
    sentMessagesCount: sentMessages?.length || 0,
    receivedMessagesCount: inboxMessages?.length || 0,
    messagesByCategory: {},
    messagesByPriority: {},
    dailyActivity: [],
    topContacts: [],
    messagesSentToday: sentMessages?.filter(msg => {
      const today = new Date();
      const msgDate = msg.createdAt.toDate ? msg.createdAt.toDate() : new Date(msg.createdAt);
      return msgDate.toDateString() === today.toDateString();
    })?.length || 0,
    contactsCount: contactsData?.length || 0
  };
  
  // Si nous n'avons pas de données de métriques, créer des exemples de données pour le graphique d'activité
  const activityData = metricsData?.[0]?.dailyActivity?.length > 0 
    ? metricsData[0].dailyActivity 
    : generateMockActivityData();
  
  // Si nous n'avons pas de données de métriques, créer des exemples de données pour les contacts principaux
  const contactsData2 = metricsData?.[0]?.topContacts?.length > 0 
    ? metricsData[0].topContacts 
    : generateMockContactsData();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tableau de bord des messages</h1>
      
      {error ? (
        <FirebaseErrorAlert error={error} />
      ) : (
        <>
          <MessageMetricsCards metrics={metrics} isLoading={isLoading} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Activité quotidienne</CardTitle>
                <CardDescription>Nombre de messages envoyés et reçus par jour</CardDescription>
              </CardHeader>
              <CardContent>
                <ActivityChart data={activityData} isLoading={isLoading} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Contacts principaux</CardTitle>
                <CardDescription>Les contacts avec qui vous interagissez le plus</CardDescription>
              </CardHeader>
              <CardContent>
                <TopContacts contacts={contactsData2} isLoading={isLoading} />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

// Fonction utilitaire pour générer des données d'activité fictives
function generateMockActivityData() {
  const data = [];
  const today = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      count: Math.floor(Math.random() * 10)
    });
  }
  
  return data;
}

// Fonction utilitaire pour générer des données de contacts fictives
function generateMockContactsData() {
  return [
    { id: '1', name: 'Jean Dupont', count: 15 },
    { id: '2', name: 'Marie Martin', count: 12 },
    { id: '3', name: 'Pierre Durand', count: 10 },
    { id: '4', name: 'Sophie Bernard', count: 8 },
    { id: '5', name: 'Thomas Richard', count: 6 }
  ];
}

export default MessagesDashboard;
