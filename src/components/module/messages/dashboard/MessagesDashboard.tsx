
import React from 'react';
import { CalendarCheck, Clock, Inbox, Archive, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useFirebaseCollection } from '@/hooks/useFirebaseCollection';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Message } from '../types/message-types';
import { useNavigate } from 'react-router-dom';

export function MessagesDashboard() {
  const navigate = useNavigate();
  
  // Use non-nullish collection paths
  const inboxPath = COLLECTIONS.MESSAGES.INBOX;
  const sentPath = COLLECTIONS.MESSAGES.SENT;
  const archivedPath = COLLECTIONS.MESSAGES.ARCHIVED;
  const scheduledPath = COLLECTIONS.MESSAGES.SCHEDULED;
  
  const { data: inbox = [] } = useFirebaseCollection<Message>(inboxPath);
  const { data: sent = [] } = useFirebaseCollection<Message>(sentPath);
  const { data: archived = [] } = useFirebaseCollection<Message>(archivedPath);
  const { data: scheduled = [] } = useFirebaseCollection<Message>(scheduledPath);
  
  // Calculate message counts with null/undefined handling
  const inboxCount = inbox?.length || 0;
  const sentCount = sent?.length || 0;
  const archivedCount = archived?.length || 0;
  const scheduledCount = scheduled?.length || 0;

  // Navigation handlers
  const navigateToInbox = () => navigate('/modules/messages/inbox');
  const navigateToSent = () => navigate('/modules/messages/sent');
  const navigateToArchived = () => navigate('/modules/messages/archive');
  const navigateToScheduled = () => navigate('/modules/messages/scheduled');
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MessageCard
        icon={<Inbox className="h-6 w-6" />}
        title="Boîte de réception"
        count={inboxCount}
        onClick={navigateToInbox}
        color="bg-blue-500"
      />
      <MessageCard
        icon={<Send className="h-6 w-6" />}
        title="Messages envoyés"
        count={sentCount}
        onClick={navigateToSent}
        color="bg-green-500"
      />
      <MessageCard
        icon={<Archive className="h-6 w-6" />}
        title="Archives"
        count={archivedCount}
        onClick={navigateToArchived}
        color="bg-yellow-500"
      />
      <MessageCard
        icon={<CalendarCheck className="h-6 w-6" />}
        title="Programmés"
        count={scheduledCount}
        onClick={navigateToScheduled}
        color="bg-purple-500"
      />
    </div>
  );
}

interface MessageCardProps {
  icon: React.ReactNode;
  title: string;
  count: number;
  onClick: () => void;
  color: string;
}

function MessageCard({ icon, title, count, onClick, color }: MessageCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className={cn("text-white py-3", color)}>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="text-2xl font-bold mb-2">{count}</div>
        <Button
          variant="outline"
          className="w-full"
          onClick={onClick}
        >
          Afficher
        </Button>
      </CardContent>
    </Card>
  );
}
