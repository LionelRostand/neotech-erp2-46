import React, { useEffect, useState } from 'react';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { MessageMetrics } from '../types/message-types';
import MessageMetricsCards from './MessageMetricsCards';
import ActivityChart from './ActivityChart';
import TopContacts from './TopContacts';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const MessagesDashboard: React.FC = () => {
  const { getAll } = useFirestore(COLLECTIONS.MESSAGES.METRICS);
  const [metrics, setMetrics] = useState<MessageMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const metricsData = await getAll();
        // Prendre les métriques les plus récentes
        if (metricsData && metricsData.length > 0) {
          // Ensure the data has updateTimestamp property before sorting
          const dataWithTimestamp = metricsData.filter(item => 
            item && typeof item === 'object' && 'updateTimestamp' in item && item.updateTimestamp
          );
          
          if (dataWithTimestamp.length > 0) {
            const latestMetrics = dataWithTimestamp.sort((a, b) => {
              if (a.updateTimestamp && b.updateTimestamp) {
                return b.updateTimestamp.toDate().getTime() - a.updateTimestamp.toDate().getTime();
              }
              return 0;
            })[0] as MessageMetrics;
            
            setMetrics(latestMetrics);
          } else {
            // Fallback to demo data if no valid timestamps
            setDemoMetrics();
          }
        } else {
          // Si pas de données, créer des métriques fictives pour la démo
          setDemoMetrics();
        }
      } catch (err: any) {
        console.error("Erreur lors de la récupération des métriques:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const setDemoMetrics = () => {
      setMetrics({
        id: 'demo',
        totalMessages: 247,
        unreadMessages: 15,
        archivedMessages: 56,
        scheduledMessages: 8,
        messagesSentToday: 12,
        messagesReceivedToday: 23,
        contactsCount: 143,
        topContacts: [
          { contactId: '1', contactName: 'Jean Dupont', messagesCount: 47 },
          { contactId: '2', contactName: 'Marie Martin', messagesCount: 36 },
          { contactId: '3', contactName: 'Pierre Durand', messagesCount: 28 },
          { contactId: '4', contactName: 'Sophie Bernard', messagesCount: 21 },
          { contactId: '5', contactName: 'Philippe Petit', messagesCount: 15 }
        ],
        dailyActivity: Array.from({ length: 14 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (13 - i));
          return {
            date: date.toISOString().split('T')[0],
            sent: Math.floor(Math.random() * 20) + 5,
            received: Math.floor(Math.random() * 30) + 10
          };
        }),
        updateTimestamp: new Date() as any
      });
    };

    fetchMetrics();
    
    // On pourrait ajouter ici une écoute WebSocket pour les mises à jour en temps réel
    // Simulons cela avec un intervalle
    const interval = setInterval(() => {
      fetchMetrics();
    }, 60000); // Mise à jour toutes les minutes

    return () => clearInterval(interval);
  }, [getAll]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 rounded-md bg-red-50">
        Erreur: {error}
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-gray-500 p-4">
        Aucune donnée de messages disponible.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MessageMetricsCards metrics={metrics} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-4">
          <h3 className="text-lg font-medium mb-4">Activité des messages</h3>
          <ActivityChart data={metrics.dailyActivity} />
        </Card>
        
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Contacts les plus actifs</h3>
          <TopContacts contacts={metrics.topContacts} />
        </Card>
      </div>
    </div>
  );
};

export default MessagesDashboard;
