
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFirebaseCollection } from '@/hooks/useFirebaseCollection';
import { COLLECTIONS } from '@/lib/firebase-collections';
import ArchivedMessagesList from './ArchivedMessagesList';
import { Message } from '../types/message-types';
import { FirebaseErrorAlert } from '@/components/ui/FirebaseErrorAlert';

const ArchivePage: React.FC = () => {
  const { data: messages, isLoading, error, refetch } = useFirebaseCollection<Message>(COLLECTIONS.MESSAGES.ARCHIVED);

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
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">Tous</TabsTrigger>
                <TabsTrigger value="sent">Envoyés</TabsTrigger>
                <TabsTrigger value="received">Reçus</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <ArchivedMessagesList messages={messages} isLoading={isLoading} filter="all" />
              </TabsContent>
              
              <TabsContent value="sent">
                <ArchivedMessagesList messages={messages} isLoading={isLoading} filter="sent" />
              </TabsContent>
              
              <TabsContent value="received">
                <ArchivedMessagesList messages={messages} isLoading={isLoading} filter="received" />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ArchivePage;
