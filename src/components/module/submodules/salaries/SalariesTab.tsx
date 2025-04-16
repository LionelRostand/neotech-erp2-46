
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SalaryForm } from './components/SalaryForm';
import PayslipList from './components/PayslipList';

const SalariesTab = () => {
  return (
    <Tabs defaultValue="history" className="w-full">
      <TabsList>
        <TabsTrigger value="create">Nouvelle fiche de paie</TabsTrigger>
        <TabsTrigger value="history">Historique</TabsTrigger>
      </TabsList>
      
      <TabsContent value="create">
        <SalaryForm />
      </TabsContent>
      
      <TabsContent value="history">
        <PayslipList />
      </TabsContent>
    </Tabs>
  );
};

export default SalariesTab;
