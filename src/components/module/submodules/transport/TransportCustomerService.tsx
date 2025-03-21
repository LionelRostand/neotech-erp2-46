
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import CustomerServiceTabs from './customer-service/CustomerServiceTabs';
import CustomerServiceContent from './customer-service/CustomerServiceContent';

const TransportCustomerService: React.FC = () => {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Service Client</h2>
      
      <Card>
        <CardContent className="pt-6">
          <CustomerServiceTabs 
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          <CustomerServiceContent activeTab={activeTab} />
        </CardContent>
      </Card>
    </div>
  );
};

export default TransportCustomerService;
