
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, MessagesSquare, Phone, Mail, Users, Settings } from "lucide-react";

interface CustomerServiceTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const CustomerServiceTabs: React.FC<CustomerServiceTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="mb-6">
      <TabsList className="grid grid-cols-3 sm:grid-cols-6 max-w-3xl">
        <TabsTrigger
          value="chat"
          onClick={() => onTabChange('chat')}
          data-state={activeTab === 'chat' ? 'active' : ''}
          className="flex flex-col items-center gap-1 py-3 px-4"
        >
          <MessageSquare className="h-4 w-4" />
          <span className="text-xs">Chat</span>
        </TabsTrigger>
        <TabsTrigger
          value="messages"
          onClick={() => onTabChange('messages')}
          data-state={activeTab === 'messages' ? 'active' : ''}
          className="flex flex-col items-center gap-1 py-3 px-4"
        >
          <MessagesSquare className="h-4 w-4" />
          <span className="text-xs">Messages</span>
        </TabsTrigger>
        <TabsTrigger
          value="calls"
          onClick={() => onTabChange('calls')}
          data-state={activeTab === 'calls' ? 'active' : ''}
          className="flex flex-col items-center gap-1 py-3 px-4"
        >
          <Phone className="h-4 w-4" />
          <span className="text-xs">Appels</span>
        </TabsTrigger>
        <TabsTrigger
          value="emails"
          onClick={() => onTabChange('emails')}
          data-state={activeTab === 'emails' ? 'active' : ''}
          className="flex flex-col items-center gap-1 py-3 px-4"
        >
          <Mail className="h-4 w-4" />
          <span className="text-xs">Emails</span>
        </TabsTrigger>
        <TabsTrigger
          value="customers"
          onClick={() => onTabChange('customers')}
          data-state={activeTab === 'customers' ? 'active' : ''}
          className="flex flex-col items-center gap-1 py-3 px-4"
        >
          <Users className="h-4 w-4" />
          <span className="text-xs">Clients</span>
        </TabsTrigger>
        <TabsTrigger
          value="settings"
          onClick={() => onTabChange('settings')}
          data-state={activeTab === 'settings' ? 'active' : ''}
          className="flex flex-col items-center gap-1 py-3 px-4"
        >
          <Settings className="h-4 w-4" />
          <span className="text-xs">Paramètres</span>
        </TabsTrigger>
      </TabsList>
    </div>
  );
};

export default CustomerServiceTabs;
