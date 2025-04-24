
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, RefreshCcw, Send } from 'lucide-react';
import { useFirebaseCollection } from '@/hooks/useFirebaseCollection';
import { COLLECTIONS } from '@/lib/firebase-collections';
import MessagesList from './MessagesList';
import { Message } from '../types/message-types';
import { FirebaseErrorAlert } from '@/components/ui/FirebaseErrorAlert';
import { Link } from 'react-router-dom';

const InboxPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  // Ensure we use a valid collection path
  const inboxPath = COLLECTIONS.MESSAGES.INBOX || 'messages_inbox';
  
  const { data: messages, isLoading, error, refetch } = useFirebaseCollection<Message>(inboxPath);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search implementation
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Boîte de réception</h2>
        <Button asChild>
          <Link to="/modules/messages/compose">
            <Send className="mr-2 h-4 w-4" />
            Nouveau message
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Messages</CardTitle>
            
            <div className="flex items-center gap-2">
              <form onSubmit={handleSearch} className="flex items-center">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Rechercher..."
                    className="pl-8 w-[250px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </form>
              
              <Button variant="outline" size="icon" onClick={() => refetch()}>
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <FirebaseErrorAlert error={error} onRetry={refetch} />
          ) : (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all">Tous</TabsTrigger>
                <TabsTrigger value="unread">Non lus</TabsTrigger>
                <TabsTrigger value="read">Lus</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <MessagesList messages={messages} isLoading={isLoading} filter="all" searchTerm={searchTerm} />
              </TabsContent>
              
              <TabsContent value="unread">
                <MessagesList messages={messages} isLoading={isLoading} filter="unread" searchTerm={searchTerm} />
              </TabsContent>
              
              <TabsContent value="read">
                <MessagesList messages={messages} isLoading={isLoading} filter="read" searchTerm={searchTerm} />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InboxPage;
