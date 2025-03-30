
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import ChatTab from './tabs/ChatTab';
import MessagesTab from './tabs/MessagesTab';
import CallsTab from './tabs/CallsTab';
import EmailsTab from './tabs/EmailsTab';
import CustomersTab from './tabs/CustomersTab';
import SettingsTab from './tabs/SettingsTab';

interface CustomerServiceContentProps {
  activeTab: string;
}

const CustomerServiceContent: React.FC<CustomerServiceContentProps> = ({ activeTab }) => {
  return (
    <>
      <TabsContent value="chat">
        <ChatTab />
      </TabsContent>
      <TabsContent value="messages">
        <MessagesTab />
      </TabsContent>
      <TabsContent value="calls">
        <CallsTab />
      </TabsContent>
      <TabsContent value="emails">
        <EmailsTab />
      </TabsContent>
      <TabsContent value="customers">
        <CustomersTab />
      </TabsContent>
      <TabsContent value="settings">
        <SettingsTab />
      </TabsContent>
    </>
  );
};

export default CustomerServiceContent;
