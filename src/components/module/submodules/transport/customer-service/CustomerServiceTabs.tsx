
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Mail, Phone, Clock } from "lucide-react";
import ChatSupportTab from './tabs/ChatSupportTab';
import EmailSupportTab from './tabs/EmailSupportTab';
import PhoneSupportTab from './tabs/PhoneSupportTab';
import HistoryTab from './tabs/HistoryTab';

interface CustomerServiceTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const CustomerServiceTabs: React.FC<CustomerServiceTabsProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid grid-cols-4 mb-6">
        <TabsTrigger value="chat" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          <span>Chat</span>
        </TabsTrigger>
        <TabsTrigger value="email" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          <span>Email</span>
        </TabsTrigger>
        <TabsTrigger value="phone" className="flex items-center gap-2">
          <Phone className="h-4 w-4" />
          <span>Téléphone</span>
        </TabsTrigger>
        <TabsTrigger value="history" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>Historique</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="chat">
        <ChatSupportTab />
      </TabsContent>
      
      <TabsContent value="email">
        <EmailSupportTab />
      </TabsContent>
      
      <TabsContent value="phone">
        <PhoneSupportTab />
      </TabsContent>
      
      <TabsContent value="history">
        <HistoryTab />
      </TabsContent>
    </Tabs>
  );
};

export default CustomerServiceTabs;
