
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, MessageSquare, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { COLLECTIONS } from '@/lib/firebase-collections';

const TopBar = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  // Safe access to COLLECTIONS.MESSAGES with fallback
  const messagesCollection = COLLECTIONS.MESSAGES || {};
  const inboxPath = messagesCollection.INBOX ? `/modules/messages/inbox` : '#';

  const handleProfileClick = () => {
    navigate('/settings/profile');
  };

  const handleMessagesClick = () => {
    navigate(inboxPath);
  };

  const handleNotificationsClick = () => {
    // For future implementation
    console.log('Notifications clicked');
  };

  return (
    <div className="border-b px-6 py-3 flex items-center justify-between bg-white">
      <div className="relative w-80">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          className="w-full pl-9 pr-4 py-2 rounded-full bg-gray-50 border-gray-200 focus:bg-white"
          placeholder="Rechercher..."
        />
      </div>

      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleMessagesClick}
          className="rounded-full hover:bg-gray-100"
        >
          <MessageSquare className="h-5 w-5 text-gray-500" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNotificationsClick}
          className="rounded-full hover:bg-gray-100"
        >
          <Bell className="h-5 w-5 text-gray-500" />
        </Button>
        <div 
          className="flex items-center cursor-pointer"
          onClick={handleProfileClick}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={auth?.currentUser?.photoURL || ''} />
            <AvatarFallback className="bg-primary/80 text-white">
              {auth?.currentUser?.displayName?.charAt(0) || auth?.currentUser?.email?.charAt(0) || <User size={16} />}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
