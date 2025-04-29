
import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Bell, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Function to safely get the number of unread messages
const getUnreadMessagesCount = (data: any[] | undefined): number => {
  if (!data || !Array.isArray(data)) return 0;
  return data.filter(item => item?.read === false).length;
};

const TopBar: React.FC = () => {
  const [unreadMessages, setUnreadMessages] = useState<any[]>([]);
  
  useEffect(() => {
    // Check if the MESSAGES collection exists in COLLECTIONS
    if (!COLLECTIONS.MESSAGES?.INBOX) {
      console.warn('MESSAGES.INBOX path not found in COLLECTIONS');
      return;
    }
    
    const messagesCollection = collection(db, COLLECTIONS.MESSAGES.INBOX);
    const messagesQuery = query(messagesCollection, where('read', '==', false));
    
    // Set up a listener for unread messages
    const unsubscribe = onSnapshot(
      messagesQuery,
      (snapshot) => {
        const messages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUnreadMessages(messages);
      },
      (error) => {
        console.error('Error fetching unread messages:', error);
        // In case of error, just set empty array to avoid UI issues
        setUnreadMessages([]);
      }
    );
    
    // Clean up the listener when component unmounts
    return () => unsubscribe();
  }, []);
  
  const unreadCount = getUnreadMessagesCount(unreadMessages);

  return (
    <div className="flex items-center justify-end space-x-2 px-3 py-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="relative">
            <MessageSquare className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Messages</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {unreadCount === 0 ? (
            <DropdownMenuItem>Pas de nouveaux messages</DropdownMenuItem>
          ) : (
            <>
              <DropdownMenuItem>
                {unreadCount} message{unreadCount > 1 ? 's' : ''} non lu{unreadCount > 1 ? 's' : ''}
              </DropdownMenuItem>
              <DropdownMenuItem>Voir tous les messages</DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              3
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Nouveau message de Jean</DropdownMenuItem>
          <DropdownMenuItem>Facture en attente</DropdownMenuItem>
          <DropdownMenuItem>Maintenance prévue</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Voir toutes les notifications</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TopBar;
