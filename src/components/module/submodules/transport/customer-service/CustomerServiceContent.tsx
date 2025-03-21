
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
    <div className="pt-4">
      <TabsContent value="chat" className={activeTab === "chat" ? "block" : "hidden"}>
        <ChatSupportTab />
      </TabsContent>
      
      <TabsContent value="email" className={activeTab === "email" ? "block" : "hidden"}>
        <EmailSupportTab />
      </TabsContent>
      
      <TabsContent value="phone" className={activeTab === "phone" ? "block" : "hidden"}>
        <PhoneSupportTab />
      </TabsContent>
      
      <TabsContent value="history" className={activeTab === "history" ? "block" : "hidden"}>
        <HistoryTab />
      </TabsContent>
    </div>
  );
};

export default CustomerServiceContent;
