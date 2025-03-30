
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import CustomerServiceTabs from './customer-service/CustomerServiceTabs';
import CustomerServiceContent from './customer-service/CustomerServiceContent';
import ChevronsUpDown from "@/components/icons/ChevronIcons";

const TransportCustomerService: React.FC = () => {
  const [activeTab, setActiveTab] = useState('chat');
  
  // Ensure ChevronsUpDown is available globally
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.ChevronsUpDown = ChevronsUpDown;
    }
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Service Client</h2>
      
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <CustomerServiceTabs 
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
            <CustomerServiceContent activeTab={activeTab} />
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransportCustomerService;
