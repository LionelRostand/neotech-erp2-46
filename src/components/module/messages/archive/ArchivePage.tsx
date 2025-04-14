
import React from 'react';
import { useCollectionData } from '@/hooks/useCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { where } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ArchivePage = () => {
  const { contactId } = useParams();
  
  const { data: messages, isLoading } = useCollectionData(
    COLLECTIONS.MESSAGES.ARCHIVE,
    [where('contactId', '==', contactId || '')]
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Archive</CardTitle>
        </CardHeader>
        <CardContent>
          {messages.length > 0 ? (
            <ul>
              {messages.map((message: any) => (
                <li key={message.id}>{message.text}</li>
              ))}
            </ul>
          ) : (
            <div>No archived messages</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ArchivePage;
