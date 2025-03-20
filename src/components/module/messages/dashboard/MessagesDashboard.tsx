import React, { useEffect, useState } from 'react';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { MessageMetrics } from '../types/message-types';
import MessageMetricsCards from './MessageMetricsCards';
import ActivityChart from './ActivityChart';
import TopContacts from './TopContacts';
import { Card } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from "sonner";

const MessagesDashboard: React.FC = () => {
  const { getAll, error: firestoreError } = useFirestore(COLLECTIONS.MESSAGES.METRICS);
  const [metrics, setMetrics] = useState<MessageMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataFetched, setDataFetched] = useState(false);

  // Function to generate demo metrics
  const generateDemoMetrics = (): MessageMetrics => {
    console.log("Generating demo metrics");
    return {
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
      updateTimestamp: { toDate: () => new Date() } as any
    };
  };

  useEffect(() => {
    // Éviter la récupération répétée des données
    if (dataFetched) return;
    
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Tentative de récupération des métriques...");

        // Try to get real data first
        const metricsData = await getAll();
        console.log("Données métriques reçues:", metricsData);

        if (metricsData && metricsData.length > 0) {
          // Process real data if available
          const dataWithTimestamp = metricsData.filter((item: any) => 
            item && typeof item === 'object' && 'updateTimestamp' in item && item.updateTimestamp
          );
          
          console.log("Données avec timestamp:", dataWithTimestamp.length);
          
          if (dataWithTimestamp.length > 0) {
            const latestMetrics = dataWithTimestamp.sort((a: any, b: any) => {
              if (a.updateTimestamp && b.updateTimestamp) {
                return b.updateTimestamp.toDate().getTime() - a.updateTimestamp.toDate().getTime();
              }
              return 0;
            })[0] as MessageMetrics;
            
            console.log("Dernières métriques trouvées:", latestMetrics.id);
            setMetrics(latestMetrics);
          } else {
            // Use demo data if no valid timestamps
            console.log("Aucune donnée avec timestamp valide, utilisation des données de démo");
            setMetrics(generateDemoMetrics());
          }
        } else {
          // Use demo data if no data at all
          console.log("Aucune donnée trouvée, utilisation des données de démo");
          setMetrics(generateDemoMetrics());
        }
        
        setDataFetched(true);
      } catch (err: any) {
        console.error("Erreur lors de la récupération des métriques:", err);
        setError(err.message || "Une erreur s'est produite lors de la récupération des données");
        toast.error("Erreur lors du chargement des métriques. Affichage des données de démonstration.");
        
        // Use demo data in case of error
        setMetrics(generateDemoMetrics());
        setDataFetched(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [getAll, dataFetched]);

  // Always show a loading state while fetching
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show error state but still use demo metrics
  if (error && !metrics) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Erreur de chargement</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <p className="text-sm text-red-600 mt-2">Affichage des données de démonstration...</p>
          </div>
        </div>
        
        {/* Render demo data even in error state */}
        <MessageMetricsCards metrics={generateDemoMetrics()} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-4">
            <h3 className="text-lg font-medium mb-4">Activité des messages (Démo)</h3>
            <ActivityChart data={generateDemoMetrics().dailyActivity} />
          </Card>
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Contacts les plus actifs (Démo)</h3>
            <TopContacts contacts={generateDemoMetrics().topContacts} />
          </Card>
        </div>
      </div>
    );
  }

  // Ensure we always have something to display
  const displayMetrics = metrics || generateDemoMetrics();

  return (
    <div className="space-y-6">
      <MessageMetricsCards metrics={displayMetrics} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-4">
          <h3 className="text-lg font-medium mb-4">Activité des messages</h3>
          {displayMetrics.dailyActivity && displayMetrics.dailyActivity.length > 0 ? (
            <ActivityChart data={displayMetrics.dailyActivity} />
          ) : (
            <div className="h-72 flex items-center justify-center text-gray-400">
              Aucune donnée d'activité disponible
            </div>
          )}
        </Card>
        
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Contacts les plus actifs</h3>
          {displayMetrics.topContacts && displayMetrics.topContacts.length > 0 ? (
            <TopContacts contacts={displayMetrics.topContacts} />
          ) : (
            <div className="h-72 flex items-center justify-center text-gray-400">
              Aucun contact actif
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MessagesDashboard;
