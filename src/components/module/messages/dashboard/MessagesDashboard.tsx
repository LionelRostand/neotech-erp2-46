
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFirebaseCollection } from '@/hooks/useFirebaseCollection';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Mail, Send, Archive, Clock, Users } from "lucide-react";
import { DataCard } from '../components/DataCard';
import { RecentMessages } from './RecentMessages';
import { RecentContacts } from './RecentContacts';
import { Link } from 'react-router-dom';
import { LoadingSpinner } from '../components/LoadingSpinner';

const MessagesDashboard: React.FC = () => {
  // Paths with fallbacks - ensure they're never empty
  const inboxPath = COLLECTIONS.MESSAGES?.INBOX || 'message_inbox';
  const sentPath = COLLECTIONS.MESSAGES?.SENT || 'message_sent';
  const archivedPath = COLLECTIONS.MESSAGES?.ARCHIVED || 'message_archived';
  const scheduledPath = COLLECTIONS.MESSAGES?.SCHEDULED || 'message_scheduled';
  const contactsPath = COLLECTIONS.MESSAGES?.CONTACTS || 'message_contacts';
  
  // Validate paths before using them
  console.log('Collection paths:', { inboxPath, sentPath, archivedPath, scheduledPath, contactsPath });
  
  const { data: inbox = [], isLoading: inboxLoading } = useFirebaseCollection(inboxPath);
  const { data: sent = [], isLoading: sentLoading } = useFirebaseCollection(sentPath);
  const { data: archived = [], isLoading: archivedLoading } = useFirebaseCollection(archivedPath);
  const { data: scheduled = [], isLoading: scheduledLoading } = useFirebaseCollection(scheduledPath);
  const { data: contacts = [], isLoading: contactsLoading } = useFirebaseCollection(contactsPath);
  
  const isLoading = inboxLoading || sentLoading || archivedLoading || scheduledLoading || contactsLoading;
  
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Aperçu</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <DataCard
                title="Boîte de réception"
                value={inbox.length.toString()}
                icon={<Mail className="h-4 w-4" />}
                link="/modules/messages/inbox"
              />
              <DataCard
                title="Messages envoyés"
                value={sent.length.toString()}
                icon={<Send className="h-4 w-4" />}
                link="/modules/messages/sent"
              />
              <DataCard
                title="Messages archivés"
                value={archived.length.toString()}
                icon={<Archive className="h-4 w-4" />}
                link="/modules/messages/archive"
              />
              <DataCard
                title="Messages planifiés"
                value={scheduled.length.toString()}
                icon={<Clock className="h-4 w-4" />}
                link="/modules/messages/scheduled"
              />
              <DataCard
                title="Contacts"
                value={contacts.length.toString()}
                icon={<Users className="h-4 w-4" />}
                link="/modules/messages/contacts"
              />
            </>
          )}
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle>Messages récents</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentMessages />
          <Link to="/modules/messages/inbox" className="block mt-4 text-blue-500 hover:underline">
            Voir tous les messages
          </Link>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle>Contacts récents</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentContacts />
          <Link to="/modules/messages/contacts" className="block mt-4 text-blue-500 hover:underline">
            Voir tous les contacts
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessagesDashboard;
