
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import ChatTab from './tabs/ChatTab';
import PhoneSupportTab from './tabs/PhoneSupportTab';
import EmailSupportTab from './tabs/EmailSupportTab';
import ChatSupportTab from './tabs/ChatSupportTab';
import MessagesTab from './tabs/MessagesTab';
import EmailsTab from './tabs/EmailsTab';
import CallsTab from './tabs/CallsTab';
import HistoryTab from './tabs/HistoryTab';
import CustomersTab from './tabs/CustomersTab';
import SettingsTab from './tabs/SettingsTab';

// Import ChevronsUpDown component explicitly so it's available in the context
import { ChevronsUpDown } from "@/components/icons/ChevronIcons";

interface CustomerServiceContentProps {
  activeTab: string;
}

const CustomerServiceContent: React.FC<CustomerServiceContentProps> = ({ activeTab }) => {
  // Make ChevronsUpDown available to TransportPayments.tsx component
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      window.ChevronsUpDown = ChevronsUpDown;
    }
  }, []);
  
  return (
    <div className="space-y-6 mt-6">
      <TabsContent value="chat" className="space-y-4">
        <ChatTab />
      </TabsContent>
      
      <TabsContent value="phone" className="space-y-4">
        <PhoneSupportTab />
      </TabsContent>
      
      <TabsContent value="email" className="space-y-4">
        <EmailSupportTab />
      </TabsContent>
      
      <TabsContent value="live-chat" className="space-y-4">
        <ChatSupportTab />
      </TabsContent>
      
      <TabsContent value="messages" className="space-y-4">
        <MessagesTab />
      </TabsContent>
      
      <TabsContent value="emails" className="space-y-4">
        <EmailsTab />
      </TabsContent>
      
      <TabsContent value="calls" className="space-y-4">
        <CallsTab />
      </TabsContent>
      
      <TabsContent value="history" className="space-y-4">
        <HistoryTab />
      </TabsContent>
      
      <TabsContent value="customers" className="space-y-4">
        <CustomersTab />
      </TabsContent>
      
      <TabsContent value="settings" className="space-y-4">
        <SettingsTab />
      </TabsContent>
    </div>
  );
};

export default CustomerServiceContent;
