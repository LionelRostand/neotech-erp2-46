
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import RecentCompaniesWidget from './RecentCompaniesWidget';
import RecentDocumentsWidget from './RecentDocumentsWidget';

const RecentItemsSection = () => {
  return (
    <Card className="col-span-1 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <Tabs defaultValue="companies" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="companies">Récentes</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="companies" className="mt-0 p-0">
            <RecentCompaniesWidget />
          </TabsContent>
          
          <TabsContent value="documents" className="mt-0 p-0">
            <RecentDocumentsWidget />
          </TabsContent>
        </Tabs>
      </CardHeader>
    </Card>
  );
};

export default RecentItemsSection;
