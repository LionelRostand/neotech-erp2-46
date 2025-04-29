
import React from 'react';
import { Search, Bell, Mail, User, Key, Languages, Shield, LogOut } from 'lucide-react';
import { useAlertsData } from '@/hooks/useAlertsData';
import { useFirebaseCollection } from '@/hooks/useFirebaseCollection';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Button } from "@/components/ui/button";
import { Message } from '@/components/module/messages/types/message-types';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu";
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

const TopBar = () => {
  const { alerts } = useAlertsData();
  const { userData } = useAuth();
  const activeAlerts = alerts?.filter(alert => alert.status === 'Active').length || 0;
  
  const navigate = useNavigate();

  // Add this to fetch unread messages count
  const { data: messages } = useFirebaseCollection<Message>(COLLECTIONS.MESSAGES.INBOX);
  const unreadMessagesCount = messages?.filter(message => !message.isRead)?.length || 0;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Déconnexion réussie');
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      toast.error('Erreur lors de la déconnexion');
    }
  };

  // Get user's initials for the avatar fallback
  const getInitials = () => {
    if (userData?.firstName && userData?.lastName) {
      return `${userData.firstName[0]}${userData.lastName[0]}`.toUpperCase();
    }
    return userData?.email?.[0]?.toUpperCase() || 'U';
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Search section */}
        <div className="flex items-center w-72">
          <div className="relative w-full">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-200 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Alerts button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={() => navigate('/modules/employees/alerts')}
          >
            <Bell size={20} />
            {activeAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center animate-pulse">
                {activeAlerts}
              </span>
            )}
          </Button>
          
          {/* Messages button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={() => navigate('/modules/messages/inbox')}
          >
            <Mail size={20} />
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                {unreadMessagesCount}
              </span>
            )}
          </Button>

          {/* User dropdown section */}
          <div className="flex items-center pl-4 border-l border-gray-200">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userData?.profileImageUrl} alt={userData?.firstName} />
                    <AvatarFallback className="bg-neotech-primary text-white">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {userData?.firstName} {userData?.lastName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userData?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* Profile Settings */}
                <DropdownMenuGroup>
                  <DropdownMenuItem 
                    className="cursor-pointer flex items-center gap-2"
                    onClick={() => navigate('/profile')}
                  >
                    <User className="h-4 w-4" />
                    <span>Profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer flex items-center gap-2"
                    onClick={() => navigate('/profile?tab=password')}
                  >
                    <Key className="h-4 w-4" />
                    <span>Mot de passe</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer flex items-center gap-2"
                    onClick={() => navigate('/profile?tab=language')}
                  >
                    <Languages className="h-4 w-4" />
                    <span>Langue</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer flex items-center gap-2"
                    onClick={() => navigate('/profile?tab=2fa')}
                  >
                    <Shield className="h-4 w-4" />
                    <span>Authentification</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer text-destructive flex items-center gap-2"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="ml-2 font-medium text-sm">
              {userData?.firstName || 'Admin'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
