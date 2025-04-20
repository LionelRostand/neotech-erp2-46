
import React, { useState } from 'react';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import MessageMetricsCards from './MessageMetricsCards';
import ActivityChart from './ActivityChart';
import TopContacts from './TopContacts';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';

const MessagesDashboard = () => {
  const { data: metricsData, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ['messages', 'metrics'],
    queryFn: async () => {
      const metrics = await fetchCollectionData(COLLECTIONS.MESSAGES.METRICS);
      if (metrics && metrics.length > 0) {
        return metrics[0];
      }
      // Fallback metrics if none exist
      return {
        totalMessages: 0,
        unreadMessages: 0,
        archivedMessages: 0,
        scheduledMessages: 0,
        messagesSentToday: 0,
        messagesReceivedToday: 0,
        contactsCount: 0,
        topContacts: [],
        dailyActivity: []
      };
    }
  });

  const { data: contacts = [], isLoading: isLoadingContacts } = useQuery({
    queryKey: ['messages', 'contacts'],
    queryFn: () => fetchCollectionData(COLLECTIONS.MESSAGES.CONTACTS)
  });

  if (isLoadingMetrics || isLoadingContacts) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MessageMetricsCards metrics={metricsData} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-4">
          <h3 className="text-lg font-medium mb-4">Activité des messages</h3>
          {metricsData?.dailyActivity && metricsData.dailyActivity.length > 0 ? (
            <ActivityChart data={metricsData.dailyActivity} />
          ) : (
            <div className="h-72 flex items-center justify-center text-gray-400">
              Aucune donnée d'activité disponible
            </div>
          )}
        </Card>
        
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Contacts les plus actifs</h3>
          {metricsData?.topContacts && metricsData.topContacts.length > 0 ? (
            <TopContacts contacts={metricsData.topContacts} />
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
