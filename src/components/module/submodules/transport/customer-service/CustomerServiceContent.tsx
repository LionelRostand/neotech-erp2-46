
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import ChatSupportTab from './tabs/ChatSupportTab';
import EmailSupportTab from './tabs/EmailSupportTab';
import PhoneSupportTab from './tabs/PhoneSupportTab';
import HistoryTab from './tabs/HistoryTab';

interface CustomerServiceContentProps {
  activeTab: string;
}

const CustomerServiceContent: React.FC<CustomerServiceContentProps> = ({ activeTab }) => {
  return (
    <>
      <TabsContent value="chat" forceMount={activeTab === "chat"}>
        <ChatSupportTab />
      </TabsContent>
      
      <TabsContent value="email" forceMount={activeTab === "email"}>
        <EmailSupportTab />
      </TabsContent>
      
      <TabsContent value="phone" forceMount={activeTab === "phone"}>
        <PhoneSupportTab />
      </TabsContent>
      
      <TabsContent value="history" forceMount={activeTab === "history"}>
        <HistoryTab />
      </TabsContent>
    </>
  );
};

export default CustomerServiceContent;
