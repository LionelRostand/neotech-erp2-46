
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SalaryForm } from './components/SalaryForm';
import PayslipList from './components/PayslipList';
import { useSearchParams } from 'react-router-dom';

const SalariesTab = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  
  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };
  
  return (
    <Tabs defaultValue={tabParam || "create"} className="w-full" onValueChange={handleTabChange}>
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
