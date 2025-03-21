
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Mail, Phone, History } from "lucide-react";

interface CustomerServiceTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const CustomerServiceTabs: React.FC<CustomerServiceTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <TabsList className="grid w-full grid-cols-4 mb-4">
      <TabsTrigger 
        value="chat" 
        onClick={() => onTabChange("chat")}
        className="flex items-center space-x-2"
      >
        <MessageSquare className="h-4 w-4" />
        <span>Chat</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="email" 
        onClick={() => onTabChange("email")}
        className="flex items-center space-x-2"
      >
        <Mail className="h-4 w-4" />
        <span>Email</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="phone" 
        onClick={() => onTabChange("phone")}
        className="flex items-center space-x-2"
      >
        <Phone className="h-4 w-4" />
        <span>Téléphone</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="history" 
        onClick={() => onTabChange("history")}
        className="flex items-center space-x-2"
      >
        <History className="h-4 w-4" />
        <span>Historique</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default CustomerServiceTabs;
