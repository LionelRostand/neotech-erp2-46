
import React, { useState } from 'react';
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PricingCalculator from './PricingCalculator';
import QuotesManager from './quotes/QuotesManager';
import InvoicesManager from './invoices/InvoicesManager';

const FreightPricing: React.FC = () => {
  const [activeTab, setActiveTab] = useState('calculator');

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold">Tarification et Facturation</h1>
        <p className="text-muted-foreground">
          Gérez les tarifs, créez des devis et consultez les factures
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-[500px]">
          <TabsTrigger value="calculator">Calculateur de tarifs</TabsTrigger>
          <TabsTrigger value="quotes">Devis</TabsTrigger>
          <TabsTrigger value="invoices">Factures</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="calculator" className="mt-0">
            <PricingCalculator />
          </TabsContent>
          
          <TabsContent value="quotes" className="mt-0">
            <QuotesManager />
          </TabsContent>
          
          <TabsContent value="invoices" className="mt-0">
            <InvoicesManager />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default FreightPricing;
