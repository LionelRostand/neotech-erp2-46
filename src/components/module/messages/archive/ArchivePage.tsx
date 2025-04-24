
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFirebaseCollection } from '@/hooks/useFirebaseCollection';
import { COLLECTIONS } from '@/lib/firebase-collections';
import ArchivedMessagesList from './ArchivedMessagesList';
import { Message } from '../types/message-types';
import { FirebaseErrorAlert } from '@/components/ui/FirebaseErrorAlert';

const ArchivePage: React.FC = () => {
  // Ensure we use a valid collection path - ARCHIVED not ARCHIVE
  const archivePath = COLLECTIONS.MESSAGES?.ARCHIVED || 'messages_archived';
  
  const { data: messages, isLoading, error, refetch } = useFirebaseCollection<Message>(archivePath);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Fonction pour restaurer un message archivé
  const handleRestoreMessage = (message: Message) => {
    // Cette fonction serait implémentée pour restaurer un message archivé
    console.log('Restaurer le message:', message);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Messages archivés</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <FirebaseErrorAlert error={error} onRetry={refetch} />
          ) : (
            <Tabs defaultValue="all" onValueChange={setSelectedFilter}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">Tous</TabsTrigger>
                <TabsTrigger value="sent">Envoyés</TabsTrigger>
                <TabsTrigger value="received">Reçus</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <ArchivedMessagesList 
                  messages={messages || []} 
                  isLoading={isLoading} 
                  onRestoreMessage={handleRestoreMessage}
                />
              </TabsContent>
              
              <TabsContent value="sent">
                <ArchivedMessagesList 
                  messages={(messages || []).filter(m => m.type === 'sent')} 
                  isLoading={isLoading} 
                  onRestoreMessage={handleRestoreMessage}
                />
              </TabsContent>
              
              <TabsContent value="received">
                <ArchivedMessagesList 
                  messages={(messages || []).filter(m => m.type === 'received')} 
                  isLoading={isLoading} 
                  onRestoreMessage={handleRestoreMessage}
                />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ArchivePage;
