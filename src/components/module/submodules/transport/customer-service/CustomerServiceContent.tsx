
import React from 'react';
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
  switch (activeTab) {
    case 'chat':
      return <ChatTab />;
    case 'messages':
      return <MessagesTab />;
    case 'calls':
      return <CallsTab />;
    case 'emails':
      return <EmailsTab />;
    case 'customers':
      return <CustomersTab />;
    case 'settings':
      return <SettingsTab />;
    default:
      return <ChatTab />;
  }
};

export default CustomerServiceContent;
