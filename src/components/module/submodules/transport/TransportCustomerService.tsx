
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import CustomerServiceTabs from './customer-service/CustomerServiceTabs';
import CustomerServiceContent from './customer-service/CustomerServiceContent';

const TransportCustomerService = () => {
  const [activeTab, setActiveTab] = useState<string>("chat");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Service Client</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Demandes</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <CustomerServiceTabs activeTab={activeTab} onTabChange={handleTabChange} />
            <CustomerServiceContent activeTab={activeTab} />
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransportCustomerService;
