
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Mail, Phone, Clock } from "lucide-react";

interface CustomerServiceTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const CustomerServiceTabs: React.FC<CustomerServiceTabsProps> = ({ 
  activeTab, 
  onTabChange 
}) => {
  return (
    <TabsList className="grid w-full grid-cols-4">
      <TabsTrigger 
        value="chat" 
        className="flex items-center gap-2"
        onClick={() => onTabChange("chat")}
      >
        <MessageCircle size={16} />
        <span>Chat</span>
      </TabsTrigger>
      <TabsTrigger 
        value="email" 
        className="flex items-center gap-2"
        onClick={() => onTabChange("email")}
      >
        <Mail size={16} />
        <span>Email</span>
      </TabsTrigger>
      <TabsTrigger 
        value="phone" 
        className="flex items-center gap-2"
        onClick={() => onTabChange("phone")}
      >
        <Phone size={16} />
        <span>Téléphone</span>
      </TabsTrigger>
      <TabsTrigger 
        value="history" 
        className="flex items-center gap-2"
        onClick={() => onTabChange("history")}
      >
        <Clock size={16} />
        <span>Historique</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default CustomerServiceTabs;
